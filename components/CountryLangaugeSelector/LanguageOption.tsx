import React from "react";

interface LanguageOptionProps {
  flagSrc: string;
  languageName: string;
  selected?: boolean;
  onClick?: () => void;
}

export const LanguageOption: React.FC<LanguageOptionProps> = ({
  flagSrc,
  languageName,
  selected = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col justify-center items-center py-4 rounded-lg shadow-sm w-[150px] hover:bg-stone-100 transition-colors ${
        selected ? "bg-stone-200" : "bg-stone-50"
      }`}
    >
      <img
        src={flagSrc}
        alt={`${languageName} flag`}
        className="object-contain w-12 rounded-full aspect-square"
      />
      <span className="mt-2 text-zinc-900">{languageName}</span>
    </button>
  );
};
