import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Header from "./containers/Header";
import Footer from "./containers/Footer";
import Planner from "./containers/Home/Planner";
import { Dashboard, LoginPage, RegisterPage } from "./pages/Auth";
import { FloorplanAnalyzer } from "./pages/FloorplanAnalyzer";
import Contacts from "./pages/contact";
import Documentation from "./pages/Documentation";
import AIChat from "./pages/AIChat";
import Shop from "./pages/Shop";
import Services from "./pages/Services";
import Articles from "./pages/Articles";

function AppContent() {
  const location = useLocation();
  const isPlannerPage = location.pathname === "/planner";

  return (
    <div className="min-h-screen flex flex-col">
      {!isPlannerPage && <Header />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
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
          <Route 
            path="/chatbot" 
            element={
              <ProtectedRoute>
                <AIChat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/shop" 
            element={
              <ProtectedRoute>
                <Shop />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/services" 
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/articles" 
            element={
              <ProtectedRoute>
                <Articles />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isPlannerPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
