import React, { FC } from "react";

interface Props {
  id: string;
  icon: React.ReactNode;
  label: string;
  changeStatus: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LabStatusOption: FC<Props> = ({ id, icon, label, changeStatus }) => {
  return (
    <label htmlFor={id} className="flex gap-1 items-center">
      <input
        className="flex items-center hover:underline"
        onChange={changeStatus}
        type="checkbox"
        name={id}
        value={id}
        id={id}
      />
      {icon}
      {label}
    </label>
  );
};

export default LabStatusOption;
