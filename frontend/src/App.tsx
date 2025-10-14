import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FlightsPage from "./pages/FlightsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/flights" element={<FlightsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
