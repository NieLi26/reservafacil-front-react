import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { validarEmail, validarRut } from '../helpers/validarCampos';

const PersonalFormStep = ({ prevStep, nextStep, objetoEspecialista, handleObjetoEspecialista }) => {

  const SEXO = {
    M: 'Masculino',
    F: 'Femenino',
    NB: 'No Binario',
    NO: 'Prefiero no Decirlo'
  }

  const { first_name, last_name, email, telefono, direccion, nacionalidad, rut, fecha_nacimiento, sexo, info } = objetoEspecialista;

  const handleNext = () => {
      if ( [ first_name, last_name, email, telefono, direccion, nacionalidad, rut, fecha_nacimiento, sexo, info ].includes('') ) {
          toast.warning('Todos los campos son obligatorios')
          return
      }

      if ( !validarEmail(email) ) {
          toast.warning('Formato de Correo Incorrecto')
          return
      }

      if ( !validarRut(rut) ) {
          toast.warning('Rut Incorrecto, debe ser sin puntos y con guion')
          return
      }

      nextStep()
  }

  return (
    <> 
      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 py-2">
              <div className="sm:col-span-6">
                  <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                  >
                      Nombre 
                  </label>
                  <div className="mt-1">
                      <input
                          type="text"
                          id="firstName"
                          value={first_name}
                          onChange={e => handleObjetoEspecialista({...objetoEspecialista, first_name: e.target.value})}
                          className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                      />
                  </div>
              </div>
    
              <div className="sm:col-span-6">
                  <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                  >
                      Apellidos
                  </label>
                  <div className="mt-1">
                      <input
                          type="text"
                          id="lastName"
                          value={last_name}
                          onChange={e => handleObjetoEspecialista({...objetoEspecialista, last_name: e.target.value})}
                          className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                      />
                  </div>
              </div>
    
              <div className="sm:col-span-3">
                  <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-gray-700"
                  >
                      Telefono
                  </label>
                  <div className="mt-1">
                      <input
                          type="tel"
                          id="telefono"
                          value={telefono}
                          onChange={e => handleObjetoEspecialista({...objetoEspecialista, telefono: e.target.value})}
                          className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                      />
                  </div>
              </div>
    
              <div className="sm:col-span-3">
                  <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                  >
                      Correo
                  </label>
                  <div className="mt-1">
                      <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={e => handleObjetoEspecialista({...objetoEspecialista, email: e.target.value})}
                          className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                      />
                  </div>
              </div>
    
              <div className="sm:col-span-3">
                  <label
                  htmlFor="rut"
                  className="block text-sm font-medium text-gray-700"
                  >
                      RUT
                  </label>
                  <div className="mt-1">
                      <input
                          type="text"
                          id="rut"
                          value={rut}
                          onChange={e => handleObjetoEspecialista({...objetoEspecialista, rut: e.target.value})}
                          className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                      />
                  </div>
              </div>
    
              <div className="sm:col-span-3">
                  <label
                  htmlFor="fechaNacimiento"
                  className="block text-sm font-medium text-gray-700"
                  >
                      Fecha Nacimiento
                  </label>
                  <div className="mt-1">
                      <input
                          type="date"
                          id="fechaNacimiento"
                          value={fecha_nacimiento}
                          onChange={e => handleObjetoEspecialista({...objetoEspecialista, fecha_nacimiento: e.target.value})}
                          className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                      />
                  </div>
              </div>
    
              <div className="sm:col-span-6">
                  <label
                  htmlFor="direccion"
                  className="block text-sm font-medium text-gray-700"
                  >
                      Direccion
                  </label>
                  <div className="mt-1">
                      <input
                          type="text"
                          id="direccion"
                          value={direccion}
                          onChange={e => handleObjetoEspecialista({...objetoEspecialista, direccion: e.target.value})}
                          className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                      />
                  </div>
              </div>
    
              <div className="sm:col-span-3">
                  <label
                  htmlFor="nacionalidad"
                  className="block text-sm font-medium text-gray-700"
                  >
                      Nacionalidad
                  </label>
                  <div className="mt-1">
                      <input
                          type="text"
                          id="nacionalidad"
                          value={nacionalidad}
                          onChange={e => handleObjetoEspecialista({...objetoEspecialista, nacionalidad: e.target.value})}
                          className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                      />
                  </div>
              </div>
    
              <div className="sm:col-span-3">
                  <label
                      htmlFor="sexo"
                      className="block text-sm font-medium text-gray-700"
                  >
                      Sexo
                  </label>
    
                  <div className="mt-1">
                  <select 
                      id="sexo"
                      className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                      value={sexo}
                      onChange={e => handleObjetoEspecialista({...objetoEspecialista, sexo: e.target.value})}
                  >
                      <option value="" disabled > -- Seleccione una Opcion -- </option>
                      { Object.entries(SEXO).map( ([key, value]) => (
                          <option key={key} value={key} >{value} </option>
                      )) }
                  </select>
                  </div>
              </div>
    
              <div className="sm:col-span-6">
                  <label
                      htmlFor="info"
                      className="block text-sm font-medium text-gray-700"
                  >
                      Sobre Mi
                  </label>
                  <div className="mt-1">
                      <textarea 
                          id="info" 
                          rows="5"
                          value={info}
                          className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                          onChange={e => handleObjetoEspecialista({...objetoEspecialista, info: e.target.value})}
                      ></textarea>
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
              type="button"
              onClick={handleNext}
              // disabled={step && true}
              className="disabled:opacity-50 disabled:bg-green-600 disabled:cursor-not-allowed w-full ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
              Siguiente
          </button>
      </div>
    </>
    )
}

export default PersonalFormStep


