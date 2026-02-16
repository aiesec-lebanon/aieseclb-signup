import { GroupBase } from "react-select";
import { Option } from "../types/otherTypes";

export const nationalityOptions: GroupBase<Option>[] = [
  {
    label: "Lebanon",
    options: [
      { value: "lebanese", label: "Lebanese" }
    ]
  },
  {
    label: "Middle East",
    options: [
      { value: "jordanian", label: "Jordanian" },
      { value: "emirati", label: "Emirati (UAE)" },
      { value: "saudi", label: "Saudi Arabian" },
      { value: "qatari", label: "Qatari" },
      { value: "kuwaiti", label: "Kuwaiti" },
      { value: "omani", label: "Omani" },
      { value: "bahraini", label: "Bahraini" },
      { value: "egyptian", label: "Egyptian" },
      { value: "palestinian", label: "Palestinian" }
    ]
  },
  {
    label: "Europe",
    options: [
      { value: "european", label: "European (Other/Multiple)" },
      { value: "german", label: "German" },
      { value: "french", label: "French" },
      { value: "italian", label: "Italian" },
      { value: "spanish", label: "Spanish" },
      { value: "british", label: "British" },
      { value: "dutch", label: "Dutch" },
      { value: "swedish", label: "Swedish" }
    ]
  },
  {
    label: "Americas",
    options: [
      { value: "american", label: "American (USA)" },
      { value: "canadian", label: "Canadian" },
      { value: "latin_american", label: "Latin American" },
      { value: "brazilian", label: "Brazilian" },
      { value: "mexican", label: "Mexican" }
    ]
  },
  {
    label: "Asia",
    options: [
      { value: "indian", label: "Indian" },
      { value: "pakistani", label: "Pakistani" },
      { value: "sri_lankan", label: "Sri Lankan" },
      { value: "indonesian", label: "Indonesian" },
      { value: "malaysian", label: "Malaysian" },
      { value: "filipino", label: "Filipino" },
      { value: "chinese", label: "Chinese" },
      { value: "japanese", label: "Japanese" },
      { value: "korean", label: "Korean" }
    ]
  },
  {
    label: "Africa",
    options: [
      { value: "nigerian", label: "Nigerian" },
      { value: "kenyan", label: "Kenyan" },
      { value: "south_african", label: "South African" },
      { value: "moroccan", label: "Moroccan" },
      { value: "tunisian", label: "Tunisian" }
    ]
  },
  {
    label: "Other",
    options: [
      { value: "prefer_not_to_say", label: "Prefer not to say" },
      { value: "stateless", label: "Stateless / No nationality" }
    ]
  }
];
