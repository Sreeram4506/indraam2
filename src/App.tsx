import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import Preloader from './components/Preloader';

const Home = lazy(() => import('./pages/Home'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));

export default function App() {
  return (
    <Suspense fallback={<Preloader onComplete={() => {}} />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Routes>
    </Suspense>
  )
}
