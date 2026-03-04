"use client"

import { useEffect } from "react"
import { getAuth, signInAnonymously } from "firebase/auth"
import { messaging } from "@/lib/firebase" // ajusta ruta si es necesario
import { getToken, onMessage } from "firebase/messaging"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function NotifsPage() {

  const logear = async () => {
    try {
      const user = await signInAnonymously(getAuth())
      console.log("Usuario:", user)
    } catch (error) {
      console.error("Error login:", error)
    }
  }

  useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("SW registrado correctamente:", registration);
      })
      .catch((err) => {
        console.error("Error registrando SW:", err);
      });
  }
}, []);

  const activarMensajes = async () => {
  try {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const token = await getToken(messaging!, {
      vapidKey: "BPexO-WZbLDnI1V8T1FmQN71reVnGz1qT_4qUcHxWVju9jl5JR823pRNK9iX6S5Bh2_teNsQCdiO7C6X8AVGPkM",
      serviceWorkerRegistration: registration,
    });

    console.log("Token:", token);

  } catch (error) {
    console.error("Falla de API:", error);
  }
};

  useEffect(() => {
  if (!messaging) return

  const unsubscribe = onMessage(messaging, (message) => {
    console.log("Mensaje recibido:", message)

    const title = message.notification?.title || "Notificación"
    const body = message.notification?.body || "Mensaje nuevo"

    // Mostrar notificación del sistema
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/apple-icon.png" // opcional
      })
    }

    // Mantener el toast también si quieres
    toast.info(`${title} - ${body}`)
  })

  return () => unsubscribe()
}, [])

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Test de Notificaciones</h1>

      <button
        onClick={logear}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Log
      </button>

      <button
        onClick={activarMensajes}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Generar Token
      </button>

      <ToastContainer />
    </div>
  )
}