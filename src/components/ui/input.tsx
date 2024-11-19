import React from 'react';

interface InputFieldProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; // Para estilos adicionales
}

const InputField: React.FC<InputFieldProps> = ({
  type = 'text',
  placeholder = 'Enter text...',
  value,
  onChange,
  className = '',
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    />
  );
};

export default InputField;
