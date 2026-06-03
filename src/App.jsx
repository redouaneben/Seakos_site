import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/MainLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Cartographie from './pages/Cartographie.jsx'
import Impact from './pages/Impact.jsx'
import Maintenance from './pages/Maintenance.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cartographie" element={<Cartographie />} />
        <Route path="impact" element={<Impact />} />
        <Route path="maintenance" element={<Maintenance />} />
      </Route>
    </Routes>
  )
}
