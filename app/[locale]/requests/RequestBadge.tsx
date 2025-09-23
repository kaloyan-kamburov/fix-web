"use client";
import * as React from "react";

interface RequestBadgeProps {
  text: string;
  variant: "offers" | "urgent";
}

export function RequestBadge({ text, variant }: RequestBadgeProps) {
  const baseClasses =
    "flex flex-col justify-center items-center px-1 py-0.5 w-full rounded text-sm text-zinc-900";
  const variantClasses = {
    offers: "bg-yellow-100",
    urgent: "bg-rose-200",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>{text}</div>
  );
}
