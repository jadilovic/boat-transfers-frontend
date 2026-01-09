import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../App.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle resize properly
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Close menu automatically when switching to desktop
      if (!mobile) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu after clicking a link (mobile UX fix)
  const handleNavClick = () => {
    if (isMobile) {
      setMenuOpen(false);
    }
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <svg
          width="36"
          height="24"
          viewBox="0 0 260 160"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="40" y="80" width="160" height="20" rx="6" fill="#1a3c6e" />
          <polygon points="40,80 200,80 180,110 60,110" fill="#274b89" />
          <rect x="110" y="30" width="6" height="50" fill="#1a1a1a" />
          <polygon points="116,30 170,65 116,65" fill="#d9e7ff" />
          <path d="M0 120 Q130 160 260 120" fill="#a8d8ff" />
        </svg>
        <span>Island Boat Transfers</span>
      </div>

      {/* Hamburger (mobile only) */}
      {isMobile && (
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </div>
      )}

      {/* Navigation */}
      <nav
        className={`nav-links ${isMobile ? "mobile" : ""} ${
          menuOpen ? "show" : ""
        }`}
      >
        <NavLink to="/" end onClick={handleNavClick}>
          Home
        </NavLink>

        <NavLink to="/calculator" onClick={handleNavClick}>
          Calculator
        </NavLink>

        <NavLink to="/about" onClick={handleNavClick}>
          About
        </NavLink>
      </nav>
    </header>
  );
}
