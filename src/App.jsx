import { BrowserRouter, Routes, Route } from "react-router-dom";
import es from 'date-fns/locale/es';
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import HomeLayout from "./layouts/HomeLayout";
import Home from "./pages/Home";
import Contacto from "./pages/Contacto";
import ReservaLayout from "./layouts/ReservaLayout";
import Dashboard from "./pages/Dashboard";
import Tarifa from "./pages/Tarifa";

registerLocale('es', es)
setDefaultLocale('es')

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="contacto" element={<Contacto />} />
        </Route>

        <Route path="/reserva/" element={<ReservaLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tarifa" element={<Tarifa />} />
          <Route path="cita" element={<Tarifa />} />
          <Route path="categoria" element={<Tarifa />} />
          <Route path="especialidad" element={<Tarifa />} />
          <Route path="pago" element={<Tarifa />} />
          <Route path="horario" element={<Tarifa />} />
          <Route path="cliente" element={<Tarifa />} />
          <Route path="especialista" element={<Tarifa />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
