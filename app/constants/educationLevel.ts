import { Option } from "../types/otherTypes";

export const educationLevelOptions: Option[] = [
  { value: "high_school", label: "High School Student" },
  { value: "high_school_graduate", label: "High School Graduate" },

  { value: "diploma", label: "Diploma / Technical Certificate" },

  { value: "bachelor_ongoing", label: "Bachelor's Degree (Currently Studying)" },
  { value: "bachelor_completed", label: "Bachelor's Degree (Graduated)" },

  { value: "postgraduate_diploma", label: "Postgraduate Diploma" },

  { value: "masters_ongoing", label: "Master's Degree (Currently Studying)" },
  { value: "masters_completed", label: "Master's Degree (Graduated)" },

  { value: "phd_ongoing", label: "PhD / Doctorate (Currently Studying)" },
  { value: "phd_completed", label: "PhD / Doctorate (Completed)" },

  { value: "other", label: "Other" }
];