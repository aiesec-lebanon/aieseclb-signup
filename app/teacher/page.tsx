"use client";

import { useState } from "react";
import SignupForm from "../components/SignupForm";

export default function TeacherSignup() {
  return (
      <SignupForm
        role="teacher"
        titleKeyword="Teach"
        titleSuffix="abroad!"
        themeColor="#f48825"
        bgImage="/images/teacher-form.jpg"
        logoSrc="/images/aiesec global teacher.png"
      />
    );
}

