// components/SatsInput.tsx
import React, { useState, useCallback } from "react";

type SatsInputProps = {
  value: string | number;
  onChange: (value: string) => void; // string of digits only
  placeholder?: string;
};

// export function SatsInput({
//   value,
//   onChange,
//   placeholder = "0",
// }: SatsInputProps) {
//   const [focused, setFocused] = useState(false);

//   // Format number with commas (e.g. 1234567 → "1,234,567")
//   const formattedValue = useCallback((val: string | number) => {
//     const num = String(val).replace(/\D/g, "");
//     return num === "" ? "" : parseInt(num).toLocaleString("en-US");
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const rawValue = e.target.value.replace(/\D/g, ""); // only digits
//     onChange(rawValue); // send clean number string to parent
//   };

//   const handleBlur = () => {
//     setFocused(false);
//   };

//   const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
//     setFocused(true);
//     e.target.select(); // optional: select all on focus
//   };

//   // Show formatted value only when not focused (to avoid cursor jumps)
//   const displayValue = focused ? value : value ? formattedValue(value) : "";

//   return (
//     <input
//       type="text"
//       inputMode="numeric"
//       value={displayValue}
//       onChange={handleChange}
//       onFocus={handleFocus}
//       onBlur={handleBlur}
//       placeholder={formattedValue(placeholder)}
//       className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//     />
//   );
// }

export function SatsInput({
  value,
  onChange,
  placeholder = "0",
}: SatsInputProps) {
  const [focused, setFocused] = useState(false);

  const formattedValue = useCallback((val: string | number) => {
    const numStr = String(val).replace(/\D/g, "");
    return numStr === "" ? "" : Number(numStr).toLocaleString("en-US");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    onChange(rawValue); // send clean digits to parent
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    e.target.select();
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const displayValue = focused
    ? String(value || "")
    : value
    ? formattedValue(value)
    : "";

  return (
    <input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={formattedValue(placeholder)}
      className="w-full px-4 py-3 bg-gray-800 border rounded-lg"
    />
  );
}
