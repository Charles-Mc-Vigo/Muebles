import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandinPage from "./pages/LandinPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/adminPages/Dashboard";
import AdminLogin from "./pages/adminPages/AdminLogin";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandinPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart/>}/>
      </Routes>
    </BrowserRouter>
  );
}