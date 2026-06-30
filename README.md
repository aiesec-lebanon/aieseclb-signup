# AIESEC Signup Template

A reusable Next.js signup template for AIESEC entities that want a public landing page for outgoing opportunities and a registration flow connected to EXPA/GIS and Google Sheets.

The default content is configured for AIESEC in Lebanon, but the project is structured so another entity can replace the entity-specific values, assets, LC mappings, and copy without rebuilding the whole app.

## Features

- Landing page for Global Volunteer, Global Teacher, and Global Talent.
- Product-specific signup pages at `/volunteer`, `/teacher`, and `/talent`.
- Reusable signup form with personal details, university/institute, education, languages, referral source, and consent fields.
- GIS alignment lookup for universities/institutes by MC name.
- Server-side EXPA signup through `/api/register`.
- Optional Google Sheets lead export using a Google service account.
- Success page after registration.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Axios
- React Select
- Google Sheets API
- ESLint

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Fill in the values in `.env.local`, then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_GIS_API` | Yes | Base URL for the GIS API used to load MC alignments. This is exposed to the browser. |
| `EXPA_SIGNUP_URL` | Yes | Server-side endpoint used to create the EXPA signup. |
| `GOOGLE_SHEET_ID` | Yes, if using Sheets | ID of the Google Sheet that receives signup rows. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Yes, if using Sheets | Service account email with edit access to the sheet. |
| `GOOGLE_PRIVATE_KEY` | Yes, if using Sheets | Service account private key. In `.env.local`, keep newline characters escaped as `\n`. |

Google Sheets export is currently non-blocking. If EXPA registration succeeds but the sheet append fails, the user still receives a success response and the server logs the sheet error.

## How Registration Works

1. The visitor chooses a program on the home page.
2. The signup form loads university/institute alignments from GIS using the configured MC name.
3. The form posts `user` and `additional` data to `/api/register`.
4. `/api/register` creates the signup through `EXPA_SIGNUP_URL`.
5. If EXPA returns a `person_id`, the app appends the lead details to Google Sheets.
6. The visitor is redirected to `/signup/success`.

## Entity Customization Checklist

Most entity-specific defaults live in [`app/config/entity.ts`](app/config/entity.ts). Change this file first when repurposing the project.

Update:

- `organizationName`: your public entity name.
- `metadata.title` and `metadata.description`: browser and sharing metadata.
- `navLinks.home` and `navLinks.partners`: navbar links for your entity.
- `privacyPolicyUrl`: privacy or terms URL shown in the consent checkbox.
- `gisMcName`: MC name passed to the GIS alignment endpoint.
- `expaCountryId`: EXPA country ID sent during signup.
- `defaultPhoneCode` and `defaultPhonePlaceholder`: default phone field behavior.
- `defaultNationalities`: default selected nationality values.
- `productIds`: EXPA product IDs for Global Volunteer, Global Teacher, and Global Talent.
- `googleSheet.appendRange`: sheet tab and columns used by the append API.
- `phoneCodes`: country calling codes shown in the form.

Then update the supporting project files:

- [`app/constants/offices.ts`](app/constants/offices.ts): replace LC and alignment ID mappings with your entity's values. These labels are written to Google Sheets.
- [`app/constants/nationalities.ts`](app/constants/nationalities.ts): adjust nationality options and defaults.
- [`app/constants/languages.ts`](app/constants/languages.ts), [`app/constants/educationLevel.ts`](app/constants/educationLevel.ts), and [`app/constants/majors.ts`](app/constants/majors.ts): adapt form options for your market.
- [`app/page.tsx`](app/page.tsx): change landing page copy, program descriptions, and card content.
- [`app/volunteer/page.tsx`](app/volunteer/page.tsx), [`app/teacher/page.tsx`](app/teacher/page.tsx), and [`app/talent/page.tsx`](app/talent/page.tsx): change program titles, colors, form background images, and logos.
- [`public/images`](public/images): replace the default AIESEC in Lebanon assets with your entity or campaign assets.
- [`app/signup/success/page.tsx`](app/signup/success/page.tsx): adjust post-signup instructions and links.
- [`app/components/SignupForm.tsx`](app/components/SignupForm.tsx): change form questions only if your entity needs a different data model.

## Google Sheets Setup

1. Create a Google Cloud service account.
2. Create a JSON key for that service account.
3. Share your target Google Sheet with the service account email as an editor.
4. Put the sheet ID in `GOOGLE_SHEET_ID`.
5. Put the service account email in `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
6. Put the private key in `GOOGLE_PRIVATE_KEY`, preserving escaped newlines.

The default append range is `Sheet1!A:Q`. The expected columns are:

| Column | Value |
| --- | --- |
| A | Timestamp |
| B | EXPA person ID |
| C | Full name |
| D | Date of birth |
| E | Email |
| F | Phone |
| G | Nationalities |
| H | Languages |
| I | LC ID |
| J | LC name |
| K | Alignment ID |
| L | Alignment name |
| M | Major |
| N | Education level |
| O | Selected program IDs |
| P | Referral source |
| Q | Referee |

If you change the form fields or sheet structure, update [`app/utils/updateGoogleSheet.ts`](app/utils/updateGoogleSheet.ts) and `entityConfig.googleSheet.appendRange`.

## Scripts

```bash
npm run dev      # Start local development server
npm run build    # Create a production build
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## Deployment

The app can be deployed on Vercel or any host that supports Next.js. Configure the same environment variables in your deployment provider. Do not commit `.env.local`, `.env`, service account JSON files, or private keys.

## Troubleshooting

- `Failed to load universities`: check `NEXT_PUBLIC_GIS_API` and `entityConfig.gisMcName`.
- EXPA email validation errors: the API returns the EXPA validation message when available.
- Google Sheets rows are not added: confirm the sheet is shared with the service account and `GOOGLE_PRIVATE_KEY` includes escaped `\n` characters.
- Build fails because `.next` is locked on Windows: stop any running Next.js process and remove the stale `.next` folder before rebuilding.
- Wrong LC or university names in the sheet: update [`app/constants/offices.ts`](app/constants/offices.ts) with your entity's IDs.

## Contributing

Issues and pull requests are welcome. Keep entity-specific changes configurable where possible so the template stays reusable for other AIESEC entities.

## License

MIT
