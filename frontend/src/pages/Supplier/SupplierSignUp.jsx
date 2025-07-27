// File: SupplierSignUpPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Eye, EyeOff, Loader2, Lock, Mail, MessageSquare,
  User, Phone, Briefcase, MapPin, Landmark, Truck,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import FormInput from "../../components/FormInput";
import FormRadioGroup from "../../components/FormRadioGroup";

const SupplierSignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    businessAddress: "",
    gstNumber: "",
    deliveryMethod: "",
    serviceArea: "",
  });

  const validateForm = () => {
    const {
      businessName, ownerName, email, password,
      phone, businessAddress, deliveryMethod, serviceArea,
    } = formData;

    if (!businessName.trim()) return toast.error("Business name is required");
    if (!ownerName.trim()) return toast.error("Owner name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format");
    if (!password || password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!phone.trim()) return toast.error("Phone number is required");
    if (!businessAddress.trim()) return toast.error("Business address is required");
    if (!deliveryMethod) return toast.error("Please select a delivery method");
    if (!serviceArea.trim()) return toast.error("Service area is required");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const success = await signup({ ...formData, role: "supplier" });
      if (success) navigate("/login-supplier");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-3">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="size-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Supplier Account</h1>
          <p className="text-sm text-gray-500">Start your supplier journey with Mandi Mitra</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            icon={<Briefcase />} label="Business Name" placeholder="Acme Traders"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          />
          <FormInput
            icon={<User />} label="Owner Name" placeholder="Ravi Kumar"
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          />
          <FormInput
            icon={<Mail />} type="email" label="Email" placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <FormInput
            icon={<Lock />}
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="size-5 text-gray-400" /> : <Eye className="size-5 text-gray-400" />}
              </button>
            }
          />
          <FormInput
            icon={<Phone />} label="Phone Number" placeholder="9876543210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <FormInput
            icon={<MapPin />} label="Business Address" placeholder="123 Main Street, Pune"
            value={formData.businessAddress}
            onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
          />
          <FormInput
            icon={<Landmark />} label="GST Number (Optional)" placeholder="27AAEPM1234C1Z5"
            value={formData.gstNumber}
            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
          />
          <FormRadioGroup
            icon={<Truck />} label="Delivery Method"
            options={["Delivery", "Pickup", "Both"]}
            selected={formData.deliveryMethod}
            onChange={(value) => setFormData({ ...formData, deliveryMethod: value })}
          />
          <FormInput
            icon={<MapPin />} label="Service Area (map/pincode)" placeholder="e.g., 422001, 422002"
            value={formData.serviceArea}
            onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
          />

          <button
            type="submit"
            className="btn btn-primary w-full rounded-xl py-2.5 font-medium text-white"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                Creating...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SupplierSignUpPage;
