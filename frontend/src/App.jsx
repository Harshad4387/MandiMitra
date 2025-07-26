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
import SupplierLoginPage from "./pages/Supplier/LoginPage.jsx";
import SupplierSignUpPage from "./pages/Supplier/SupplierSignUp.jsx";

import VendorLayout from "./layouts/VenderLayout.jsx";
import VendorDashboard from "./pages/Vendor/VendorHomePage.jsx";
import SearchProduct from "./pages/Vendor/SearchProduct.jsx";
import PlaceOrder from "./pages/Vendor/PlaceOrder.jsx";
import LoyaltyPoints from "./pages/Vendor/LoyaltyPoints.jsx";
import MyOrders from "./pages/Vendor/MyOrders.jsx";
import Analytics from "./pages/Vendor/Analytics.jsx";
import Support from "./pages/Vendor/Support.jsx";
import Profile from "./pages/Vendor/Profile.jsx";
import LoginPage from "./pages/Supplier/LoginPage.jsx";
import SupplierDashboard from "./pages/Supplier/SupplierDashboard.jsx";
import VendorHomePage from "./pages/Vendor/VendorHomePage.jsx";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup-supplier" element={!authUser ? <SupplierSignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : (
          authUser.role === "vendor"
            ? <Navigate to="/vendor/HomePage" />
            : <Navigate to="/supplier/dashboard" />
        )} />
        <Route path="/signup-vendor" element={!authUser ? <VendorSignUpPage /> : <Navigate to="/" />} />

        {authUser && (
          <Route path="/vendor" element={<VendorLayout />}>
            <Route path="homepage" element={<VendorHomePage />} />
            <Route path="search" element={<SearchProduct />} />
            <Route path="order" element={<PlaceOrder />} />
            <Route path="loyalty" element={<LoyaltyPoints />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="support" element={<Support />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        )}

        {/* {authUser && (
          <Route path="/supplier" element={<SupplierDashboard />}>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="search" element={<SearchProduct />} />
            <Route path="order" element={<PlaceOrder />} />
            <Route path="loyalty" element={<LoyaltyPoints />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="support" element={<Support />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        )} */}

        {authUser && (
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        )}

      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
