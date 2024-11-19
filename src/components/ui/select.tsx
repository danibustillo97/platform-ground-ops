import React from "react";

export const Select = ({ children, onValueChange }: { children: React.ReactNode; onValueChange: (value: string) => void }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange(e.target.value);
  };

  return <select onChange={handleChange} className="border rounded px-3 py-2 w-full">{children}</select>;
};

export const SelectTrigger = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative ${className}`}>{children}</div>
);

export const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute bg-white shadow-lg rounded-md mt-2 w-full">{children}</div>
);

export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
);

export const SelectValue = ({ placeholder }: { placeholder?: string }) => <>{placeholder}</>;
