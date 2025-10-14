import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FlightsPage from "./pages/FlightsPage";
import AddFlightPage from "./pages/AddFlightPage";
import EditFlightPage from "./pages/EditFlightPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/flights/new" element={<AddFlightPage />} />
        <Route path="/flights/edit/:id" element={<EditFlightPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
