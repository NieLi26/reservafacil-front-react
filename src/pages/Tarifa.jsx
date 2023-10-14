import { useState, useEffect } from "react";


import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

import DatePicker from "react-datepicker";
import { format } from 'date-fns';

import Tabla from "../components/Tabla";
import TablaBody from "../components/TablaBody";
import ResultadoVacio from "../components/ResultadoVacio";
import Paginacion from "../components/Paginacion";
import Modal from "../components/Modal";


const Tarifa = () => {

    const tablaHeader = [
        'Numero',
        'Valor',
        'Fecha',
    ]

    // const [csrfToken, setCsrfToken] = useState('');

    // useEffect(() => {
    //     // Realiza la solicitud GET para obtener el token CSRF una sola vez
    //     const getcsrftoken = async () => {
    //         const url = `${import.meta.env.VITE_BACKEND_URL}/v2/get-csrf-token`;
    //         try {
    //             const { data } = await axios(url)
    //             console.log(data);
    //             setCsrfToken(data.csrf_token)
    //         } catch (error) {
    //             console.log(error.response);
    //         }
    //     }
    //     getcsrftoken();
    // }, []);

    const [isOpen, setIsOpen] = useState(false);

    const [ tarifas, setTarifas ] = useState([]);
    const [ paginator, setPaginator ] = useState({});
    const [ pagina, setPagina ] = useState(1);

    // form
    const [ valor, setValor ] = useState(0);

    const handleSubmit = async e => {
        e.preventDefault();
        const url = `${import.meta.env.VITE_BACKEND_URL}/v2/booking/tarifas`;
        try {
            const { data } = await axios.post(url, {valor})
            console.log(data);
            handleClickFilterReset();
            toast.success('Tarea Creada Correctamente')
            setIsOpen(false)
            setValor('')
        } catch (error) {
            console.log(error.response.data);
            toast.error(error.response.data)
        }
    }

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
        setPagina(1);
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

    useEffect(() => {

        const cargarTarifas = async () => {
            const url = `${import.meta.env.VITE_BACKEND_URL}/v2/booking/tarifas?page=${pagina}&orden=${filterOrden}&rango_fecha=${filterFecha}&q=${filterSearch}`;
            console.log(url);
            try {
                const { data } = await axios(url)
                setTarifas(data.results)
                console.log(data.results);
                const { results, ...copiaPaginator } = data;
                setPaginator(copiaPaginator)
                // console.log(data.data);
            } catch (error) {
                console.log(error);
                console.log(error.response.data);
            }
        }
        cargarTarifas();
    }, [pagina, filterOrden, filterFecha, filterSearch])

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-end mb-4">
            <div className="sm:flex-auto">
                <h1 className="text-2xl font-semibold text-gray-900">Listado de Tarifas</h1>
                {/* <!-- <p className="mt-2 text-sm text-gray-700">A table of placeholder stock market data that does not make any sense.</p> --> */}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button 
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">Agregar</button>
            </div>
        </div>
 
  
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Crear Tarifa"
        >
        {/* { msg && <Alerta alerta={alerta} /> } */}

            <form 
                onSubmit={handleSubmit}
                className="space-y-8 divide-y divide-gray-200"
            >
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 py-2">
                <div className="sm:col-span-6">
                    <label
                    htmlFor="valor"
                    className="block text-sm font-medium text-gray-700"
                    >
                    {" "}
                    Valor{" "}
                    </label>
                    <div className="mt-1">
                    <input
                        type="number"
                        name="valor"
                        id="valor"
                        value={valor}
                        onChange={e => setValor(e.target.value)}
                        className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    </div>
                </div>
                </div>

                <div className="flex pt-5">
                    <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                    Cancelar
                    </button>
                    <button
                    type="submit"
                    className="w-full ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                    <span>Guardar</span>
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
                                        <label htmlFor="search-tarifa" className="sr-only"> Buscar </label>
                                    
                                        <input
                                        type="text"
                                        id="search-tarifa"
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
                            {/* <!-- <div className="py-24">
                                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">New Arrivals</h1>
                                <p className="mt-4 max-w-3xl mx-auto text-base text-gray-500">Thoughtfully designed objects for the workspace, home, and travel.</p>
                            </div> --> */}
                        
                            <section aria-labelledby="filter-heading" className="border-t border-gray-200 py-6">
                                <h2 id="filter-heading" className="sr-only">Product filters</h2>
                        
                                <div className="flex items-center justify-between space-x-6">
                                <div className="flex items-center justify-between space-x-6">
                                    {/* <!-- Reset --> */}
                                    <button 
                                        onClick={handleClickFilterReset}
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
                            
                                    {/* <!--
                                        Dropdown menu, show/hide based on menu state.
                            
                                        Entering: "transition ease-out duration-100"
                                        From: "transform opacity-0 scale-95"
                                        To: "transform opacity-100 scale-100"
                                        Leaving: "transition ease-in duration-75"
                                        From: "transform opacity-100 scale-100"
                                        To: "transform opacity-0 scale-95"
                                    --> */}
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
                                    <label htmlFor="search-tarifa" className="sr-only"> Buscar </label>
                                
                                    <input
                                        type="text"
                                        id="search-tarifa"
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
                        

                                {/* <!-- Mobile filter dialog toggle, controls the 'mobileFilterDialogOpen' state. --> */}
                                <button type="button" className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden">Filtros</button>
                        
                                <div className="hidden sm:flex sm:items-baseline sm:space-x-8">
                                    {/* <!-- Fecha --> */}
                                    {/* <!-- <div id="fecha-menu" className="relative z-10 inline-block text-left">
                                    <input type="text" className="w-full rounded-md border-gray-200 px-4 py-2 shadow-sm sm:text-sm" placeholder="Seleccionar Fecha..." readonly="readonly">
                                    </div> --> */}
                                </div>
                                </div>
                            </section>
                            </div>
                        </div>
                      
                        <Tabla
                            tablaHeader={tablaHeader}
                        >
                              { tarifas.length !== 0 && tarifas.map( tarifa => (
                                    <tr
                                        key={tarifa.id}
                                    >
                                        <TablaBody 
                                            tarifa={tarifa}
                                        />
                                        <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                            <button
                                            //   x-on:click="modalCreate.cargarTarifa(25)"
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
                                            </button>
                                        </td>
                                    </tr>
                               
                                ))}
                        </Tabla>

                        { tarifas.length === 0 ? (
                            <ResultadoVacio />
                        ) : (
                            <Paginacion 
                                paginator={paginator}
                                setPagina={setPagina}
                                pagina={pagina}
                            />
                        )}

                                            
                    </div>
                </div>
            </div>
        </div>
      </div> 
  )
}

export default Tarifa


