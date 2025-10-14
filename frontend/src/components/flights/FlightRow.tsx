import type { Flight } from "../../types";

interface FlightRowProps {
  flight: Flight;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function FlightRow({
  flight,
  onEdit,
  onDelete,
}: FlightRowProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(flight.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {flight.departureAirport}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {flight.arrivalAirport}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {flight.aircraftType}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {flight.flightHours.toFixed(1)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            flight.isNight
              ? "bg-indigo-100 text-indigo-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {flight.isNight ? "Night" : "Day"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {flight.isSolo ? (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Solo
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Dual
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onEdit(flight.id)}
          className="text-blue-600 hover:text-blue-900 mr-4"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(flight.id)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
