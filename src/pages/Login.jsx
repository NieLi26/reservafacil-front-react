import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../hooks/useAuth';
import clienteAxios from '../config/clienteAxios';

const Login = () => {

    const { auth, cargando, setCargando, setAuth } = useAuth()

    const navigate = useNavigate()

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    if ( Object.values(auth).length !== 0 ) return <Navigate to={'/reserva'}/>

    const handleSubmit = async e => {
        e.preventDefault()
        
        if ( [username, password].includes('') ) {
            toast.warning('Todos los campos son obligatorios')
            return
        }

        setCargando(true)
        try {
            const { data } = await clienteAxios.post('/v1/accounts/token/', { username, password })
            localStorage.setItem('token', JSON.stringify(data))
            setAuth(data)
            navigate('/reserva')
        } catch (error) {
            console.log(error.response.data.detail);
            toast.error(error.response.data.detail)
        } finally {
            setCargando(false)
        }
    }

  return (

    <section className="bg-white">
         <ToastContainer />
        <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
            <form 
                onSubmit={handleSubmit}
                noValidate
                className="w-full max-w-md">
                <img className="w-auto h-12 sm:h-14" src="logo.ico" alt="Logo Icono" />

                <h1 className="mt-3 text-2xl font-semibold text-gray-800 capitalize sm:text-3xl">Login</h1>

                <div className="relative flex items-center mt-8">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-3 text-gray-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </span>

                    <input 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        type="text" className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Usuario" />
                </div>

                <div className="relative flex items-center mt-4">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </span>

                    <input 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password" className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Contraseña" />
                </div>

                <div className="mt-6">
                    <button 
                        type='submit'
                        disabled={ cargando && true }
                        className="disabled:opacity-50 disabled:cursor-not-allowed w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                        Iniciar Sesión
                    </button>

                    <div className="mt-6 text-right ">
                        <a href="#" className="text-sm text-blue-500 hover:underline">
                            Olvidaste tu Contraseña?
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </section>
   
  )
}

export default Login