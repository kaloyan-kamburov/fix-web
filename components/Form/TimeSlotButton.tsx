"use client";
export const TimeSlotButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex gap-2 justify-center items-center self-stretch px-6 py-3 rounded-lg border border-solid cursor-pointer bg-stone-50 border-zinc-400 max-md:px-5 max-md:py-2.5 max-sm:px-4 max-sm:py-2"
      aria-label="Избор на ден и час"
    >
      <span className="text-base font-semibold text-center text-zinc-900 max-md:text-base max-sm:text-sm">
        Избор на ден и час
      </span>
    </button>
  );
};
