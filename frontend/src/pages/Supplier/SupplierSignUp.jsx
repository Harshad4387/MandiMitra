import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore.js";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
  Phone,
  Briefcase,
  MapPin,
  Landmark,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../../components/AuthImagePattern";
import toast from "react-hot-toast";

const SupplierSignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
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

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    const { businessName, ownerName, email, password, phone, businessAddress, deliveryMethod, serviceArea, role } = formData;
    if (!businessName.trim()) return toast.error("Business name is required");
    if (!ownerName.trim()) return toast.error("Owner name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format");
    if (!password) return toast.error("Password is required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!phone.trim()) return toast.error("Phone number is required");
    if (!businessAddress.trim()) return toast.error("Business address is required");
    if (!deliveryMethod) return toast.error("Please select a delivery method");
    if (!serviceArea.trim()) return toast.error("Service area is required");
    return true;
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  const success = validateForm();
  if (success === true) {
    signup({ ...formData, role: "supplier" }); // 👈 hardcoded role here
  }
};


  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Supplier Account</h1>
              <p className="text-base-content/60">Get started with your free Supplier account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business Name */}
            <FormInput
              icon={<Briefcase />}
              label="Business Name"
              placeholder="Acme Corp"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value})}
            />

            {/* Owner Name */}
            <FormInput
              icon={<User />}
              label="Owner Name"
              placeholder="John Doe"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            />

            {/* Email */}
            <FormInput
              icon={<Mail />}
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            {/* Password */}
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Password</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Phone Number */}
            <FormInput
              icon={<Phone />}
              label="Phone Number"
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            {/* Address */}
            <FormInput
              icon={<MapPin />}
              label="Business Address"
              placeholder="123 Main Street, City"
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
            />

            {/* GST Number (Optional) */}
            <FormInput
              icon={<Landmark />}
              label="GST Number (optional)"
              placeholder="27AAEPM1234C1Z5"
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
            />

            {/* Delivery Method */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Truck className="size-4" /> Delivery Method
                </span>
              </label>
              <div className="flex gap-4">
                {["Delivery", "Pickup", "Both"].map((method) => (
                  <label key={method} className="label cursor-pointer gap-2">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      className="radio checked:bg-primary"
                      value={method}
                      checked={formData.deliveryMethod === method}
                      onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                    />
                    <span className="label-text">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Service Area */}
            <FormInput
              icon={<MapPin />}
              label="Service Area (map/pincode)"
              placeholder="e.g., 411001, 411002"
              value={formData.serviceArea}
              onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
            />

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login-supplier" className="link link-primary">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with customers, grow your business, and deliver great service."
      />
    </div>
  );
};

const FormInput = ({ icon, label, placeholder, type = "text", value, onChange }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text font-medium">{label}</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        className="input input-bordered w-full pl-10"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export default SupplierSignUpPage;
