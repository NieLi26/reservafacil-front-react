import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PerfilFormStep = ({ nextStep, objetoEspecialista, handleObjetoEspecialista, handleModalFormEspecialista}) => {

    const { username, password, password2, id } = objetoEspecialista;

    const handleNext = () => {
        if ( [username, password, password2 ].includes('') ) {
            toast.warning('Todos los campos son obligatorios')
            return
        }

        if ( password !== password2 ) {
            toast.warning('Las Contraseñas deben coincidir')
            return
        }

        nextStep()
    }

    return (
      <>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 py-2">
              <div className="sm:col-span-6">
                  <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                  >
                      Nombre Usuario
                  </label>
                  <div className="mt-1">
                      <input
                          type="text"
                          id="username"
                          value={username}
                          onChange={e => handleObjetoEspecialista({...objetoEspecialista, username: e.target.value})}
                          className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                      />
                  </div>
              </div>

            { !id && 
                <>
                    <div className="sm:col-span-6">
                <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
                >
                    Contraseña
                </label>
                <div className="mt-1">
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => handleObjetoEspecialista({...objetoEspecialista, password: e.target.value})}
                        className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                    />
                </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label
                        htmlFor="password2"
                        className="block text-sm font-medium text-gray-700"
                        >
                            Repetir Contraseña
                        </label>
                        <div className="mt-1">
                            <input
                                type="password"
                                id="password2"
                                value={password2}
                                onChange={e => handleObjetoEspecialista({...objetoEspecialista, password2: e.target.value})}
                                className="px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ring-1 ring-inset ring-gray-300"
                            />
                        </div>
                    </div>
                </>
            }

        </div>
  
  
        <div className="flex pt-5">
              <button
                  type="button"
                  onClick={handleModalFormEspecialista}
                  className="w-full bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                  Cancelar
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

export default PerfilFormStep