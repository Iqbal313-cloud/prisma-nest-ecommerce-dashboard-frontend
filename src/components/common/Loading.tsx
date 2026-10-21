import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  minHeight?: string;
}

function Loading({
  message = "Loading...",
  minHeight = "min-h-[300px]",
}: LoadingProps) {
  return (
    <div className={`flex ${minHeight} items-center justify-center`}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />

        <p className="text-sm font-medium text-slate-500">{message}</p>
      </div>
    </div>
  );
}

export default Loading;
