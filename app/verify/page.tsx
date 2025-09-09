"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputOTP } from "@/components/ui/input-otp";

export default function Verify() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();
  const CORRECT_PIN = "5555";

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        // Set cookie for authentication
        document.cookie = "verified=true; path=/; max-age=86400"; // 24 hours
        router.push("/");
        router.refresh();
      } else {
        setError(true);
        setTimeout(() => {
          setPin("");
          setError(false);
        }, 1000);
      }
    }
  }, [pin, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">MAFF</h1>
          <h2 className="text-xl font-medium mb-2">Enter Access Code</h2>
          <p className="text-muted-foreground">
            Please enter the 4-digit PIN to access the site
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <InputOTP value={pin} onChange={setPin} maxLength={4} />
        </div>

        {error && (
          <p className="text-red-500 text-sm animate-pulse">
            Incorrect PIN. Please try again.
          </p>
        )}

        <p className="text-xs text-muted-foreground mt-8">
          If you don&apos;t have a PIN, please contact the site administrator.
        </p>
      </div>
    </div>
  );
}
