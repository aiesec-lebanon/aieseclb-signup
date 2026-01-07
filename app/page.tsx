"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [openCard, setOpenCard] = useState<null | "volunteer" | "teacher" | "talent">(null);

  const toggle = (key: "volunteer" | "teacher" | "talent") => {
    setOpenCard((prev) => (prev === key ? null : key));
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar-wrapper">
        <header className="navbar">
          <img src="/images/aiesec logo.PNG" alt="AIESEC logo" className="logo" />
          <nav className="nav-right">
            <a className="nav-link" href="#home">Home</a>
            <a className="nav-link" href="#partners">Partners</a>
            <a className="nav-btn" href="/signup">Sign up</a>
          </nav>
        </header>
      </div>

      {/* PAGE CONTENT */}
      <div className="page">
        <h1 className="hero-title">
          <span className="c1">Ready to</span>{" "}
          <span className="c2">make a</span>{" "}
          <span className="c3">difference</span>
        </h1>
        <p className="hero-subtitle">Explore our opportunities abroad !</p>

        <section className="programs">
          {/* GLOBAL VOLUNTEER */}
          <div className={`program-card volunteer ${openCard === "volunteer" ? "is-open" : ""}`}>
            <img src="/images/global volunteer.jpeg" className="program-image" alt="Global Volunteer" />
            <div className="program-overlay" />

            <div className="program-content">
              {/* Row: title + SignUp button */}
              <div className="program-toprow">
                <div className="program-label">Global Volunteer</div>

          
              </div>

              <p className="program-desc">
                Develop your leadership through a volunteering project contributing
                to the Sustainable Development Goals.
              </p>     
              
                <Link href="/volunteer" className="program-btn signup-btn">
                  Sign Up Now
                </Link>

                {/* Learn more (mobile only via CSS) */}
                <button
                  type="button"
                  className="program-btn learnmore-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle("volunteer");
                  }}
                >
                  Learn more
                </button>
            </div>
          </div>

          {/* GLOBAL TEACHER */}
          <div className={`program-card teacher ${openCard === "teacher" ? "is-open" : ""}`}>
            <img src="/images/global teacher.jpeg" className="program-image" alt="Global Teacher" />
            <div className="program-overlay" />

            <div className="program-content">
              <div className="program-toprow">
                <div className="program-label">Global Teacher</div>

              

              <p className="program-desc">
                Develop your leadership while boosting your career prospects with an opportunity to work as a teacher abroad
              </p>

                <Link href="/teacher" className="program-btn signup-btn">
                  Sign Up Now
                </Link>

                <button
                  type="button"
                  className="program-btn learnmore-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle("teacher");
                  }}
                >
                  Learn more
                </button>
              </div>
            </div>
          </div>

          {/* GLOBAL TALENT */}
          <div className={`program-card talent ${openCard === "talent" ? "is-open" : ""}`}>
            <img src="/images/global talent.jpeg" className="program-image" alt="Global Talent" />
            <div className="program-overlay" />

            <div className="program-content">
              <div className="program-toprow">
                <div className="program-label">Global Talent</div>


                
              </div>

              <p className="program-desc">
                Gain professional experience abroad and grow your international career.
              </p>
              <Link href="/talent" className="program-btn signup-btn">
                  Sign Up Now
                </Link>

                <button
                  type="button"
                  className="program-btn learnmore-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle("talent");
                  }}
                >
                  Learn more
                </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
