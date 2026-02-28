import { useState, useRef, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/useMobile";

/**
 * MMAdHeader Component
 * Premium hero ad section with glassmorphism QR dropdown panel
 * Fully responsive: dropdown on desktop, bottom sheet on mobile
 */
export default function MMAdHeader() {
  const [, navigate] = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative w-full bg-cover bg-center pt-24 pb-20 md:pt-32 md:pb-24 overflow-hidden"
        style={{
          backgroundImage: "url(/assets/mmoney-ad.gif)",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl">
            {/* Headline */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              <span className="text-pretty">
                Sell Tickets and Boost Your Events
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base md:text-lg text-white/90 mb-8 md:mb-10 leading-relaxed max-w-md">
              Powered by MM — Secure Wallet & Card Payments
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Primary CTA */}
              <Button
                size="lg"
                className="font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                onClick={() => navigate("/organizer/create")}
              >
                Create Event Now
              </Button>

              {/* Secondary CTA */}
              <div className="relative">
                <Button
                  ref={triggerRef}
                  variant="outline"
                  size="lg"
                  className="font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 border-white/30 text-white hover:bg-white/10 transition-colors duration-200"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="Download MM App"
                  aria-expanded={isDropdownOpen}
                  aria-controls="mm-qr-panel"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download MM App
                </Button>

                {/* Glassmorphism QR Dropdown Panel */}
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    id="mm-qr-panel"
                    role="dialog"
                    aria-label="Download Mmoney App"
                    className={`absolute z-50 animate-in fade-in slide-in-from-top-2 transition-all duration-300 ease-out
                      ${
                        isMobile
                          ? "fixed bottom-0 left-0 right-0 rounded-t-2xl"
                          : "right-0 top-full mt-3 rounded-xl"
                      }
                      backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl p-6`}
                  >
                    {/* Close Button (Mobile) */}
                    {isMobile && (
                      <button
                        onClick={() => setIsDropdownOpen(false)}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    )}

                    {/* Panel Content */}
                    <div className="flex flex-col items-center gap-4">
                      {/* Logo */}
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm">
                        <span className="font-bold text-white text-lg">MM</span>
                      </div>

                      {/* Text */}
                      <div className="text-center">
                        <h3 className="text-white font-semibold mb-1">
                          Scan to download
                        </h3>
                        <p className="text-white/80 text-sm">
                          the Mmoney App
                        </p>
                      </div>

                      {/* QR Code */}
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                        <img
                          src="/assets/mm-qr.png"
                          alt="QR code to download Mmoney app"
                          className="w-40 h-40 md:w-48 md:h-48"
                        />
                      </div>

                      {/* Subtle Note */}
                      <p className="text-white/60 text-xs text-center">
                        Fast, Secure, Mobile Payments
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
