// app/utils/updateGoogleSheet.ts
'use server';

import axios from "axios";
import User from "@/app/types/userType";
import { getGoogleAccessToken } from "./googleAuth";

export async function updateGoogleSheet(
  user: User,
  personId: number
) {
  const accessToken = await getGoogleAccessToken();

  const fullName = `${user.first_name} ${user.last_name}`;
  const phone = `'${user.country_code}${user.phone}`;
  const timestamp = new Date().toISOString();
  const selectedPrograms = user.selected_programs.join(",");

  const AllignmentMap: { [key: number]: string } = {
    3032: "Lebanese American University (Beirut)",
    40211: "Lebanese American University (Byblos)",
    40212: "American University of Beirut",
    40213: "Other",
    // Add more mappings as needed
  };

  const LCMap: { [key: number]: string } = {
    6550: "AUB (EXP)",
    5853: "Haigazian (EXP CLOSED)",
    5854: "LAU Beirut (EXP)",
    6547: "LAU Byblos (EXP)",
    1735: "MC Lebanon",
    6549: "USJ (EXP CLOSED)"
    // Add more mappings as needed
  };

  const row = [
    timestamp,
    personId,
    fullName,
    user.email,
    phone,
    user.lc,
    LCMap[user.lc] || "",
    user.alignment_id,
    AllignmentMap[user.alignment_id] || "",
    selectedPrograms,
    user.referral_type,
  ];

  await axios.post(
    `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1!A:I:append`,
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
