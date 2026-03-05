import { Outlet, NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  opacity: isActive ? 1 : 0.65,
  padding: "10px 12px",
  borderRadius: 999,
  border: `1px solid ${isActive ? "rgba(255,45,45,0.35)" : "rgba(255,255,255,0.10)"}`,
  background: isActive ? "rgba(255,45,45,0.12)" : "rgba(255,255,255,0.04)",
});

export function App() {
  return (
    <>
      <div className="navbar">
        <div className="container nav-inner">
          <div className="badge">
          <img
  src={logo}
  alt="ApexForge AI logo"
  className="logoGlow"
  style={{
    width: 95,
    height: 95,
    objectFit: "contain",
  }}
/>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <strong style={{ fontSize: 14 }}>ApexForge AI</strong>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>AI fitness coach</span>
            </div>
          </div>

          <div className="nav-links">
            <NavLink to="/" style={linkStyle}>Home</NavLink>
            <NavLink to="/checkin" style={linkStyle}>Check-In</NavLink>
            <NavLink to="/plans" style={linkStyle}>Plans</NavLink>
            <NavLink to="/progress" style={linkStyle}>Progress</NavLink>
            <NavLink to="/settings" style={linkStyle}>Settings</NavLink>
          </div>
        </div>
      </div>

      <div className="container page">
        <Outlet />
      </div>
    </>
  );
}