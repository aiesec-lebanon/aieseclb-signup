import { GroupBase } from "react-select";
import { Option } from "../types/otherTypes";

export const majorOptions: GroupBase<Option>[] = [
  {
    label: "Business & Management",
    options: [
      { value: "business_administration", label: "Business Administration" },
      { value: "marketing", label: "Marketing" },
      { value: "finance", label: "Finance" },
      { value: "accounting", label: "Accounting" },
      { value: "economics", label: "Economics" },
      { value: "management", label: "Management" },
      { value: "entrepreneurship", label: "Entrepreneurship" },
      { value: "human_resources", label: "Human Resources" }
    ]
  },
  {
    label: "Computer & Technology",
    options: [
      { value: "computer_science", label: "Computer Science" },
      { value: "software_engineering", label: "Software Engineering" },
      { value: "information_technology", label: "Information Technology" },
      { value: "data_science", label: "Data Science" },
      { value: "artificial_intelligence", label: "Artificial Intelligence" },
      { value: "cyber_security", label: "Cyber Security" },
      { value: "computer_engineering", label: "Computer Engineering" }
    ]
  },
  {
    label: "Engineering",
    options: [
      { value: "mechanical_engineering", label: "Mechanical Engineering" },
      { value: "civil_engineering", label: "Civil Engineering" },
      { value: "electrical_engineering", label: "Electrical Engineering" },
      { value: "electronics_engineering", label: "Electronics Engineering" },
      { value: "industrial_engineering", label: "Industrial Engineering" },
      { value: "chemical_engineering", label: "Chemical Engineering" }
    ]
  },
  {
    label: "Health & Medical",
    options: [
      { value: "medicine", label: "Medicine (MBBS/MD)" },
      { value: "nursing", label: "Nursing" },
      { value: "pharmacy", label: "Pharmacy" },
      { value: "dentistry", label: "Dentistry" },
      { value: "public_health", label: "Public Health" },
      { value: "nutrition", label: "Nutrition & Dietetics" }
    ]
  },
  {
    label: "Social Sciences & Humanities",
    options: [
      { value: "psychology", label: "Psychology" },
      { value: "sociology", label: "Sociology" },
      { value: "political_science", label: "Political Science" },
      { value: "international_relations", label: "International Relations" },
      { value: "education", label: "Education / Teaching" },
      { value: "law", label: "Law" },
      { value: "journalism", label: "Journalism / Media Studies" }
    ]
  },
  {
    label: "Arts & Design",
    options: [
      { value: "graphic_design", label: "Graphic Design" },
      { value: "architecture", label: "Architecture" },
      { value: "fine_arts", label: "Fine Arts" },
      { value: "film_media", label: "Film & Media Production" },
      { value: "interior_design", label: "Interior Design" }
    ]
  },
  {
    label: "Other",
    options: [
      { value: "undeclared", label: "Undeclared / Not Yet Decided" },
      { value: "other_major", label: "Other" }
    ]
  }
];
