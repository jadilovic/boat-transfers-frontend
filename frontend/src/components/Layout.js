import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // ensures footer is at bottom
      }}
    >
      <Navbar />

      <main style={{ flex: 1, padding: "20px 40px" }}>{children}</main>

      <Footer />
    </div>
  );
}
