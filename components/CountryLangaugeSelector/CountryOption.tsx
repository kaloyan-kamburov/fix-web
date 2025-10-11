import React from "react";

interface CountryOptionProps {
  flagSrc: string;
  countryName: string;
  selected?: boolean;
  onClick?: () => void;
}

export const CountryOption: React.FC<CountryOptionProps> = ({
  flagSrc,
  countryName,
  selected = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-wrap gap-4 items-center p-4 w-full whitespace-nowrap rounded-lg shadow-sm max-md:max-w-full hover:bg-stone-100 transition-colors ${
        selected ? "bg-stone-200" : "bg-stone-50"
      }`}
    >
      <img
        src={flagSrc}
        alt={`${countryName} flag`}
        className="object-contain shrink-0 self-stretch my-auto w-5 rounded-full aspect-square"
      />
      <span className="self-stretch my-auto text-zinc-900">{countryName}</span>
    </button>
  );
};
