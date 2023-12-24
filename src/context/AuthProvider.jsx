import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const navigate = useNavigate()
    const [ auth, setAuth ] = useState({})
    const [ cargando, setCargando ] = useState(true)

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = JSON.parse(localStorage.getItem('token'))
            if ( !token ) {
                setCargando(false)
                return;
            }

            const  config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token.access}`
                }
            }

            try {
                const { data } = await clienteAxios('/v1/accounts/usuarios/perfil', config)
                console.log(data);
                setAuth(data)
            } catch (error) {
                console.log(error.response.data);
                setAuth({})
                navigate('/login')

                if ( error.response.data.code === 'token_not_valid' ) {
                    actualizarToken(token.refresh)
                }
            } 

            setCargando(false);

        }
        autenticarUsuario()
    }, [])

    const cerrarSesionAuth = () => {
        setAuth({})
        localStorage.removeItem('token')
    }

    const actualizarToken = async token => {
        try {
            const { data } = await clienteAxios.post('/v1/accounts/token/refresh/', { refresh: token })
            console.log('nuevo token: ', data);
            const tokenLS = JSON.parse(localStorage.getItem('token'))
            // if (!tokenLS) {
            //     return
            // }
            tokenLS.access = data.access
            localStorage.setItem('token', JSON.stringify(tokenLS))
            // setAuth(data)
            // navigate('/reserva')
        } catch (error) {
            console.log(error.response.data.detail);
        }
    }

    // Refrescar token cada tantos minutos
    useEffect(() => {
        const cuatroMinutos = 1000 * 60 * 4
        const interval = setInterval(() => {
            if ( auth?.id ) {
                const token = JSON.parse(localStorage.getItem('token'))
                actualizarToken(token.refresh)
            }
        }, cuatroMinutos);
        console.log('actualizado');
        return () => clearInterval(interval)
    }, [auth])

    return (
        <AuthContext.Provider
            value={{
                setAuth,
                auth,
                cargando,
                setCargando,
                cerrarSesionAuth
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}


export default AuthContext