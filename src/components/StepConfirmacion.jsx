import { useEffect } from 'react'
import axios from 'axios'
import clienteAxios from '../config/clienteAxios'

const SEXO = {
    M: 'Masculino',
    F: 'Femenino',
    NB: 'No Binario',
    NO: 'Prefiero no Decirlo'
}

const StepConfirmacion = ({prevStep, cita, handleFormCita, handleCita}) => {

    const { nombre, primer_apellido, segundo_apellido, email, telefono, fecha_nacimiento, sexo, motivo, rut } = cita

    useEffect(() => {
        const obtenerCliente = async () => {
            try {

                const { data } = await clienteAxios(`/v2/booking/cliente-rut/${rut}`)
                console.log(data)
                const { id, ...citaModificada } = data
                handleCita({
                    ...cita,
                    ...citaModificada
                })
            } catch (error) {
                console.log(error.response.data.msg);
            }
            
        }
        obtenerCliente();
    }, [])



  return (
    // <!-- step 4 -->
    <div className="htmlForm-step max-w-2xl mx-auto">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div className="pt-1 space-y-6 sm:pt-4 sm:space-y-5">
                <div className="space-y-6 sm:space-y-5">
                    {/* <!-- <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="rut" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Rut Paciente<span className="text-red-600">*</span> </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <input id="rut" name="rut" type="text" autoComplete="rut" className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md">
                        </div>
                    </div>
             --> */}
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Nombre <span className="text-red-600">*</span> </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <input 
                            value={nombre}
                            onChange={handleFormCita}
                            id="nombre" name="nombre" type="text" autoComplete="nombre" className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300" />
                        </div>
                    </div>
            
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="primer-apellido" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Primer Apellido <span className="text-red-600">*</span> </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <input 
                            value={primer_apellido}
                            onChange={handleFormCita}
                            id="primer-apellido" name="primer_apellido" type="text" autoComplete="primer-apellido" className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300" />
                        </div>
                    </div>
            
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="segundo-apellido" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Segundo Apellido <span className="text-red-600">*</span> </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <input 
                            value={segundo_apellido}
                            onChange={handleFormCita}
                            id="segundo-apellido" name="segundo_apellido" type="text" autoComplete="segundo-apellido" className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300" />
                        </div>
                    </div>
            
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> E-Mail <span className="text-red-600">*</span> </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <input 
                            value={email}
                            onChange={handleFormCita}
                            id="email" name="email" type="email" autoComplete="email" className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300" />
                        </div>
                    </div>
            
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Teléfono móvil <span className="text-red-600">*</span> </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <input 
                            value={telefono}
                            onChange={handleFormCita}
                            id="telefono" name="telefono" type="text" autoComplete="telefono" placeholder="(56) 999999999" className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300" />
                        </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="fecha-nacimiento" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Fecha Nacimiento <span className="text-red-600">*</span> </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <input 
                            value={fecha_nacimiento}
                            onChange={handleFormCita}
                            id="fecha-nacimiento" name="fecha_nacimiento" type="date" autoComplete="fecha-nacimiento" className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300" />
                        </div>
                    </div>
                    
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Sexo <span className="text-red-600">*</span> </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <select 
                                id="sexo"
                                name='sexo'
                                className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                                value={sexo}
                                onChange={handleFormCita}
                            >
                                <option value="" disabled > -- Seleccione una Opcion -- </option>
                                { Object.entries(SEXO).map( ([key, value]) => (
                                    <option key={key} value={key} >{value} </option>
                                )) }
                            </select>

                        </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Motivo <span className="text-red-600">*</span> </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <textarea 
                                value={motivo}
                                onChange={handleFormCita}
                                id="motivo" name="motivo" rows="3" className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"></textarea>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    
        <div className="pt-8 sm:pt-10">
            <div className="flex justify-end">
                <button 
                    onClick={prevStep}
                    type="button" className="btn-prev bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Regresar</button>
                <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <div id="spinner" className="hidden spinner">
                        <div className="rect1"></div>
                        <div className="rect2"></div>
                        <div className="rect3"></div>
                        <div className="rect4"></div>
                        <div className="rect5"></div>
                    </div>
                    <span>
                        Enviar
                    </span>
                </button>
            </div>
        </div>
    </div>
  )
}

export default StepConfirmacion