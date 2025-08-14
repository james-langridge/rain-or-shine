import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import stravaApiLogo from "../assets/api_logo_cptblWith_strava_horiz_orange.svg";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Navigation */}
      <nav className="px-4 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center">
          <div className="flex w-full items-center justify-between">
            {/* Logo/Brand */}
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl">⛅</span>
              <h1 className="text-lg sm:text-xl font-bold">Rain or Shine</h1>
            </Link>

            {/* User Menu */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {user.profileImageUrl && (
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="h-8 w-8 rounded-full ring-2 ring-background hover:ring-4 transition-all sm:pointer-events-none"
                      >
                        <img
                          src={user.profileImageUrl}
                          alt={user.displayName}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </button>
                    )}
                    <span className="text-sm font-medium hidden sm:inline">
                      {user.displayName}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="hidden sm:flex"
                  >
                    Sign Out
                  </Button>
                </div>

                {/* Mobile Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 sm:hidden">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.displayName}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-6 mx-auto px-3 flex-1">{children}</main>

      {/* Footer  */}
      <footer className="border-t px-4 mt-auto">
        <div className="flex flex-col sm:flex-row sm:h-16 items-center sm:justify-between py-4 gap-3 sm:gap-0">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            <a
              href="https://www.ngridge.com/en"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              James Langridge
            </a>{" "}
            © 2025
            {" · "}
            <Link
              to="/privacy"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <img
            src={stravaApiLogo}
            alt="Compatible with Strava"
            className="h-4 flex-shrink-0"
          />
        </div>
      </footer>
    </div>
  );
}
