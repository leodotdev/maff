"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DonatePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page
    router.replace("/");

    // Scroll to donation section after a short delay
    setTimeout(() => {
      const donateSection = document.getElementById('donate');
      if (donateSection) {
        donateSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to donation form...</p>
    </div>
  );
}
