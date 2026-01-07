import { useState, useEffect } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo with boat SVG */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <svg
          width="36"
          height="24"
          viewBox="0 0 260 160"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: 10 }}
        >
          <rect x="40" y="80" width="160" height="20" rx="6" fill="#1a3c6e" />
          <polygon points="40,80 200,80 180,110 60,110" fill="#274b89" />
          <rect x="110" y="30" width="6" height="50" fill="#1a1a1a" />
          <polygon points="116,30 170,65 116,65" fill="#d9e7ff" />
          <path d="M0 120 Q130 160 260 120" fill="#a8d8ff" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>
          Island Boat Transfers
        </span>
      </div>

      {/* Hamburger only on mobile */}
      {isMobile && (
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            cursor: "pointer",
          }}
        >
          <span style={{ display: "block", width: 25, height: 3, background: "#333", transition: "0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ display: "block", width: 25, height: 3, background: "#333", opacity: menuOpen ? 0 : 1, transition: "0.3s" }} />
          <span style={{ display: "block", width: 25, height: 3, background: "#333", transition: "0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </div>
      )}

      {/* Navigation */}
      <nav
        style={{
          display: isMobile ? (menuOpen ? "flex" : "none") : "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 20,
          position: isMobile ? "absolute" : "static",
          top: isMobile ? "70px" : "auto",
          right: isMobile ? "20px" : "auto",
          background: isMobile ? "#fff" : "transparent",
          padding: isMobile ? "20px" : 0,
          borderRadius: isMobile ? 12 : 0,
          boxShadow: isMobile ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.3s ease",
          zIndex: 90,
        }}
      >
        <a href="/" style={{ padding: 8 }}>Home</a>
        <a href="/calculator" style={{ padding: 8 }}>Calculator</a>
        <a href="#" style={{ padding: 8 }}>About</a>
      </nav>
    </header>
  );
}
