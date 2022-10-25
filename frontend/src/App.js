import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Header from "./components/layout/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
// PAGES
import Landing from "./pages/Landing";
import About from "./pages/About";
import Materials from "./pages/Materials";
import Carports from "./pages/Carports";
import Calculator from "./pages/Calculator";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import Dashboard from "./pages/user/dashboard/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Header />
        <div>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/carports" element={<Carports />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer position="bottom-center" limit={3} hideProgressBar />
    </>
  );
}

export default App;
