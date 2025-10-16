"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, logout, getCartItemsCount } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
  };

  const getCurrentPath = () => {
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return "/";
  };

  return (
    <>
      <header className="border-b border-border bg-card relative">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          {/* Menú Hamburguesa - Esquina Izquierda */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Abrir menú"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo y Título - Centrado */}
          <div className="text-center flex-1">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-4xl font-bold text-foreground font-serif">
                Pizzeria Imperial
              </h1>
              <p className="text-muted-foreground mt-2">Auténtica pizzas</p>
            </Link>
          </div>

          {/* Íconos de Usuario y Carrito - Esquina Derecha */}
          <div className="flex items-center space-x-4">
            {/* Mostrar perfil si está autenticado, o login si no lo está */}
            {user ? (
              <Link
                href="/profile"
                className="p-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                aria-label="Mi perfil"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden sm:block text-sm font-medium">
                  {user.username}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Iniciar sesión"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </Link>
            )}

            {/* Ícono del carrito */}
            <Link
              href="/carrito"
              className="p-2 rounded-md hover:bg-muted transition-colors relative"
              aria-label="Carrito de compras"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {/* Mostrar cantidad real del carrito */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartItemsCount()}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Barra Lateral - Menú Hamburguesa */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Fondo con transparencia */}
        <div
          className="absolute inset-0 bg-opacity-30"
          onClick={closeSidebar}
        ></div>

        {/* Panel lateral */}
        <div
          className={`absolute left-0 top-0 h-full w-64 bg-card shadow-lg transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-border">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">Menú</h2>
              <button
                onClick={closeSidebar}
                className="p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Cerrar menú"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Información del usuario autenticado */}
            {user && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {user.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Tus puntos:
                  </span>
                  <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                    {user.points || 0} pts
                  </span>
                </div>
              </div>
            )}
          </div>

          <nav className="p-4">
            <ul className="space-y-4">
              {/* Mostrar enlaces según autenticación */}
              {user ? (
                <>
                  {/* Enlace: Mi Perfil */}
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center py-2 px-4 rounded-md hover:bg-muted transition-colors text-foreground"
                      onClick={closeSidebar}
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Mi Perfil
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/historial-pedidos"
                      className="flex items-center py-2 px-4 rounded-md hover:bg-muted transition-colors text-foreground"
                      onClick={closeSidebar}
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Historial de pedidos
                    </Link>
                  </li>

                  {/* Sección de puntos y recompensas */}
                  <li>
                    <div className="flex items-center py-2 px-4 rounded-md bg-yellow-50 border border-yellow-200">
                      <svg
                        className="w-5 h-5 mr-3 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Mis Puntos
                        </p>
                        <p className="text-xs text-yellow-600">
                          {user.points || 0} puntos disponibles
                        </p>
                      </div>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  {/* Enlaces para usuarios no autenticados */}
                  <li>
                    <Link
                      href="/login"
                      className="flex items-center py-2 px-4 rounded-md hover:bg-muted transition-colors text-foreground"
                      onClick={closeSidebar}
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="flex items-center py-2 px-4 rounded-md hover:bg-muted transition-colors text-foreground"
                      onClick={closeSidebar}
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Registrarse
                    </Link>
                  </li>
                </>
              )}

              {/* Enlaces comunes para todos los usuarios */}
              <li>
                <Link
                  href="/sobre-nosotros"
                  className="flex items-center py-2 px-4 rounded-md hover:bg-muted transition-colors text-foreground"
                  onClick={closeSidebar}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Sobre Nosotros
                </Link>
              </li>

              <li>
                <Link
                  href={`/servicio-cliente?from=${encodeURIComponent(
                    getCurrentPath()
                  )}`}
                  className="flex items-center py-2 px-4 rounded-md hover:bg-muted transition-colors text-foreground"
                  onClick={closeSidebar}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Servicio al cliente
                </Link>
              </li>
            </ul>

            {/* Botón de Cerrar Sesión solo para usuarios autenticados */}
            {user && (
              <div className="absolute bottom-4 left-4 right-4">
                <button
                  className="w-full flex items-center justify-center py-2 px-4 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                  onClick={handleLogout}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
