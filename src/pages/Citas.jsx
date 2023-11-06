import { useState, useEffect, Fragment  } from "react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Combobox, Transition } from '@headlessui/react'

import axios from 'axios';

import DatePicker from "react-datepicker";

import Spinner from "../components/Spinner";

import Tabla from "../components/Tabla";
import ResultadoVacio from "../components/ResultadoVacio";
import Paginacion from "../components/Paginacion";
import Modal from "../components/Modal";

import useReserva from "../hooks/useReserva";
import clienteAxios from "../config/clienteAxios";


const ESTADOS = {
    AN: {
        'nombre': 'Anulada',
        'color': 'bg-red-500'
    },
    CF: {
        'nombre': 'Confirmada',
        'color': 'bg-indigo-500'
    },
    RS: {
        'nombre': 'Reservada',
        'color': 'bg-amber-500'
    },
    PA: {
        'nombre': 'Pagada',
        'color': 'bg-blue-500'
    }
}

const SEXO = {
    M: 'Masculino',
    F: 'Femenino',
    NB: 'No Binario',
    NO: 'Prefiero no Decirlo'
}

const METODOS_PAGO = {
    TA: 'Tarjeta',
    EF: 'Efectivo',
    FO: 'Fonasa',
    IS: 'Isapre',
    CO: 'Convenio'
}

const Citas = () => {
    // Contexto

    const { 
            handleModalForm, handleModalEliminar, paginator, pagina, cargando,
            handlePaginator, handlePagina, filterOrden, setFilterOrden, filterFecha,filterSearch, setFilterSearch, handleClickFilterReset,
            startDate, endDate, setDateRange, dropDown, setDropDown
        } = useReserva();

    // Modal
    const [ modalInfoCliente, setModalInfoCliente ] = useState(false);
    const [ modalInfoMotivo, setModalInfoMotivo ] = useState(false);
    const [ modalAnular, setModalAnular ] = useState(false);
    const [ modalFormPago, setModalFormPago ] = useState(false);

    const handleModalInfoCliente = () => {
        setModalInfoCliente(!modalInfoCliente)
    }

    const handleModalInfoMotivo = () => {
        setModalInfoMotivo(!modalInfoMotivo)
    }

    const handleModalAnular = () => {
        setModalAnular(!modalAnular)
        setMotivoAnulacion('')
    }

    const handleModalFormPago = () => {
        setModalFormPago(!modalFormPago);
    }

    // Estado

    const [checkBoxesEstado, setCheckBoxesEstado] = useState({
        RL: false,
        AN: false,
        CF: false,
        RS: false,
        PA: false
    });

    const [ filterEstado, setFilterEstado ] = useState([])


    const handleCheckBoxChangeEstado = async (event) => {
        const { name, checked } = event.target;
        setCheckBoxesEstado({
          ...checkBoxesEstado,
          [name]: checked,
        });

        const listadoEstados = Object.entries({
            ...checkBoxesEstado,
            [name]: checked,
          }).reduce((acomulador, [key, value]) => {
            if ( value ) {
                acomulador.push(key)
            }
            return acomulador
          }, [])

        setFilterEstado(listadoEstados)
        handlePagina(1)
      };

    const [ dropdownEstado,  setdropdownEstado ] = useState(false);

    // Situacion

    const [checkBoxesSituacion, setCheckBoxesSituacion] = useState({
        T: false,
        F: false
    });

    const [ filterSituacion, setFilterSituacion ] = useState([])


    const handleCheckBoxChangeSituacion = async (event) => {
        const { name, checked } = event.target;
        setCheckBoxesSituacion({
          ...checkBoxesSituacion,
          [name]: checked,
        });

        const listadoSituaciones = Object.entries({
            ...checkBoxesSituacion,
            [name]: checked,
          }).reduce((acomulador, [key, value]) => {
            if ( value ) {
                acomulador.push(key)
            }
            return acomulador
          }, [])

        setFilterSituacion(listadoSituaciones)
        handlePagina(1)
      };

    const [ dropdownSituacion,  setdropdownSituacion ] = useState(false);


    
    // General
    const [ citas, setCitas ] = useState([]);
    const [ cita, setCita ] = useState({});
    const [ especialistas, setEspecialistas ] = useState([]);
    const [ especialista, setEspecialista ] = useState({});
    const [ cliente, setCliente ] = useState({});
    const [ motivo, setMotivo ] = useState('')
    // form anulacion
    const [ motivoAnulacion, setMotivoAnulacion ] = useState({})
    // form pago
    const [ totalPago, setTotalPago ] = useState('');
    const [ codigoEspecialista, setCodigoEspecialista ] = useState('');
    const [ metodoPago, setMetodoPago ] = useState('');
    const [ folio, setFolio ] = useState('')


    const obtenerCitas = async () => {
        const token = JSON.parse(localStorage.getItem('token'))
        if ( !token ) return;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.access}`
            }
        }

        try {
            const { data } = await clienteAxios(`/v2/booking/citas?page=${pagina}&orden=${filterOrden}&rango_fecha=${filterFecha}&q=${filterSearch}&estado=${filterEstado}&realizada=${filterSituacion}&especialista=${especialista.id || ''}`, config)
            setCitas(data.results)
            console.log(data.results);
            const { results, ...copiaPaginator } = data;
            handlePaginator(copiaPaginator)
            // console.log(data.data);
        } catch (error) {
            console.log(error);
            console.log(error.response.data);
        }
    }

    useEffect(() => {
        obtenerCitas();
    }, [pagina, filterOrden, filterFecha, filterSearch, checkBoxesEstado, checkBoxesSituacion, especialista])


    const handleResetLocalFilters = () => {
        setCheckBoxesSituacion({
            T: false,
            F: false
        })
        setFilterSituacion([])
        setCheckBoxesEstado({
            RL: false,
            AN: false,
            CF: false,
            RS: false,
            PA: false
        })
        setFilterEstado([])
        setEspecialista({})
        setdropdownEstado(false)
        setdropdownSituacion(false)
    }


    useEffect(() => {
        const obtenerEspecialistas = async () => {
            const token = JSON.parse(localStorage.getItem('token'))
            if ( !token ) return;
    
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token.access}`
                }
            }

            try {
                const { data } = await clienteAxios('/v2/booking/especialistasprofile-listado', config)
                console.log(data);
                setEspecialistas(data)
            } catch (error) {
                console.log(error);
                console.log(error.response.data);
            }
        }

        obtenerEspecialistas()
    }, [])


        // ########## COMBO BOX ###########
        const [queryEspecialista, setQueryEspecialista] = useState('')

        const filteredEspecialistas =
            queryEspecialista === ''
            ? especialistas
            : especialistas.filter((especialista) =>
                especialista.nombre
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(queryEspecialista.toLowerCase().replace(/\s+/g, ''))
            )
    


    const handleSubmitMotivoAnulacion = async e => {
        e.preventDefault()

        try {
            const token = JSON.parse(localStorage.getItem('token'))
            if ( !token ) return;
    
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token.access}`
                }
            }

            const { data } = await clienteAxios.post('/v2/booking/historial-anulaciones', { cita: cita.id, motivo: motivoAnulacion }, config)
            console.log(data);
            obtenerCitas()
            // setCategorias([...categorias, data])
            toast.success('Motivo Anulacion guardado correctamente')
            handleModalAnular()
            setMotivoAnulacion('')
            setCliente({})
        } catch (error) {
            // console.log(error.response.data);
            if (Array.isArray(error.response.data.msg)) {
                for ( const msg of error.response.data.msg ) {
                    toast.error(msg)
                }
                return
            } 
            toast.error(error.response.data.msg)
        }
    }

    const handleSubmitPago = async e => {
        e.preventDefault();

        if ( [ totalPago, codigoEspecialista, metodoPago ].includes('') ) {
            toast.warning('Todos los campos son obligatorios')
            return
        }

        if ( ["FO", "IS", "CO"].includes(metodoPago) && folio === '' ) {
            toast.warning('Debe Ingresar Folio')
            return
        }

        try {
            const token = JSON.parse(localStorage.getItem('token'))
            if ( !token ) return;
    
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token.access}`
                }
            }

            const { data } = await clienteAxios.post('/v2/booking/pagos', { cita: cita.id, total: totalPago, cod_especialista: codigoEspecialista, 
            metodo: metodoPago, folio: folio }, config)
            console.log(data);
            obtenerCitas()
            // setCategorias([...categorias, data])
            toast.success('Pago guardado correctamente')
            handleModalFormPago()
            limpiarCampos()
            setCita({})
        } catch (error) {
            // console.log(error.response.data);
            if (Array.isArray(error.response.data.msg)) {
                for ( const msg of error.response.data.msg ) {
                    toast.error(msg)
                }
                return
            } 
            toast.error(error.response.data.msg)
        }
    }

    useEffect(() => {
        ["TA", "EF"].includes(metodoPago) && setFolio('')
    }, [metodoPago])

    const limpiarCampos = () => {
        setTotalPago('')
        setCodigoEspecialista('')
        setMetodoPago('')
        setFolio('')
    }

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-end mb-4">
            <div className="sm:flex-auto">
                <h1 className="text-2xl font-semibold text-gray-900">Listado de citas</h1>
                {/* <!-- <p className="mt-2 text-sm text-gray-700">A table of placeholder stock market data that does not make any sense.</p> --> */}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                {/* <button 
                    onClick={handleModalFormcita}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                    Agregar
                </button> */}
            </div>
        </div>
        {/* Modal Info Cliente */}
        <Modal
            modal={modalInfoCliente}
            handleModal={handleModalInfoCliente}
            title="Informacion Cliente"
            texto="Detalles e Informacion sobre el Cliente"
        >
            
            <div className="max-w-2xl overflow-hidden bg-white shadow sm:rounded-lg">
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Nombre
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                { cliente.nombre } {cliente.primer_apellido } { cliente.segundo_apellido }
                            </dd>
                        </div>

                        <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Rut
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                { cliente.rut }
                            </dd>
                        </div>

                        <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Correo
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                { cliente.email }
                            </dd>
                        </div>

                        <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Telefono
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                { cliente.telefono }
                            </dd>
                        </div>

                        <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Sexo
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                { SEXO[cliente.sexo] }
                            </dd>
                        </div>

                        <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Fecha Nacimiento
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                { cliente.fecha_nacimiento }
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

        </Modal>

        {/* Modal Info Motivo Cita */}
        <Modal
            modal={modalInfoMotivo}
            handleModal={handleModalInfoMotivo}
            title="Motivo Atencion"
            texto="Detalles sobre el Motivo de Atencion"
        >
            
            <div className="border border-gray-200 flow-root rounded-lg py-3 px-10 shadow h-72 overflow-y-auto">
                <p className="text-gray-700 sm:col-span-2">{ motivo }</p>
            </div>

        </Modal>

        {/* Modal Anular Cita */}
        <Modal
            modal={modalAnular}
            handleModal={handleModalAnular}
            title="Anular Cita"
            texto="Describe el Motivo de la Anulacion"
        >
            <form 
                onSubmit={handleSubmitMotivoAnulacion}
                className="space-y-8 divide-y divide-gray-200"
                noValidate
            >
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 py-2">
                    <div className="sm:col-span-6">
                        <div className="mt-1">
                            <textarea 
                                id="motivo-anulacion"
                                value={motivoAnulacion}
                                onChange={e => setMotivoAnulacion(e.target.value)}
                                rows={3}
                                className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex pt-5">
                    <button
                        type="button"
                        onClick={handleModalAnular}
                        className="w-full bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!motivoAnulacion && true}
                        className="disabled:opacity-50 disabled:bg-red-700 disabled:cursor-not-allowed w-full ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        <div
                            id="spinner"
                            className="hidden spinner w-[20px] h-[20px]"
                        >
                            <div className="rect1"></div>
                            <div className="rect2"></div>
                            <div className="rect3"></div>
                            <div className="rect4"></div>
                            <div className="rect5"></div>
                        </div>
                        <span>Anular</span>
                    </button>
                </div>
            </form>
            
        </Modal>

        {/* Modal Registro Pago */}
        <Modal
            modal={modalFormPago}
            handleModal={handleModalFormPago}
            title="Crear Pago"
        >
            <p className="text-center px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-200 rounded-md">PRESTACION: CIRUGÍA DE HERNIAS</p>

            <form 
                onSubmit={handleSubmitPago}
                className="space-y-8 divide-y divide-gray-200"
                noValidate
            >
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 py-2">

                    <div className="sm:col-span-6">
                        <label
                        htmlFor="total"
                        className="block text-sm font-medium text-gray-700"
                        >
                            Total
                        </label>
                        <div className="mt-1">
                            <input
                                type="number"
                                id="total"
                                value={totalPago}
                                onChange={e => setTotalPago(e.target.value)}
                                min={0}
                                className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label
                        htmlFor="codigo-especialista"
                        className="block text-sm font-medium text-gray-700"
                        >
                        Codigo Especialista
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="codigo-especialista"
                                value={codigoEspecialista}
                                onChange={e => setCodigoEspecialista(e.target.value)}
                                className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label
                            htmlFor="metodo-pago"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Metodo Pago
                        </label>

                        <div className="mt-1">
                        <select 
                            id="metodo-pago"
                            className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                            value={metodoPago}
                            onChange={e => setMetodoPago(e.target.value)}
                        >
                            <option value="" disabled > -- Seleccione una Opcion -- </option>
                            { Object.entries(METODOS_PAGO).map( ([key, value]) => (
                                <option key={key} value={key} >{value} </option>
                            )) }
                        </select>
                        </div>
                    </div>

                    { ["FO", "IS", "CO"].includes(metodoPago) && 
                        <div className="sm:col-span-6">
                            <label
                            htmlFor="folio"
                            className="block text-sm font-medium text-gray-700"
                            >
                            N° Folio
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="folio"
                                    value={folio}
                                    onChange={e => setFolio(e.target.value)}
                                    className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                                />
                            </div>
                        </div>
                    }

                </div>

                <div className="flex pt-5">
                    <button
                        type="button"
                        onClick={handleModalFormPago}
                        className="w-full bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={cargando && true}
                        className="disabled:opacity-50 disabled:bg-green-600 disabled:cursor-not-allowed w-full ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        { cargando ? <Spinner /> : <span>Guardar</span> }
                    </button>
                </div>
            </form>
        </Modal>


        {/* <!-- <input id="vanilla-calendar" type="text"> --> */}
        <div className="mt-4 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        {/* FIltro */}
                        <div className="bg-white">
                            {/* <!--
                            Mobile filter dialog
                        
                            Off-canvas menu for mobile, show/hide based on off-canvas menu state.
                            --> */}
                            <div className="fixed inset-0 flex z-40 sm:hidden" role="dialog" aria-modal="true">
                            {/* <!--
                                Off-canvas menu overlay, show/hide based on off-canvas menu state.
                        
                                Entering: "transition-opacity ease-linear duration-300"
                                From: "opacity-0"
                                To: "opacity-100"
                                Leaving: "transition-opacity ease-linear duration-300"
                                From: "opacity-100"
                                To: "opacity-0"
                            --> */}
                            <div  className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true">
                            </div>
                        
                            {/* <!--
                                Off-canvas menu, show/hide based on off-canvas menu state.
                        
                                Entering: "transition ease-in-out duration-300 transform"
                                From: "translate-x-full"
                                To: "translate-x-0"
                                Leaving: "transition ease-in-out duration-300 transform"
                                From: "translate-x-0"
                                To: "translate-x-full"
                            --> */}
                            <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-6 flex flex-col overflow-y-auto">
                                <div className="px-4 flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
                                <button 
                                type="button" className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <span className="sr-only">Close menu</span>
                                    {/* <!-- Heroicon name: outline/x --> */}
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                </div>
                        
                                {/* <!-- Filters --> */}
                                <form className="mt-4">
                                    <div className="border-t border-gray-200 px-4 py-6">
                                        {/* <!-- Search --> */}
                                        <div className="relative flex-1">
                                            <label htmlFor="search-cita" className="sr-only"> Buscar </label>
                                        
                                            <input
                                            type="text"
                                            id="search-cita"
                                            placeholder="Busqueda por..."
                                            className="w-full rounded-md border-gray-200 px-4 py-2 shadow-sm sm:text-sm"
                                            />
                                    
                                            <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                                                <button disabled type="button" className="text-gray-600 hover:text-gray-700">
                                                    <span className="sr-only">Search</span>
                                            
                                                    <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    className="h-4 w-4"
                                                    >
                                                    <path
                                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                                    />
                                                    </svg>
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            </div>
                        
                            <div className="max-w-3xl mx-auto px-4 text-center sm:px-6 lg:max-w-full lg:px-8">
                         
                        
                            <section aria-labelledby="filter-heading" className="border-t border-gray-200 py-6">
                                <h2 id="filter-heading" className="sr-only">Product filters</h2>
                        
                                <div className="flex items-center justify-between space-x-6">
                                <div className="flex items-center justify-between space-x-6">
                                    {/* <!-- Reset --> */}
                                    <button 
                                        onClick={() => {
                                            handleClickFilterReset()
                                            handleResetLocalFilters()
                                        }}
                                        type="button" 
                                        className="p-2 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg ">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                            <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>
                                    </button>
                                
                                    {/* <!-- Orden --> */}
                                    <div id="orden-menu" className="relative z-10 inline-block text-left">
                                    <div>
                                        <button  
                                            onClick={() => setDropDown(!dropDown)}
                                            type="button" 
                                            className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900" id="mobile-menu-button" aria-expanded="false" aria-haspopup="true"
                                        >
                                        Ordenar
                                        {/* <!-- Heroicon name: solid/chevron-down --> */}
                                        <svg className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                        </button>
                                    </div>

                                    { dropDown && (
                                        <div className="origin-top-left absolute left-0 z-10 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="mobile-menu-button" tabIndex="-1">
                                            <div className="py-1" role="none">
                                            <fieldset className="flex flex-col gap-1 p-1">
                                                <legend className="sr-only">Orden</legend>     
                                                <div
                                                >
                                                    <input
                                                        onChange={e => setFilterOrden(e.target.value)}
                                                        type="radio"
                                                        name="orden"
                                                        value="asc"
                                                        id="asc"
                                                        className="peer hidden"
                                                        checked={filterOrden === 'asc'}
                                                    />
                                                
                                                    <label
                                                    htmlFor="asc"
                                                    className="flex cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-100 bg-white px-3 py-2 text-gray-900 hover:border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white"
                                                    >                 
                                                    <p className="text-sm font-medium">A-Z</p>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                                        <path d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                                    </svg>     
                                                    </label>
                                                </div>
                                                
                                                <div
                                                >
                                                    <input
                                                        onChange={e => setFilterOrden(e.target.value)}
                                                        type="radio"
                                                        name="orden"
                                                        value="desc"
                                                        id="desc"
                                                        className="peer hidden"
                                                        checked={filterOrden === 'desc'}
                                                    />
                                                
                                                    <label
                                                    htmlFor="desc"
                                                    className="flex cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-100 bg-white px-3 py-2 text-gray-900 hover:border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white"
                                                    >
                                                    <p className="text-sm font-medium">Z-A</p>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                                        <path d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                                    </svg>  
                                                    </label>
                                                </div>
                                            </fieldset>
                                            {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                                            {/* <!-- <button className="block px-4 py-2 text-sm font-medium text-gray-900" role="menuitem" tabIndex="-1" id="mobile-menu-item-0"> Az </button>
                                
                                            <button className="block px-4 py-2 text-sm font-medium text-gray-900" role="menuitem" tabIndex="-1" id="mobile-menu-item-1"> Best Rating </button> --> */}
                                
                                            </div>
                                        </div>
                                    )
                                    }
                                    </div>
                                </div>

                                {/* <!-- Search --> */}
                                <div className="hidden sm:block sm:relative sm:flex-1">
                                    <label htmlFor="search-cita" className="sr-only"> Buscar </label>
                                
                                    <input
                                        type="text"
                                        id="search-cita"
                                        placeholder="Busqueda por..."
                                        className="w-full rounded-md border-gray-200 px-4 py-2 shadow-sm sm:text-sm"
                                        value={filterSearch}
                                        onChange={e => setFilterSearch(e.target.value)}
                                    />
                                
                                    <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                                    <button disabled type="button" className="text-gray-600 hover:text-gray-700">
                                        <span className="sr-only">Search</span>
                                
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="h-4 w-4"
                                        >
                                        <path
                                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                        />
                                        </svg>
                                    </button>
                                    </span>
                                </div>

                               {/* Fecha */}
                                <DatePicker
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => {
                                        setDateRange(update);
                                    }}
                                    isClearable={true}
                                    placeholderText="Seleccione una Fecha"
                                />
                        
                                {/* Especialista */}
                                <Combobox value={especialista} onChange={setEspecialista}>
                                <div className="relative mt-1">
                                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                        <Combobox.Input
                                            className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            displayValue={(item) => item.nombre}
                                            onChange={(event) => setQueryEspecialista(event.target.value)}
                                        />
                                        { !especialista.id ?
                                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                                </svg>
                                            </Combobox.Button >
                                            :
                                            <button onClick={() => setEspecialista({})} className="absolute inset-y-0 right-0 flex items-center pr-2 ml-auto">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button >
                                        }
                                     
                                        
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                        afterLeave={() => setQueryEspecialista('')}
                                    >
                                        <Combobox.Options className="absolute mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {filteredEspecialistas.length === 0 && queryEspecialista !== '' ? (
                                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                            Nada Encontrado.
                                            </div>
                                        ) : (
                                            filteredEspecialistas.map((item) => (
                                            <Combobox.Option
                                                key={item.id}
                                                className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                                }`
                                                }
                                                value={item}
                                            >
                                                {({ especialista, active }) => (
                                                <>
                                                    <span
                                                        className={`truncate flex gap-4 items-center ${
                                                            especialista ? 'font-medium' : 'font-normal'
                                                        }`}
                                                    >
                                                         <img src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />

                                                        {item.nombre}
                                                    </span>
                                                    {especialista ? (
                                                        <span
                                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                            active ? 'text-white' : 'text-teal-600'
                                                            }`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                            </svg>

                                                        </span>
                                                    ) : null}
                                                </>
                                                )}
                                            </Combobox.Option>
                                            ))
                                        )}
                                        </Combobox.Options>
                                    </Transition>
                                </div>
                                </Combobox>

                                {/* <!-- Mobile filter dialog toggle, controls the 'mobileFilterDialogOpen' state. --> */}
                                <button type="button" className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden">Filtros</button>
                        
                                <div className="hidden sm:flex sm:items-baseline sm:space-x-8">
                                    
                                    {/* <!-- Fecha --> */}
                                    {/* <!-- <div id="fecha-menu" className="relative z-10 inline-block text-left">
                                    <input type="text" className="w-full rounded-md border-gray-200 px-4 py-2 shadow-sm sm:text-sm" placeholder="Seleccionar Fecha..." readonly="readonly">
                                    </div> --> */}

                                    {/* ESTADO */}
                                    <div className="relative z-10 inline-block text-left">
                                        <div>
                                            <button 
                                                onClick={() => setdropdownEstado(!dropdownEstado)}
                                                type="button" className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900" aria-expanded="false">
                                            <span>Estado</span>

                                            <span className="quantity hidden ml-1.5 rounded py-0.5 px-1.5 bg-gray-200 text-xs font-semibold text-gray-700 tabular-nums">1</span>
                                            {/* <!-- Heroicon name: solid/chevron-down --> */}
                                            <svg className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                            </button>
                                        </div>

                                    { dropdownEstado && (
                                        <div 
                                        className="origin-top-right absolute visible right-0 mt-2 bg-white rounded-md shadow-2xl p-4 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <form className="space-y-4" method="post" >
                                            <div className="flex items-center">
                                                <input 
                                                    type="checkbox"
                                                    name="AN"
                                                    checked={checkBoxesEstado.AN}
                                                    onChange={handleCheckBoxChangeEstado}
                                                    className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500" />
                                                <label className="ml-3 pr-6 text-sm font-medium text-gray-900 whitespace-nowrap"> Anulada </label>
                                            </div>
                            
                                            <div className="flex items-center">
                                                <input 
                                                     type="checkbox"
                                                     name="CF"
                                                     checked={checkBoxesEstado.CF}
                                                     onChange={handleCheckBoxChangeEstado}
                                                    className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500" />
                                                <label className="ml-3 pr-6 text-sm font-medium text-gray-900 whitespace-nowrap"> Confirmada </label>
                                            </div>
                            
                                            <div className="flex items-center">
                                                <input 
                                                    type="checkbox"
                                                    name="RS"
                                                    checked={checkBoxesEstado.RS}
                                                    onChange={handleCheckBoxChangeEstado}
                                                    className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500" />
                                                <label className="ml-3 pr-6 text-sm font-medium text-gray-900 whitespace-nowrap"> Reservada </label>
                                            </div>
                            
                                            <div className="flex items-center">
                                                <input 
                                                     type="checkbox"
                                                     name="PA"
                                                     checked={checkBoxesEstado.PA}
                                                     onChange={handleCheckBoxChangeEstado}
                                                     className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500" />
                                                <label className="ml-3 pr-6 text-sm font-medium text-gray-900 whitespace-nowrap"> Pagada </label>
                                            </div>
                                        </form>
                                        </div>
                                    )
                                    }
                                        
                                    </div>

                                    {/* SITUACION */}
                                    <div className="relative z-10 inline-block text-left">
                                        <div>
                                            <button 
                                                onClick={() => setdropdownSituacion(!dropdownSituacion)}
                                                type="button" className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900" aria-expanded="false">
                                            <span>Situacion</span>

                                            <span className="quantity hidden ml-1.5 rounded py-0.5 px-1.5 bg-gray-200 text-xs font-semibold text-gray-700 tabular-nums">1</span>
                                            {/* <!-- Heroicon name: solid/chevron-down --> */}
                                            <svg className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                            </button>
                                        </div>

                                    { dropdownSituacion && (
                                        <div 
                                        className="origin-top-right absolute visible right-0 mt-2 bg-white rounded-md shadow-2xl p-4 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="space-y-4" method="post" >
                                            <div className="flex items-center">
                                                <input 
                                                 type="checkbox"
                                                 name="T"
                                                 checked={checkBoxesSituacion.T}
                                                 onChange={handleCheckBoxChangeSituacion}
                                               className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500" />
                                                <label className="ml-3 pr-6 text-sm font-medium text-gray-900 whitespace-nowrap"> Realizada </label>
                                            </div>
                            
                                            <div className="flex items-center">
                                                <input 
                                                    type="checkbox"
                                                    name="F"
                                                    checked={checkBoxesSituacion.F}
                                                    onChange={handleCheckBoxChangeSituacion}
                                                    className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500" />
                                                <label className="ml-3 pr-6 text-sm font-medium text-gray-900 whitespace-nowrap"> No Realizada </label>
                                            </div>
                            
                                        </div>
                                        </div>
                                        )
                                    }
                                        
                                    </div>

                                </div>
                                </div>
                            </section>
                            </div>
                        </div>
                      
                        <Tabla
                            tablaHeader={[
                                'Numero',
                                'Fecha',
                                'Hora',
                                'Cliente',
                                'Especialista',
                                'Estado',
                                'Situacion',
                            ]}
                        >
                              { citas?.length !== 0 && citas.map( item => (
                                    <tr
                                        key={item.id}
                                    >
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.id}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.fecha}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.hora}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.cliente.nombre} {item.cliente.primer_apellido} {item.cliente.segundo_apellido}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.especialista.nombre_completo}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            <span className={`py-0.5 px-1 rounded ${ESTADOS[item.estado].color} text-white text-xs`}>{ESTADOS[item.estado].nombre}</span>
                                         </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            { item.realizada 
                                                ? 
                                                <span
                                                    className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700"
                                                    >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="-ms-1 me-1.5 h-4 w-4"
                                                    >
                                                        <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>

                                                    <p className="whitespace-nowrap text-sm">realizada</p>
                                                </span>
                                                   
                                                :
                                                <span
                                                    className="inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-700"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="-ms-1 me-1.5 h-4 w-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                                    </svg>
                                                
                                                    <p className="whitespace-nowrap text-sm">sin realizar</p>
                                                 </span>
                                              

                                            }
                                     
                                        </td>

                                        <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                        <button 
                                            onClick={() => {
                                                setCliente(item.cliente);
                                                handleModalInfoCliente();
                                            }}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user-question w-6 h-6" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                                                <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5"></path>
                                                <path d="M19 22v.01"></path>
                                                <path d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"></path>
                                            </svg>
                                        </button>

                                        <button 
                                            onClick={() => {
                                                setMotivo(item.motivo);
                                                handleModalInfoMotivo();
                                            }}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-notes" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"></path>
                                                <path d="M9 7l6 0"></path>
                                                <path d="M9 11l6 0"></path>
                                                <path d="M9 15l4 0"></path>
                                            </svg>
                                        </button>

                                        <button 
                                            onClick={() => {
                                                setCita(item);
                                                handleModalFormPago()
                                            }}
                                            disabled={ item.estado !== 'CF' && true }
                                            className="text-green-600 hover:text-green-900 disabled:text-gray-300 disabled:cursor-not-allowed"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-cash" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M7 9m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"></path>
                                                <path d="M14 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                                <path d="M17 9v-2a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h2"></path>
                                            </svg>
                                        </button>

                                        <button 
                                            onClick={() => {
                                                setCita(item);
                                                handleModalAnular()
                                            }}
                                            disabled={ item.estado === 'AN' && true}
                                            className="text-red-600 hover:text-red-900 disabled:text-gray-300 disabled:cursor-not-allowed"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-notebook-off" width={24} height={24} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M8 4h9a2 2 0 0 1 2 2v9m-.179 3.828a2 2 0 0 1 -1.821 1.172h-11a1 1 0 0 1 -1 -1v-14m4 -1v1m0 4v13"></path>
                                                <path d="M13 8h2"></path>
                                                <path d="M3 3l18 18"></path>
                                            </svg>
                                        </button>
                                        
                                            {/* <button
                                                //   x-on:click="modalCreate.cargarcita(25)"
                                                onClick={() => {
                                                    handleModalFormcita()
                                                    setCita({nombre: item.nombre, id:item.id})
                                                }}
                                                className="text-yellow-600 hover:text-yellow-900"
                                            >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                ></path>
                                            </svg>
                                            </button>
                                            
                                            <button
                                                //   x-on:click="modalDelete.openModal(25)"
                                                onClick={() => {
                                                    setCita({id:item.id})
                                                    handleModaleliminarcita()
                                                }}
                                                // onClick={() => eliminarcita(t.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                ></path>
                                            </svg>
                                            </button> */}
                                        </td>
                                    </tr>
                               
                                ))}
                        </Tabla>

                        { citas?.length === 0 ?
                            <ResultadoVacio />
                        : 
                            <Paginacion 
                                paginator={paginator}
                                handlePagina={handlePagina}
                                pagina={pagina}
                            />
                        }

                                            
                    </div>
                </div>
            </div>
        </div>
      </div> 
  )
}

export default Citas


