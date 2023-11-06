import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validarRut } from "../helpers/validarCampos"

const StepIndentificacion = ({ nextStep, cita, handleFormCita }) => {



  const handleNext = () => {
    console.log(cita.rut);
      if ( cita.rut === '' ) {
        console.log('entroo');
          toast.warning('Debe ingresar el rut')
          return
      }

      if ( !validarRut(cita.rut) ) {
        toast.warning('Rut Incorrecto, debe ser sin puntos y con guion')
        return
      }

      nextStep()
  }

  return (
      <div id="rut-screen" className="form-step max-w-md mx-auto">
        <div className="py-5 flex justify-between items-center">
            <div>
                <p className="text-gray-700 dark:text-gray-300 md:text-lg">Reserva de </p>
                <h1 className="text-2xl font-medium text-gray-800 capitalize lg:text-3xl ">
                    Horas
                </h1>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[64px] h-[64px] text-indigo-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
            </svg>
        </div>
        <div className="flex flex-col mb-2">
            <div className=" relative ">
              <label htmlFor="rut" className="sr-only">Rut</label>
              <input 
                value={cita.rut}
                onChange={handleFormCita}
                id="rut" name="rut" type="text" required className="rounded-lg border-transparent flex-1 appearance-none border border-indigo-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" placeholder="Ingrese Rut Paciente Ej: 17605812-2" />
            </div>
        </div>
        <div className="flex w-full my-4">
            <button 
              onClick={handleNext}
              type="button" className="btn-next py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                Siguiente
            </button>
        </div>
        <div className="py-2 text-left">
            <p>
                Tambien puede {''}
                <Link to="/anular-cita" className="font-semibold hover:underline">
                    Ver o Anular sus Reservas.
                </Link>
            </p>
        </div>
      </div>
  )
}

export default StepIndentificacion