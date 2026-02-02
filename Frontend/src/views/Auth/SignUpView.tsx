import { FormEvent, useState } from "react";
import { useAuth } from "@/controllers/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Mail, User, Eye, EyeOff, Loader2, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast, ToastContainer } from "@/components/ui/Toasts";

const SignUpView = () => {
  const { signUp, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Password strength indicators
  const passwordStrength = {
    hasLength: password.length >= 8,
    hasLetter: /[a-z]/.test(password),
    hasCapital: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password before submitting
    if (!isPasswordValid) {
      const errorMsg = "Password must meet all requirements";
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    setLoading(true);

    try {
      await signUp(name, email, password);
      showSuccess("Account created successfully! Welcome to InvestBeans.");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: any) {
      const errorMsg = err?.message ?? "Unable to create account. Try again.";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setError(null);
    setGoogleLoading(true);
    loginWithGoogle();
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10">
            {/* Logo & Heading */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer">
                  <span className="text-white text-2xl font-bold">
                    IB
                  </span>
                </div>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Create Account
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                Join InvestBeans and start your investment journey
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Google Sign Up Button */}
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 mb-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700"
              onClick={handleGoogleSignUp}
              type="button"
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <FcGoogle className="mr-2 h-6 w-6" />
                  Continue with Google
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-medium">Or sign up with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-11 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading || googleLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-11 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading || googleLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-11 pr-12 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || googleLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                    disabled={loading || googleLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password Strength Indicators */}
                {password && (
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2
                        className={`w-4 h-4 ${passwordStrength.hasLength ? 'text-green-600' : 'text-gray-300'}`}
                      />
                      <span className={passwordStrength.hasLength ? 'text-green-700' : 'text-gray-500'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2
                        className={`w-4 h-4 ${passwordStrength.hasLetter ? 'text-green-600' : 'text-gray-300'}`}
                      />
                      <span className={passwordStrength.hasLetter ? 'text-green-700' : 'text-gray-500'}>
                        Contains lowercase letters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2
                        className={`w-4 h-4 ${passwordStrength.hasCapital ? 'text-green-600' : 'text-gray-300'}`}
                      />
                      <span className={passwordStrength.hasCapital ? 'text-green-700' : 'text-gray-500'}>
                        Contains uppercase letters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2
                        className={`w-4 h-4 ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-300'}`}
                      />
                      <span className={passwordStrength.hasNumber ? 'text-green-700' : 'text-gray-500'}>
                        Contains numbers
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2
                        className={`w-4 h-4 ${passwordStrength.hasSpecial ? 'text-green-600' : 'text-gray-300'}`}
                      />
                      <span className={passwordStrength.hasSpecial ? 'text-green-700' : 'text-gray-500'}>
                        Contains special characters
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                disabled={loading || googleLoading || (password && !isPasswordValid)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-4">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link to="/signin" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-8">
            © 2025 INVESTBEANS • Secure • Regulated • Trusted
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUpView;