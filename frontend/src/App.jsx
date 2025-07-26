import Navbar from "./components/NavBar.jsx";
import HomePage from "./pages/HomePage.jsx";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import VendorLoginPage from "./pages/Vendor/VendorLoginPage.jsx";
import VendorSignUpPage from "./pages/Vendor/VendorSignUp.jsx";
import SupplierLoginPage from "./pages/Supplier/SupplierLoginPage.jsx";
import SupplierSignUpPage from "./pages/Supplier/SupplierSignUp.jsx";

const App = () => {
  // const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  const authUser = false
  const isCheckingAuth = false

  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup-supplier" element={!authUser ? <SupplierSignUpPage /> : <Navigate to="/" />} />
        <Route path="/login-supplier" element={!authUser ? <SupplierLoginPage /> : <Navigate to="/" />} />
        <Route path="/signup-vendor" element={!authUser ? <VendorSignUpPage /> : <Navigate to="/" />} />
        <Route path="/login-vendor" element={!authUser ? <VendorLoginPage /> : <Navigate to="/" />} />

        {/* <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} /> */}
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;