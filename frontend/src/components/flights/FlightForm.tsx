import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { Flight, CreateFlightDto } from "../../types";

interface FlightFormProps {
  flight?: Flight | null;
  onSubmit: (data: CreateFlightDto) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}

export default function FlightForm({
  flight,
  onSubmit,
  onCancel,
  isEdit = false,
}: FlightFormProps) {
  const [formData, setFormData] = useState<CreateFlightDto>({
    date: "",
    departureAirport: "",
    arrivalAirport: "",
    aircraftType: "",
    flightHours: 0,
    isNight: false,
    isSolo: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form if editing
  useEffect(() => {
    if (flight) {
      setFormData({
        date:
          flight.date instanceof Date
            ? flight.date.toISOString().split("T")[0]
            : flight.date.split("T")[0],
        departureAirport: flight.departureAirport,
        arrivalAirport: flight.arrivalAirport,
        aircraftType: flight.aircraftType,
        flightHours: flight.flightHours,
        isNight: flight.isNight,
        isSolo: flight.isSolo,
      });
    }
  }, [flight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Flight" : "Log New Flight"}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEdit
              ? "Update flight details below"
              : "Enter flight details below"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6 space-y-6"
        >
          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Flight Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Departure Airport */}
          <div>
            <label
              htmlFor="departureAirport"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Departure Airport *
            </label>
            <input
              type="text"
              id="departureAirport"
              name="departureAirport"
              value={formData.departureAirport}
              onChange={handleChange}
              required
              placeholder="e.g., KBOS"
              maxLength={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
            />
            <p className="mt-1 text-sm text-gray-500">
              4-letter ICAO code (e.g., KBOS)
            </p>
          </div>

          {/* Arrival Airport */}
          <div>
            <label
              htmlFor="arrivalAirport"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Arrival Airport *
            </label>
            <input
              type="text"
              id="arrivalAirport"
              name="arrivalAirport"
              value={formData.arrivalAirport}
              onChange={handleChange}
              required
              placeholder="e.g., KJFK"
              maxLength={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
            />
            <p className="mt-1 text-sm text-gray-500">
              4-letter ICAO code (e.g., KJFK)
            </p>
          </div>

          {/* Aircraft Type */}
          <div>
            <label
              htmlFor="aircraftType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Aircraft Type *
            </label>
            <input
              type="text"
              id="aircraftType"
              name="aircraftType"
              value={formData.aircraftType}
              onChange={handleChange}
              required
              placeholder="e.g., Cessna 172"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Flight Hours */}
          <div>
            <label
              htmlFor="flightHours"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Flight Hours *
            </label>
            <input
              type="number"
              id="flightHours"
              name="flightHours"
              value={formData.flightHours}
              onChange={handleChange}
              required
              min="0.1"
              step="0.1"
              placeholder="e.g., 2.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isNight"
                name="isNight"
                checked={formData.isNight}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="isNight"
                className="ml-3 text-sm font-medium text-gray-700"
              >
                Night Flight
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isSolo"
                name="isSolo"
                checked={formData.isSolo}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="isSolo"
                className="ml-3 text-sm font-medium text-gray-700"
              >
                Solo Flight
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? "Saving..." : isEdit ? "Update Flight" : "Log Flight"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
