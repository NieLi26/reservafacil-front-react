import { BrowserRouter, Routes, Route } from "react-router-dom";
import es from 'date-fns/locale/es';
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import HomeLayout from "./layouts/HomeLayout";
import Home from "./pages/Home";
import Contacto from "./pages/Contacto";
import ReservaLayout from "./layouts/ReservaLayout";
import Dashboard from "./pages/Dashboard";
import Tarifas from "./pages/Tarifas";
import Categorias from "./pages/Categorias";
import Clientes from "./pages/Clientes";
import Especialidades from "./pages/Especialidades";
import Horarios from "./pages/Horarios";
import Pagos from "./pages/Pagos";
import Citas from "./pages/Citas";
import Especialistas from "./pages/Especialistas";

import { ReservaProvider } from "./context/ReservaProvider";

registerLocale('es', es)
setDefaultLocale('es')

function App() {
  return (
    <BrowserRouter>
      <ReservaProvider>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route path="contacto" element={<Contacto />} />
          </Route>

          <Route path="/reserva/" element={<ReservaLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="tarifas" element={<Tarifas />} />
              <Route path="citas" element={<Citas />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="especialidades" element={<Especialidades />} />
              <Route path="pagos" element={<Pagos />} />
              <Route path="horarios" element={<Horarios />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="especialistas" element={<Especialistas />} />
          </Route>
        </Routes>
      </ReservaProvider>
    </BrowserRouter>
  )
}

export default App
