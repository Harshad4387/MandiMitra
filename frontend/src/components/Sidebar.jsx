import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingCart, Gift, ClipboardList, BarChart2, HelpCircle, User } from 'lucide-react';

const menuItems = [
  { to: '/vendor/homepage', label: 'HomePage', icon: <Home size={18} /> },
  { to: '/vendor/search', label: 'Search Product', icon: <Search size={18} /> },
  { to: '/vendor/order', label: 'View Cart', icon: <ShoppingCart size={18} /> },
  { to: '/vendor/loyalty', label: 'Loyalty Points', icon: <Gift size={18} /> },
  { to: '/vendor/orders', label: 'My Orders', icon: <ClipboardList size={18} /> },
  { to: '/vendor/analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
  { to: '/vendor/support', label: 'Support', icon: <HelpCircle size={18} /> },
  { to: '/vendor/profile', label: 'Profile', icon: <User size={18} /> },
];

const Sidebar = () => (
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
    </nav>
  </div>
);

export default Sidebar;
