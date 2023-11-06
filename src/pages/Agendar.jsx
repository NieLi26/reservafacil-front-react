import { useState, Fragment, useEffect } from "react"
import { useNavigate } from "react-router-dom";

import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import clienteAxios from "../config/clienteAxios";

import StepIndentificacion from "../components/StepIndentificacion"
import StepSeleccion from "../components/StepSeleccion"
import StepBusqueda from "../components/StepBusqueda"
import StepConfirmacion from "../components/StepConfirmacion"
import GlobalSpinner from "../components/GlobalSpinner";

const Agendar = () => {

  const navigate = useNavigate();

  // FORMULARIO

  const [ cargando, setCargando ] = useState(false)
  const [ categorias, setCategorias ] = useState([]);
  const [ categoria, setCategoria ] = useState({});

  const [ especialidades, setEspecialidades ] = useState([]);
  const [ especialidad, setEspecialidad ] = useState({});
  const [ especialista, setEspecialista ] = useState({});

  const [ hora, setHora ] = useState('')

  const [ cita, setCita ] = useState({
    nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    telefono: '',
    email: '',
    rut: '',
    fecha_nacimiento: '',
    sexo: '',
    especialista: '',
    especialidad: '',
    fecha: '',
    hora: '',
    motivo: ''
  })

  const handleCategoria = categoria => {
    console.log(categoria);
    setCategoria(categoria)
  }

  const handleEspecialidad = especialidad => {
    console.log(especialidad);
    setEspecialidad(especialidad)
  }

  const handleEspecialista = especialista => {
    console.log(especialista);
    setEspecialista(especialista)
  }

  const handleHora = hora => {
    console.log(hora);
    setHora(hora)
  }

  const handleFormCita = e => {
    setCita({
      ...cita,
      [e.target.name]: e.target.value
    })
  }

  const handleCita = cita => {
    setCita(cita)
  }


  useEffect(() => {
    const obtenerCategorias = async () => {

        try {
            const { data } = await clienteAxios('/v2/booking/categorias-listado')
            console.log(data);
            setCategorias([...data, {id: 999, nombre: 'Todos'}])
        } catch (error) {
            console.log(error);
            console.log(error.response.data);
        }
    }

    obtenerCategorias()
  }, [])

  useEffect(() => {
    setEspecialidad({})
    const obtenerEspecialidades = async () => {

        try {
            const { data } = await clienteAxios(`/v2/booking/especialidades-listado?categoria=${categoria?.id ? categoria.id : ''}`)
            console.log(data);
            setEspecialidades(data)
        } catch (error) {
            console.log(error);
            console.log(error.response.data);
        }
    }

    obtenerEspecialidades()
  }, [categoria])


  const handleSubmit = async e => {
    e.preventDefault();

    if ( Object.values(cita).includes('') ) {
      toast.warning('Todos los campos son obligatorios')
      return
    }

    setCargando(true)

    try {
        const { data } = await clienteAxios.post('/v2/booking/crear-cita/', cita)
        // setEspecialistas([...especialistas, data])
        toast.success('Cita Creada Correctamente')
        setCita({
          nombre: '',
          primer_apellido: '',
          segundo_apellido: '',
          telefono: '',
          email: '',
          rut: '',
          fecha_nacimiento: '',
          sexo: '',
          especialista: '',
          especialidad: '',
          fecha: '',
          hora: '',
          motivo: ''
        })
        setSteps([
          { id: '01', name: 'Identificación', status: 'current'},
          { id: '02', name: 'Selección del Profesional', status: 'upcoming' },
          { id: '03', name: 'Búsqueda de Disponibilidad', status: 'upcoming' },
          { id: '04', name: 'Confirmación', status: 'upcoming'}
        ])
        navigate(`resumen/${data.numero_cita}`)
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
    setCargando(false)

  }


    const prevStep = () => {
      // Encuentra el índice del estado actual
      const currentIndex = steps.findIndex(step => step.status === 'current');
    
      // Verifica si se encontró el estado actual y si no es el primer paso
      if (currentIndex !== -1 && currentIndex > 0) {
        // Crea una copia del array de pasos
        const updatedSteps = [...steps];
    
        // Cambia el estado actual a 'upcoming'
        updatedSteps[currentIndex].status = 'upcoming';
    
        // Cambia el estado anterior a 'current'
        updatedSteps[currentIndex - 1].status = 'current';
    
        // Actualiza el estado con la copia modificada
        setSteps(updatedSteps);
      }
    }


    const nextStep = () => {
      // Encuentra el índice del estado actual
      const currentIndex = steps.findIndex(step => step.status === 'current');
    
      // Verifica si se encontró el estado actual
      if (currentIndex !== -1) {
        // Crea una copia del array de pasos
        const updatedSteps = [...steps];
    
        // Cambia el estado actual a 'complete'
        updatedSteps[currentIndex].status = 'complete';
    
        // Si hay un siguiente estado, cámbialo a 'current'
        if (currentIndex < steps.length - 1) {
          updatedSteps[currentIndex + 1].status = 'current';
        }
    
        // Actualiza el estado con la copia modificada
        setSteps(updatedSteps);
      }
    }
    


    const [ steps, setSteps ] = useState([
      { id: '01', name: 'Identificación', status: 'current'},
      { id: '02', name: 'Selección del Profesional', status: 'upcoming' },
      { id: '03', name: 'Búsqueda de Disponibilidad', status: 'upcoming' },
      { id: '04', name: 'Confirmación', status: 'upcoming'}
    ]);
  

    const mostrarStep = () => {
      const currentStep = steps.findIndex(step => step.status === 'current')
      if ( currentStep === 0 ) {
        return <StepIndentificacion nextStep={nextStep} cita={cita} handleFormCita={handleFormCita} />
      }
      
      if ( currentStep === 1 ) {
        return <StepSeleccion prevStep={prevStep} nextStep={nextStep} categoria={categoria} handleCategoria={handleCategoria} 
        categorias={categorias} especialidad={especialidad}  handleEspecialidad={handleEspecialidad} 
        especialidades={especialidades} handleEspecialista={handleEspecialista} cita={cita} handleCita={handleCita} />
      }

      if ( currentStep === 2 ) {
        return <StepBusqueda prevStep={prevStep} nextStep={nextStep}  especialista={especialista} especialidad={especialidad} handleHora={handleHora} 
        cita={cita} handleCita={handleCita} />
      }

      if ( currentStep === 3 ) {
          return <StepConfirmacion prevStep={prevStep} cita={cita} handleFormCita={handleFormCita} handleCita={handleCita}/>
      }
    }


  return (
    <nav aria-label="Progress">
          <ToastContainer />
          { cargando && <GlobalSpinner /> }
      <div className="max-w-xl mx-auto pt-16 px-4 sm:pt-24 sm:px-6 md:max-w-7xl md:px-8">
        <ol role="list" className="border border-gray-300 rounded-md divide-y divide-gray-300 md:flex md:divide-y-0">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative md:flex-1 md:flex">
              {step.status === 'complete' ? (
                <a href={step.href} className="group flex items-center w-full">
                  <span className="px-6 py-4 flex items-center text-sm font-medium">
                    <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full group-hover:bg-indigo-800">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                  </span>
                </a>
              ) : step.status === 'current' ? (
                <a href={step.href} className="px-6 py-4 flex items-center text-sm font-medium" aria-current="step">
                  <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-indigo-600 rounded-full">
                    <span className="text-indigo-600">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-indigo-600">{step.name}</span>
                </a>
              ) : (
                <a href={step.href} className="group flex items-center">
                  <span className="px-6 py-4 flex items-center text-sm font-medium">
                    <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                      <span className="text-gray-500 group-hover:text-gray-900">{step.id}</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</span>
                  </span>
                </a>
              )}

              {stepIdx !== steps.length - 1 ? (
                <>
                  {/* Arrow separator for lg screens and up */}
                  <div className="hidden md:block absolute top-0 right-0 h-full w-5" aria-hidden="true">
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>

        {/* <!-- Be sure to use this with a layout container that is full-width on mobile --> */}
        <div className="bg-white shadow sm:rounded-lg md:max-w-7xl max-w-xl"> 
          <div className="px-4 py-5 sm:p-6">
            <form 
              onSubmit={handleSubmit}
            >
              { mostrarStep() }

            </form>
          </div>
          </div>
      </div>
    </nav>
  )

}

export default Agendar