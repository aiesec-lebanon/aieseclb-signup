"use client";

import SignupForm from "../components/SignupForm";

export default function TalentSignup() {
  return (
    <SignupForm
      role="talent"
      titleKeyword="Intern"
      titleSuffix="abroad!"
      themeColor="#0cb9c0"
      bgImage="/images/talent-form.jpg"
      logoSrc="/images/aiesec global talent.png"
    />
  );
}
