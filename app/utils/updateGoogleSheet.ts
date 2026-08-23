// app/utils/updateGoogleSheet.ts
'use server';

import axios from "axios";
import { AdditionalUser, User } from "@/app/types/userType";
import { getGoogleAccessToken } from "./googleAuth";
import { LCMap, AllignmentMap } from "../constants/offices";
import { entityConfig } from "../config/entity";

export async function updateGoogleSheet(
  user: User,
  additional: AdditionalUser,
  personId: number
) {
  const accessToken = await getGoogleAccessToken();

  const fullName = `${user.first_name} ${user.last_name}`;
  const phone = `'${user.country_code}${user.phone}`;
  const timestamp = new Date().toISOString();
  const humanize = (value: string) => value.replace(/_/g, " ");
  const selectedPrograms = user.selected_programs
    .map((id) => entityConfig.programNames[id] || String(id))
    .join(",");
  const languages = additional.languages.join(",");
  const nationalities = additional.nationality.map(humanize).join(",");
  const university = additional.other_university || AllignmentMap[user.alignment_id] || "";

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
    humanize(additional.major),
    humanize(additional.education),
    selectedPrograms,
    user.referral_type,
    additional.referee
  ];

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
    }
  );
}
