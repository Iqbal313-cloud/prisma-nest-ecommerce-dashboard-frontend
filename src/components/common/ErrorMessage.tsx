import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

function ErrorMessage({
  message = "Something went wrong. Please try again.",
  className = "",
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-4 shadow-sm backdrop-blur-sm ${className}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-5 w-5 text-red-600" />
      </div>

      <div className="min-w-0 pt-0.5">
        <p className="text-sm font-semibold text-red-800">
          Something went wrong
        </p>

        <p className="mt-1 text-sm leading-relaxed text-red-600">{message}</p>
      </div>
    </div>
  );
}

export default ErrorMessage;
