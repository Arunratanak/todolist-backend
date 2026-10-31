import { useState } from "react";
import { api } from "../api";

export default function AuthForm({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await api(`/api/auth/${mode}`, {
        method: "POST",
        body: { email, password },
      });
      onLogin(user); // tell App we're logged in
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{mode === "login" ? "Log in" : "Create account"}</h2>

      <input
        type="email"
        aria-label="Email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <input
        type="password"
        aria-label="Password"
        placeholder="Password (8+ characters)"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {mode === "login" ? "Log in" : "Register"}
      </button>

      <p className="auth-switch">
        {mode === "login" ? "No account? " : "Already registered? "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          {mode === "login" ? "Register" : "Log in"}
        </button>
      </p>
    </form>
  );
}