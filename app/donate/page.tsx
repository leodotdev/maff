"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DonatePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with #donate hash
    router.replace("/#donate");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to donation form...</p>
    </div>
  );
}
