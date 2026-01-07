"use client";

import { useState } from "react";

export default function TeacherSignup() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitted(true);
    console.log("Teacher signup successful");
  };

  return (
    <div
  className="signup-page"
  style={{ ["--signup-bg" as any]: "url('/images/teacher-form.jpg')" }}
>

      <div
        className="navbar-wrapper teacher-nav"
        style={{ backgroundColor: "#f48825" }}
      >
        <header className="navbar">
          <img
            src="/images/aiesec global teacher.png"
            alt="AIESEC logo"
            className="logo"
          />
          <nav className="nav-right">
            <a className="nav-link" href="/">
              Home
            </a>
            <a className="nav-link" href="#partners">
              Partners
            </a>
            <a className="nav-btn" href="/teacher">
              Sign up
            </a>
          </nav>
        </header>
      </div>

      <main className="signup-main">
        <div className="signup-card">
          <section className="signup-left">
            <div className="signup-topbar teacher-color" />
            <div className="signup-inner">
              <div className="signup-header-row">
               <h2 className="signup-title">
  <span className="keyword teacher">Teach</span>{" "}
  <span className="abroad-word">abroad!</span>
</h2>

              </div>

              <form className="signup-form" onSubmit={handleSubmit}>
                <label>
                  First Name
                  <input name="firstName" type="text" required />
                </label>

                <label>
                  Last Name
                  <input name="lastName" type="text" required />
                </label>

                <label>
                  Email Address
                  <input name="email" type="email" required />
                </label>

                {/* ✅ Controlled password */}
                <label>
                  Password
                  <input
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                      if (submitted) setSubmitted(false);
                    }}
                  />
                </label>

                {/* ✅ Controlled confirm password */}
                <label>
                  Confirm Password
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError("");
                      if (submitted) setSubmitted(false);
                    }}
                  />
                </label>

                {error && <p className="error-text">{error}</p>}

                {/* ✅ Phone code editable (ALL extensions) */}
                <label>
  Phone Number
  <div className="phone-row">
    <select name="phoneCode" defaultValue="+961" required>
      <option value="+961">+961 (Lebanon)</option>
      <option value="+1">+1 (USA/Canada)</option>
      <option value="+33">+33 (France)</option>
      <option value="+44">+44 (UK)</option>
      <option value="+49">+49 (Germany)</option>
      <option value="+61">+61 (Australia)</option>
      <option value="+90">+90 (Turkey)</option>
      <option value="+971">+971 (UAE)</option>
      <option value="+966">+966 (Saudi Arabia)</option>
      <option value="+20">+20 (Egypt)</option>
      <option value="+962">+962 (Jordan)</option>
      <option value="+963">+963 (Syria)</option>
      <option value="+98">+98 (Iran)</option>
      <option value="+7">+7 (Russia/Kazakhstan)</option>
      <option value="other">Other…</option>
    </select>

    <input
      name="phoneNumber"
      type="tel"
      placeholder="03 123 456"
      required
    />
  </div>
</label>

                <label>
                  University/Institute
                  <select name="university" required defaultValue="">
                    <option value="" disabled>
                      Select your university
                    </option>
                    <option>Lebanese American University (Beirut)</option>
                    <option>Lebanese American University (Byblos)</option>
                    <option>American University of Beirut</option>
                  </select>
                </label>

                <label>
                  Where did you first hear about us?
                  <select name="referral" required defaultValue="">
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option>Friend</option>
                    <option>Information booth on campus</option>
                    <option>Classroom presentation</option>
                    <option>Facebook</option>
                    <option>WeChat</option>
                    <option>Twitter</option>
                    <option>Instagram</option>
                    <option>LinkedIn</option>
                    <option>Heading for the future</option>
                    <option>Other social media channel</option>
                    <option>Search engine</option>
                    <option>Event</option>
                    <option>Emails</option>
                    <option>Telegram</option>
                    <option>Vk</option>
                    <option>Media (magazine, TV, newspaper or radio)</option>
                    <option>TikTok</option>
                    <option>WhatsApp</option>
                    <option>Other</option>
                  </select>
                </label>

                {/* ✅ make these required if you want to block submission unless checked */}
                <label className="signup-checkbox">
                  <input name="consentMessages" type="checkbox" required />
                  <span>
                    I agree to receiving emails or messages from AIESEC about
                    opportunities and programs.
                  </span>
                </label>

                <label className="signup-checkbox">
                  <input name="consentPolicy" type="checkbox" required />
                  <span>
                    By signing up, I agree to the{" "}
                    <a
                      href="https://aiesec.org/assets/documents/AIESEC_Privacy_Policy2022.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      terms &amp; privacy conditions
                    </a>
                    .
                  </span>
                </label>

                <button type="submit" className="signup-submit teacher-color">
                  SIGN UP
                </button>

                {submitted && (
                  <p className="success-text">Submitted successfully ✅ (demo)</p>
                )}
              </form>
            </div>
          </section>

          <section className="signup-right">
            <img
              src="/images/teacher-form.jpg"
              alt="Teach abroad"
              className="signup-image"
            />
          </section>
        </div>
      </main>
    </div>
  );
}

