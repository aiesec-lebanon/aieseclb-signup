// app/utils/updateGoogleSheet.ts
'use server';

import axios from "axios";
import { AdditionalUser, User } from "@/app/types/userType";
import { getGoogleAccessToken } from "./googleAuth";
import { LCMap, AllignmentMap } from "../constants/offices";

export async function updateGoogleSheet(
  user: User,
  additional: AdditionalUser,
  personId: number
) {
  const accessToken = await getGoogleAccessToken();

  const fullName = `${user.first_name} ${user.last_name}`;
  const phone = `'${user.country_code}${user.phone}`;
  const timestamp = new Date().toISOString();
  const selectedPrograms = user.selected_programs.join(",");
  const languages = additional.languages.join(",");
  const nationalities = additional.nationality.join(",");

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
    AllignmentMap[user.alignment_id] || "",
    additional.major,
    additional.education,
    selectedPrograms,
    user.referral_type,
    additional.referee
  ];

  await axios.post(
    `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1!A:Q:append`,
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
      },
    }
  );
}
