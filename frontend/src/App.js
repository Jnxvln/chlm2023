import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
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

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

function App() {

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      return JSON.parse(localStorage.getItem('user'))
    },
    onSuccess: (user) => {
      console.log('[App.js mutation] user set: ')
      console.log(user)
      queryClient.setQueryData(['user'], user)
    }
  })
  
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'))
  
    if (localUser) {
      console.log('[App.js useEffect] User detected in local storage, setting as `user`...')
      mutation.mutate()
    }
  }, [])

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
      <ToastContainer position="top-center" limit={3} hideProgressBar />
    </>
  );
}

export default App;
