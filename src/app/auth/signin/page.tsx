
"use client";
import { useState } from "react";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/callback/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken: '', // NextAuth will handle CSRF automatically on the default page, but not here
        ...form,
      }),
    });
    if (!res.ok) {
      setError("Invalid credentials");
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Sign in to Plant Shop</h1>
      <a href="/api/auth/signin/github" className="btn bg-gray-800 text-white px-4 py-2 rounded mb-4">Sign in with GitHub</a>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs">
        <input
          type="text"
          placeholder="Email or Username"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
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
        <button type="submit" className="bg-green-600 text-white py-2 rounded">Sign in</button>
      </form>
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
