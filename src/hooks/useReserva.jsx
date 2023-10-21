import { useContext } from "react";
import ReservaContext from "../context/ReservaProvider";

const useReserva = () => {
    return useContext(ReservaContext)
}

export default useReserva