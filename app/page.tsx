"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(
    "custom"
  );
  const [customAmount, setCustomAmount] = useState("");
  const customInputRef = useRef<HTMLInputElement>(null);
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
  });
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const playerRefs = useRef<any[]>([]);

  const presetAmounts = [250, 500, 1000, 2500, 5000];

  const videos = ["H2_aua_K2r4", "TIcShqSYSao", "AVBFJAuunHs", "X4wHOFoHZLY"];

  useEffect(() => {
    if (selectedAmount === "custom" && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [selectedAmount]);

  // Load YouTube IFrame API and initialize players
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      // Initialize players for each video
      videos.forEach((videoId, index) => {
        const player = new (window as any).YT.Player(`player-${index}`, {
          events: {
            onReady: (event: any) => {
              event.target.setVolume(50);
            },
            onStateChange: (event: any) => {
              // State 0 = ended
              if (event.data === 0) {
                nextVideo();
              }
            },
          },
        });
        playerRefs.current[index] = player;
      });
    };
  }, []);

  // Control video playback when switching videos
  useEffect(() => {
    // Wait a bit for players to be ready
    const timer = setTimeout(() => {
      playerRefs.current.forEach((player, index) => {
        if (player && player.pauseVideo && player.playVideo) {
          if (index === currentVideoIndex) {
            player.playVideo();
          } else {
            player.pauseVideo();
          }
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [currentVideoIndex]);

  const switchToVideo = (index: number, unmute: boolean = false) => {
    setCurrentVideoIndex(index);

    // If unmute is requested, unmute the video after switching
    if (unmute) {
      setTimeout(() => {
        const player = playerRefs.current[index];
        if (player && player.unMute) {
          player.unMute();
        }
      }, 200);
    }
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const amount =
        selectedAmount === "custom" ? parseFloat(customAmount) : selectedAmount;

      if (!amount || amount < 1) {
        alert("Please enter a valid donation amount");
        setIsProcessing(false);
        return;
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          name: donorInfo.name,
          email: donorInfo.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-gray-300" />
            <div className="text-xl font-bold">Maurice A. Ferré Foundation</div>
          </div>
        </div>
      </header>

      {/* Hero Section with Video Carousel */}
      <section className="w-full bg-black">
        <div className="relative w-full aspect-video overflow-hidden group">
          {videos.map((videoId, index) => (
            <div
              key={videoId}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentVideoIndex
                  ? "opacity-100 z-20"
                  : "opacity-0 z-0"
              }`}
            >
              <iframe
                id={`player-${index}`}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&cc_load_policy=1&playsinline=1&rel=0&fs=1&enablejsapi=1`}
                className="w-full h-full relative z-20"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title={`Video ${index + 1}`}
              />
            </div>
          ))}

          {/* Navigation Controls - Show on Hover */}
          <button
            onClick={prevVideo}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-4 rounded-full backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100"
            aria-label="Previous video"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextVideo}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-4 rounded-full backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100"
            aria-label="Next video"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Video Playlist */}
      <section className="py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto justify-center px-2 py-3">
            {videos.map((videoId, index) => (
              <button
                key={videoId}
                onClick={() => switchToVideo(index, true)}
                className={`relative flex-shrink-0 w-40 aspect-video rounded-lg transition-all ${
                  index === currentVideoIndex
                    ? "ring-4 ring-blue-500 scale-105"
                    : "opacity-60 hover:opacity-100"
                }`}
                aria-label={`Play video ${index + 1}`}
              >
                <img
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt={`Video ${index + 1} thumbnail`}
                  className="w-full h-full object-cover rounded-lg"
                />
                {index === currentVideoIndex && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-blue-500 text-white p-2 rounded-full">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <blockquote className="relative">
            <p className="text-2xl md:text-3xl lg:text-4xl leading-relaxed mb-8 font-[family-name:var(--font-fahkwang)]">
              "If I have contributed something of value to Miami in my public
              service, over the past 50 years, it was because I was accompanied
              by a dedicated, intelligent and honorable cadre of people that
              made many of our dreams possible."
            </p>
            <footer className="flex flex-col gap-1 border-l-4 border-blue-600 pl-6">
              <cite className="text-xl font-semibold not-italic">
                Maurice A. Ferré
              </cite>
              <span className="text-gray-500">January 31, 2019</span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Our Mission
          </h2>
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              The Maurice A. Ferré Foundation supports charitable and
              educational organizations that enhance the general well-being of
              various communities in the Unites States of America. Its present
              focus is in the state of Florida and territory of Puerto Rico.
            </p>
            <p>
              The Foundation has partnered with Florida International University
              to establish the{" "}
              <a
                href="https://ferre.fiu.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Maurice A. Ferré Institute for Civic Leadership
              </a>{" "}
              within the Steven J. Green School of International and Public
              Affairs. In addition it is dedicated to preserving and enhancing
              the Maurice A. Ferré Park, a public green space located in the
              heart of Downtown Miami&apos;s cultural district.
            </p>
            <p>
              The Maurice A. Ferré Foundation works with civic organizations to
              enhance mass public transportation, develop affordable housing
              solutions, foster opportunities for entrepreneurship in
              underserved communities and seek solutions that help humans adapt
              to the effects of a changing climate.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed">
              <span className="float-left text-3xl font-bold leading-[0.8] mr-2 mt-2">
                T
              </span>
              he Maurice A. Ferré Foundation is dedicated to supporting
              education, arts, and community development initiatives that
              enrich the lives of Miami residents. Through strategic
              partnerships and targeted programs, we work to create lasting
              positive change in our community.
            </p>

            <p className="text-lg leading-relaxed">
              Founded with a vision to honor the legacy of Miami&apos;s
              longest-serving mayor, our foundation focuses on empowering the
              next generation of leaders. We believe in the transformative
              power of education and the arts to build stronger, more vibrant
              communities.
            </p>

            <p className="text-lg leading-relaxed">
              Your contribution helps us continue this vital work. Every
              donation directly supports programs that make a meaningful
              difference in the lives of Miami families. Join us in building a
              brighter future for our city.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] p-8 md:p-12">
            {/* Donation Form */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">Make a Donation</h2>
                <p className="text-gray-600">
                  Support our mission with a secure donation
                </p>
              </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Amount Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="font-medium">Select Amount</label>
                    <div className="grid grid-cols-3 gap-2">
                      {presetAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant={
                            selectedAmount === amount ? "default" : "outline"
                          }
                          onClick={() => setSelectedAmount(amount)}
                          className="h-12"
                        >
                          ${amount.toLocaleString()}
                        </Button>
                      ))}
                      <Button
                        type="button"
                        variant={
                          selectedAmount === "custom" ? "default" : "outline"
                        }
                        onClick={() => setSelectedAmount("custom")}
                        className="h-12"
                      >
                        Custom
                      </Button>
                    </div>
                    {selectedAmount === "custom" && (
                      <Input
                        ref={customInputRef}
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        min="1"
                      />
                    )}
                  </div>

                  {/* Donor Information */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={donorInfo.name}
                      onChange={(e) =>
                        setDonorInfo({ ...donorInfo, name: e.target.value })
                      }
                      required
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={donorInfo.email}
                      onChange={(e) =>
                        setDonorInfo({ ...donorInfo, email: e.target.value })
                      }
                      required
                      disabled={isProcessing}
                    />
                    <p className="text-xs text-gray-500">
                      We&apos;ll send your receipt to this email
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        Continue to Payment{" "}
                        {selectedAmount === "custom"
                          ? customAmount
                            ? `$${Number(customAmount).toLocaleString()}`
                            : ""
                          : `$${selectedAmount.toLocaleString()}`}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    You&apos;ll be redirected to Stripe for secure payment
                    processing
                  </p>
                </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-gray-300" />
            <div className="font-bold">Maurice A. Ferré Foundation</div>
          </div>
          <div className="flex space-x-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
