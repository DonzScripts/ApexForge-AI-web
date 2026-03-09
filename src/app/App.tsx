import { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import { handleAuthCallback, isAuthenticated } from "../lib/auth";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  opacity: isActive ? 1 : 0.65,
  padding: "10px 12px",
  borderRadius: 999,
  border: `1px solid ${
    isActive ? "rgba(255,45,45,0.35)" : "rgba(255,255,255,0.10)"
  }`,
  background: isActive
    ? "rgba(255,45,45,0.12)"
    : "rgba(255,255,255,0.04)",
});

export type AppOutletContext = {
  signedIn: boolean;
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  authError: string;
  setAuthError: React.Dispatch<React.SetStateAction<string>>;
};

export default function App() {
  const [signedIn, setSignedIn] = useState(isAuthenticated());
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    async function initAuth() {
      try {
        const completed = await handleAuthCallback();

        if (completed) {
          setSignedIn(true);
          setAuthError("");
        } else {
          setSignedIn(isAuthenticated());
        }
      } catch (err) {
        setSignedIn(false);
        setAuthError(
          err instanceof Error ? err.message : "Authentication failed."
        );
      }
    }

    void initAuth();
  }, []);

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
            <div
              style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}
            >
              <strong style={{ fontSize: 14 }}>ApexForge AI</strong>
              <span
                style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}
              >
                AI fitness coach
              </span>
            </div>
          </div>

          <div className="nav-links">
            <NavLink to="/" style={linkStyle}>
              Home
            </NavLink>
            <NavLink to="/checkin" style={linkStyle}>
              Check-In
            </NavLink>
            <NavLink to="/plans" style={linkStyle}>
              Plans
            </NavLink>
            <NavLink to="/progress" style={linkStyle}>
              Progress
            </NavLink>
            <NavLink to="/settings" style={linkStyle}>
              Settings
            </NavLink>
          </div>
        </div>
      </div>

      <div className="container page">
        <Outlet
          context={{
            signedIn,
            setSignedIn,
            authError,
            setAuthError,
          }}
        />
      </div>
    </>
  );
}