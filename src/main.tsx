import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DesktopBlocker } from './components/common/DesktopBlocker.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DesktopBlocker />
    <App />
  </React.StrictMode>,
)
