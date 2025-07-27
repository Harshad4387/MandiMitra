import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/SideBar.jsx";
import { Outlet } from "react-router-dom";

const VendorLayout = () => {
  return (
<div className="flex h-screen overflow-hidden">
  {/* Sidebar */}
  <div className="w-64 bg-gray-100 fixed top-0 left-0 bottom-0 z-30 shadow-md">
    <Sidebar />
  </div>

  {/* Main Content Area */}
  <div className="flex-1 ml-64 pt-16 overflow-auto bg-gray-50">
    <Navbar />
    <main className="p-4">
      <Outlet />
    </main>
  </div>
</div>
  );
};

export default VendorLayout;
