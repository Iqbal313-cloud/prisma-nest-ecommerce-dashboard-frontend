
import Select, {
  type InputActionMeta,
  type SingleValue,
  type StylesConfig,
} from "react-select";

export interface SelectOption<T extends string | number = string> {
  value: T;
  label: string;
}

interface SearchableSelectProps<T extends string | number> {
  options: SelectOption<T>[];
  value: T | null | undefined;
  onChange: (value: T | undefined) => void;
  placeholder?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  noOptionsMessage?: string;
  inputId?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

export default function SearchableSelect<
  T extends string | number,
>({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  isLoading = false,
  isDisabled = false,
  isClearable = true,
  noOptionsMessage = "No options found",
  inputId,
  inputValue,
  onInputChange,
}: SearchableSelectProps<T>) {
  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  const handleChange = (
    option: SingleValue<SelectOption<T>>,
  ) => {
    onChange(option?.value);
  };

  const handleInputChange = (
    newValue: string,
    meta: InputActionMeta,
  ) => {
    if (meta.action === "input-change") {
      onInputChange?.(newValue);
    }

    return newValue;
  };

  const styles: StylesConfig<SelectOption<T>, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: 40,
      backgroundColor: "#ffffff",
      borderRadius: 6,
      borderColor: state.isFocused ? "#64748b" : "#cbd5e1",
      boxShadow: state.isFocused ? "0 0 0 1px #64748b" : "none",
      cursor: isDisabled ? "not-allowed" : "pointer",
      "&:hover": {
        borderColor: "#64748b",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "2px 10px",
    }),

    singleValue: (base) => ({
      ...base,
      color: "#334155",
      WebkitTextFillColor: "#334155",
      opacity: 1,
    }),

    input: (base) => ({
      ...base,
      color: "#334155",
      WebkitTextFillColor: "#334155",
      opacity: 1,
    }),

    placeholder: (base) => ({
      ...base,
      color: "#94a3b8",
      opacity: 1,
    }),

    menu: (base) => ({
      ...base,
      zIndex: 50,
      backgroundColor: "#ffffff",
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 50,
    }),

    option: (base, state) => ({
      ...base,
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? "#ffedd5"
        : state.isFocused
          ? "#fff7ed"
          : "#ffffff",
      color: "#334155",
      "&:active": {
        backgroundColor: "#fed7aa",
      },
    }),

    noOptionsMessage: (base) => ({
      ...base,
      color: "#64748b",
    }),

    loadingMessage: (base) => ({
      ...base,
      color: "#64748b",
    }),

    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "#e2e8f0",
    }),

    dropdownIndicator: (base) => ({
      ...base,
      color: "#64748b",
      "&:hover": {
        color: "#334155",
      },
    }),

    clearIndicator: (base) => ({
      ...base,
      color: "#94a3b8",
      "&:hover": {
        color: "#334155",
      },
    }),
  };

  return (
    <Select<SelectOption<T>, false>
      inputId={inputId}
      options={options}
      value={selectedOption}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      isSearchable
      isClearable={isClearable}
      isLoading={isLoading}
      isDisabled={isDisabled}
      placeholder={placeholder}
      noOptionsMessage={() => noOptionsMessage}
      loadingMessage={() => "Searching..."}
      className="w-full text-sm"
      classNamePrefix="searchable-select"
      styles={styles}
    />
  );
}

