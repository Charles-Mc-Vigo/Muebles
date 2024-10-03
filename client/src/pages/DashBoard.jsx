import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faListUl, faTruck, faChevronDown, faChevronUp, faHandshake, faWrench } from '@fortawesome/free-solid-svg-icons';
import ProductManagement from './ProductManagement';
import Inventory from '../components/Inventory';
import ServiceSection from '../components/Services';
import ItemList from '../components/ItemList';
import DashboardContent from '../components/DashboardContent';
import Maintenance from '../components/Maintenance';

const DashBoard = () => {
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [transactionDropdownOpen, setTransactionDropdownOpen] = useState(false);
  const [deliveryDropdownOpen, setDeliveryDropdownOpen] = useState(false);
  const [maintenanceDropdownOpen, setMaintenanceDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Load active section from localStorage on component mount
  useEffect(() => {
    const storedSection = localStorage.getItem('activeSection');
    if (storedSection) {
      setActiveSection(storedSection);
    }
  }, []);

  // Save active section to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  const toggleProductDropdown = () => setProductDropdownOpen(!productDropdownOpen);
  const toggleTransactionDropdown = () => setTransactionDropdownOpen(!transactionDropdownOpen);
  const toggleDeliveryDropdown = () => setDeliveryDropdownOpen(!deliveryDropdownOpen);
  const toggleMaintenanceDropdown = () => setMaintenanceDropdownOpen(!maintenanceDropdownOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-oliveGreen text-white flex flex-col items-center py-5 rounded-l-3xl ml-1 h-50 mt-2 mb-2">
        <h1 className="text-2xl font-bold mb-6">JCKAME</h1>
        <nav className="w-full">
          <ul className="space-y-4">
            <h1 className={`px-4 py-2 flex items-center text-black text-xl cursor-pointer ${activeSection === 'dashboard' ? 'bg-white rounded-l-3xl' : ''}`} onClick={() => setActiveSection('dashboard')}>
              <FontAwesomeIcon icon={faBox} className="mr-2" /> Dashboard
            </h1>
            <li className={`px-4 py-2 flex items-center justify-between text-black cursor-pointer ${activeSection.startsWith('product') ? 'bg-white rounded-l-3xl' : ''}`} onClick={toggleProductDropdown}>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faBox} className="mr-2" /> Product Management
              </span>
              <FontAwesomeIcon icon={productDropdownOpen ? faChevronUp : faChevronDown} />
            </li>
            {productDropdownOpen && (
              <ul className="ml-8 space-y-2">
                <li className={`px-4 py-2 text-black cursor-pointer ${activeSection === 'view-products' ? 'bg-white rounded-l-3xl' : 'hover:bg-white rounded-l-3xl'}`} onClick={() => setActiveSection('view-products')}>
                  View Products
                </li>
                <li className={`px-4 py-2 text-black cursor-pointer ${activeSection === 'modify-product' ? 'bg-white rounded-l-3xl' : 'hover:bg-white rounded-l-3xl'}`} onClick={() => setActiveSection('modify-product')}>
                  Modify Product
                </li>
              </ul>
            )}
            <li className={`px-4 py-2 flex items-center text-black cursor-pointer ${activeSection === 'order-management' ? 'bg-white rounded-l-3xl' : 'hover:bg-white rounded-l-3xl'}`} onClick={() => setActiveSection('order-management')}>
              <FontAwesomeIcon icon={faListUl} className="mr-2" /> Order Management
            </li>
            <li className={`px-4 py-2 flex items-center text-black cursor-pointer ${activeSection === 'inventory' ? 'bg-white rounded-l-3xl' : 'hover:bg-white rounded-l-3xl'}`} onClick={() => setActiveSection('inventory')}>
              <FontAwesomeIcon icon={faBox} className="mr-2" /> Inventory
            </li>
            <li className={`px-4 py-2 flex items-center justify-between text-black cursor-pointer ${activeSection.startsWith('transaction') ? 'bg-white rounded-l-3xl' : ''}`} onClick={toggleTransactionDropdown}>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faHandshake} className="mr-2" /> Transaction
              </span>
              <FontAwesomeIcon icon={transactionDropdownOpen ? faChevronUp : faChevronDown} />
            </li>
            {transactionDropdownOpen && (
              <ul className="ml-8 space-y-2">
                <li className={`px-4 py-2 text-black cursor-pointer ${activeSection === 'view-transactions' ? 'bg-white rounded-l-3xl' : 'hover:bg-white rounded-l-3xl'}`} onClick={() => setActiveSection('view-transactions')}>
                  View Transactions
                </li>
              </ul>
            )}
            <li className={`px-4 py-2 flex items-center justify-between text-black cursor-pointer ${activeSection.startsWith('delivery') ? 'bg-white rounded-l-3xl' : ''}`} onClick={toggleDeliveryDropdown}>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faTruck} className="mr-2" /> Delivery
              </span>
              <FontAwesomeIcon icon={deliveryDropdownOpen ? faChevronUp : faChevronDown} />
            </li>
            {deliveryDropdownOpen && (
              <ul className="ml-8 space-y-2">
                <li className={`px-4 py-2 text-black cursor-pointer ${activeSection === 'track-delivery' ? 'bg-white rounded-l-3xl' : 'hover:bg-white rounded-l-3xl'}`} onClick={() => setActiveSection('track-delivery')}>
                  Track Delivery
                </li>
                <li className={`px-4 py-2 text-black cursor-pointer ${activeSection === 'manage-delivery' ? 'bg-white rounded-l-3xl' : 'hover:bg-white rounded-l-3xl'}`} onClick={() => setActiveSection('manage-delivery')}>
                  Manage Delivery
                </li>
              </ul>
            )}
            <li className={`px-4 py-2 flex items-center justify-between text-black cursor-pointer ${activeSection.startsWith('maintenance') ? 'bg-white rounded-l-3xl' : ''}`} onClick={toggleMaintenanceDropdown}>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faWrench} className="mr-2" /> Maintenance
              </span>
              <FontAwesomeIcon icon={maintenanceDropdownOpen ? faChevronUp : faChevronDown} />
            </li>
            {maintenanceDropdownOpen && (
              <ul className="ml-8 space-y-2">
                <li className={`px-4 py-2 text-black cursor-pointer ${activeSection === 'Category' ? 'bg-white rounded-l-3xl' : 'hover:bg-white rounded-l-3xl'}`} onClick={() => setActiveSection('Category')}>
                  Category
                </li>
                <li className={`px-4 py-2 text-black cursor-pointer ${activeSection === 'Services' ? 'bg-white rounded-l-3xl' : 'hover:bg-white rounded-l-3xl'}`} onClick={() => setActiveSection('Services')}>
                  Services
                </li>
              </ul>
            )}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="h-100 max-h-[calc(50vh-50px)]">
          {activeSection === 'dashboard' && (
            <div className='h-full overflow-y-auto'>
              <DashboardContent />
            </div>
          )}
          {activeSection === 'view-products' && (
            <div className='h-full overflow-y-auto'>
              <ItemList />
            </div>
          )}
          {activeSection === 'modify-product' && (
            <div className="h-full overflow-y-auto">
              <ProductManagement />
            </div>
          )}
          {activeSection === 'inventory' && (
            <div>
              <Inventory />
            </div>
          )}
          {activeSection === 'order-management' && <h2 className="text-2xl font-semibold">Order Management Content</h2>}
          {activeSection === 'track-delivery' && <h2 className="text-2xl font-semibold">Track Delivery Content</h2>}
          {activeSection === 'manage-delivery' && <h2 className="text-2xl font-semibold">Manage Delivery Content</h2>}
          {activeSection === 'Category' && (
            <div className="h-full overflow-y-auto">
              <Maintenance />
            </div>
          )}
          {activeSection === 'Services' && (
            <div className="h-full overflow-y-auto">
              <ServiceSection />
            </div>
          )}
          {activeSection === 'repair-hardware' && <h2 className="text-2xl font-semibold">Repair Hardware Content</h2>}
        </div>
      </main>
    </div>
  );
};

export default DashBoard;