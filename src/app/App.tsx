import { useEffect, useState } from "react";
import { handleAuthCallback, isAuthenticated, login, logout } from "../lib/auth";
import { getMe } from "../lib/api";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      try {
        await handleAuthCallback();

        if (isAuthenticated()) {
          const profile = await getMe();
          setUser(profile);
        }
      } catch (err: any) {
        setError(err.message || "Auth error");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  if (loading) return <div>Loading ApexForgeAI...</div>;

  if (!isAuthenticated()) {
    return (
      <div style={{ padding: 24 }}>
        <h1>ApexForgeAI</h1>
        <p>You are not signed in.</p>
        <button onClick={() => login()}>Sign In</button>
        {error && <p>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>ApexForgeAI</h1>
      <p>Signed in</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={() => logout()}>Logout</button>
      {error && <p>{error}</p>}
    </div>
  );
}