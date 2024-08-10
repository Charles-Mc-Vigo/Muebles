import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandinPage from "./pages/LandinPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from './pages/Home';
import ProtectedRoute from "./components/ProtectedRoutes";
import { DashBoard } from "./pages/DashBoard";
import Logout from "./components/Logout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandinPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute element={<Home/>}/>} />
        <Route path="/dashboard" element={<ProtectedRoute element={<DashBoard/>}/>} />
        <Route path="/logout" element={<Logout/>}/>
      </Routes>
    </BrowserRouter>
  );
}