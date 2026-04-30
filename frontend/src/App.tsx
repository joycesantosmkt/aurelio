import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Caixa from "./pages/Caixa";
import Fiado from "./pages/Fiado";
import Relatorios from "./pages/Relatorios";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/caixa" element={<Caixa />} />
      <Route path="/fiado" element={<Fiado />} />
      <Route path="/relatorios" element={<Relatorios />} />
    </Routes>
  );
}
