import axios from "axios";

// const token = JSON.parse(localStorage.getItem('token'))

const clienteAxios = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    // headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: token && `Bearer ${token.access}`
    // }
})


export default clienteAxios