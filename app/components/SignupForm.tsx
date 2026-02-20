"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./SignupForm.css";
import { User, AdditionalUser } from "../types/userType";
import { useRouter } from "next/navigation";
import Select, {GroupBase, MultiValue, SingleValue} from "react-select";
import { nationalityOptions } from "../constants/nationalities";
import { languageOptions } from "../constants/languages";
import { Option } from "../types/otherTypes";
import { educationLevelOptions } from "../constants/educationLevel";
import { majorOptions } from "../constants/majors";
import CreatableSelect from "react-select/creatable";
import { selectStyles } from "../styles/selectStyles";
import toast from "react-hot-toast";

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
  alignment_id: 0,
  allow_phone_communication: 0,
  allow_email_communication: 1,
  allow_term_and_conditions: 0,
  selected_programs: [],
};

const initialAdditionals: AdditionalUser = {
  dob: "",
  nationality: ["Lebanese"],
  languages: [],
  education: "",
  major: "",
  referee: "",
}

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
  const [additionalData, setAdditionalData] = useState<AdditionalUser>(initialAdditionals)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_ENDPOINT = process.env.NEXT_PUBLIC_GIS_API || "";
  const router = useRouter();

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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error])


  const updateField = (field: keyof User) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
  };

  const updateAdditional = (field: keyof AdditionalUser) =>
    (e: SingleValue<Option>) => {
      setAdditionalData({...additionalData, [field]: e?.value });
  };

  const handleNationalityChange = (selected: MultiValue<Option>) => {
    const values = selected.map(o => o.value);
    setAdditionalData({...additionalData, nationality: values});
  };

  const handleLanguageChange = (selected: readonly Option[] | null) => {
    const values = selected ? selected.map(o => o.value) : [];
    setAdditionalData({...additionalData, languages: values});
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


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Password validation
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
    setIsSubmitting(true);

    try {
      const res = await axios.post("/api/register", {
        user: {
          ...formData,
          password
        },
        additional: additionalData
      });

      // 1. Clear form
      setFormData(initialValues);
      setAdditionalData(initialAdditionals);
      setPassword("");
      setConfirmPassword("");
      setPasswordErrors([]);
      setPasswordTouched(false);

      router.push("/signup/success");

    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.details ||
          "Signup failed"
        );
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
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
                  Date of Birth
                  <input 
                    name="dob" 
                    type="date" 
                    required
                    onChange={(e) => {
                      setAdditionalData({ ...additionalData, dob: e.target.value })
                    }}
                  />
                </label>

                <label>
                  Nationality
                  <Select<Option, true, GroupBase<Option>>
                    isMulti
                    styles={selectStyles}
                    options={nationalityOptions}
                    onChange={handleNationalityChange}
                    placeholder="Select your nationalities."
                  />
                </label>
                
                <label>
                  What languages do you speak?
                  <Select
                    isMulti
                    styles={selectStyles}
                    options={languageOptions}
                    placeholder="Select the languages."
                    onChange={handleLanguageChange}
                  />
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
                        alignment_id: Number(selectedOption.dataset.alignmentId!),
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
                  Level of Education
                  <Select<Option, false>
                    styles={selectStyles}
                    options={educationLevelOptions}
                    placeholder="Select your level of education."
                    onChange={updateAdditional("education")}
                    isClearable
                  />
                </label>

                <label>
                  Major
                  <CreatableSelect<Option, false, GroupBase<Option>>
                    styles={selectStyles}
                    options={majorOptions}
                    onChange={updateAdditional("major")}
                    placeholder="Select or type your major."
                    isClearable
                    formatCreateLabel={(inputValue) =>
                      `Add "${inputValue}" as a custom major`
                    }
                  />
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

                <label>
                  Were you referred by someone? If yes please mention their full name.
                  <input 
                    name="referee" 
                    type="text" 
                    onChange={(e) => {
                      setAdditionalData({ ...additionalData, referee: e.target.value})
                    }}
                  />
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

                {error && <p className="error-text">{error}</p>}

                <button
                  type="submit"
                  className="signup-submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: themeColor }}
                >
                  {isSubmitting ? "Submitting..." : "SIGN UP"}
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
