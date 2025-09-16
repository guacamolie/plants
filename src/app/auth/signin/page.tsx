"use client";

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-8 rounded shadow">
        <label htmlFor="email" className="font-semibold">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border px-4 py-2 rounded focus:outline-blue-600"
          required
          autoComplete="email"
        />
        <label htmlFor="password" className="font-semibold">Password</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border px-4 py-2 rounded w-full focus:outline-blue-600"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-sm text-blue-600 hover:underline"
            onClick={() => setShowPassword(v => !v)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold mt-2"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {error && <div className="text-red-600 mt-2 text-center" role="alert">{error}</div>}
        <div className="mt-4 text-center">
          <a href="/auth/register" className="text-blue-700 hover:underline">Don't have an account? Register</a>
        </div>
        <div className="mt-2 text-center">
          <a href="#" className="text-gray-500 hover:underline" tabIndex={-1}>Forgot password?</a>
        </div>
      </form>
    </div>
  );
}
