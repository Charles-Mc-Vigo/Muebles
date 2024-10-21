import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBox,
	faListUl,
	faTruck,
	faChevronDown,
	faChevronUp,
	faHandshake,
	faWrench,
} from "@fortawesome/free-solid-svg-icons";
import ProductManagement from "./ProductManagement";
import Inventory from "../components/Inventory";
import ServiceSection from "../components/Services";
import ViewProduct from "../components/ViewProduct";
import DashboardContent from "../components/DashboardContent";
import Maintenance from "../components/Maintenance";
import Logout from "../components/Logout";
import Profile from "../../src/components/Profile";
import HamburgerMenu from "../components/HamburgerMenu";
import Notification from "../components/Notification";

const Dashboard = () => {
	// State management for dropdowns
	const [dropdowns, setDropdowns] = useState({
		product: false,
		transaction: false,
		delivery: false,
		maintenance: false,
	});

	const [activeSection, setActiveSection] = useState("");

	// Load active section from localStorage
	useEffect(() => {
		const storedSection = localStorage.getItem("activeSection");
		if (storedSection) {
			setActiveSection(storedSection);
		}
	}, []);

	// Save active section to localStorage
	useEffect(() => {
		localStorage.setItem("activeSection", activeSection);
	}, [activeSection]);

	// Toggle dropdown handler
	const toggleDropdown = (dropdown) => {
		setDropdowns((prev) => ({
			...prev,
			[dropdown]: !prev[dropdown],
		}));
	};

	// Navigation item component
	const NavItem = ({ icon, label, isActive, onClick, hasDropdown, isOpen }) => (
		<li
			className={`px-4 py-2 flex  items-center justify-between text-black cursor-pointer 
        ${
					isActive
						? "bg-white rounded-l-3xl"
						: "hover:bg-white hover:rounded-l-3xl"
				}`}
			onClick={onClick}
		>
			<span className="flex items-center">
				<FontAwesomeIcon icon={icon} className="mr-2" /> {label}
			</span>
			{hasDropdown && (
				<FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
			)}
		</li>
	);

	// Dropdown item component
	const DropdownItem = ({ label, section, currentSection, onClick }) => (
		<li
			className={`px-4 py-2 text-black cursor-pointer 
        ${
					currentSection === section
						? "bg-white rounded-l-3xl"
						: "hover:bg-white rounded-l-3xl"
				}`}
			onClick={() => onClick(section)}
		>
			{label}
		</li>
	);

	// Content mapping
	const contentMap = {
		dashboard: <DashboardContent/>,
		"view-products": <ViewProduct />,
		"modify-product": <ProductManagement />,
		inventory: <Inventory />,
		"order-management": (
			<h2 className="text-2xl font-semibold">Order Management Content</h2>
		),
		"track-delivery": (
			<h2 className="text-2xl font-semibold">Track Delivery Content</h2>
		),
		"manage-delivery": (
			<h2 className="text-2xl font-semibold">Manage Delivery Content</h2>
		),
		Category: <Maintenance />,
		Services: <ServiceSection />,
		"repair-hardware": (
			<h2 className="text-2xl font-semibold">Repair Hardware Content</h2>
		),
	};

	return (
		<div className="flex h-screen bg-gray-100">
			{/* Sidebar */}
			<aside className="w-64 bg-oliveGreen text-white flex flex-col border-2 items-center rounded-l-3xl ml-1 h-50 mt-2 mb-2">
				<div className="font-semibold text-3xl text-center justify-center flex text-black my-10"> 
					JCKAME
				</div>
				<nav className="w-full flex-grow">
					<ul className="space-y-4">
						<NavItem
							icon={faBox}
							label="Dashboard"
							isActive={activeSection === "dashboard"}
							onClick={() => setActiveSection("dashboard")}
						/>
						{/* Product Management Section */}
						<NavItem
							icon={faBox}
							label="Product Management"
							isActive={activeSection.startsWith("product")}
							onClick={() => toggleDropdown("product")}
							hasDropdown
							isOpen={dropdowns.product}
						/>
						{dropdowns.product && (
							<ul className="ml-8 space-y-2">
								<DropdownItem
									label="View Products"
									section="view-products"
									currentSection={activeSection}
									onClick={setActiveSection}
								/>
								<DropdownItem
									label="Modify Product"
									section="modify-product"
									currentSection={activeSection}
									onClick={setActiveSection}
								/>
							</ul>
						)}

						{/* Order Management */}
						<NavItem
							icon={faListUl}
							label="Order Management"
							isActive={activeSection === "order-management"}
							onClick={() => setActiveSection("order-management")}
						/>

						{/* Inventory */}
						<NavItem
							icon={faBox}
							label="Inventory"
							isActive={activeSection === "inventory"}
							onClick={() => setActiveSection("inventory")}
						/>

						{/* Transaction Section */}
						<NavItem
							icon={faHandshake}
							label="Transaction"
							isActive={activeSection.startsWith("transaction")}
							onClick={() => toggleDropdown("transaction")}
							hasDropdown
							isOpen={dropdowns.transaction}
						/>
						{dropdowns.transaction && (
							<ul className="ml-8 space-y-2">
								<DropdownItem
									label="View Transactions"
									section="view-transactions"
									currentSection={activeSection}
									onClick={setActiveSection}
								/>
							</ul>
						)}

						{/* Delivery Section */}
						<NavItem
							icon={faTruck}
							label="Delivery"
							isActive={activeSection.startsWith("delivery")}
							onClick={() => toggleDropdown("delivery")}
							hasDropdown
							isOpen={dropdowns.delivery}
						/>
						{dropdowns.delivery && (
							<ul className="ml-8 space-y-2">
								<DropdownItem
									label="Track Delivery"
									section="track-delivery"
									currentSection={activeSection}
									onClick={setActiveSection}
								/>
								<DropdownItem
									label="Manage Delivery"
									section="manage-delivery"
									currentSection={activeSection}
									onClick={setActiveSection}
								/>
							</ul>
						)}

						{/* Maintenance Section */}
						<NavItem
							icon={faWrench}
							label="Maintenance"
							isActive={activeSection.startsWith("maintenance")}
							onClick={() => toggleDropdown("maintenance")}
							hasDropdown
							isOpen={dropdowns.maintenance}
						/>
						{dropdowns.maintenance && (
							<ul className="ml-8 space-y-2">
								<DropdownItem
									label="Category"
									section="Category"
									currentSection={activeSection}
									onClick={setActiveSection}
								/>
								<DropdownItem
									label="Services"
									section="Services"
									currentSection={activeSection}
									onClick={setActiveSection}
								/>
							</ul>
						)}
					</ul>
				</nav>

				{/* signout */}
				<div className="w-full mt-auto flex justify-center items-center py-4">
					<Logout isAdmin={true} />
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-10 overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold mx-10">Dashboard</h1>

					{/* Wrap Notification and HamburgerMenu in a flex container with justify-end */}
					<div className="flex items-center justify-end flex-grow gap-5 mx-10">
						<Notification />
						<HamburgerMenu />
					</div>
				</div>

				{/* Rest of the content */}
				<div className="h-100 max-h-[calc(50vh-50px)]">
					<div className={`h-full overflow-y-auto`}>
						{contentMap[activeSection]}
					</div>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
