import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import PopulationPage from './pages/population/population'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PopulationPage />
  </React.StrictMode>,
)
