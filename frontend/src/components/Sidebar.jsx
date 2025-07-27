import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Search,
  ShoppingCart,
  ClipboardList,
  HelpCircle,
  User
} from 'lucide-react';

const Sidebar = () => {
  const [showSupportDetails, setShowSupportDetails] = useState(false);

  const menuItems = [
    { to: '/vendor/homepage', label: 'HomePage', icon: <Home size={18} /> },
    { to: '/vendor/search', label: 'Search Product', icon: <Search size={18} /> },
    { to: '/vendor/order', label: 'View Cart', icon: <ShoppingCart size={18} /> },
    { to: '/vendor/orders', label: 'My Orders', icon: <ClipboardList size={18} /> },
    { to: '/vendor/chatbot', label: 'chatbot', icon: <User size={18} /> },

  ];

  const staticItems = [
    { label: 'Support', icon: <HelpCircle size={18} />, onClick: () => setShowSupportDetails(!showSupportDetails) },
    { to: '/vendor/profile', label: 'Profile', icon: <User size={18} /> },
  ];


  return (
    <div className="w-64 h-screen bg-white shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Vendor Panel</h2>
      <nav className="flex flex-col space-y-3">
        {menuItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              }`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Support toggle item */}
        <div
          onClick={staticItems[0].onClick}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 cursor-pointer"
        >
          {staticItems[0].icon}
          <span>{staticItems[0].label}</span>
        </div>

        {/* Conditional support details */}
        {showSupportDetails && (
          <div className="ml-8 mt-1 text-sm text-gray-700 space-y-1">
            <div><strong>Email:</strong> support@admin.com</div>
            <div><strong>Phone:</strong> +91 9541883510</div>
          </div>
        )}

        {/* Profile nav link */}
        <NavLink
          to={staticItems[1].to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
            }`
          }
        >
          {staticItems[1].icon}
          <span>{staticItems[1].label}</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
