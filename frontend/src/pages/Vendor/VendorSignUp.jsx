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
  MapPin,
  UtensilsCrossed,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VendorSignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: {
      latitude: null,
      longitude: null,
    },
    foodType: "",
  });

  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!formData.phone.trim()) return toast.error("Phone number is required");
    if (!formData.location.latitude || !formData.location.longitude)
      return toast.error("Location is required");
    if (!formData.foodType.trim()) return toast.error("Please select the type of food sold");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid === true) {
      const success = await signup({ ...formData, role: "vendor" });
      if (success) navigate("/login-vendor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-3">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="size-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Vendor Account</h1>
          <p className="text-sm text-gray-500">Start your food vendor journey with Mandi Mitra</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-10">
          {/* Full Name */}
          <FormGroup
            label="Full Name"
            icon={<User />}
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          {/* Email */}
          <FormGroup
            label="Email"
            icon={<Mail />}
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          {/* Password */}
          <FormGroup
            label="Password"
            icon={<Lock />}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="size-5 text-gray-400" /> : <Eye className="size-5 text-gray-400" />}
              </button>
            }
          />

          {/* Phone */}
          <FormGroup
            label="Phone Number"
            icon={<Phone />}
            placeholder="9876543210"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          {/* Location */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Location</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="size-5 text-base-content/40" />
              </div>
              <input
                type="text"
                disabled
                className="input input-bordered w-full pl-10"
                value={
                  formData.location.latitude && formData.location.longitude
                    ? `${formData.location.latitude.toFixed(5)}, ${formData.location.longitude.toFixed(5)}`
                    : ""
                }
                placeholder="Click 'Get Location'"
              />
              <button
                type="button"
                className="btn btn-sm btn-outline absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => {
                  if (!navigator.geolocation) return toast.error("Geolocation not supported");
                  toast.loading("Getting your location...");
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      toast.dismiss();
                      const { latitude, longitude } = position.coords;
                      setFormData((prev) => ({
                        ...prev,
                        location: { latitude, longitude },
                      }));
                      toast.success("Location captured!");
                    },
                    (error) => {
                      toast.dismiss();
                      toast.error("Failed to get location: " + error.message);
                    }
                  );
                }}
              >
                Get Location
              </button>
            </div>
          </div>

          {/* Food Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Type of Food Sold</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UtensilsCrossed className="size-5 text-base-content/40" />
              </div>
              <select
                className="select select-bordered w-full pl-10"
                value={formData.foodType}
                onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
              >
                <option value="">Select Food Type</option>
                <option value="Indian">Indian</option>
                <option value="Chinese">Chinese</option>
                <option value="Italian">Italian</option>
                <option value="Snacks">Snacks</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl shadow hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>

        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

// 🔁 Reusable Form Group
const FormGroup = ({ label, icon, value, onChange, type = "text", placeholder, rightIcon }) => (
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
        className="input input-bordered w-full pl-10 pr-10"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {rightIcon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{rightIcon}</div>}
    </div>
  </div>
);

export default VendorSignUpPage;
