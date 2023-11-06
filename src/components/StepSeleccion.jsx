import { useState, useEffect, Fragment } from "react";

import { Combobox, Transition } from '@headlessui/react'
import ResultadoVacio from "./ResultadoVacio"
import clienteAxios from "../config/clienteAxios";

const StepSeleccion = ({ prevStep, nextStep, categoria, categorias, handleCategoria, especialidad, especialidades, handleEspecialidad, handleEspecialista, cita, handleCita }) => {

  const [queryCategoria, setQueryCategoria] = useState('')
  const [ especialistas, setEspecialistas ] = useState([])

  const filteredCategorias =
  queryCategoria === ''
    ? categorias
    : categorias.filter((cat) =>
        cat.nombre
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(queryCategoria.toLowerCase().replace(/\s+/g, ''))
    )

  const [queryEspecialidad, setQueryEspecialidad] = useState('')

  const filteredEspecialidades =
  queryEspecialidad === ''
    ? especialidades
    : especialidades.filter((es) =>
        es.nombre
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(queryEspecialidad.toLowerCase().replace(/\s+/g, ''))
    )


    useEffect(() => {
      const obtenerEspecialistas = async () => {
        try {
            const { data } = await clienteAxios(`/v1/accounts/especialistas-especialidad-listado?especialidad=${especialidad.id}`)
            setEspecialistas(data)
        } catch (error) {
            console.log(error);
            console.log(error.response.data);
        }
      } 
      if ( especialidad.id ) {
        console.log(especialidad);
        obtenerEspecialistas()
      }
    }, [especialidad])


    const handleClickCargarAgenda = especialista => {
        console.log('especialista: ', especialista);
        handleEspecialista(especialista)
        const { id } = especialista.especialista_profile
        handleCita({...cita, especialista: id, especialidad: especialidad.nombre})
        nextStep()
    }

  return (
    <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="flex justify-start">
            <button 
              onClick={prevStep}
              type="button" className="btn-prev bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Regresar</button>
        </div>    
 
        <div className="pt-4 space-y-6 sm:pt-5 sm:space-y-5">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2 sm:col-start-1">
                    <label htmlFor="categoria" className="block text-sm font-medium leading-6 text-gray-900">Area Médica</label>
                    <div className="mt-2">
                        {/* <select id="categoria" name="categoria" className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md">
                            <option value="">Todos </option>
                          </select>     */}
    
                          <Combobox value={categoria} onChange={handleCategoria}>
                            <div className="relative mt-1">
                                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                    <Combobox.Input
                                        className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        displayValue={(item) => item.nombre}
                                        onChange={(event) => setQueryCategoria(event.target.value)}
                                    />
                                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                        </svg>
                                    </Combobox.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                    afterLeave={() => setQueryCategoria('')}
                                >
                                    <Combobox.Options className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {filteredCategorias.length === 0 && queryCategoria !== '' ? (
                                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                        Nothing found.
                                        </div>
                                    ) : (
                                        filteredCategorias.map((item) => (
                                        <Combobox.Option
                                            key={item.id}
                                            className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                            }`
                                            }
                                            value={item}
                                        >
                                            {({ categoria, active }) => (
                                            <>
                                                <span
                                                className={`block truncate ${
                                                    categoria ? 'font-medium' : 'font-normal'
                                                }`}
                                                >
                                                {item.nombre}
                                                </span>
                                                {categoria ? (
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
                    </div>
                </div>
                
        
                <div className="sm:col-span-2">
                    <label htmlFor="especialidad" className="block text-sm font-medium leading-6 text-gray-900">Especialidad</label>
                    <div className="mt-2">
                        {/* <select disabled id="especialidad" name="especialidad" className="disabled:opacity-50 max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md">
                            <option value="">Seleccione una opción</option>
                          </select>       */}

                          <Combobox disabled={!categoria.id ? true : false} value={especialidad} onChange={handleEspecialidad}>
                            <div className="relative mt-1">
                                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                    <Combobox.Input
                                        className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        displayValue={(item) => item.nombre}
                                        onChange={(event) => setQueryEspecialidad(event.target.value)}
                                    />
                                    <Combobox.Button 
                                      className="absolute inset-y-0 right-0 flex items-center pr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                        </svg>
                                    </Combobox.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                    afterLeave={() => setQueryEspecialidad('')}
                                >  
                                    <Combobox.Options className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {filteredEspecialidades.length === 0 && queryEspecialidad !== '' ? (
                                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                        Nothing found.
                                        </div>
                                    ) : (
                                        filteredEspecialidades.map((item) => (
                                        <Combobox.Option
                                            key={item.id}
                                            className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                            }`
                                            }
                                            value={item}
                                        >
                                            {({ especialidad, active }) => (
                                            <>
                                                <span
                                                className={`block truncate ${
                                                    especialidad ? 'font-medium' : 'font-normal'
                                                }`}
                                                >
                                                {item.nombre}
                                                </span>
                                                {especialidad ? (
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
                    </div>
                </div>

                
        
                {/* <!-- <div className="sm:col-span-2">
                    <label htmlFor="especialista" className="block text-sm font-medium leading-6 text-gray-900">Profesional</label>
                    <div className="mt-2">
                        <select disabled id="especialista" name="especialista" autocomplete="especialista-name" className="disabled:opacity-50 max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md">
                            <option value="">Todos</option>
                          </select>                                              
                    </div>
                </div> --> */}
            </div>
        </div>


        { especialidad?.id && (!especialistas.length ? <ResultadoVacio /> :
        
          <section id="section-table" className="container pt-4 sm:pt-5 px-4 mx-auto w-full">
          <div className="flex items-center gap-x-3">
              {/* <!-- <h2 className="text-lg font-medium text-gray-800 dark:text-white">Profesionales</h2> --> */}
              <span id="cantidad-titulo" className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">{especialistas.length} Especialistas</span>
          </div>
      
          <div className="flex flex-col mt-6">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                  <tr>
                                      <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500">
                                          <div className="flex items-center gap-x-3">
                                              <span>Name</span>
                                          </div>
                                      </th>
                                      <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">Fecha</th>
      
                                      <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">Hora</th>

                                      <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">Duración</th>
      
                                      <th scope="col" className="relative py-3.5 px-4">
                                          <span className="sr-only">Edit</span>
                                      </th>
                                  </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                { especialidad?.id && especialistas.length && especialistas.map( especialista => (
                                    <tr key={especialista.id}>
                                      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                          <div className="inline-flex items-center gap-x-3">                        
                                              <div className="flex items-center gap-x-2">
                                                  <img className="object-cover w-10 h-10 rounded-full" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=880&amp;q=80" alt="" />
                                                  <div>
                                                      <h2 className="font-medium text-gray-800">Dr. { especialista.first_name } { especialista.last_name }</h2>
                                                      <p className="text-xs font-normal text-gray-600">{especialidad.nombre}</p>
                                                  </div>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">11/11/1999</td>
                                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">12:00 AM</td>
                                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">30 min</td>
                                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                                          <button 
                                            onClick={() => handleClickCargarAgenda(especialista)}
                                            type="button" className="gap-x-2 flex justify-center items-center rounded bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:rotate-2 hover:scale-110 focus:outline-none focus:ring active:bg-green-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                            </svg>
                                              
                                              {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="btn-next pointer-events-none w-6 h-6">
                                              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"></path>
                                              </svg> */}
                                              Ver Agenda
                                          </button>
                                      
                                      </td>
                                    </tr>
                                ))}

                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
          </section>
        
        )}



    </div>
  )
}

export default StepSeleccion