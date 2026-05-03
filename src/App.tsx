import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import ProjectDetails from './pages/ProjectDetails'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/project/:id" element={<ProjectDetails />} />
    </Routes>
  )
}
