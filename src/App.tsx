import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<div>Login page coming soon</div>} />
              <Route path="/register" element={<div>Register page coming soon</div>} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <div>Protected dashboard coming soon</div>
                  </ProtectedRoute>
                } 
              />
              <Route path="/about" element={<div>About page coming soon</div>} />
              <Route path="/apply" element={<div>Loan application page coming soon</div>} />
              <Route path="/support" element={<div>Support page coming soon</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;