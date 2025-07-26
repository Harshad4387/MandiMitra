import React from 'react';
import DashboardButton from '../../components/DashboardButton';
import AddItemForm from './AddItemForm';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const SupplierDashboard = () => {
  const navigate = useNavigate();

  const handleClick = (label) => {
    switch (label) {
      case "Add Item Form":
        navigate("/add-item");
        break;
      case "View Orders Panel":
        navigate("/view-orders");
        break;
      case "Ratings & Reviews":
        navigate("/ratings-reviews");
        break;
      case "Analytics":
        navigate("/analytics");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-xl bg-gray-900 border border-gray-700 rounded-xl p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold mb-10">SUPPLIER DASHBOARD</h1>

        <div className="absolute top-6 right-8 text-sm text-gray-300 hover:text-white cursor-pointer">
          PROFILE
        </div>

        <div className="grid grid-cols-1 gap-5">
          <DashboardButton label="ADD ITEM FORM" onClick={() => handleClick('Add Item Form')} />
          <DashboardButton label="VIEW ORDERS PANEL" onClick={() => handleClick('View Orders Panel')} />
          <DashboardButton label="RATINGS & REVIEWS" onClick={() => handleClick('Ratings & Reviews')} />
          <DashboardButton label="ANALYTICS" onClick={() => handleClick('Analytics')} />
        </div>

        <div className="absolute bottom-6 right-8 text-sm text-gray-300 hover:text-white cursor-pointer">
          CHAT
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
