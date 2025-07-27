import HomePage from "./pages/HomePage.jsx";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import VendorSignUpPage from "./pages/Vendor/VendorSignUp.jsx";

import SupplierSignUpPage from "./pages/Supplier/SupplierSignUp.jsx";

import VendorLayout from "./layouts/VendorLayout.jsx";

import SearchProduct from "./pages/Vendor/SearchProduct.jsx";
import PlaceOrder from "./pages/Vendor/ViewCart.jsx";
import MyOrders from "./pages/Vendor/MyOrders.jsx";
import Support from "./pages/Vendor/Support.jsx";
import Profile from "./pages/Vendor/ProfilePage.jsx";
import LoginPage from "./pages/Supplier/LoginPage.jsx";
import SupplierDashboard from "./pages/Supplier/SupplierDashboard.jsx";
import VendorHomePage from "./pages/Vendor/VendorHomePage.jsx";
import SupplierLayout from "./layouts/SupplierLayout.jsx";
import AddItemForm from "./pages/Supplier/AddItemForm.jsx"
import ViewOrdersPanel from "./pages/Supplier/ViewOrdersPanel.jsx";
import CustomersPage from "./pages/Supplier/CustomersPage.jsx";
import ProfilePage from "./pages/Supplier/ProfilePage.jsx";
import ViewMyItems from './pages/Supplier/ViewMyItems';
import GroqChatbot from "./pages/Vendor/GroqChatbot.jsx";

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
            <Route path="orders" element={<MyOrders />} />
            <Route path="support" element={<Support />} />
            <Route path="profile" element={<Profile />} />
            <Route path="chatbot" element={<GroqChatbot/>}/>
          </Route>
        )}


        <Route path="/supplier" element={<SupplierLayout />}>
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          <Route path="/supplier/add-item" element={<AddItemForm />} />
          <Route path="/supplier/view-orders" element={<ViewOrdersPanel />} />
          <Route path="/supplier/view-my-items" element={<ViewMyItems />} />
          <Route path="/supplier/contact-customer" element={<CustomersPage />} />
          <Route path="/supplier/profile" element={<ProfilePage />} />
        </Route>

      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
