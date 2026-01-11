"use client";

import { useState } from "react";
import SignupForm from "../components/SignupForm";

export default function VolunteerSignupPage() {
  return (
    <SignupForm
      role="volunteer"
      titleKeyword="Volunteer"
      titleSuffix="abroad!"
      themeColor="#F85A40"
      bgImage="/images/volunteer-form.jpg"
      logoSrc="/images/aiesec global volunteer.png"
    />
  );
}