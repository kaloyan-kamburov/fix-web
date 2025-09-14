import React from "react";

interface StatusBadge {
  text: string;
  type: "offers" | "urgent";
}

interface RequestStatusBadgesProps {
  badges: StatusBadge[];
}

export const RequestStatusBadges: React.FC<RequestStatusBadgesProps> = ({
  badges,
}) => {
  const getBadgeStyles = (type: StatusBadge["type"]) => {
    switch (type) {
      case "offers":
        return "bg-yellow-100";
      case "urgent":
        return "bg-rose-200";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="text-sm text-zinc-900 w-[69px]">
      {badges.map((badge, index) => (
        <div
          key={index}
          className={`flex flex-col justify-center items-center px-1 py-0.5 w-full rounded ${
            index > 0 ? "whitespace-nowrap" : ""
          } ${getBadgeStyles(badge.type)}`}
        >
          <span className="text-zinc-900">{badge.text}</span>
        </div>
      ))}
    </div>
  );
};
