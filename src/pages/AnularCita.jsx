import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import GlobalSpinner from '../components/GlobalSpinner';
import { validarRut } from "../helpers/validarCampos"
import clienteAxios from '../config/clienteAxios';
import Modal from '../components/Modal';

const AnularCita = () => {

    const [ modalConfirmarCita, setModalConfirmarCita ] = useState(false)
    const [ modalAnularCita, setModalAnularCita ] = useState(false)
    const [ rut, setRut ] = useState('')
    const [ citas, setCitas ] = useState([])
    const [ cargando, setCargando ] = useState(false)
    const [ id, setId ] = useState('')

    const handleModalAnularCita = () => {
        setModalAnularCita(!modalAnularCita)
    }

    const handleModalConfirmarCita = () => {
        setModalConfirmarCita(!modalConfirmarCita)
    }

    const handleSubmit = e => {
        e.preventDefault()

        console.log(rut);
        if ( rut === '' ) {
        console.log('entroo');
            toast.warning('Debe ingresar el rut')
            return
        }

        if ( !validarRut(rut) ) {
            toast.warning('Rut Incorrecto, debe ser sin puntos y con guion')
            return
        }

        cargarCitasPaciente()

    }


    const cargarCitasPaciente = async () => {

        setCargando(true)
        try {
            const { data } = await clienteAxios(`/v2/booking/citas-listado?rut=${rut}`)
            console.log(data);
            setCitas(data)
        } catch (error) {
            console.log(error);
            console.log(error.response.data);
        }
        setCargando(false)
    }

    const cambiarEstado = async (estado) => {
        setCargando(true)
        try {
            const { data } = await clienteAxios.post(`/v2/booking/cita-estado/${id}`, { estado })
            console.log(data);
            // sincronizar state
            const citasActualizadas = citas.filter( cita => cita.id !== id )
            estado === 'CF' && setModalConfirmarCita(false)
            estado === 'AN' && setModalAnularCita(false)
            setCitas(citasActualizadas)
            setId('')
            toast.success(data.msg)
        } catch (error) {
            console.log(error);
            console.log(error.response.data);
            toast.error(error.response.data.msg)
        }
        setCargando(false) 
    }

  return (
    <nav aria-label="Progress">
        <ToastContainer />
        { cargando && <GlobalSpinner /> }

        <div className="max-w-xl mx-auto pt-16 px-4 sm:pt-24 sm:px-6 md:max-w-7xl md:px-8">

        {/* <!-- Be sure to use this with a layout container that is full-width on mobile --> */}
            <div className="bg-white shadow sm:rounded-lg md:max-w-7xl max-w-xl"> 
                <div className="px-4 py-5 sm:p-6">
                    <form 
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div id="rut-screen" className="form-step max-w-md mx-auto">
                            <div className="py-5 flex justify-between items-center">
                                <div>
                                    <p className="text-gray-700 dark:text-gray-300 md:text-lg">Mis Horas </p>
                                    <h1 className="text-2xl font-medium text-gray-800 capitalize lg:text-3xl ">
                                        Vigentes
                                    </h1>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="w-[64px] h-[64px] text-indigo-600"><path fill="currentColor" d="M5 8h14V6H5v2Zm0 0V6v2Zm0 14q-.825 0-1.413-.588T3 20V6q0-.825.588-1.413T5 4h1V3q0-.425.288-.713T7 2q.425 0 .713.288T8 3v1h8V3q0-.425.288-.713T17 2q.425 0 .713.288T18 3v1h1q.825 0 1.413.588T21 6v5.675q-.475-.225-.975-.375T19 11.075V10H5v10h6.3q.175.55.413 1.05t.562.95H5Zm13 1q-2.075 0-3.538-1.463T13 18q0-2.075 1.463-3.538T18 13q2.075 0 3.538 1.463T23 18q0 2.075-1.463 3.538T18 23Zm.5-5.2v-2.3q0-.2-.15-.35T18 15q-.2 0-.35.15t-.15.35v2.275q0 .2.075.388t.225.337l1.525 1.525q.15.15.35.15t.35-.15q.15-.15.15-.35t-.15-.35L18.5 17.8Z"/></svg>
                            </div>
                            <div className="flex flex-col mb-2">
                                <div className=" relative ">
                                <label htmlFor="rut" className="sr-only">Rut</label>
                                <input 
                                    value={rut}
                                    onChange={e => setRut(e.target.value)}
                                    id="rut" name="rut" type="text" required className="rounded-lg border-transparent flex-1 appearance-none border border-indigo-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" placeholder="Ingrese Rut Paciente Ej: 17605812-2" />
                                </div>
                            </div>
                            <div className="flex w-full my-4">
                                <button 
                                type="submit" className="btn-next py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                    Buscar
                                </button>
                            </div>
                            <div className="py-2 text-left">
                                <p>
                                    Tambien puede {''}
                                    <Link to="/agendar" className="font-semibold hover:underline">
                                        Reservar Horas.
                                    </Link>
                                </p>
                            </div>
                        </div>

                    </form>

                <div className="max-w-2xl mx-auto pt-4">
                    <ul className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                        { citas.length > 0 ? 
                            citas.map( cita => (
                                <li 
                                    key={cita.id}
                                    className='col-span-1 bg-white rounded-lg shadow-lg divide-y divide-gray-400 border border-gray-400'>
                                    <div className="w-full flex items-center justify-between p-6 space-x-6">
                                        <div className="flex-1 truncate">
                                            <div className="flex items-center space-x-3">
                                            <h3 className="text-gray-600 text-sm font-medium truncate">{cita.fecha}</h3>
                                            <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">{cita.hora}</span>
                                            </div>
                                            <h2 className="mt-1 text-gray-900 text-md font-bold truncate">{cita.especialista.nombre_completo}</h2>
                                            <p className="mt-1 text-gray-500 text-xs truncate">{cita.especialidad}</p>
                                        </div>
            
                                        <img className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" alt="" />
                                    </div>
            
                                    <div className="-mt-px flex divide-x divide-gray-200">
                                        <div className="w-0 flex-1 flex">
                                            <button 
                                                onClick={() => {
                                                    setId( cita.id )
                                                    handleModalAnularCita();
                                                }}
                                                className="btn-anular relative -mr-px w-0 flex-1 inline-flex items-center justify-center bg-red-500 p2-4 text-sm text-white font-medium border border-transparent rounded-bl-lg hover:text-gray-100 hover:shadow-lg hover:scale-y-105">
                                                Anular
                                            </button>
                                        </div>
                                        <div className="-ml-px w-0 flex-1 flex">
                                            <button 
                                                onClick={() => {
                                                    setId( cita.id )
                                                    handleModalConfirmarCita();
                                                }}
                                                className="btn-confirmar relative w-0 flex-1 inline-flex items-center justify-center bg-green-500 py-2 text-sm text-white font-medium border border-transparent rounded-br-lg hover:text-gray-100 hover:shadow-lg hover:scale-y-105">
                                                Confirmar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                            : null
                        }
                    </ul>
                </div>
                </div>
            </div>
        </div>

        
        <Modal
            modal={modalConfirmarCita}
            handleModal={handleModalConfirmarCita}
            // title="ConfirmarCita"
        >
            <div className="w-full h-full text-center">
                <div className="flex flex-col justify-between h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 m-auto mt-4 text-green-500" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.5 21H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M16 3v4M8 3v4m-4 4h16m-5 8l2 2l4-4"/></svg>
                    <p className="mt-4 text-xl font-bold text-gray-800">
                        Confirmar Cita
                    </p>
                    <p className="px-6 py-2 text-xs text-gray-600">
                        Estas seguro de confirmar esta cita ?
                    </p>
                    <div className="flex items-center justify-between w-full gap-4 mt-8">
                        <button 
                            onClick={() => cambiarEstado('CF')}
                            disabled={cargando && true}
                            type="button" className="py-2 px-4  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                            Confirmar
                        </button>
                        <button 
                            onClick={handleModalConfirmarCita}
                            type="button" className="py-2 px-4  bg-white hover:bg-gray-100 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-indigo-500 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </Modal>

        
        <Modal
            modal={modalAnularCita}
            handleModal={handleModalAnularCita}
            // title="ConfirmarCita"
        >
            <div className="w-full h-full text-center">
                <div className="flex flex-col justify-between h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 m-auto mt-4 text-red-500" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.5 21H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5m-4-9v4M8 3v4m-4 4h16m-4 8a3 3 0 1 0 6 0a3 3 0 1 0-6 0m1 2l4-4"/></svg>
                    <p className="mt-4 text-xl font-bold text-gray-800">
                        Anular Cita
                    </p>
                    <p className="px-6 py-2 text-xs text-gray-600">
                        Estas seguro de anular esta cita ?
                    </p>
                    <div className="flex items-center justify-between w-full gap-4 mt-8">
                        <button 
                            onClick={() => cambiarEstado('AN')}
                            disabled={cargando && true}
                            type="button" className="py-2 px-4  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                            Anular
                        </button>
                        <button 
                            onClick={handleModalAnularCita}
                            type="button" className="py-2 px-4  bg-white hover:bg-gray-100 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-indigo-500 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    </nav>
  )
}

export default AnularCita