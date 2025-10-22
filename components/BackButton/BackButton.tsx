"use client";
import React from "react";

interface BackButtonProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  children,
  className,
  ariaLabel,
}) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button onClick={handleBack} className={className} aria-label={ariaLabel}>
      {children}
    </button>
  );
};
