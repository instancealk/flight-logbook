import { useEffect, useState } from "react";
import { flightApi } from "../services/api";
import type { FlightTotals } from "../types";

// Helper to extract error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}

export default function Dashboard() {
  const [totals, setTotals] = useState<FlightTotals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch flight totals when component mounts
    const fetchTotals = async () => {
      try {
        setLoading(true);
        const data = await flightApi.getFlightTotals();
        setTotals(data);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err) || "Failed to load flight totals");
        console.error("Error fetching totals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []); // Empty dependency array = run once on mount

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Flight Logbook Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Flights */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase">
              Total Flights
            </div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              {totals?.totalFlights || 0}
            </div>
          </div>

          {/* Total Hours */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase">
              Total Hours
            </div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              {totals?.totalHours.toFixed(1) || "0.0"}
            </div>
          </div>

          {/* Day Hours */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase">
              Day Hours
            </div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">
              {totals?.dayHours.toFixed(1) || "0.0"}
            </div>
          </div>

          {/* Night Hours */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase">
              Night Hours
            </div>
            <div className="mt-2 text-3xl font-bold text-indigo-600">
              {totals?.nightHours.toFixed(1) || "0.0"}
            </div>
          </div>

          {/* Solo Hours */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase">
              Solo Hours
            </div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {totals?.soloHours.toFixed(1) || "0.0"}
            </div>
          </div>

          {/* Last Updated */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 uppercase">
              Last Updated
            </div>
            <div className="mt-2 text-lg font-medium text-gray-700">
              {totals?.lastUpdated
                ? new Date(totals.lastUpdated).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <a
            href="/flights"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View All Flights →
          </a>
        </div>
      </div>
    </div>
  );
}
