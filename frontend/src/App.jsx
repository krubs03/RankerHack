import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProblemsPage from './pages/ProblemsPage';
import { useUser } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import ProblemDetailPage from './pages/ProblemDetailPage';
import { SpeedInsights } from '@vercel/speed-insights/react';
import SessionsPage from './pages/SessionsPage';

function App() {

  const { isSignedIn, isLoaded } = useUser();

  if(!isLoaded) return null;
  console.log("User signed in:", isSignedIn);
  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to="/" />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemDetailPage /> : <Navigate to="/" />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionsPage /> : <Navigate to="/" />} />
      </Routes>

      <Toaster />
      <SpeedInsights />
    </>
  )
}

export default App;
