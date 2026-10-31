import { useState, type FormEvent } from "react";
import { useSession } from "../../lib/auth-client";
import { authClient } from "../../lib/auth-client";

export default function AccountSettingsPage() {
  const { data: session, isPending } = useSession();

  const [newEmail, setNewEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const currentEmail = session?.user?.email ?? "";

  const handleChangeEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const normalizedEmail = newEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your new email address.");
      return;
    }

    if (normalizedEmail === currentEmail.toLowerCase()) {
      setError("New email must be different from your current email.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await authClient.changeEmail({
        newEmail: normalizedEmail,
        callbackURL: "/settings/account",
      });

      if (result.error) {
        setError(result.error.message || "Failed to request email change.");
        return;
      }

      setMessage(
        "Verification email has been sent. Please check your new email address to complete the change.",
      );

      setNewEmail("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return <div className="p-6">Loading account settings...</div>;
  }

  if (!session?.user) {
    return (
      <div className="p-6">Please sign in to access account settings.</div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and email address.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Email Address</h2>

        <p className="mt-1 text-sm text-gray-500">
          Your email address is used for signing in and receiving account
          notifications.
        </p>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Current email
          </label>

          <input
            type="email"
            value={currentEmail}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none"
          />

          <p className="mt-2 text-xs text-gray-500">
            {session.user.emailVerified
              ? "Your current email is verified."
              : "Your current email is not verified."}
          </p>
        </div>

        <div className="my-6 border-t border-gray-200" />

        <form onSubmit={handleChangeEmail} className="space-y-4">
          <div>
            <label
              htmlFor="newEmail"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              New email address
            </label>

            <input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter your new email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !newEmail.trim()}
              className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Change Email"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
