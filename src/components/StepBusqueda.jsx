import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import clienteAxios from "../config/clienteAxios";
import { formatearFecha } from "../helpers/formatearFecha";

const StepBusqueda = ({ prevStep, nextStep, especialista, especialidad, handleHora, cita, handleCita }) => {

    // console.log(formatearFecha(new Date()));

    const currentDate = new Date()
    const diaMinimo = currentDate.setDate(currentDate.getDate() + 1 )
    const [ diaMaximo, setDiaMaximo ] = useState('')
    const [startDate, setStartDate] = useState(new Date(diaMinimo));
    const [ horarios, setHorarios ] = useState({});

    const { first_name, last_name, especialista_profile: { id } } = especialista;
    const { nombre} = especialidad

    useEffect(() => {
        const obtenerHorarios = async () => {
            try {

                const { data } = await clienteAxios(`/v2/booking/horarios-especialista-listado?especialista=${id}&fecha=${formatearFecha(startDate)}`)

                if ( data.horarios.length > 0 ) {
                    const { horas_disponibles, duracion } = data.horarios[0]
                    setHorarios({ horas_disponibles, duracion })
                    const fechaLimite = new Date(data.fecha_limite)
                    setDiaMaximo(fechaLimite)
                    return
                }
                setHorarios({})
            } catch (error) {
                console.log(error);
                console.log(error.response.data);
            }
        } 
        obtenerHorarios()
    }, [startDate])


    const handleClickSeleccionarHora = hora => {
        handleHora(hora)
        handleCita({...cita, hora, fecha: formatearFecha(startDate)})
        nextStep()
    }

  return (
    // <!-- step 3 -->
    <div className="form-step">
        <div className="space-y-8 divide-gray-200 sm:space-y-5">
            <div className="flex justify-start">
                <button 
                    onClick={prevStep}
                    type="button" className="btn-prev bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Regresar</button>
            </div>

            <div id="heading-confirm" className="container flex flex-col items-center justify-center w-full mx-auto">
                <div className="flex items-center gap-x-2 w-full px-4 py-5 mb-2 bg-white border rounded-md shadow sm:px-6">
                    <img className="object-cover w-14 h-14 rounded-full" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" alt="" />

                    <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Dr. { first_name } { last_name }
                        </h3>
                        <p className="max-w-2xl mt-1 text-sm text-gray-500">
                            {nombre}.
                        </p>
                    </div>
                </div>
            </div>
            {/* <!-- width:445px;height: 332px; -->
            <!-- This example requires Tailwind CSS v2.0+ --> */}
            <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200 ">
                <div className="mx-auto">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        inline
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={diaMinimo}
                        maxDate={diaMaximo}
                        // calendarStartDay={3}
                    />
                                        
                </div>
                {/* <div id="vanilla-calendar" className="mx-auto" style="border: 2px solid red;"></div> */}
                <section id="section-hours" className="mt-12 md:mt-0 md:pl-14">
                    {/* <!-- <h2 className="font-semibold text-gray-900">Schedule for <time datetime="2022-01-21">January 21, 2022</time></h2> --> */}
                    <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500 overflow-y-auto h-64">
                    { horarios.horas_disponibles?.length > 0 ? 
                        horarios.horas_disponibles.map( hora => (
                   
                                <li 
                                    key={hora}
                                    className="flex flex-row mb-2 border-gray-400">
                                    <div className="transition duration-500 shadow ease-in-out transform hover:-translate-y-1 hover:shadow-lg select-none bg-white rounded-md flex flex-1 items-center justify-between p-4">
                                        <div className="pl-1 md:mr-16">
                                            <div className="font-bold text-gray-600">
                                            {hora} Hrs.
                                            </div>
                                            <p className="mt-0.5">Dr. {first_name} {last_name}</p>
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {horarios.duracion} min
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleClickSeleccionarHora(hora)}
                                            className="btn-next group flex items-center justify-between gap-4 rounded-lg border border-green-600 bg-green-600 px-3 py-1 transition-colors hover:bg-transparent focus:outline-none focus:ring"
                                            >
                                            <span
                                                className="btn-next font-medium text-white transition-colors group-hover:text-green-600 group-active:text-green-500"
                                            >
                                                Reservar Hora
                                            </span>

                                            <span
                                                className="btn-next shrink-0 rounded-full border border-current bg-white p-2 text-green-600 group-active:text-green-500"
                                            >
                                                <svg
                                                className="btn-next pointer-events-none h-5 w-5 rtl:rotate-180"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                />
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </li>
                        ))
                        : null
                    }
                    </ol>
                </section>
            </div>
        </div>
        {/* <!-- <div className="calendar"></div> -->
        <!-- <div id="my-calendar" className="material-theme red"></div> --> */}
    </div>
  )
}

export default StepBusqueda