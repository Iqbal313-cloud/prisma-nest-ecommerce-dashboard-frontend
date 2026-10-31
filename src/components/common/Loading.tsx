import { RefreshCw } from "lucide-react";

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
        <RefreshCw className="h-7 w-7 animate-spin text-orange-500" />

        <p className="text-sm font-medium text-slate-500">{message}</p>
      </div>
    </div>
  );
}

export default Loading;
