"use client";
import * as React from "react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  // No direct input, only +/- controls

  return (
    <div className="flex flex-col gap-0.5 items-start self-stretch">
      <div className="flex gap-2 items-center self-stretch">
        <label className="text-xs font-semibold text-zinc-900">
          Количество (можете да заявите услугата многократно)
        </label>
      </div>
      <div className="flex justify-between items-start w-28 rounded-lg border border-solid bg-zinc-200 border-zinc-300 overflow-hidden">
        <div className="flex shrink-0 gap-2 justify-center items-center w-10 bg-stone-50 ">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={value <= min}
            className="flex gap-1 justify-center items-center p-2 cursor-pointer bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-default"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="minus-icon"
              style={{ width: "24px", height: "24px" }}
            >
              <path d="M19 13H5V11H19V13Z" fill="#1C1C1D" />
            </svg>
          </button>
        </div>
        <div className="flex justify-center items-center p-2 flex-[1_0_0]">
          <span className="text-sm leading-6 text-center text-zinc-900 select-none">
            {value}
          </span>
        </div>
        <div className="flex shrink-0 gap-2 justify-center items-center w-10 bg-stone-50">
          <button
            type="button"
            onClick={handleIncrement}
            disabled={value >= max}
            className="flex gap-1 justify-center items-center p-2 cursor-pointer bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-default"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="plus-icon"
              style={{ width: "24px", height: "24px" }}
            >
              <path
                d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                fill="#1C1C1D"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
