import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
    const { authUser } = useAuthStore.getState();
    if (authUser?.role === "vendor") navigate("/vendor/homepage");
    else if (authUser?.role === "supplier") navigate("/supplier/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center px-4 py-8">
      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white shadow-2xl rounded-3xl overflow-hidden">
        
        {/* Left: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-3">
              <Mail className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center border border-gray-300 rounded-md shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  className="w-full outline-none bg-transparent text-sm placeholder-gray-400"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Password</label>
              <div className="flex items-center border border-gray-300 rounded-md shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Lock className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full outline-none bg-transparent text-sm placeholder-gray-400"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 ml-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>


            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full hover:scale-[1.01] active:scale-100 transition-transform duration-200"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
            <p>
              Don’t have a <b>Vendor</b> account?{" "}
              <Link to="/signup-vendor" className="link link-primary">Sign up</Link>
            </p>
            <p>
              Don’t have a <b>Supplier</b> account?{" "}
              <Link to="/signup-supplier" className="link link-primary">Sign up</Link>
            </p>
          </div>
        </div>

        {/* Right: Welcome Panel */}
        <div className="hidden md:flex items-center justify-center bg-blue-600 text-white p-10">
          <div className="space-y-6 text-center max-w-sm">
            <h3 className="text-3xl font-semibold">Welcome to Mandi Mitra 🌾</h3>
            <p className="text-sm leading-relaxed">
              Your trusted partner for a smarter mandi experience.  
              <br /><br />
              Whether you're a <b>Vendor</b> managing produce or a <b>Supplier</b> fulfilling demand, Mandi Mitra connects you to the right people and helps your business grow — all in one place.
            </p>
            <img src="/illustrations/login.svg" alt="Login illustration" className="w-60 mx-auto mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
