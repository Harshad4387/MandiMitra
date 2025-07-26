import { useAuthStore } from "../store/useAuthStore";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { logout } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        {/* Title or logo placeholder (optional) */}
        <div className="text-lg font-semibold text-primary">MandiMitra</div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
