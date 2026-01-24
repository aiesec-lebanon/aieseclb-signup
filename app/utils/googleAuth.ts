// app/utils/googleAuth.ts
'use server';

import axios from "axios";
import * as jwt from "jsonwebtoken";

export async function getGoogleAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const privateKey = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");

  const assertion = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
  });

  const res = await axios.post(
    "https://oauth2.googleapis.com/token",
    new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.access_token;
}
