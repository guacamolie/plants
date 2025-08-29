"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Registration failed");
    } else {
      setSuccess(true);
      setForm({ email: "", username: "", password: "" });
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-green-600 text-white py-2 rounded">Register</button>
      </form>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">Registration successful! You can now sign in.</p>}
    </div>
  );
}
