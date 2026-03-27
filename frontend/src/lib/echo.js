import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

let echoInstance = null
let echoToken = null
let connectionState = 'idle'
const connectionListeners = new Set()

function getApiBaseUrl() {
  const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  return new URL(rawApiUrl)
}

function notifyConnectionState(nextState) {
  connectionState = nextState
  connectionListeners.forEach((listener) => {
    listener(nextState)
  })
}

function bindConnectionState(echo) {
  const pusherConnection = echo?.connector?.pusher?.connection
  if (!pusherConnection) {
    return
  }

  notifyConnectionState(pusherConnection.state || 'connecting')

  pusherConnection.bind('state_change', ({ current }) => {
    notifyConnectionState(current)
  })
}

export function getEcho(token) {
  if (!token) {
    return null
  }

  if (echoInstance && echoToken === token) {
    const existingState = echoInstance?.connector?.pusher?.connection?.state
    if (existingState) {
      notifyConnectionState(existingState)
    }
    return echoInstance
  }

  if (echoInstance && echoToken !== token) {
    echoInstance.disconnect()
    echoInstance = null
  }

  echoToken = token

  const apiUrl = getApiBaseUrl()
  const wsScheme = import.meta.env.VITE_REVERB_SCHEME || 'http'

  notifyConnectionState('connecting')

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

  bindConnectionState(echoInstance)

  return echoInstance
}

export function subscribeEchoConnection(listener) {
  const currentState = echoInstance?.connector?.pusher?.connection?.state
  if (currentState) {
    notifyConnectionState(currentState)
  }

  connectionListeners.add(listener)
  listener(connectionState)

  return () => {
    connectionListeners.delete(listener)
  }
}

export function resetEcho() {
  if (echoInstance) {
    echoInstance.disconnect()
    echoInstance = null
    echoToken = null
    notifyConnectionState('idle')
  }
}
