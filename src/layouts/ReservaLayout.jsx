import { useState } from "react";
import { Outlet, useLocation, Link, Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import useAuth from "../hooks/useAuth";

import IconoCategoria from '../img/categoria-icon.svg'
import IconoCita from '../img/cita-icon.svg'
import IconoCliente from '../img/cliente-icon.svg'
import IconoDashboard from '../img/dashboard-icon.svg'
import IconoEspecialista from '../img/especialista-icon.svg'
import IconoEspecialidad from '../img/especialidad-icon.svg'
import IconoHorario from '../img/horario-icon.svg'
import IconoPago from '../img/pago-icon.svg'
import IconoTarifa from '../img/tarifa-icon.svg'
import GlobalSpinner from "../components/GlobalSpinner";

const SIDEBAR_LINKS = [
    { nombre: "Dashboard", icono: IconoDashboard, link: "/reserva" },
    { nombre: "Citas", icono: IconoCita, link: "/reserva/citas" },
    { nombre: "Categorias", icono: IconoCategoria, link: "/reserva/categorias" },
    { nombre: "Especialidades", icono: IconoEspecialidad, link: "/reserva/especialidades" },
    { nombre: "Tarifas", icono: IconoTarifa, link: "/reserva/tarifas" },
    { nombre: "Pagos", icono: IconoPago, link: "/reserva/pagos" },
    { nombre: "Horarios", icono: IconoHorario, link: "/reserva/horarios" },
    { nombre: "Clientes", icono: IconoCliente, link: "/reserva/clientes" },
    { nombre: "Especialistas", icono: IconoEspecialista, link: "/reserva/especialistas" }
]

const ReservaLayout = () => {
  const location = useLocation();

  const { auth, cargando, cerrarSesionAuth } = useAuth()

  const [ sidebar, setSidebar ] = useState(false)
  const [ dropdown, setDropdown ] = useState(false)

  const handleClickCerrarSesion = () => {
    cerrarSesionAuth()
  }

  // para esperar que se llene le state de auth
  if (cargando) return <GlobalSpinner />

  if (!auth.id) return <Navigate to={'/login'} />

  return (
    <>
      <ToastContainer />
      <div className="min-h-[640px] bg-gray-100">
        <div>
          { sidebar &&  
            <div className="fixed inset-0 flex z-40 md:hidden" aria-modal="true">
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-75"
                aria-hidden="true"
              ></div>

              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    onClick={() => setSidebar(false)}
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <div className="flex-shrink-0 flex items-center px-4">
                  <img
                    className="h-8 w-auto"
                  src="/logo.ico"
                    alt="Workflow"
                  />
                </div>

                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    <a
                      href="{% url 'booking:dashboard' %}"
                      className="{% if request.resolver_match.url_name == 'dashboard' %} bg-gray-900 text-white {% else %} text-gray-300 hover:bg-gray-700 hover:text-white {% endif %} group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    >
                      <svg
                        className="{% if request.resolver_match.url_name == 'dashboard' %} text-gray-300 {% else %} text-gray-400 group-hover:text-gray-300 {% endif %} mr-4 flex-shrink-0 h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                      Dashboard
                    </a>

                    <a
                      href="{% url 'booking:cita' %}"
                      className="{% if request.resolver_match.url_name == 'cita' %} bg-gray-900 text-white {% else %} text-gray-300 hover:bg-gray-700 hover:text-white {% endif %} group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="{% if request.resolver_match.url_name == 'cita' %} text-gray-300 {% else %} text-gray-400 group-hover:text-gray-300 {% endif %} mr-4 flex-shrink-0 h-6 w-6"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill="none"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z"></path>
                        <path d="M19 16h-12a2 2 0 0 0 -2 2"></path>
                        <path d="M9 8h6"></path>
                      </svg>
                      Citas
                    </a>

                    {/* {% for group in request.user.groups.all %}
                          {% if group.name == 'Administrador' %}    */}
                    <a
                      href="{% url 'booking:categoria' %}"
                      className="{% if request.resolver_match.url_name == 'categoria' %} bg-gray-900 text-white {% else %} text-gray-300 hover:bg-gray-700 hover:text-white {% endif %} group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="{% if request.resolver_match.url_name == 'categoria' %} text-gray-300 {% else %} text-gray-400 group-hover:text-gray-300 {% endif %} mr-4 flex-shrink-0 h-6 w-6"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill="none"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M4 4h6v6h-6z"></path>
                        <path d="M14 4h6v6h-6z"></path>
                        <path d="M4 14h6v6h-6z"></path>
                        <path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                      </svg>
                      Categorias
                    </a>
                    {/* {% endif %}
                          {% endfor %} */}

                    <a
                      href="{% url 'booking:especialidad' %}"
                      className="{% if request.resolver_match.url_name == 'especialidad' %} bg-gray-900 text-white {% else %} text-gray-300 hover:bg-gray-700 hover:text-white {% endif %} group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="{% if request.resolver_match.url_name == 'especialidad' %} text-gray-300 {% else %} text-gray-400 group-hover:text-gray-300 {% endif %} mr-4 flex-shrink-0 h-6 w-6"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill="none"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M12 15m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                        <path d="M10 7h4"></path>
                        <path d="M10 18v4l2 -1l2 1v-4"></path>
                        <path d="M10 19h-2a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2"></path>
                      </svg>
                      Especialidades
                    </a>

                    {/* {% for group in request.user.groups.all %}
                          {% if group.name == 'Administrador' %}    */}
                    <a
                      href="{% url 'booking:tarifa' %}"
                      className="{% if request.resolver_match.url_name == 'tarifa' %} bg-gray-900 text-white {% else %} text-gray-300 hover:bg-gray-700 hover:text-white {% endif %} group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="{% if request.resolver_match.url_name == 'tarifa' %} text-gray-300 {% else %} text-gray-400 group-hover:text-gray-300 {% endif %} mr-4 flex-shrink-0 h-6 w-6"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill="none"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M16 6m-5 0a5 3 0 1 0 10 0a5 3 0 1 0 -10 0"></path>
                        <path d="M11 6v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4"></path>
                        <path d="M11 10v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4"></path>
                        <path d="M11 14v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4"></path>
                        <path d="M7 9h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5"></path>
                        <path d="M5 15v1m0 -8v1"></path>
                      </svg>
                      Tarifas
                    </a>

                    <a
                      href="{% url 'booking:pago' %}"
                      className="{% if request.resolver_match.url_name == 'pago' %} bg-gray-900 text-white {% else %} text-gray-300 hover:bg-gray-700 hover:text-white {% endif %} group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    >
                      <svg
                        className="{% if request.resolver_match.url_name == 'pago' %} text-gray-300 {% else %} text-gray-400 group-hover:text-gray-300 {% endif %} mr-4 flex-shrink-0 h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                      </svg>
                      Pagos
                    </a>

                    <a
                      href="{% url 'booking:horario' %}"
                      className="{% if request.resolver_match.url_name == 'horario' %} bg-gray-900 text-white {% else %} text-gray-300 hover:bg-gray-700 hover:text-white {% endif %} group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="{% if request.resolver_match.url_name == 'horario' %} text-gray-300 {% else %} text-gray-400 group-hover:text-gray-300 {% endif %} mr-4 flex-shrink-0 h-6 w-6"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill="none"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M12 13m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                        <path d="M12 10l0 3l2 0"></path>
                        <path d="M7 4l-2.75 2"></path>
                        <path d="M17 4l2.75 2"></path>
                      </svg>
                      Horarios
                    </a>
                    {/* {% endif %}
                          {% endfor %} */}

                    <a
                      href="{% url 'booking:cliente' %}"
                      className="{% if request.resolver_match.url_name == 'cliente' %} bg-gray-900 text-white {% else %} text-gray-300 hover:bg-gray-700 hover:text-white {% endif %} group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="{% if request.resolver_match.url_name == 'cliente' %} text-gray-300 {% else %} text-gray-400 group-hover:text-gray-300 {% endif %} mr-4 flex-shrink-0 h-6 w-6"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill="none"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                      </svg>
                      Clientes
                    </a>

                    {/* {% for group in request.user.groups.all %}
                          {% if group.name == 'Administrador' %}    */}
                    <a
                      href="{% url 'booking:especialista' %}"
                      className="{% if request.resolver_match.url_name == 'especialista' %} bg-gray-900 text-white {% else %} text-gray-300 hover:bg-gray-700 hover:text-white {% endif %} group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="{% if request.resolver_match.url_name == 'especialista' %} text-gray-300 {% else %} text-gray-400 group-hover:text-gray-300 {% endif %} mr-4 flex-shrink-0 h-6 w-6"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill="none"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                      </svg>
                      Especialistas
                    </a>
                    {/* {% endif %}
                          {% endfor %} */}
                  </nav>
                </div>
              </div>

              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* <!-- Dummy element to force sidebar to shrink to fit close icon --> */}
              </div>
            </div>
          }
          {/* <!-- Static sidebar for desktop --> */}
          <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
            {/* <!-- Sidebar component, swap this element with another sidebar if you like --> */}
            <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
              <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
                <img
                  className="h-8 w-auto"
                  src="/logo.ico"
                  alt="Workflow"
                />
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-2 py-4 space-y-1">

                  {SIDEBAR_LINKS.map(link => (
                    <Link
                        key={link.nombre}
                        to={link.link}
                        className={`${location.pathname === link.link ? 'bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md '}`}
                    >
                        <img 
                            src={link.icono} 
                            alt={`Icono de ${link.nombre}`}   
                            className={`${location.pathname === link.link ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'} mr-3 flex-shrink-0 h-6 w-6`}
                        />
                        {link.nombre}
                    </Link>
                  ))}      
                </nav>
              </div>
            </div>
          </div>

          <div className="md:pl-64 flex flex-col">
            <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
              <button
                onClick={() => setSidebar(true)}
                type="button"
                className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M4 6h16M4 12h16M4 18h7"></path>
                </svg>
              </button>

              <div className="flex-1 px-4 flex justify-between">
                <div className="flex-1 flex">
                  {/* <!-- <form className="w-full flex md:ml-0" action="#" method="GET">
                            <label for="search-field" className="sr-only">Search</label>
                            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                <svg className="h-5 w-5" x-description="Heroicon name: solid/search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <input id="search-field" className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm" placeholder="Search" type="search" name="search" />
                            </div>
                        </form> --> */}
                </div>

                <div className="ml-4 flex items-center md:ml-6">
                  <div>
                    <p>
                      {/* {% if request.user.is_authenticated %}
                            {{ user.username }}
                            {% endif %} */}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="ml-3 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                  </button>

                  {/* <!-- Profile dropdown --> */}
                  <div className="ml-3 relative">
                    <div>
                      <button
                        type="button"
                        onClick={() => setDropdown(!dropdown)}
                        className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        id="user-menu-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                      >
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                          alt=""
                        />
                      </button>
                    </div>
                    
                    { dropdown && 
                      <div
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                      >
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                          role="menuitem"
                          id="user-menu-item-0"
                        >
                          Your Profile
                        </a>

                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                          role="menuitem"
                          id="user-menu-item-1"
                        >
                          Settings
                        </a>

                        <button
                          onClick={handleClickCerrarSesion}
                          className="w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                          role="menuitem"
                          id="user-menu-item-2"
                        >
                          Logout
                        </button>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <main className="flex-1">
              <div className="py-6">
                {/* <!-- <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    </div> --> */}
                <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                  {/* <!-- Replace with your content --> */}
                  <div className="py-4">
                    {/* <!-- <div className="border-4 border-dashed border-gray-200 rounded-lg h-96"> --> */}
                    <div className="rounded-lg h-96">
                      <Outlet />
                    </div>
                  </div>
                  {/* <!-- /End replace --> */}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservaLayout;
