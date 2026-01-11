"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./SignupForm.css";
import User from "../types/userType";

type SignupFormProps = {
  role: "volunteer" | "teacher" | "talent";
  titleKeyword: string;
  titleSuffix: string;
  themeColor: string;
  bgImage: string;
  logoSrc: string;
};

type PasswordValidation = {
  isValid: boolean;
  errors: string[];
};

type Allignements = {
  id: number;
  value: string;
  alignment_id: number;
};

type AllignementResponse = {
  id: number;
  name: string;
  country_code: string;
  label: string;
  alignments: Allignements[];
};

const initialValues: User = {
  first_name: "",
  last_name: "",
  email: "",
  country_code: "+961",
  phone: "",
  password: "",
  country: 182,
  lc: 0,
  lc_input: 0,
  referral_type: "",
  alignment_id: "",
  allow_phone_communication: 0,
  allow_email_communication: 1,
  allow_term_and_conditions: 0,
  selected_programs: [],
};

const producTIds = {
  "volunteer": 7,
  "teacher": 8,
  "talent": 9,
}

export default function SignupForm({
  role,
  titleKeyword,
  titleSuffix,
  themeColor,
  bgImage,
  logoSrc,
}: SignupFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [universities, setUniversities] = useState<Allignements[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [universityError, setUniversityError] = useState("");
  const [formData, setFormData] = useState<User>({ ...initialValues,
    selected_programs: [producTIds[role]]
  });

  const API_ENDPOINT = process.env.NEXT_PUBLIC_GIS_API || "";

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get<AllignementResponse[]>(`${API_ENDPOINT}/v2/lists/mcs_alignments`, {
          params: {
            mc_name: "Lebanon",
          }
        });

        // assuming you want the first country's alignments
        const alignments = response.data?.[0]?.alignments || [];

        setUniversities(alignments);
      } catch (err) {
        console.error(err);
        setUniversityError("Failed to load universities");
      } finally {
        setLoadingUniversities(false);
      }
    };

    fetchUniversities();
  }, []);

  useEffect(() => {
    // clear body override if exists
    document.body.style.removeProperty("--theme-color");

    // set theme color
    document.documentElement.style.setProperty(
      "--theme-color",
      themeColor
    );

    // set navbar logo
    document.documentElement.style.setProperty(
      "--navbar-logo",
      `url("${logoSrc}")`
    );

    return () => {
      document.documentElement.style.removeProperty("--navbar-logo");
    };
  }, [themeColor, logoSrc]);


  const updateField = (field: keyof User) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
  };

  function validatePassword(password: string): PasswordValidation {
    const errors: string[] = [];

    if (!/[a-z]/.test(password)) {
      errors.push("At least one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("At least one uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("At least one digit");
    }
    if (password.length < 8) {
      errors.push("Minimum of 8 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordValidation = validatePassword(password);

    if (!passwordValidation.isValid) {
      setPasswordErrors(passwordValidation.errors);
      setPasswordTouched(true);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    console.log("Form Data:", formData);
    console.log(`${role} signup successful`);
  };


  return (
    <div
      className="signup-page"
      style={{ ["--signup-bg" as any]: `url('${bgImage}')`}}
    >
      <main className="signup-main">
        <div className="signup-card">
          {/* LEFT */}
          <section className="signup-left">
            <div
              className="signup-topbar"
              style={{ backgroundColor: themeColor }}
            />

            <div className="signup-inner">
              <h2 className="signup-title">
                <span className={`keyword ${role}`}>
                  {titleKeyword}
                </span>{" "}
                <span className="abroad-word">{titleSuffix}</span>
              </h2>

              <form className="signup-form" onSubmit={handleSubmit}>
                <label>
                  First Name
                  <input name="first_name" type="text" required onChange={updateField("first_name")} />
                </label>

                <label>
                  Last Name
                  <input name="last_name" type="text" required onChange={updateField("last_name")} />
                </label>

                <label>
                  Email Address
                  <input name="email" type="email" required onChange={updateField("email")} />
                </label>

                <label>
                  Password
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassword(value);

                      if (!passwordTouched) setPasswordTouched(true);

                      const validation = validatePassword(value);
                      setPasswordErrors(validation.errors);

                      setFormData({ ...formData, password: value });

                      if (error) setError("");
                    }}
                  />
                </label>

                {passwordTouched && passwordErrors.length > 0 && (
                  <div className="password-rules">
                    <p className="password-strength">
                      Password strength: <strong>Weak</strong>
                    </p>

                    <ul>
                      {passwordErrors.map((error) => (
                        <li key={error} className="rule-fail">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {passwordTouched && passwordErrors.length === 0 && (
                  <p className="password-strong">
                    Password strength: <strong>Strong</strong>
                  </p>
                )}


                <label>
                  Confirm Password
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError("");
                    }}
                  />
                </label>

                {error && <p className="error-text">{error}</p>}

                <label>
                  Phone Number
                  <div className="phone-row">
                    <select name="phoneCode" defaultValue="+961" required 
                    onChange={(e) => {
                      setFormData({ ...formData, country_code: e.target.value })
                    }}>
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
                      onChange={updateField("phone")}
                    />
                  </div>
                </label>


                <label>
                  University / Institute
                  <select
                    required
                    defaultValue=""
                    disabled={loadingUniversities}
                    onChange={(e) => {
                      const selectedOption = e.target.selectedOptions[0];

                      setFormData((prev) => ({
                        ...prev,
                        alignment_id: selectedOption.dataset.alignmentId!,
                        lc: Number(selectedOption.dataset.lc),
                        lc_input: Number(selectedOption.dataset.lc),
                      }));
                    }}
                  >
                    <option value="" disabled>
                      {loadingUniversities
                        ? "Loading universities..."
                        : "Select your university"}
                    </option>

                    {universities.map((uni) => (
                      <option
                        key={uni.alignment_id}
                        value={uni.value}
                        data-alignment-id={uni.alignment_id}
                        data-lc={uni.id}
                      >
                        {uni.value}
                      </option>
                    ))}
                  </select>

                  {universityError && (
                    <p className="error-text">{universityError}</p>
                  )}
                </label>



                <label>
                  Where did you first hear about us?
                  <select required defaultValue=""
                    onChange={(e) => {
                      setFormData({ ...formData, referral_type: e.target.value });
                    }}
                  >
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

                <label className="signup-checkbox">
                  <input type="checkbox" onChange={(e) => {
                    setFormData({ ...formData, allow_phone_communication: e.target.checked? 1 : 0});
                  }} />
                  <span>
                    I agree to receiving emails or messages from AIESEC about
                    opportunities and programs.
                  </span>
                </label>

                <label className="signup-checkbox">
                  <input type="checkbox"
                    required
                    onChange={(e) => {
                      setFormData({ ...formData, allow_term_and_conditions: e.target.checked? 1 : 0});
                    }}
                  />
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

                <button
                  type="submit"
                  className="signup-submit"
                  style={{ backgroundColor: themeColor }}
                >
                  SIGN UP
                </button>
              </form>
            </div>
          </section>

          {/* RIGHT */}
          <section className="signup-right">
            <img src={bgImage} alt={`${role} form`} className="signup-image" />
          </section>
        </div>
      </main>
    </div>
  );
}
