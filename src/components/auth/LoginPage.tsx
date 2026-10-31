// import { useState, type FormEvent } from "react";
// import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

// import { Package, Loader2 } from "lucide-react";
// import { signIn, useSession } from "../../lib/auth-client";

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { data: session, isPending: isSessionPending } = useSession();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);

//   const from = location.state?.from?.pathname || "/";

//   // Already authenticated
//   if (isSessionPending) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <Loader2 className="h-7 w-7 animate-spin text-slate-700" />
//       </div>
//     );
//   }

//   if (session?.user) {
//     return <Navigate to={from} replace />;
//   }

//   // Email and password login
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setError("");
//     setIsLoading(true);

//     try {
//       const result = await signIn.email({
//         email,
//         password,
//       });

//       if (result.error) {
//         setError(result.error.message || "Invalid email or password");
//         return;
//       }

//       navigate(from, { replace: true });
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Google OAuth login
//   const handleGoogleLogin = async () => {
//     setError("");
//     setIsGoogleLoading(true);

//     try {
//       await signIn.social({
//         provider: "google",
//         callbackURL: `${window.location.origin}${from}`,
//       });
//     } catch (error) {
//       console.error("Google login error:", error);
//       setError("Unable to login with Google. Please try again.");
//       setIsGoogleLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
//       <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
//         {/* Brand */}
//         <div className="mb-8 text-center">
//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-white">
//             <Package className="h-7 w-7" />
//           </div>

//           <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>

//           <p className="mt-2 text-sm text-slate-500">
//             Sign in to your Product Admin account
//           </p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         {/* Google Login */}
//         <button
//           type="button"
//           onClick={handleGoogleLogin}
//           disabled={isLoading || isGoogleLoading}
//           className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           {isGoogleLoading ? (
//             <Loader2 className="h-5 w-5 animate-spin" />
//           ) : (
//             <svg
//               className="h-5 w-5"
//               viewBox="0 0 48 48"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fill="#EA4335"
//                 d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
//                 transform="translate(0 4)"
//               />
//               <path
//                 fill="#4285F4"
//                 d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.77 7.18l7.73 6c4.51-4.17 7.08-10.31 7.08-17.65z"
//               />
//               <path
//                 fill="#FBBC05"
//                 d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19z"
//                 transform="translate(0 4)"
//               />
//               <path
//                 fill="#34A853"
//                 d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
//                 transform="translate(0 -4)"
//               />
//             </svg>
//           )}

//           {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
//         </button>

//         {/* Divider */}
//         <div className="relative my-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-slate-200" />
//           </div>

//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-white px-3 text-slate-400">
//               Or continue with email
//             </span>
//           </div>
//         </div>

//         {/* Login Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label
//               htmlFor="email"
//               className="mb-2 block text-sm font-medium text-slate-700"
//             >
//               Email Address
//             </label>

//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               autoComplete="email"
//               required
//               className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="mb-2 block text-sm font-medium text-slate-700"
//             >
//               Password
//             </label>

//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               autoComplete="current-password"
//               required
//               className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading || isGoogleLoading}
//             className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}

//             {isLoading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>

//         {/* Register */}
//         <p className="mt-6 text-center text-sm text-slate-500">
//           Don't have an account?{" "}
//           <Link
//             to="/register"
//             className="font-semibold text-slate-900 hover:underline"
//           >
//             Create account
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Package, Loader2 } from "lucide-react";
import { signIn, useSession } from "../../lib/auth-client";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: session, isPending } = useSession();

  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("super-admin@gmail.com");
  const [password, setPassword] = useState("123456789");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (session) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid email or password.");
        return;
      }

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}${from}`,
      });
    } catch (error) {
      console.error("Google login error:", error);
      setError("Unable to login with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError("");
    setIsGithubLoading(true);

    try {
      await signIn.social({
        provider: "github",
        callbackURL: `${window.location.origin}${from}`,
      });
    } catch (error) {
      console.error("GitHub login error:", error);
      setError("Unable to login with GitHub. Please try again.");
      setIsGithubLoading(false);
    }
  };

  const isAnyLoading = isLoading || isGoogleLoading || isGithubLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
            <Package className="h-7 w-7" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Social Login */}
          <div className="space-y-3">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isAnyLoading}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.93c-.58 2.96-2.26 5.47-4.74 7.16l7.73 6C44.42 37.92 46.98 31.8 46.98 24.55Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.54 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.12.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.56 2.56 10.78l7.98-6.19Z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.47 0 11.91-2.13 15.88-5.82l-7.73-6c-2.14 1.44-4.89 2.3-8.15 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                  />
                </svg>
              )}
              Continue with Google
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={isAnyLoading}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGithubLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.88-1.36-3.88-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.71 1.25 3.37.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.68 5.4-5.24 5.68.41.36.78 1.06.78 2.14v3.18c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              )}
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Login */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={isAnyLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-slate-900 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} NestJS Dashboard. All rights reserved.
        </p>
      </div>
    </div>
  );
}
