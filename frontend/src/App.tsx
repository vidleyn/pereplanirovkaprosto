import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Header from "./containers/Header";
import Footer from "./containers/Footer";
import Planner from "./containers/Home/Planner";
import { Dashboard, LoginPage, RegisterPage } from "./pages/Auth";
import { FloorplanAnalyzer } from "./pages/FloorplanAnalyzer";
import { Contact } from "lucide-react";
import Contacts from "./pages/contact";
import Documentation from "./pages/Documentation";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />

          <main className="flex-grow">
            <Routes>
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/planner" 
                element={
                  <ProtectedRoute>
                    <Planner />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/floorplan-analyzer" 
                element={
                  <ProtectedRoute>
                    <FloorplanAnalyzer />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documentation" 
                element={
                  <ProtectedRoute>
                    <Documentation />
                  </ProtectedRoute>
                } 
              />
              <Route path="/contact" element={<Contacts />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
