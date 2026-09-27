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
      className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}
    >
      <p className="text-sm font-medium text-red-600">{message}</p>
    </div>
  );
}

export default ErrorMessage;
