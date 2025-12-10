import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready()
  window.Telegram.WebApp.expand()
}

const onFirstTap = () => {
  document.documentElement.requestFullscreen?.().catch(() => {})
  window.removeEventListener('pointerdown', onFirstTap)
}
window.addEventListener('pointerdown', onFirstTap, { once: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)