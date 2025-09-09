"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
} from "@/components/ui/form";

export function DonationDialog({
  openByDefault = false,
  onOpenChange,
}: {
  openByDefault?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) {
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(
    "custom",
  );
  const [customAmount, setCustomAmount] = useState("");
  const [isOpen, setIsOpen] = useState(openByDefault);
  const customInputRef = useRef<HTMLInputElement>(null);
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const presetAmounts = [250, 500, 1000, 2500, 5000];

  useEffect(() => {
    if (isOpen && selectedAmount === "custom" && customInputRef.current) {
      setTimeout(() => {
        customInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, selectedAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Stripe integration would go here
    const amount = selectedAmount === "custom" ? customAmount : selectedAmount;
    console.log("Processing donation:", { amount, ...donorInfo });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
          Donate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Make a Donation</DialogTitle>
          <DialogDescription>
            Support our mission with a secure donation powered by Stripe
          </DialogDescription>
        </DialogHeader>

        <Form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Amount, Name, Email */}
            <div className="space-y-4">
              <FormField>
                <FormLabel>Select Amount</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {presetAmounts.map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant={
                        selectedAmount === amount ? "default" : "outline"
                      }
                      onClick={() => setSelectedAmount(amount)}
                      className="h-14"
                    >
                      ${amount.toLocaleString()}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant={
                      selectedAmount === "custom" ? "default" : "outline"
                    }
                    onClick={() => {
                      setSelectedAmount("custom");
                      setTimeout(() => customInputRef.current?.focus(), 100);
                    }}
                    className="h-14"
                  >
                    Custom
                  </Button>
                </div>
                {selectedAmount === "custom" && (
                  <FormControl>
                    <Input
                      ref={customInputRef}
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      min="1"
                      autoFocus
                      className="mt-2"
                    />
                  </FormControl>
                )}
              </FormField>
            </div>

            {/* Right Column - Name, Email, and Payment Information */}
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-5 space-y-4 border border-gray-200 dark:border-gray-700">
              <FormField>
                <FormLabel htmlFor="name">Full Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={donorInfo.name}
                    onChange={(e) =>
                      setDonorInfo({ ...donorInfo, name: e.target.value })
                    }
                    required
                  />
                </FormControl>
              </FormField>

              <FormField>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={donorInfo.email}
                    onChange={(e) =>
                      setDonorInfo({ ...donorInfo, email: e.target.value })
                    }
                    required
                  />
                </FormControl>
                <FormDescription>
                  We&apos;ll send your donation receipt to this email
                </FormDescription>
              </FormField>

              <div className="border-t pt-4">
                <h3 className="font-medium text-sm mb-3">
                  Payment Information
                </h3>

                <FormField>
                  <FormLabel htmlFor="cardNumber">Card Number</FormLabel>
                  <FormControl>
                    <Input
                      id="cardNumber"
                      placeholder="4242 4242 4242 4242"
                      value={donorInfo.cardNumber}
                      onChange={(e) =>
                        setDonorInfo({
                          ...donorInfo,
                          cardNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </FormControl>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="expiry">Expiry Date</FormLabel>
                  <FormControl>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={donorInfo.expiry}
                      onChange={(e) =>
                        setDonorInfo({ ...donorInfo, expiry: e.target.value })
                      }
                      required
                    />
                  </FormControl>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="cvc">CVC</FormLabel>
                  <FormControl>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={donorInfo.cvc}
                      onChange={(e) =>
                        setDonorInfo({ ...donorInfo, cvc: e.target.value })
                      }
                      required
                    />
                  </FormControl>
                </FormField>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" size="lg">
            Donate{" "}
            {selectedAmount === "custom"
              ? customAmount
                ? `$${Number(customAmount).toLocaleString()}`
                : ""
              : `$${selectedAmount.toLocaleString()}`}
          </Button>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            Powered by Stripe. Your payment is secure and encrypted.
          </p>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
