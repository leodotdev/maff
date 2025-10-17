"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// YouTube Player type definitions
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
}

interface YTEvent {
  target: YTPlayer;
  data: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          events: {
            onReady?: (event: YTEvent) => void;
            onStateChange?: (event: YTEvent) => void;
          };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PRESET_AMOUNTS = [250, 500, 1000, 2500, 5000];
const VIDEOS = ["H2_aua_K2r4", "TIcShqSYSao", "AVBFJAuunHs", "X4wHOFoHZLY"];

const PHOTOS = [
  {
    src: "/photos/photo-3.jpeg",
    caption: "Mayor MAF speaking at the UN about Puerto Rico, 1980s",
  },
  {
    src: "/photos/photo-4.JPG",
    caption: "Ferré Family signing agreement with FIU, May 12, 2021",
  },
  {
    src: "/photos/photo-5.jpeg",
    caption:
      "MAF with Sister Isolina Ferré Missionary Nun from Puerto Rico (his godmother and aunt), 1980s",
  },
  {
    src: "/photos/photo-6.jpeg",
    caption: "MAF with Gov. Bob Graham of Florida, 1980s",
  },
  {
    src: "/photos/photo-1.jpeg",
    caption: "Mother Teresa and Mayor MAF, 1981",
  },
  {
    src: "/photos/photo-2.jpeg",
    caption: "King Juan Carlos of Spain with Mayor MAF, 1980s",
  },
];

// Parallax hook
function useParallax() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

export default function Home() {
  const scrollY = useParallax();
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(
    "custom"
  );
  const [customAmount, setCustomAmount] = useState("1000");
  const customInputRef = useRef<HTMLInputElement>(null);
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
  });
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const playerRefs = useRef<(YTPlayer | null)[]>([]);
  const isInitialMount = useRef(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    // Skip auto-focus on initial page load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (selectedAmount === "custom" && customInputRef.current) {
      customInputRef.current.focus();
      customInputRef.current.select();
    }
  }, [selectedAmount]);

  const nextVideo = useCallback(() => {
    setCurrentVideoIndex((prev) => (prev + 1) % VIDEOS.length);
  }, []);

  const prevVideo = useCallback(() => {
    setCurrentVideoIndex((prev) => (prev - 1 + VIDEOS.length) % VIDEOS.length);
  }, []);

  const nextPhoto = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev + 1) % PHOTOS.length);
  }, []);

  const prevPhoto = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
  }, []);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextPhoto();
    } else if (isRightSwipe) {
      prevPhoto();
    }
  };

  // Load YouTube IFrame API after a delay (lazy loading)
  useEffect(() => {
    // Defer loading the YouTube API until after initial page load
    const loadYouTubeAPI = () => {
      // Check if script already exists
      if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        // Initialize players for each video
        VIDEOS.forEach((videoId, index) => {
          const player = new window.YT.Player(`player-${index}`, {
            events: {
              onReady: (event: YTEvent) => {
                event.target.setVolume(50);
              },
              onStateChange: (event: YTEvent) => {
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
    };

    // Delay loading by 1 second to prioritize critical resources
    const timer = setTimeout(loadYouTubeAPI, 1000);

    return () => clearTimeout(timer);
  }, [nextVideo]);

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
    } catch (error) {
      console.error("Error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setIsProcessing(false);
    }
  };

  const scrollToDonate = () => {
    const donateSection = document.getElementById("donate");
    if (donateSection) {
      donateSection.scrollIntoView({ behavior: "smooth" });
      // Update URL hash without triggering page reload
      window.history.pushState(null, "", "#donate");

      // Focus and select the custom input after scroll completes
      setTimeout(() => {
        if (customInputRef.current) {
          customInputRef.current.focus();
          customInputRef.current.select();
        }
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-[960px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-lg font-bold text-gray-900 font-[family-name:var(--font-fahkwang)]">
              Maurice A. Ferré Foundation
            </div>
            <Button
              onClick={scrollToDonate}
              className="bg-blue-600 hover:bg-blue-600 text-white rounded-full px-8 font-bold font-[family-name:var(--font-fahkwang)]"
            >
              Donate
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Parallax */}
      <section className="relative w-full h-[95vh] md:h-[80vh] max-h-[680px] md:max-h-none overflow-hidden">
        {/* Background layer - moves slower, full width */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/hero-bg.png"
            alt="Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={90}
          />
        </div>

        {/* Content layer - Centered 960px container */}
        <div className="relative z-10 h-full flex items-start md:items-center justify-center pt-32 md:pt-0">
          <div className="max-w-[960px] w-full mx-auto px-6 h-auto md:h-full flex items-start md:items-center">
            <div className="flex flex-col md:flex-row items-stretch w-full md:py-20">
              {/* Quote Section */}
              <div className="w-full flex items-start md:items-center mb-2 md:mb-0">
                <blockquote className="max-w-[600px] w-full">
                  <p className="text-[22px] md:text-[36px] lg:text-[40px] leading-tight font-bold text-gray-900 mb-4 md:mb-8 font-[family-name:var(--font-fahkwang)]">
                    &ldquo;If I have contributed something of value to Miami in
                    my public service, over the past 50 years, it was because I
                    was accompanied by a dedicated, intelligent and honorable
                    cadre of people that made many of our dreams
                    possible.&rdquo;
                  </p>
                  <footer className="space-y-1.5 md:space-y-2">
                    <cite className="text-blue-600 text-[18px] md:text-[32px] font-bold not-italic block font-[family-name:var(--font-fahkwang)]">
                      Maurice A. Ferré
                    </cite>
                    <div className="text-[11px] md:text-base text-gray-700 space-y-0 md:space-y-1">
                      <p>
                        <span className="font-medium">b.</span> June 23, 1935
                        Ponce, PR
                      </p>
                      <p>
                        <span className="font-medium">d.</span> September 19,
                        2019 Miami, FL
                      </p>
                      <p className="pt-2">Mayor of Miami, FL</p>
                      <p className="font-bold">1973 - 1985</p>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* Foreground layer - Portrait positioned bottom right */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="max-w-[960px] w-full h-full mx-auto relative">
            <div className="absolute bottom-0 right-0 md:-right-40 w-[60%] md:w-[70%] h-[50vh] md:h-[130vh]">
              <Image
                src="/hero-fg.png"
                alt="Maurice A. Ferré"
                fill
                sizes="(max-width: 768px) 60vw, 70vw"
                className="object-contain object-bottom"
                priority
                quality={90}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[960px] mx-auto px-6">
          {/* Main Video Player */}
          <div className="relative w-full lg:w-[960px] lg:h-[540px] aspect-video lg:aspect-auto bg-black rounded-[36px] overflow-hidden shadow-2xl mb-8 mx-auto">
            {VIDEOS.map((videoId, index) => (
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
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  loading="lazy"
                  title={`Video ${index + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Video Thumbnails */}
          <div className="flex gap-4 overflow-x-auto justify-center px-2 py-3">
            {VIDEOS.map((videoId, index) => (
              <button
                key={videoId}
                onClick={() => switchToVideo(index, true)}
                className={`relative flex-shrink-0 w-48 aspect-video rounded-[18px] transition-all ${
                  index === currentVideoIndex
                    ? "ring-4 ring-blue-600 scale-105"
                    : "opacity-60 hover:opacity-100"
                }`}
                aria-label={`Play video ${index + 1}`}
              >
                <Image
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt={`Video ${index + 1} thumbnail`}
                  width={480}
                  height={360}
                  className="w-full h-full object-cover rounded-[18px]"
                />
                {index === currentVideoIndex && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-blue-600 text-white p-3 rounded-full">
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

      {/* Our Mission Section */}
      <section className="py-24">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Photo Carousel */}
            <div className="space-y-4">
              <div
                className="relative aspect-[4/5] rounded-[36px] overflow-hidden shadow-xl bg-gray-200 touch-pan-y"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {PHOTOS.map((photo, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentPhotoIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      quality={90}
                    />
                  </div>
                ))}

                {/* Navigation Arrows */}
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all z-10"
                  aria-label="Previous photo"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all z-10"
                  aria-label="Next photo"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Caption */}
              <p className="text-sm text-gray-600 text-center">
                {PHOTOS[currentPhotoIndex].caption}
              </p>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 pt-2">
                {PHOTOS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentPhotoIndex
                        ? "bg-blue-600 w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to photo ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Mission Text */}
            <div className="space-y-6 text-lg leading-relaxed">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Our mission
              </h2>
              <p className="text-gray-800">
                The Maurice A. Ferré Foundation supports charitable and
                educational organizations that enhance the general well-being of
                various communities in the United States of America. Its present
                focus is in the state of Florida and territory of Puerto Rico.
              </p>
              <p className="text-gray-800">
                The Foundation has partnered with Florida International
                University to establish the{" "}
                <a
                  href="https://ferre.fiu.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-600 underline font-medium"
                >
                  Maurice A. Ferré Institute for Civic Leadership
                </a>{" "}
                within the Steven J. Green School of International and Public
                Affairs. In addition it is dedicated to preserving and enhancing
                the Maurice A. Ferré Park, a public green space located in the
                heart of Downtown Miami&apos;s cultural district.
              </p>
              <p className="text-gray-800">
                The Maurice A. Ferré Foundation works with civic organizations
                to enhance mass public transportation, develop affordable
                housing solutions, foster opportunities for entrepreneurship in
                underserved communities and seek solutions that help humans
                adapt to the effects of a changing climate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section / Footer */}
      <footer
        id="donate"
        className="relative py-24 pb-128 overflow-hidden scroll-mt-20"
      >
        {/* Footer Background - Full width */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/foot-bg.png"
            alt="Footer background"
            fill
            sizes="100vw"
            className="object-cover"
            quality={85}
          />
        </div>

        <div className="relative z-10 max-w-[960px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Text Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Make a donation
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-900">
                <p>
                  The Maurice A. Ferré Foundation is dedicated to supporting
                  education, arts, and community development initiatives that
                  enrich the lives of Miami residents. Through strategic
                  partnerships and targeted programs, we work to create lasting
                  positive change in our community.
                </p>
                <p>
                  Founded with a vision to honor the legacy of Miami&apos;s
                  longest-serving mayor, our foundation focuses on empowering
                  the next generation of leaders. We believe in the
                  transformative power of education and the arts to build
                  stronger, more vibrant communities.
                </p>
                <p>
                  Your contribution helps us continue this vital work. Every
                  donation directly supports programs that make a meaningful
                  difference in the lives of Miami families. Join us in building
                  a brighter future for our city.
                </p>
              </div>
            </div>

            {/* Donation Form */}
            <div className="bg-white rounded-[36px] p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Amount Selection */}
                <div className="flex flex-col gap-3">
                  <label className="font-semibold text-gray-900 text-base">
                    Select Amount
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {PRESET_AMOUNTS.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={
                          selectedAmount === amount ? "default" : "outline"
                        }
                        onClick={() => setSelectedAmount(amount)}
                        className="h-16 text-base font-semibold"
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
                        setTimeout(() => {
                          if (customInputRef.current) {
                            customInputRef.current.focus();
                            customInputRef.current.select();
                          }
                        }, 0);
                      }}
                      className="h-16 text-base font-semibold col-span-2"
                    >
                      Custom Amount
                    </Button>
                  </div>
                  {selectedAmount === "custom" && (
                    <div className="relative mt-2">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base font-medium">
                        $
                      </span>
                      <Input
                        ref={customInputRef}
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        min="1"
                        className="pl-8 h-14 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  )}
                </div>

                {/* Donor Information */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="font-semibold text-gray-900 text-base"
                  >
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
                    className="h-12 text-base"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="font-semibold text-gray-900 text-base"
                  >
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
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-gray-600">
                    We&apos;ll send your receipt to this email
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-600 text-white h-14 text-base font-semibold mt-2 rounded-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      Donate{" "}
                      {selectedAmount === "custom"
                        ? customAmount
                          ? `$${Number(customAmount).toLocaleString()}`
                          : ""
                        : `$${selectedAmount.toLocaleString()}`}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Secure payment via Stripe
                </p>
              </form>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
