import PocketBase from 'pocketbase'

// URL de PocketBase - ajusta según tu configuración
const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

export const pb = new PocketBase(POCKETBASE_URL)

// Configuración para desarrollo
pb.autoCancellation(false)

// Solo para debugging en desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log('PocketBase configurado en:', POCKETBASE_URL)
}

export default pb