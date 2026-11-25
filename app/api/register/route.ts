import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { User, AdditionalUser } from "@/app/types/userType";
import RegisterAPIError from "@/app/utils/RegisterAPIError";
import { updateGoogleSheet } from "@/app/utils/updateGoogleSheet";
import { OTHER_ALIGNMENT_ID } from "@/app/constants/offices";
import { COUNTRY_CODE_PATTERN } from "@/app/constants/phone";
import { describeError } from "@/app/utils/safeError";
import {
  consumeSignupQuota,
  getClientIp,
  isHoneypotFilled,
  isSameOriginRequest,
} from "@/app/utils/botProtection";

// Leaves room for the sheet retries (capped at about 8 s). Within the Vercel Hobby limit
// (60 s maximum without Fluid compute, 300 s with it).
export const maxDuration = 30;

interface ExpaSignupResponse {
    person_id: number;
}

type ExpaErrorResponse = {
  error?: string;
  errors?: {
    email?: string[];
  };
};

const countryCodeRegex = new RegExp(`^${COUNTRY_CODE_PATTERN}$`);
const isEmptyList = (value: unknown) => !Array.isArray(value) || value.length === 0;
const isBlank = (value: unknown) => typeof value !== "string" || value.trim() === "";
// Marketing consent is opt-in: anything other than an explicit 1 means no.
const toConsentFlag = (value: unknown) => (Number(value) === 1 ? 1 : 0);

function findMissingField(user: User, additional: Partial<AdditionalUser>): string | null {
  const { nationality, languages, education, major } = additional;

  if (!countryCodeRegex.test(user.country_code)) return "A valid country code";

  if (isEmptyList(nationality)) return "Nationality";
  if (isEmptyList(languages)) return "Language";
  if (languages?.includes("other") && isBlank(additional.other_language)) return "Other language";
  if (user.alignment_id === OTHER_ALIGNMENT_ID && isBlank(additional.other_university)) return "Other university";
  if (isBlank(education)) return "Level of education";
  if (education === "other" && isBlank(additional.other_education)) return "Other level of education";
  if (isBlank(major)) return "Major";
  if (major === "other_major" && isBlank(additional.other_major)) return "Other major";

  return null;
}

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const userInfo: User = body.user;
    const additionalInfo: AdditionalUser = body.additional

    if (isHoneypotFilled(body.website)) {
      return NextResponse.json({ error: "Signup failed" }, { status: 400 });
    }

    if (!userInfo) {
      return NextResponse.json(
        { error: "Bad Request", details: "user info is required" },
        { status: 400 }
      );
    }

    // Must run before the EXPA signup, which cannot be rolled back.
    const missingField = findMissingField(userInfo, additionalInfo ?? {});
    if (missingField) {
      return NextResponse.json(
        { error: `${missingField} is required` },
        { status: 400 }
      );
    }

    userInfo.allow_email_communication = toConsentFlag(userInfo.allow_email_communication);
    userInfo.allow_phone_communication = toConsentFlag(userInfo.allow_phone_communication);

    // Counted only once the form is valid, so people fixing typos are not blocked.
    const quota = consumeSignupQuota(getClientIp(req));
    if (!quota.allowed) {
      return NextResponse.json(
        { error: "Too many sign-up attempts from your network. Please try again in a few minutes." },
        { status: 429, headers: { "Retry-After": String(quota.retryAfterSeconds) } }
      );
    }

    // 1. Create EXPA signup
    const expaRes = await ExpaSignup(userInfo);

    // 2. Update Google Sheet (non-blocking option)
    try {
      await updateGoogleSheet(userInfo, additionalInfo, expaRes.person_id);
    } catch (sheetErr) {
      // The EXPA person ID is enough to find the person in EXPA and re-add the row;
      // never log the row itself.
      console.error("Google Sheet update failed:", { personId: expaRes.person_id, ...describeError(sheetErr) });
      // intentionally NOT failing the request
    }

    return NextResponse.json(
      { person_id: expaRes.person_id },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (err instanceof RegisterAPIError) {
      return NextResponse.json(
        { error: err.message, details: err.details },
        { status: err.status }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function ExpaSignup(userInfo: User): Promise<ExpaSignupResponse> {
    try {
        const response = await axios.post(process.env.EXPA_SIGNUP_URL || "",
            {
                user: userInfo
            }
        )
        
        if (response.status == 201) {
            return {
                person_id: response.data.person_id
            }
        } else {
            throw new RegisterAPIError("Error creating signup on expa", response.status, "Error has occured");
        }
    } catch (err: unknown) {
        if (axios.isAxiosError<ExpaErrorResponse>(err) && err.response?.status == 422) {
            throw new RegisterAPIError("Error creating signup on expa", 422, err.response.data?.errors?.email?.[0])
        }
        throw new RegisterAPIError(
            "Error creating signup on expa",
            axios.isAxiosError(err) ? err.response?.status || 500 : 500,
            axios.isAxiosError<ExpaErrorResponse>(err) ? err.response?.data?.error || err.message : err instanceof Error ? err.message : String(err)
        )
    }
}
