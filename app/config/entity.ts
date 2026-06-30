export type ProgramRole = "volunteer" | "teacher" | "talent";

export const entityConfig = {
  organizationName: "AIESEC in Lebanon",
  metadata: {
    title: "AIESEC in Lebanon",
    description: "Explore AIESEC opportunities abroad",
  },
  navLinks: {
    home: "https://aieseclb.org",
    partners: "https://partners.aieseclb.org",
  },
  privacyPolicyUrl: "https://aiesec.org/assets/documents/AIESEC_Privacy_Policy2022.pdf",

  // Replace these defaults when adapting the template for another entity.
  gisMcName: "Lebanon",
  expaCountryId: 182,
  defaultPhoneCode: "+961",
  defaultPhonePlaceholder: "03 123 456",
  defaultNationalities: ["lebanese"],

  productIds: {
    volunteer: 7,
    teacher: 8,
    talent: 9,
  },

  googleSheet: {
    appendRange: "Sheet1!A:Q",
  },

  phoneCodes: [
    { value: "+961", label: "+961 (Lebanon)" },
    { value: "+1", label: "+1 (USA/Canada)" },
    { value: "+33", label: "+33 (France)" },
    { value: "+44", label: "+44 (UK)" },
    { value: "+49", label: "+49 (Germany)" },
    { value: "+61", label: "+61 (Australia)" },
    { value: "+90", label: "+90 (Turkey)" },
    { value: "+971", label: "+971 (UAE)" },
    { value: "+966", label: "+966 (Saudi Arabia)" },
    { value: "+20", label: "+20 (Egypt)" },
    { value: "+962", label: "+962 (Jordan)" },
    { value: "+963", label: "+963 (Syria)" },
    { value: "+98", label: "+98 (Iran)" },
    { value: "+7", label: "+7 (Russia/Kazakhstan)" },
  ],
} as const;
