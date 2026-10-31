import { ArrowLeft, BarChart3, TrendingUp, Users, Package } from "lucide-react";
import { Link } from "react-router-dom";

interface AnalyticsPlaceholderPageProps {
  title: string;
  description: string;
}

const AnalyticsPlaceholderPage = ({
  title,
  description,
}: AnalyticsPlaceholderPageProps) => {
  const stats = [
    {
      label: "Total Records",
      value: "1,248",
      change: "+12.5%",
      icon: BarChart3,
    },
    {
      label: "This Month",
      value: "356",
      change: "+8.2%",
      icon: TrendingUp,
    },
    {
      label: "Active",
      value: "284",
      change: "+5.4%",
      icon: Users,
    },
    {
      label: "Categories",
      value: "18",
      change: "+2.1%",
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>

        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      {/* Placeholder Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-medium text-blue-800">Demo Analytics</p>
        <p className="mt-1 text-sm text-blue-700">
          This page currently displays dummy data. Real analytics and API
          integration will be added later.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>

                <div className="rounded-lg bg-orange-50 p-2">
                  <Icon className="text-orange-500" size={20} />
                </div>
              </div>

              <p className="mt-4 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>

              <p className="mt-2 text-sm text-green-600">
                {stat.change}{" "}
                <span className="text-gray-500">vs. last month</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Placeholder Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Analytics Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Sample monthly performance
          </p>
        </div>

        <div className="flex h-64 items-end justify-around gap-3 border-b border-l border-gray-200 px-3">
          {[45, 65, 40, 80, 58, 92, 70, 55, 85, 62, 75, 96].map(
            (height, index) => (
              <div
                key={index}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <div
                  title={`${height}%`}
                  style={{ height: `${height}%` }}
                  className="w-full rounded-t-md bg-orange-400 transition-colors hover:bg-orange-500"
                />
              </div>
            ),
          )}
        </div>

        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>Jan</span>
          <span>Mar</span>
          <span>May</span>
          <span>Jul</span>
          <span>Sep</span>
          <span>Dec</span>
        </div>
      </div>

      {/* Placeholder Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Sample records for layout preview
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Value</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {[
                {
                  name: "Sample Record A",
                  date: "Oct 20, 2026",
                  status: "Completed",
                  value: "৳12,500",
                },
                {
                  name: "Sample Record B",
                  date: "Oct 19, 2026",
                  status: "Pending",
                  value: "৳8,200",
                },
                {
                  name: "Sample Record C",
                  date: "Oct 18, 2026",
                  status: "Completed",
                  value: "৳15,000",
                },
                {
                  name: "Sample Record D",
                  date: "Oct 17, 2026",
                  status: "Processing",
                  value: "৳6,750",
                },
              ].map((record) => (
                <tr key={record.name} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                    {record.name}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                    {record.date}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        record.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : record.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-gray-900">
                    {record.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPlaceholderPage;
