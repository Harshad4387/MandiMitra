import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div className="w-64 bg-gray-200 h-screen p-4">
    <nav className="flex flex-col space-y-4">
      <Link to="/vendor/dashboard">Dashboard</Link>
      <Link to="/vendor/search">Search Product</Link>
      <Link to="/order">Place Order</Link>
      <Link to="/loyalty">Loyalty Points</Link>
      <Link to="/orders">My Orders</Link>
      <Link to="/analytics">Analytics</Link>
      <Link to="/support">Support</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  </div>
);

export default Sidebar;