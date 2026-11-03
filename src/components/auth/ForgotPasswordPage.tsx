import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Package, Loader2, Mail, ArrowLeft } from "lucide-react";
import { requestPasswordReset } from "../../lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const result = await requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (result.error) {
        setError(
          result.error.message ||
            "Unable to process your request. Please try again.",
        );
        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error("Password reset request error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Package className="h-7 w-7" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter your email address and we'll send you a password reset link.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success */}
        {success ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
            <Mail className="mx-auto mb-3 h-8 w-8 text-green-600" />

            <h2 className="font-semibold text-green-800">Check your email</h2>

            <p className="mt-2 text-sm text-green-700">
              If an account exists with this email address, you will receive a
              password reset link shortly.
            </p>

            <p className="mt-3 text-xs text-green-700">
              The reset link expires in 30 minutes.
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}

              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {/* Back to Login */}
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 font-semibold text-slate-900 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
