import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProblemsPage from './pages/ProblemsPage';
import { useUser } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null; // or loader

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {

  const { isSignedIn } = useUser();
  console.log("User signed in:", isSignedIn);
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/problems" element={
          <ProtectedRoute>
            <ProblemsPage />
          </ProtectedRoute>
        } />
      </Routes>

      <Toaster />
    </>
  )
}

export default App;
