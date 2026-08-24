import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface LoginPageProps {
  onRegister: () => void;
}

export default function LoginPage({
  onRegister,
}: LoginPageProps) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(email, password);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account?
        <button onClick={onRegister}>
          Register
        </button>
      </p>
    </div>
  );
}
