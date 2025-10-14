import { useNavigate } from "react-router-dom";
import FlightForm from "../components/flights/FlightForm";
import { flightApi } from "../services/api";
import type { CreateFlightDto } from "../types";

export default function AddFlightPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateFlightDto) => {
    await flightApi.createFlight(data);
    alert("Flight logged successfully!");
    navigate("/flights");
  };

  const handleCancel = () => {
    navigate("/flights");
  };

  return (
    <FlightForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEdit={false}
    />
  );
}
