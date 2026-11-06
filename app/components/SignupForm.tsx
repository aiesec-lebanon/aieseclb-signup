"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
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
import { entityConfig } from "../config/entity";
import type { ProgramRole } from "../config/entity";
import { OTHER_ALIGNMENT_ID } from "../constants/offices";
import { COUNTRY_CODE_PATTERN, OTHER_PHONE_CODE } from "../constants/phone";

type SignupFormProps = {
  role: ProgramRole;
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

const allNationalityOptions = nationalityOptions.flatMap((group) => group.options);

const createInitialValues = (role: ProgramRole): User => ({
  first_name: "",
  last_name: "",
  email: "",
  country_code: entityConfig.defaultPhoneCode,
  phone: "",
  password: "",
  country: entityConfig.expaCountryId,
  lc: 0,
  lc_input: 0,
  referral_type: "",
  alignment_id: 0,
  allow_phone_communication: 0,
  allow_email_communication: 1,
  allow_term_and_conditions: 0,
  selected_programs: [entityConfig.productIds[role]],
});

const createInitialAdditionals = (): AdditionalUser => ({
  dob: "",
  nationality: [...entityConfig.defaultNationalities],
  languages: [],
  education: "",
  major: "",
  referee: "",
  other_university: "",
  other_major: "",
  other_education: "",
  other_language: "",
});

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
  const [isOtherUniversity, setIsOtherUniversity] = useState(false);
  const [isOtherPhoneCode, setIsOtherPhoneCode] = useState(false);
  const [formData, setFormData] = useState<User>(() => createInitialValues(role));
  const [additionalData, setAdditionalData] = useState<AdditionalUser>(() => createInitialAdditionals());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_ENDPOINT = process.env.NEXT_PUBLIC_GIS_API || "";
  const router = useRouter();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get<AllignementResponse[]>(`${API_ENDPOINT}/v2/lists/mcs_alignments`, {
          params: {
            mc_name: entityConfig.gisMcName,
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
  }, [API_ENDPOINT]);

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

  const updateAdditional = (field: keyof AdditionalUser, otherField?: keyof AdditionalUser) =>
    (e: SingleValue<Option>) => {
      setAdditionalData((prev) => ({
        ...prev,
        [field]: e?.value ?? "",
        ...(otherField ? { [otherField]: "" } : {}),
      }));
  };

  const handleNationalityChange = (selected: MultiValue<Option>) => {
    const values = selected.map(o => o.value);
    setAdditionalData({...additionalData, nationality: values});
  };

  const handleLanguageChange = (selected: readonly Option[] | null) => {
    const values = selected ? selected.map(o => o.value) : [];
    setAdditionalData((prev) => ({
      ...prev,
      languages: values,
      other_language: values.includes("other") ? prev.other_language : "",
    }));
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
      await axios.post("/api/register", {
        user: {
          ...formData,
          password
        },
        additional: additionalData
      });

      // 1. Clear form
      setFormData(createInitialValues(role));
      setAdditionalData(createInitialAdditionals());
      setIsOtherUniversity(false);
      setIsOtherPhoneCode(false);
      setPassword("");
      setConfirmPassword("");
      setPasswordErrors([]);
      setPasswordTouched(false);

      router.push("/signup/success");

    } catch (err: unknown) {
      if (axios.isAxiosError<{ error?: string; details?: string }>(err)) {
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
      style={{ "--signup-bg": `url('${bgImage}')` } as CSSProperties}
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
                  <span className="required-label">First Name</span>
                  <input name="first_name" type="text" required onChange={updateField("first_name")} />
                </label>

                <label>
                  <span className="required-label">Last Name</span>
                  <input name="last_name" type="text" required onChange={updateField("last_name")} />
                </label>

                <label>
                  <span className="required-label">Email Address</span>
                  <input name="email" type="email" required onChange={updateField("email")} />
                </label>

                <label>
                  <span className="required-label">Password</span>
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
                  <span className="required-label">Confirm Password</span>
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
                  <span className="required-label">Phone Number</span>
                  <div className="phone-row">
                    <select name="phoneCode" defaultValue={entityConfig.defaultPhoneCode} required
                    onChange={(e) => {
                      const isOther = e.target.value === OTHER_PHONE_CODE;

                      setIsOtherPhoneCode(isOther);
                      setFormData({ ...formData, country_code: isOther ? "" : e.target.value });
                    }}>
                      {entityConfig.phoneCodes.map((phoneCode) => (
                        <option key={phoneCode.value} value={phoneCode.value}>
                          {phoneCode.label}
                        </option>
                      ))}
                      <option value={OTHER_PHONE_CODE}>Other…</option>
                    </select>

                    {isOtherPhoneCode && (
                      <input
                        name="otherCountryCode"
                        className="phone-code-input"
                        type="tel"
                        required
                        aria-label="Country code"
                        placeholder="+234"
                        pattern={COUNTRY_CODE_PATTERN}
                        title="Enter a + followed by 1 to 4 digits, for example +234"
                        maxLength={5}
                        value={formData.country_code}
                        onChange={updateField("country_code")}
                      />
                    )}

                    <input
                      name="phoneNumber"
                      type="tel"
                      placeholder={entityConfig.defaultPhonePlaceholder}
                      required
                      onChange={updateField("phone")}
                    />
                  </div>
                </label>              

                <label>
                  <span className="required-label">Date of Birth</span>
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
                  <span className="required-label">Nationality</span>
                  <Select<Option, true, GroupBase<Option>>
                    isMulti
                    required
                    styles={selectStyles}
                    options={nationalityOptions}
                    value={allNationalityOptions.filter((option) =>
                      additionalData.nationality.includes(option.value)
                    )}
                    onChange={handleNationalityChange}
                    placeholder="Select your nationalities."
                  />
                </label>
                
                <label>
                  <span className="required-label">What languages do you speak?</span>
                  <Select
                    isMulti
                    required
                    styles={selectStyles}
                    options={languageOptions}
                    placeholder="Select the languages."
                    onChange={handleLanguageChange}
                  />

                  {additionalData.languages.includes("other") && (
                    <input
                      name="otherLanguage"
                      type="text"
                      required
                      placeholder="Enter the other language(s)"
                      value={additionalData.other_language}
                      onChange={(e) => {
                        setAdditionalData((prev) => ({ ...prev, other_language: e.target.value }));
                      }}
                    />
                  )}
                </label>

                <label>
                  <span className="required-label">University / Institute</span>
                  <select
                    required
                    defaultValue=""
                    disabled={loadingUniversities}
                    onChange={(e) => {
                      const selectedOption = e.target.selectedOptions[0];
                      const alignmentId = Number(selectedOption.dataset.alignmentId!);

                      setIsOtherUniversity(alignmentId === OTHER_ALIGNMENT_ID);
                      setAdditionalData((prev) => ({ ...prev, other_university: "" }));

                      setFormData((prev) => ({
                        ...prev,
                        alignment_id: alignmentId,
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

                  {isOtherUniversity && (
                    <input
                      name="otherUniversity"
                      type="text"
                      required
                      placeholder="Enter your university name"
                      value={additionalData.other_university}
                      onChange={(e) => {
                        setAdditionalData((prev) => ({ ...prev, other_university: e.target.value }));
                      }}
                    />
                  )}
                </label>

                <label>
                  <span className="required-label">Level of Education</span>
                  <Select<Option, false>
                    required
                    styles={selectStyles}
                    options={educationLevelOptions}
                    placeholder="Select your level of education."
                    onChange={updateAdditional("education", "other_education")}
                    isClearable
                  />

                  {additionalData.education === "other" && (
                    <input
                      name="otherEducation"
                      type="text"
                      required
                      placeholder="Enter your level of education"
                      value={additionalData.other_education}
                      onChange={(e) => {
                        setAdditionalData((prev) => ({ ...prev, other_education: e.target.value }));
                      }}
                    />
                  )}
                </label>

                <label>
                  <span className="required-label">Major</span>
                  <CreatableSelect<Option, false, GroupBase<Option>>
                    required
                    styles={selectStyles}
                    options={majorOptions}
                    onChange={updateAdditional("major", "other_major")}
                    placeholder="Select or type your major."
                    isClearable
                    formatCreateLabel={(inputValue) =>
                      `Add "${inputValue}" as a custom major`
                    }
                  />

                  {additionalData.major === "other_major" && (
                    <input
                      name="otherMajor"
                      type="text"
                      required
                      placeholder="Enter your major"
                      value={additionalData.other_major}
                      onChange={(e) => {
                        setAdditionalData((prev) => ({ ...prev, other_major: e.target.value }));
                      }}
                    />
                  )}
                </label>

                <label>
                  <span className="required-label">Where did you first hear about us?</span>
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
                  <span className="required-label">
                    By signing up, I agree to the{" "}
                    <a
                      href={entityConfig.privacyPolicyUrl}
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
