import React from 'react';

const DashboardButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
  >
    {label}
  </button>
);

export default DashboardButton;
