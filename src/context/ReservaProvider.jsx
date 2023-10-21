import { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { format } from 'date-fns';

const ReservaContext = createContext();

const ReservaProvider = ({children}) => {

    const [modalForm, setModalForm] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [ paginator, setPaginator ] = useState({});
    const [ pagina, setPagina ] = useState(1);
    const [ cargando, setCargando ] = useState(false)

    const [ mostrarPaginanacion, setMostrarPaginacion ] = useState([])


    // ###### FILTROS ######
    // Orden
    const [ filterOrden, setFilterOrden ] = useState('asc');
    const [ dropDown, setDropDown ] = useState(false);
    // Fecha
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [filterFecha, setFilterFecha] = useState('')
    // Q
    const [filterSearch, setFilterSearch] = useState('')


    // Reset
    const handleClickFilterReset = () => {
        handlePagina(1);
        setFilterOrden('asc');
        setDropDown(false);
        setDateRange([null, null])
        setFilterSearch('')
    }

    useEffect(() => {
        setDropDown(false);
    }, [filterOrden])

    useEffect(() => {
        if (startDate && endDate) {
            const formatFecha = `${format(startDate, 'yyyy-MM-dd')} a ${format(endDate, 'yyyy-MM-dd')}`
            console.log(formatFecha);
            setFilterFecha(formatFecha)
        } else {
            setFilterFecha('')
        }
    }, [startDate, endDate])
    

    const handlePaginator = paginator => {
        setPaginator(paginator)
    }

    const handlePagina = pagina => {
        setPagina(pagina)
    }

    const handleModalForm = () => {
        setModalForm(!modalForm)
    }

    const handleModalEliminar = () => {
        setModalEliminar(!modalEliminar)
    }

    return (
        <ReservaContext.Provider
            value={{
                cargando,
                setCargando,
                modalForm,
                modalEliminar,
                handleModalForm,
                handleModalEliminar,
                paginator,
                pagina,
                handlePaginator,
                handlePagina,
                mostrarPaginanacion,
                setMostrarPaginacion,
                filterOrden,
                setFilterOrden,
                filterFecha,
                filterSearch,
                setFilterSearch,
                handleClickFilterReset,
                dropDown,
                setDropDown,
                startDate,
                endDate,
                setDateRange
            }}
        >
            {children}
        </ReservaContext.Provider>
    )
}

export {
    ReservaProvider
}

export default ReservaContext