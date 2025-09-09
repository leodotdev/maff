"use client";

import Link from "next/link";
import { DonationDialog } from "@/components/donation-dialog";
import { useEffect, useState } from "react";

export default function Donate() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-[960px] mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-lg font-bold">MAFF</Link>
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                Contact
              </Link>
            </div>
            <Link href="/donate">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md font-medium">
                Donate
              </button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">Support Our Mission</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your contribution helps us continue our work and make a positive impact
          in the community. Every donation makes a difference.
        </p>

        <DonationDialog openByDefault={isDialogOpen} onOpenChange={setIsDialogOpen} />

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">Secure Payments</h3>
            <p className="text-muted-foreground">
              All transactions are processed securely through Stripe with
              industry-standard encryption.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">Tax Deductible</h3>
            <p className="text-muted-foreground">
              Your donation is tax-deductible. You'll receive a receipt
              for your records via email.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">100% Impact</h3>
            <p className="text-muted-foreground">
              Every dollar you donate goes directly to supporting our
              programs and initiatives.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
