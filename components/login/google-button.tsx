'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (r: { credential: string }) => void }) => void
          renderButton: (el: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

/** Botão oficial do Google Identity Services. Não renderiza sem NEXT_PUBLIC_GOOGLE_CLIENT_ID. */
export function GoogleButton({ onCredential }: { onCredential: (credential: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(onCredential)
  callbackRef.current = onCredential

  useEffect(() => {
    if (!CLIENT_ID || !ref.current) return
    const el = ref.current

    const render = () => {
      if (!window.google) return
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (r) => callbackRef.current(r.credential),
      })
      window.google.accounts.id.renderButton(el, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: Math.min(el.clientWidth || 380, 400),
        locale: 'pt-BR',
      })
    }

    if (window.google) {
      render()
      return
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener('load', render)
    return () => script?.removeEventListener('load', render)
  }, [])

  if (!CLIENT_ID) return null
  return <div ref={ref} className="flex min-h-11 w-full justify-center" />
}

export const isGoogleLoginEnabled = Boolean(CLIENT_ID)