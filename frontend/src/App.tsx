import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./containers/Header";
import Footer from "./containers/Footer";
import Planner from "./containers/Home/Planner";
import { Dashboard, LoginPage, RegisterPage } from "./pages/Auth";
import { FloorplanAnalyzer } from "./pages/FloorplanAnalyzer";
import { Contact } from "lucide-react";
import Contacts from "./pages/contact";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col ">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/floorplan-analyzer" element={<FloorplanAnalyzer />} />
            <Route path="/contact" element={<Contacts />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
