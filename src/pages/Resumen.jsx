import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import GlobalSpinner from '../components/GlobalSpinner'
import clienteAxios from '../config/clienteAxios'

const Resumen = () => {

    const [ cita, setCita ] = useState({})
    const [ cargando, setCargando ] = useState(true)

    const params = useParams()

    const { id } = params;

    useEffect(() => {
        const obtenerCita = async () => {
            try {
                const { data } = await clienteAxios(`/v2/booking/resumen-cita/${id}`)
                console.log(data);
                setCita(data)
            } catch (error) {
                console.log(error);
                console.log(error.response.data);
            }
            setCargando(false)
        }
        obtenerCita()
    }, [])

    if ( cargando ) return <GlobalSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mt-24 py-16 px-4 sm:px-6 md:px-8 shadow-lg shadow-indigo-500/40 rounded-lg">
            <div className="px-4 sm:px-0">
                <h3 className="text-2xl font-bold leading-7 text-gray-900">Información de Reserva</h3>
                {/* <!-- <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p> --> */}
            </div>

            {/* <GeneralSpinner /> */}
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-300">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Profesional</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{cita.especialista.nombre_completo}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Fecha</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{cita.fecha}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Hora</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{cita.hora} Hrs</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Paciente</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{cita.cliente.nombre} {cita.cliente.primer_apellido}  {cita.cliente.segundo_apellido}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">N° Cita</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{cita.numero_cita}</dd>
                </div>

                <div className="pt-8 sm:pt-10">
                    <div className="flex justify-center">
                        <Link 
                            to="/" className="bg-red-600 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Ir a Inicio</Link>
                        <button  type="button" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Imprimir</button>
                    </div>
                </div>
                </dl>
            </div>
        </div>
    </div>
  )
}

export default Resumen