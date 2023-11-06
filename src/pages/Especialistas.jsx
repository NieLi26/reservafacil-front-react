import { useState, useEffect } from "react";


import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';



import DatePicker from "react-datepicker";

import Spinner from "../components/Spinner";
import Tabla from "../components/Tabla";
import ResultadoVacio from "../components/ResultadoVacio";
import Paginacion from "../components/Paginacion";
import Modal from "../components/Modal";
import ModalEliminar from "../components/ModalEliminar";

import PerfilFormStep from "../components/PerfilFormStep";
import PersonalFormStep from "../components/PersonalFormStep";
import ContratoFormStep from "../components/ContratoFormStep";

import useReserva from "../hooks/useReserva";
import clienteAxios from "../config/clienteAxios";


const SEXO = {
    M: 'Masculino',
    F: 'Femenino',
    NB: 'No Binario',
    NO: 'Prefiero no Decirlo'
}

const Especialistas = () => {



    const { 
            handleModalForm, handleModalEliminar, paginator, pagina, setCargando,
            handlePaginator, handlePagina, filterOrden, setFilterOrden, filterFecha,filterSearch, setFilterSearch, handleClickFilterReset,
            startDate, endDate, setDateRange, dropDown, setDropDown
        } = useReserva();

    const [ modalFormEspecialista, setModalFormEspecialista ] = useState(false);

    const handleModalFormEspecialista = () => {
        setModalFormEspecialista(!modalFormEspecialista)
        setStep(1)
        limpiarCampos()
    }
        
    const [ step, setStep ] = useState(1);

    // Anterior Step
    const prevStep = () => {
        setStep(step - 1);
    }

    // Siguiente Step
    const nextStep = () => {
        setStep(step + 1);
    }

    const [ especialistas, setEspecialistas ] = useState([]);
    const [ especialista, setEspecialista ] = useState({});

    // form
    // const [ id, setId ] = useState('');
    const [ objetoEspecialista, setObjetoEspecialista ] = useState({
        password: '',
        password2: '',
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        telefono: '',
        direccion: '',
        nacionalidad: '',
        rut: '',
        fecha_nacimiento: '',
        sexo: '',
        info: '',
        inicio_contrato: '',
        termino_contrato: ''
    })


    const handleObjetoEspecialista = objetoEspecialista => {
        setObjetoEspecialista(objetoEspecialista)
    }

    const componentsByStep = {
        1: <PerfilFormStep nextStep={nextStep} objetoEspecialista={objetoEspecialista} handleObjetoEspecialista={handleObjetoEspecialista} handleModalFormEspecialista={handleModalFormEspecialista} />,
        2: <PersonalFormStep prevStep={prevStep} nextStep={nextStep} objetoEspecialista={objetoEspecialista} handleObjetoEspecialista={handleObjetoEspecialista} />,
        3: <ContratoFormStep prevStep={prevStep} objetoEspecialista={objetoEspecialista} handleObjetoEspecialista={handleObjetoEspecialista} />,
        // 4: { component: <Success prop7="valor7" prop8="valor8" /> },
    };

    const nameStep = {
        1: 'Perfil',
        2: 'Informacion Personal',
        3: 'Contrato'
    }
      

    const handleSubmit = async e => {
        e.preventDefault();

        if ( Object.values(objetoEspecialista).includes('') ) {
            toast.warning('Todos los campos son obligatorios')
            return
        }

        setCargando(true)
        // await submitespecialista({id, nombre})
        if ( especialista?.id ) {
            await editarEspecialista(objetoEspecialista);
        } else {
            await crearEspecialista(objetoEspecialista);
        }
        // handleClickFilterReset();
        setCargando(false)
    }

    const limpiarCampos = () => {
        setObjetoEspecialista({
            password: '',
            username: '',
            password2: '',
            first_name: '',
            last_name: '',
            email: '',
            telefono: '',
            direccion: '',
            nacionalidad: '',
            rut: '',
            fecha_nacimiento: '',
            sexo: '',
            info: '',
            inicio_contrato: '',
            termino_contrato: ''
        })
    }

    const crearEspecialista = async especialista => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            if ( !token ) return;
    
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token.access}`
                }
            }
    
            const { data } = await clienteAxios.post('/v1/accounts/especialistas/', especialista, config)
            console.log(data);
            obtenerEspecialistas()
            // setEspecialistas([...especialistas, data])
            toast.success('especialista Creada Correctamente')
            handleModalFormEspecialista()
            setEspecialista({})
            limpiarCampos()
        } catch (error) {
            console.log(error.response.data);
            if (Array.isArray(error.response.data.msg)) {
                for ( const msg of error.response.data.msg ) {
                    toast.error(msg)
                }
                return
            } 
            toast.error(error.response.data.msg)
        }
    }

    const editarEspecialista = async especialista => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            if ( !token ) return;
    
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token.access}`
                }
            }
    
            const { data } = await clienteAxios.put(`/v1/accounts/especialistas/${especialista.id}/`, especialista, config)
            const especialistasActualizadas = especialistas.map(especialistastate => especialistastate.id === data.id ? data : especialistastate)
            setEspecialistas(especialistasActualizadas);
            toast.success('especialista Actualizada Correctamente')
            handleModalFormEspecialista()
            setEspecialista({})
            limpiarCampos()
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

    const eliminarEspecialista = async id => {
        const token = JSON.parse(localStorage.getItem('token'))
        if ( !token ) return;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.access}`
            }
        }

        // TODO: Arreglar cuando queda una especialista en la paginancion actual y se elimina, no desaparece de la vista, deberia cambiar de paginacion
        setCargando(true)
        try {
            const { data } = await clienteAxios.delete(`/v1/accounts/especialistas/${id}`, config)
            // const especialistasActualizadas = especialistas.filter( especialistastate => especialistastate.id !==  id)
            // setEspecialistas(especialistasActualizadas)
            obtenerEspecialistas()
            setEspecialista({})
            handleModalEliminar()
            toast.success(data.msg)
        } catch (error) {
            console.log(error.response.data);
            toast.error(error.response.data.msg)
        }
        setCargando(false)
    }

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
            const { data } = await clienteAxios(`/v1/accounts/especialistas?page=${pagina}&orden=${filterOrden}&rango_fecha=${filterFecha}&q=${filterSearch}`, config)
            setEspecialistas(data.results)
            const { results, ...copiaPaginator } = data;
            handlePaginator(copiaPaginator)
            // console.log(data.data);
        } catch (error) {
            console.log(error);
            console.log(error.response.data);
        }
    }


    // rellenar datos de formulario
    useEffect(() => {
        if ( especialista?.id ) {
            setObjetoEspecialista({
                id: especialista.id,
                username: especialista.username,
                first_name: especialista.first_name,
                last_name: especialista.last_name,
                email: especialista.email,
                telefono: especialista.telefono,
                direccion: especialista.direccion,
                nacionalidad: especialista.nacionalidad,
                rut: especialista.rut,
                fecha_nacimiento: especialista.fecha_nacimiento,
                sexo: especialista.sexo,
                info: especialista.info,
                inicio_contrato: especialista.inicio_contrato,
                termino_contrato:especialista.termino_contrato
            })
            return
        }

        limpiarCampos()
        // setId('')
    }, [especialista])


    useEffect(() => {
        obtenerEspecialistas();
    }, [pagina, filterOrden, filterFecha, filterSearch])

    useEffect(() => {
        console.log(objetoEspecialista);
    }, [objetoEspecialista])

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-end mb-4">
            <div className="sm:flex-auto">
                <h1 className="text-2xl font-semibold text-gray-900">Listado de Especialistas</h1>
                {/* <!-- <p className="mt-2 text-sm text-gray-700">A table of placeholder stock market data that does not make any sense.</p> --> */}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button 
                    onClick={handleModalFormEspecialista}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">Agregar</button>
            </div>
        </div>
 

        <Modal
            modal={modalFormEspecialista}
            handleModal={handleModalFormEspecialista}
            title="Crear Especialista"
        >
            <h2 className="text-center bg-blue-200 rounded-full p-2 text-base font-extrabold leading-7 text-blue-900 italic uppercase">{ nameStep[step] }</h2>

            <form 
                onSubmit={handleSubmit}
                className="space-y-8 divide-y divide-gray-200"
                noValidate
            >
                { componentsByStep[step] } 

            </form>
        </Modal>

        <ModalEliminar
            handleEliminar={eliminarEspecialista}
            id={especialista.id}
            title="Eliminar especialista"
            texto="Una especialista eliminada no se podra recuperar"
        >
        </ModalEliminar>

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
                                            <label htmlFor="search-especialista" className="sr-only"> Buscar </label>
                                        
                                            <input
                                            type="text"
                                            id="search-especialista"
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
                                    <label htmlFor="search-especialista" className="sr-only"> Buscar </label>
                                
                                    <input
                                        type="text"
                                        id="search-especialista"
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
                            tablaHeader={[
                                'Numero',
                                'Usuario',
                                'Nombre',
                                'Telefono',
                                'Email',
                                'Direccion',
                                'Nacionalidad',
                                'Rut',
                                'Fecha Nacimiento',
                                'Sexo',
                            ]}
                        >
                              { especialistas?.length !== 0 && especialistas.map( item => (
                                    <tr
                                        key={item.id}
                                    >
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.id}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.username}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.first_name} {item.last_name}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.telefono}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.email}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.direccion}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.nacionalidad}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.rut}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.fecha_nacimiento}</td>
                                         <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{SEXO[item.sexo]}</td>

                                        <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                            <button
                                                //   x-on:click="modalCreate.cargarespecialista(25)"
                                                onClick={() => {
                                                    handleModalFormEspecialista()
                                                    setEspecialista({
                                                        id: item.id,
                                                        username: item.username,
                                                        first_name: item.first_name,
                                                        last_name: item.last_name,
                                                        email: item.email,
                                                        telefono: item.telefono,
                                                        direccion: item.direccion,
                                                        nacionalidad: item.nacionalidad,
                                                        rut: item.rut,
                                                        fecha_nacimiento: item.fecha_nacimiento,
                                                        sexo: item.sexo,
                                                        info: item.especialista_profile.info,
                                                        inicio_contrato: item.especialista_profile.inicio_contrato,
                                                        termino_contrato: item.especialista_profile.termino_contrato
                                                    })
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
                                                    setEspecialista({id:item.id})
                                                    handleModalEliminar()
                                                }}
                                                // onClick={() => eliminarEspecialista(t.id)}
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

                        { especialistas?.length === 0 ?
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

export default Especialistas


