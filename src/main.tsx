import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// если оставляешь d.ts с типами Telegram, можешь просто импортнуть его для TS:
import './types/telegram' // либо './global' — в зависимости от того, как назвал файл с декларацией

if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready()
  window.Telegram.WebApp.expand()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)