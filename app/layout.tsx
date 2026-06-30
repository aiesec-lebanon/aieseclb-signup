import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { entityConfig } from "./config/entity";

export const metadata: Metadata = {
  title: entityConfig.metadata.title,
  description: entityConfig.metadata.description,
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

      <body>
        <div
          className="navbar-wrapper"
          style={{ backgroundColor: "var(--theme-color)" }}
        >
          <header className="navbar">
            <img
              alt={`${entityConfig.organizationName} logo`}
              className="logo"
            />

            <nav className="nav-right">
              <a
                className="nav-link"
                href={entityConfig.navLinks.home}
                target="_blank"
                rel="noopener noreferrer"
              >
                Home
              </a>

              <a
                className="nav-link"
                href={entityConfig.navLinks.partners}
                target="_blank"
                rel="noopener noreferrer"
              >
                Partners
              </a>

              <Link className="nav-btn" href="/">
                Sign up
              </Link>
            </nav>
          </header>
        </div>

        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
