import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

let echoInstance = null

function getApiBaseUrl() {
  const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  return new URL(rawApiUrl)
}

export function getEcho(token) {
  if (!token) {
    return null
  }

  if (echoInstance) {
    return echoInstance
  }

  const apiUrl = getApiBaseUrl()
  const wsScheme = import.meta.env.VITE_REVERB_SCHEME || 'http'

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'startupmatch-key',
    wsHost: import.meta.env.VITE_REVERB_HOST || apiUrl.hostname,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
    forceTLS: wsScheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${apiUrl.origin}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  })

  return echoInstance
}

export function resetEcho() {
  if (echoInstance) {
    echoInstance.disconnect()
    echoInstance = null
  }
}
