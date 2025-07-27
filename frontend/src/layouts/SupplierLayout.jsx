import Navbar from "../components/NavBar";
import Sidebar from "../components/SupplierSideBar";
import { Outlet } from "react-router-dom";

const SupplierLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar should not scroll */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SupplierLayout;