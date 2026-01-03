import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useAuth } from "../../context/authContext";
import { LoginPayload, loginUser } from "../../services/authApi";
import { Vendors } from "../../entities/index";
import { addUser } from "../../store/userSlice";
import { useToast } from "../../context/toastContext";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginPayload>({
    role: "VENDOR", // "VENDOR" | "BUYER"
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login, setVendor } = useAuth();
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      if (!formData.role || !formData.email || !formData.password) {
        setErrorMessage("Please select role and fill in all fields");
        setIsLoading(false);
        return;
      }

      const payload: LoginPayload = {
        role: formData.role,
        email: formData.email,
        password: formData.password,
      };
      const resp: Vendors = await loginUser(payload);
      dispatch(addUser({ ...resp, role: formData.role }));
      setVendor(formData.role === "VENDOR");
      localStorage.setItem("auth_token", resp.token || "");
      localStorage.setItem("auth_role", formData.role);
      localStorage.setItem("id", resp.id);

      setFormData({
        role: "VENDOR",
        email: "",
        password: "",
      });
      login();
      addToast("Login Successfully!","success")
      setTimeout(() => {
        if (formData.role === "VENDOR") {
          const onboardingCompleted = resp.onboardingCompleted;
          const onboardingStep = resp.onboardingProgress || 0;
          if (!onboardingCompleted) {
            localStorage.setItem("onboardingStep", onboardingStep.toString());
            navigate(`/onboarding?step=${onboardingStep + 1}`, {
              replace: true,
            });
            return;
          }
          navigate("/buyers", { replace: true });
        } else {
          navigate("/vendors", { replace: true });
        }
      }, 500);
    } catch (error) {
      setErrorMessage("Failed to login. Please check your credentials.");

      addToast("Failed to login. Please check your credentials.", "error");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-32 pb-24">
        <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-heading text-5xl lg:text-6xl font-bold text-textprimary mb-6">
              Login
            </h1>
            <p className="font-paragraph text-base text-textprimary/70 max-w-3xl">
              Log in to access your dashboard, manage listings, and receive RFP
              notifications.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-background border-2 border-textprimary/10 p-8 lg:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                >
                  Login as
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                >
                  <option value="">Select role</option>
                  <option value="VENDOR">Vendor</option>
                  <option value="BUYER">Buyer</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your registered email"
                  className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              {errorMessage && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="font-paragraph text-sm text-destructive">
                    {errorMessage}
                  </p>
                </div>
              )}

              {successMessage && (
                <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                  <p className="font-paragraph text-sm text-green-700">
                    {successMessage}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-base py-3 rounded-lg transition-colors"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-secondary text-secondary-foreground p-8"
          >
            <h2 className="font-heading text-2xl font-semibold mb-4">
              New here?
            </h2>
            <ul className="font-paragraph text-sm space-y-3 text-secondary-foreground/80">
              <li>
                {"→ Create an account to start receiving/submitting RFPs"}
              </li>
              <li>{"→ Manage your products and service offerings"}</li>
              <li>{"→ Track opportunities from your dashboard"}</li>
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
