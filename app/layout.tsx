import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIESEC in Lebanon",
  description: "Explore AIESEC opportunities abroad",
  icons: {
    icon: "/aiesec_man.png",
    shortcut: "/aiesec_man.png",
    apple: "/aiesec_man.png",
  }
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

      {/* 👇 Default theme color */}
      <body>
        {/* NAVBAR */}
        <div
          className="navbar-wrapper"
          style={{ backgroundColor: "var(--theme-color)" }}
        >
          <header className="navbar">
            <img
              alt="AIESEC logo"
              className="logo"
            />

            <nav className="nav-right">
              <a
                className="nav-link"
                href="https://aieseclb.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Home
              </a>

              <a
                className="nav-link"
                href="https://partners.aieseclb.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Partners
              </a>

              <a className="nav-btn" href="/">
                Sign up
              </a>
            </nav>
          </header>
        </div>

        {/* PAGE CONTENT */}
        {children}
      </body>
    </html>
  );
}
