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
import HamburgerMenu from "../components/HamburgerMenu";
import Notification from "../components/Notification";
import ProductCustomization from "./ProductCustomization";
import OrderManagement from "./OrderManagement";
import TransactionHistory from "./TransactionHistory";
import DeliveryManagement from "./DeliveryManagement";

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
    dashboard: <DashboardContent />,
    "view-products": <ViewProduct />,
    "modify-product": <ProductManagement />,
    inventory: <Inventory />,

    "view-transaction": <TransactionHistory />,

    "order-management": <OrderManagement />,

		"product-customization": <ProductCustomization />,
    "track-delivery": (
      <h2 className="text-2xl font-semibold">Track Delivery Content</h2>
    ),
    "manage-delivery": <DeliveryManagement/> ,

    Furniture: <Maintenance />,
	
    Services: <ServiceSection />,
    "repair-hardware": (
      <h2 className="text-2xl font-semibold">Repair Hardware Content</h2>
    ),
  };

	return (
		<div className="flex h-screen bg-gray-100">
			{/* Sidebar */}
			<aside className="w-64 bg-oliveGreen text-white flex flex-col items-center rounded-l-3xl ml-1 h-50 mt-2 mb-2">
				<div className="flex flex-col items-center p-5 m-5">
					<img
						src="/landingimage/LOGO.jpg"
						alt="LOGO"
						className="w-12 h-12 rounded-full"
					/>
					<h1 className="mt-3">JCKAME</h1>
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

						{/* product customization */}
						<NavItem
							icon={faListUl}
							label="Product Customization"
							isActive={activeSection === "product-customization"}
							onClick={() => setActiveSection("product-customization")}
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
                  section="view-transaction"
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
                  label="Furniture"
                  section="Furniture"
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
						{contentMap[activeSection] || "dashboard"}
					</div>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;