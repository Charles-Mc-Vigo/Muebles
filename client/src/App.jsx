import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import DashBoard from "./pages/DashBoard";
import UserManagement from "./pages/UserManagement";
import OrderManagement from "./pages/OrderManagement";
import TransactionHistory from "./pages/TransactionHistory";
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
import DeliveryInfo from "./components/DeliveryInfo";
import AdminPendingPage from "./pages/AdminPendingPage";
import UserProfile from "./components/UserProfile";
import TermsAndConditions from "./pages/TermsandCondition";
import DeliveryManagement from "./pages/DeliveryManagement";
import PasswordResetRequest from "./pages/PasswordResetRequest";
import PasswordResetVerify from "./pages/PasswordResetVerify";
import PasswordResetCreateNew from "./pages/PasswordResetCreateNew";
import OrderDetails from "./pages/OrderDetails";
import InventoryPage from "./pages/InventoryPage";
import PaymentMethod from "./components/PaymentMethod";
import EditUserProfile from "./components/EditUserProfile";
import EditAdminProfile from "./components/EditAdminProfile";

import ViewOrder from "./components/ViewOrder";
import AddNewAddress from "./components/AddNewAddress";
import ViewUserOrder from "./components/ViewUserOrder";
import ViewPendingRequest from "./pages/ViewPendingRequest";
import ErrorBoundary from "./components/ErrorBoundary";
import PreOrder from "./pages/PreOrder";
import ReviewPage from "./pages/ReviewPage";
// import LoadingSpinner from "./components/LoadingSpinner";


export default function App() {
	return (
		<ErrorBoundary>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/about" element={<About />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/login" element={<Login />} />
					<Route path="/terms&condition" element={<TermsAndConditions />} />
					<Route path="/payment-method" element={<PaymentMethod />} />
					<Route
						path="/verify-account/:userId"
						element={<EmailVerification />}
					/>
					<Route path="/home" element={<ProtectedRoute element={Home} />} />
					<Route
						path="/my-profile/view"
						element={<ProtectedRoute element={UserProfile} />}
					/>
					<Route
						path="/my-profile/edit"
						element={<ProtectedRoute element={EditUserProfile} />}
					/>
					<Route
						path="/address/new"
						element={<ProtectedRoute element={AddNewAddress} />}
					/>
					<Route
						path="/password-reset/request"
						element={<PasswordResetRequest />}
					/>
					<Route
						path="/password-reset/verify/:userId"
						element={<PasswordResetVerify />}
					/>
					<Route
						path="/password-reset/new-password/:userId"
						element={<PasswordResetCreateNew />}
					/>
					<Route
						path={`/furnitures/:id`}
						element={<ProtectedRoute element={ProductDetails} />}
					/>
					<Route
						path={`/order-details/:orderId`}
						element={<ProtectedRoute element={OrderDetails} />}
					/>
					<Route
						path="/pre-order/:furnitureId"
						element={<ProtectedRoute element={PreOrder} />}
					/>
					<Route path="/cart" element={<ProtectedRoute element={Cart} />} />
					<Route path="/delivery-info" element={<DeliveryInfo />} />
					<Route
						path="/orders"
						element={<ProtectedRoute element={ViewOrder} />}
					/>
					<Route path="/product-review" element={<ReviewPage />} />
					{/* <Route path="/create-review" element={<CreateReview />} /> */}

					{/* Admin routes */}
					<Route path="/admin-login" element={<AdminLogin />} />
					<Route path="/admin-signup" element={<AdminSignUp />} />
					<Route
						path="/admin-signup/verify-account/:adminId"
						element={<AdminVerify />}
					/>
					<Route
						path="/view-request/:adminId"
						element={
							<ProtectedRoute element={ViewPendingRequest} adminOnly={true} />
						}
					/>
					<Route
						path={`/order/:orderId`}
						element={
							<ProtectedRoute element={ViewUserOrder} adminOnly={true} />
						}
					/>
					<Route
						path="/admin-signup/verify-account/:adminId/pending"
						element={<AdminPendingPage />}
					/>
					<Route
						path="/dashboard"
						element={<ProtectedRoute element={DashBoard} adminOnly={true} />}
					/>
					
					<Route
						path="/table"
						element={<ProtectedRoute element={ProductTable} adminOnly={true} />}
					/>
					<Route
						path="/table"
						element={<ProtectedRoute element={ProductTable} adminOnly={true} />}
					/>
					<Route
						path={`/furnitures/:id`}
						element={
							<ProtectedRoute element={ProductDetails} adminOnly={true} />
						}
					/>
					<Route
						path={`/furnitures/edit/:furnitureId`}
						element={<ProtectedRoute element={EditProduct} adminOnly={true} />}
					/>
					<Route path="/service-page" element={<ServicePage />} />
					<Route path="/inventory-management" element={<InventoryPage />} />
					<Route
						path="/furniture-list"
						element={<ProtectedRoute element={FurnitureList} />}
					/>
					<Route path="/manage-delivery" element={<DeliveryManagement />} />
					<Route
						path="/user-management"
						element={
							<ProtectedRoute element={UserManagement} adminOnly={true} />
						}
					/>
					<Route
						path="/order-management"
						element={
							<ProtectedRoute element={OrderManagement} adminOnly={true} />
						}
					/>
					<Route
						path="/view-transaction"
						element={
							<ProtectedRoute element={TransactionHistory} adminOnly={true} />
						}
					/>
					<Route
						path="/product-management"
						element={
							<ProtectedRoute element={ProductManagement} adminOnly={true} />
						}
					/>
					<Route path="/orders/:orderId" element={<ViewUserOrder />} />

					<Route
						path="/product-customization"
						element={
							<ProtectedRoute element={ProductCustomization} adminOnly={true} />
						}
					/>
					<Route path="/logout" element={<ProtectedRoute element={Logout} />} />
				</Routes>
			</BrowserRouter>
		</ErrorBoundary>
	);
}