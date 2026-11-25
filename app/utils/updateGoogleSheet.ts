// app/utils/updateGoogleSheet.ts
'use server';

import axios from "axios";
import { AdditionalUser, User } from "@/app/types/userType";
import { getGoogleAccessToken } from "./googleAuth";
import { LCMap, AllignmentMap } from "../constants/offices";
import { entityConfig } from "../config/entity";
import { describeError } from "./safeError";

// Up to 3 attempts. The whole sheet step stays within SHEET_TIME_BUDGET_MS so the
// sign-up request finishes well inside the Vercel function time limit.
const RETRY_DELAYS_MS = [500, 1500];
const REQUEST_TIMEOUT_MS = 4000;
const SHEET_TIME_BUDGET_MS = 8000;
// Do not start another attempt with less time than this left.
const MIN_ATTEMPT_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry Google rate limits (429), Google-side errors (5xx) and network failures or timeouts.
// A request that timed out may still have been written, so a retry can occasionally
// produce a duplicate row (same EXPA person ID); that is preferable to losing the row.
function isRetryable(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false;
  const status = err.response?.status;
  return status === undefined || status === 429 || status >= 500;
}

// Under USER_ENTERED, a cell starting with one of these characters is parsed as a
// formula (e.g. =IMPORTXML(...) could send sheet contents to another server).
const FORMULA_TRIGGER = /^[\s=+\-@]/;

// A leading apostrophe makes Sheets store the value as plain text; it is not displayed.
function toSafeCell(value: unknown): string | number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = value == null ? "" : String(value);
  return FORMULA_TRIGGER.test(text) ? `'${text}` : text;
}

export async function updateGoogleSheet(
  user: User,
  additional: AdditionalUser,
  personId: number
) {
  const fullName = `${user.first_name} ${user.last_name}`;
  // Starts with "+", so toSafeCell keeps it as text.
  const phone = `${user.country_code}${user.phone}`;
  const timestamp = new Date().toISOString();
  const humanize = (value: string) => value.replace(/_/g, " ");
  const selectedPrograms = user.selected_programs
    .map((id) => entityConfig.programNames[id] || String(id))
    .join(",");
  const languages = additional.languages
    .map((lang) => (lang === "other" ? additional.other_language : humanize(lang)))
    .filter(Boolean)
    .join(",");
  const nationalities = additional.nationality.map(humanize).join(",");
  const university = additional.other_university || AllignmentMap[user.alignment_id] || "";
  const major = additional.major === "other_major" ? additional.other_major : humanize(additional.major);
  const education = additional.education === "other" ? additional.other_education : humanize(additional.education);

  const row = [
    timestamp,
    personId,
    fullName,
    additional.dob,
    user.email,
    phone,
    nationalities,
    languages,
    user.lc,
    LCMap[user.lc] || "",
    user.alignment_id,
    university,
    major,
    education,
    selectedPrograms,
    user.referral_type,
    additional.referee
  ].map(toSafeCell);

  const deadline = Date.now() + SHEET_TIME_BUDGET_MS;

  for (let attempt = 1; ; attempt++) {
    try {
      await appendRow(row, deadline);
      return;
    } catch (err) {
      const delay = RETRY_DELAYS_MS[attempt - 1];
      const canRetry =
        delay !== undefined &&
        isRetryable(err) &&
        Date.now() + delay + MIN_ATTEMPT_MS <= deadline;

      if (!canRetry) throw err;

      console.warn("Google Sheet append failed, retrying:", { personId, attempt, ...describeError(err) });
      await sleep(delay);
    }
  }
}

async function appendRow(row: (string | number)[], deadline: number) {
  const timeLeft = () => Math.max(1, Math.min(REQUEST_TIMEOUT_MS, deadline - Date.now()));
  const accessToken = await getGoogleAccessToken(timeLeft());

  await axios.post(
    `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(entityConfig.googleSheet.appendRange)}:append`,
    {
      values: [row],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: {
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
      },
      timeout: timeLeft(),
    }
  );
}
