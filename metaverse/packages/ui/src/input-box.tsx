import { ChangeEvent } from "react";

interface InputBoxType {
  htmlFor: string;
  label: string;
  type?: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export const InputBox = ({
  htmlFor,
  label,
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
}: InputBoxType) => {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        type={type || "text"}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
};
