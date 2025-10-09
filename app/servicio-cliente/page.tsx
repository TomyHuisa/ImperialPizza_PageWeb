"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CustomerServicePage() {
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [returnPath, setReturnPath] = useState("/");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtener la página de retorno de los parámetros de consulta
  useEffect(() => {
    const from = searchParams.get("from");
    if (from) {
      setReturnPath(from);
    } else {
      // Si no hay parámetro 'from', intentar obtener la página anterior del sessionStorage
      const previousPage = sessionStorage.getItem("previousPage");
      if (previousPage) {
        setReturnPath(previousPage);
      }
    }
  }, [searchParams]);

  // Guardar la página actual antes de abrir servicio al cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("previousPage", window.location.pathname);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simular envío del formulario
    setIsSubmitted(true);

    // Después de 2 segundos, redirigir a la página de retorno
    setTimeout(() => {
      router.push(returnPath);
    }, 2000);
  };

  const handleClose = () => {
    router.push(returnPath);
  };

  // Si ya se envió el formulario, mostrar mensaje de agradecimiento
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Gracias por sus comentarios!
            </h2>
            <p className="text-gray-600 mb-6">
              Su mensaje ha sido enviado correctamente.
            </p>
            <div className="text-sm text-gray-500">
              Redirigiendo a la página anterior...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center p-4">
      {/* Ventana emergente */}
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto">
        {/* Header de la ventana */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Servicio al Cliente
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

        {/* Contenido del formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Campo de correo electrónico */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo electrónico:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Ingrese su correo electrónico"
                />
              </div>
            </div>

            {/* Campo de comentarios */}
            <div>
              <label
                htmlFor="comments"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Comentarios:
              </label>
              <textarea
                id="comments"
                required
                rows={6}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                placeholder="Ingrese su mensaje aquí..."
              />
            </div>

            {/* Mensaje informativo */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 text-center">
                Sus comentarios nos ayudan a mejorar nuestra comunidad
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Enviar Comentarios
              </button>
            </div>
          </div>
        </form>

        {/* Footer de la ventana */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Nos pondremos en contacto con usted en un plazo de 24-48 horas
          </p>
        </div>
      </div>

      {/* Fondo que cierra la ventana al hacer clic */}
      <div className="absolute inset-0 -z-10" onClick={handleClose}></div>
    </div>
  );
}
