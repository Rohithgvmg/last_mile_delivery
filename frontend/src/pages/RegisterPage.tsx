import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface RegisterPageProps {
  onLogin: () => void;
}

export default function RegisterPage({
  onLogin,
}: RegisterPageProps) {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await register(name, email, password);

      setSuccess(
        "Registration successful. Please login."
      );

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>

          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />
        </div>

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
        {success && <p>{success}</p>}

        <button disabled={loading}>
          {loading
            ? "Creating account..."
            : "Register"}
        </button>
      </form>

      <p>
        Already have an account?
        <button onClick={onLogin}>
          Login
        </button>
      </p>
    </div>
  );
}