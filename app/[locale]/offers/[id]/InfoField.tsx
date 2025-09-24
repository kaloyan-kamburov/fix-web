import * as React from "react";

interface InfoFieldProps {
  label: string;
  value: string;
  className?: string;
}

export const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col gap-2 justify-center items-start self-stretch ${className}`}
    >
      <label className="font-normal text-zinc-600">{label}</label>
      <p className="text-base font-bold text-zinc-900">{value}</p>
    </div>
  );
};
