import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIESEC – Opportunities Abroad",
  description: "Explore AIESEC opportunities abroad",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Lato font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
