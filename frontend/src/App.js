import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import Header from "./components/layout/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
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

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

function App() {
  const queryClient = useQueryClient();

  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return JSON.parse(localStorage.getItem("user"));
    },
  });

  const mutation = useMutation({
    mutationKey: ["user"],
    mutationFn: (userData) => {
      return userData;
    },
    onSuccess: (_userData) => {
      queryClient.setQueryData(["user"], _userData);
    },
  });

  useEffect(() => {
    if (user && user.isSuccess) {
      if (user.data) {
        mutation.mutate(user.data);
      }
    }
  }, [user, user.isSuccess, user.data]);

  return (
    <>
      <Router>
        <Header user={user.data || JSON.parse(localStorage.getItem("user"))} />
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
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user.data || JSON.parse(localStorage.getItem("user"))}>
                  <Dashboard user={user.data || JSON.parse(localStorage.getItem("user"))} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
      <ToastContainer position="top-center" limit={3} hideProgressBar />
    </>
  );
}

export default App;
