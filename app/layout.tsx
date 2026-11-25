import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Lato } from "next/font/google";
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

// Downloaded at build time and served from our own domain, so visitors'
// browsers never contact Google Fonts.
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-lato",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={lato.variable}>
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
