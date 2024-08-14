import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandinPage from "./pages/LandinPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoutes";
import AdminOnlyRoutes from "./components/AdminOnlyRoutes";
import Logout from "./components/Logout";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import DashBoard from "./pages/DashBoard";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LandinPage />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/login" element={<Login />} />
				<Route path="/admin" element={<AdminLogin />}/>
				<Route path="/home" element={<ProtectedRoute element={<Home />} />} />
				<Route path="/dashboard" element={<AdminOnlyRoutes element={<DashBoard />} />} />

				<Route
					path="/logout"
					element={<ProtectedRoute element={<Logout />} />}
				/>
				<Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
			</Routes>
		</BrowserRouter>
	);
}
