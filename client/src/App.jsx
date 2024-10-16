import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
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
import FurnitureList from "./components/FurnitureList";
import EmailVerification from "./pages/EmailVerification";
import AdminSignUp from "./pages/AdminSignUp";
import AdminVerify from "./pages/AdminVerify";
import About from "./pages/About";
import ServicePage from "./pages/ServicePage";
import ProductTable from "./components/ProductTable";
import ProductDetails from "./components/ProductDetails";
import EditProduct from "./components/EditProduct";
import AdminPendingPage from "./pages/AdminPendingPage";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* user */}
				<Route path="/" element={<LandingPage />} />
				<Route path="/about" element={<About />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/login" element={<Login />} />
				<Route path="/verify-email/:userId" element={<EmailVerification />} />

				{/* admin */}
				<Route path="/admin-login" element={<AdminLogin />} />
				<Route path="/admin-signup" element={<AdminSignUp />} />
				<Route path="/admin-verification/:adminId" element={<AdminVerify />} />
				<Route path="/admin-verification/:adminId/pending" element={<AdminPendingPage />} />
				<Route path="/:adminId/dashboard" element={<DashBoard />} />
				<Route path="/table" element={<ProductTable />} />
				<Route path="/home" element={<ProtectedRoute element={<Home />} />} />
				<Route path={`/furnitures/:id`} element={<ProductDetails />} />
				<Route path={`/furnitures/edit/:id`} element={<EditProduct />} />

				<Route path="/service-page" element={<ServicePage />} />
				<Route
					path="/furniture-list"
					element={<ProtectedRoute element={<FurnitureList />} />}
				/>
				{/* <Route path="/dashboard" element={<AdminOnlyRoutes element={<DashBoard />} />} /> */}
				<Route
					path="/user-management"
					element={<AdminOnlyRoutes element={<UserManagement />} />}
				/>
				<Route
					path="/order-management"
					element={<AdminOnlyRoutes element={<OrderManagement />} />}
				/>
				<Route
					path="/product-management"
					element={<AdminOnlyRoutes element={<ProductManagement />} />}
				/>
				<Route
					path="/product-customization"
					element={<AdminOnlyRoutes element={<ProductCustomization />} />}
				/>

				<Route
					path="/logout"
					element={<ProtectedRoute element={<Logout />} />}
				/>
				<Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
			</Routes>
		</BrowserRouter>
	);
}
