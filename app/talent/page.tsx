"use client";

import { useState } from "react";
import SignupForm from "../components/SignupForm";
import { title } from "process";

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
