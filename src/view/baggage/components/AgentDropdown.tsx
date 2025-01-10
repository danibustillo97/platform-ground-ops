import React from "react";
import Select from "react-select";

type AgentDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  agents: { id: string; name: string }[];
};

const AgentDropdown: React.FC<AgentDropdownProps> = ({ value, onChange, agents }) => {
  const handleChange = (selectedOption: any) => {
    onChange(selectedOption?.value);
  };

  const agentOptions = agents.map((agent) => ({
    value: agent.id,
    label: agent.name,
  }));

  return (
    <Select
    options={agentOptions}
    value={agentOptions.find((option) => option.value === value)}
    onChange={handleChange}
    styles={{
        control: (base: any) => ({
          ...base,
          minHeight: "30px",
          fontSize: "14px",
          width: "100%",
        }),
        dropdownIndicator: (base: any) => ({
          ...base,
          padding: "4px",
        }),
        menu: (base: any) => ({
          ...base,
          fontSize: "14px",
          width: "100%",
          maxHeight: "200px", 
          overflowY: "auto", 
        }),
        menuList: (base: any) => ({
          ...base,
          padding: "0", 
          scrollbarWidth: "thin", 
          msOverflowStyle: "none",
        }),
      }}
    isClearable={false}
  />
  );
};

export default AgentDropdown;
