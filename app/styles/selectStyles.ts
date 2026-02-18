import { StylesConfig } from "react-select";

export const selectStyles: StylesConfig<any, any> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderColor: state.isFocused ? "#037ef3" : "#d1d5db",
    boxShadow: "none",
    ":hover": {
      borderColor: "#037ef3",
    },
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#037ef3"
      : state.isFocused
      ? "#e6f2ff"
      : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#222222",
    cursor: "pointer",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#222222",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#6b7280",
  }),

  input: (base) => ({
    ...base,
    color: "#222222",
  }),
};
