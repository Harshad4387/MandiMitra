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
import SupplierDashboard from "./pages/Supplier/SupplierDashboard.jsx";
import AddItemForm from "./pages/Supplier/AddItemForm.jsx";
import ViewOrdersPanel from "./pages/Supplier/ViewOrdersPanel.jsx";
import RatingsAndReviews from "./pages/Supplier/RatingsAndReviews.jsx";
import Analytics from "./pages/Supplier/Analytics.jsx";


const App = () => {
  // const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  const authUser = true
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
        <Route path="/" element={authUser ? <SupplierLoginPage /> : <Navigate to="/login" />} />
        <Route path="/signup-supplier" element={!authUser ? <SupplierSignUpPage /> : <Navigate to="/" />} />
        <Route path="/login-supplier" element={!authUser ? <SupplierLoginPage /> : <Navigate to="/" />} />
        <Route path="/signup-vendor" element={!authUser ? <VendorSignUpPage /> : <Navigate to="/" />} />
        <Route path="/login-vendor" element={!authUser ? <VendorLoginPage /> : <Navigate to="/" />} />
        {/* <Route path="/supplier-dashboard" element={} */}
        <Route path="/add-item" element={<AddItemForm />} />
        <Route path="/view-orders" element={<ViewOrdersPanel />} />
        <Route path="/ratings-reviews" element={<RatingsAndReviews />} />
        <Route path="/analytics" element={<Analytics />} />

        {/* <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} /> */}
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;