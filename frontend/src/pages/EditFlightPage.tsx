import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FlightForm from "../components/flights/FlightForm";
import { flightApi } from "../services/api";
import type { Flight, CreateFlightDto } from "../types";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}

export default function EditFlightPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlight = async () => {
      if (!id) return;

      try {
        const data = await flightApi.getFlightById(id);
        setFlight(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  const handleSubmit = async (data: CreateFlightDto) => {
    if (!id) return;
    await flightApi.updateFlight(id, data);
    alert("Flight updated successfully!");
    navigate("/flights");
  };

  const handleCancel = () => {
    navigate("/flights");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading flight...</div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">
          Error: {error || "Flight not found"}
        </div>
      </div>
    );
  }

  return (
    <FlightForm
      flight={flight}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEdit={true}
    />
  );
}
