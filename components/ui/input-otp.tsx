"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputOTPProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
}

export function InputOTP({
  value,
  onChange,
  maxLength = 4,
  className,
}: InputOTPProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    const newValue = value.split("");

    if (val.length > 1) {
      // Handle paste
      const pastedValue = val.slice(0, maxLength - index);
      for (let i = 0; i < pastedValue.length; i++) {
        newValue[index + i] = pastedValue[i];
      }
      onChange(newValue.join("").slice(0, maxLength));

      // Focus last input or next empty
      const nextIndex = Math.min(index + pastedValue.length, maxLength - 1);
      inputRefs.current[nextIndex]?.focus();
    } else {
      newValue[index] = val;
      onChange(newValue.join("").slice(0, maxLength));

      // Auto-focus next input
      if (val && index < maxLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Array.from({ length: maxLength }, (_, index) => (
        <React.Fragment key={index}>
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              handleChange(index, val);
            }}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={cn(
              "h-12 w-12 rounded-md border border-gray-400 dark:border-gray-600 bg-background text-center text-lg font-medium",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
          {index === 1 && maxLength === 4 && (
            <div className="text-gray-400">-</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function InputOTPGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex items-center", className)}>{children}</div>;
}

export function InputOTPSlot({
  value,
  isActive,
}: {
  value?: string;
  isActive?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative h-12 w-12 rounded-md border border-gray-400 dark:border-gray-600",
        "flex items-center justify-center text-lg font-medium",
        isActive && "ring-2 ring-ring ring-offset-2",
      )}
    >
      {value}
    </div>
  );
}
