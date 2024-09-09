import React, { useEffect } from "react";
import Cookies from "js-cookie"
import { BrowserRouter, Routes, Route , useNavigate} from "react-router-dom";
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
import UserManagement from "./pages/UserManagement";
import OrderManagement from "./pages/OrderManagement";
import ProductManagement from "./pages/ProductManagement";
import ProductCustomization from "./pages/ProductCustomization";
import FurnitureList from './components/FurnitureList'
import EmailVerification from "./pages/EmailVerification";
import AdminSignUp from "./pages/AdminSignUp";
import AdminVerify from "./pages/AdminVerify"

function RedirectToHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return null; // This component doesn't render anything
}

export default function App() {
	return (
		<BrowserRouter>
		<RedirectToHome />
			<Routes>
				<Route path="/" element={<LandinPage />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/verify-email" element={<EmailVerification />} />
				<Route path="/login" element={<Login />} />
				<Route path="/admin-login" element={<AdminLogin />}/>
				<Route path="/admin-signup" element={<AdminSignUp />}/>
				<Route path="/admin-verify" element={<AdminVerify />}/>

				<Route path="/home" element={<ProtectedRoute element={<Home />} />} />
				<Route path="/furniture-list" element={<ProtectedRoute element={<FurnitureList />} />} />
				<Route path="/dashboard" element={<AdminOnlyRoutes element={<DashBoard />} />} />
				<Route path="/user-management" element={<AdminOnlyRoutes element={<UserManagement />} />} />
				<Route path="/order-management" element={<AdminOnlyRoutes element={<OrderManagement />} />} />
				<Route path="/product-management" element={<AdminOnlyRoutes element={<ProductManagement />} />} />
				<Route path="/product-customization" element={<AdminOnlyRoutes element={<ProductCustomization />} />} />

				<Route
					path="/logout"
					element={<ProtectedRoute element={<Logout />} />}
				/>
				<Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
			</Routes>
		</BrowserRouter>
	);
}
