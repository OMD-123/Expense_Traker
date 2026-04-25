import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const initialState = { name: "", email: "", password: "" };

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login" ? { email: form.email, password: form.password } : form;
      const response = await api.post(endpoint, payload);
      login(response.data);
      toast.success(mode === "login" ? "Welcome back" : "Account created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <p className="eyebrow">Expense Tracker Pro</p>
        <h1>Track money with budget alerts, recurring bills, and smart insights.</h1>
        <p className="muted">Manage your finances with intelligent tracking and real-time insights.</p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="card-head">
          <h2>{mode === "login" ? "Login" : "Create account"}</h2>
          <button
            type="button"
            className="ghost-button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Need an account?" : "Have an account?"}
          </button>
        </div>

        {mode === "register" && (
          <label>
            Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>

        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}
