import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Spinner from "../components/Spinner";

import useReserva from "../hooks/useReserva";

const ContratoFormStep = ({ prevStep, objetoEspecialista, handleObjetoEspecialista }) => {

    const { cargando } = useReserva();
    
    const [ finalizar, setFinalizar ] = useState(true)

    const { inicio_contrato, termino_contrato } = objetoEspecialista

    useEffect(() => {
        if ( inicio_contrato && termino_contrato ) {
            setFinalizar(false)
        } else {
            
            setFinalizar(true)
        }
    }, [inicio_contrato, termino_contrato])


  return (
    <>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 py-2">
            <div className="sm:col-span-6">
                <label
                htmlFor="inicioContrato"
                className="block text-sm font-medium text-gray-700"
                >
                    Inicio Contrato
                </label>
                <div className="mt-1">
                    <input
                        type="date"
                        id="inicioContrato"
                        value={inicio_contrato}
                        onChange={e => handleObjetoEspecialista({...objetoEspecialista, inicio_contrato: e.target.value})}
                        className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                    />
                </div>
            </div>

            <div className="sm:col-span-6">
                <label
                htmlFor="terminoContrato"
                className="block text-sm font-medium text-gray-700"
                >
                    Termino Contrato
                </label>
                <div className="mt-1">
                    <input
                        type="date"
                        id="terminoContrato"
                        value={termino_contrato}
                        onChange={e => handleObjetoEspecialista({...objetoEspecialista, termino_contrato: e.target.value})}
                        className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                    />
                </div>
            </div>
        </div>


        <div className="flex pt-5">
            <button
                type="button"
                onClick={prevStep}
                className="w-full bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Anterior
            </button>
            <button
                type="submit"
                disabled={cargando || finalizar && true}
                className="disabled:opacity-50 disabled:bg-green-600 disabled:cursor-not-allowed w-full ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                { cargando ? <Spinner /> : <span>Guardar</span> }
            </button>
        </div>
    </>
  )
}

export default ContratoFormStep