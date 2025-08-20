import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./auth/AuthContext";
import App from "./App";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Tasks from "./pages/Tasks";
import Attendance from "./pages/Attendance";
import ReviewFlags from "./pages/ReviewFlags";

function Private({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employee" element={<Private><EmployeeDashboard /></Private>} />
          <Route path="/admin" element={<Private role="admin"><AdminDashboard /></Private>} />
          <Route path="/tasks" element={<Private><Tasks /></Private>} />
          <Route path="/attendance" element={<Private><Attendance /></Private>} />
          <Route path="/review-flags" element={<Private role="admin"><ReviewFlags /></Private>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
