import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AnalyticsPageHeaderProps {
  title: string;
  description: string;
}

export default function AnalyticsPageHeader({
  title,
  description,
}: AnalyticsPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/analytics")}
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-orange-600"
      >
        <ArrowLeft size={16} />
        Analytics Dashboard
      </button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}
