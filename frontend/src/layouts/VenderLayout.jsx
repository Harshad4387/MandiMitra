import Navbar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import { Outlet } from "react-router-dom";

const VendorLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;