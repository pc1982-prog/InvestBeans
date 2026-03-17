import { FormEvent, useState } from "react";
import { useAuth } from "@/controllers/AuthContext";
import { useTheme } from "@/controllers/Themecontext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Mail, Eye, EyeOff, Loader2, Lock, AlertCircle } from "lucide-react";
import { useToast, ToastContainer } from "@/components/ui/Toasts";

const SignInView = () => {
  const { signIn, loginWithGoogle } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const navigate = useNavigate();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      showSuccess("Login successful! Welcome back.");
      setTimeout(() => navigate("/"), 1000);
    } catch (err: any) {
      const msg = err?.message ?? "Invalid email or password";
      setError(msg);
      showError(msg);
    } finally { setLoading(false); }
  };

  const handleGoogleSignIn = () => {
    setError(null);
    setGoogleLoading(true);
    loginWithGoogle();
  };

  // ── Theme tokens ─────────────────────────────────────────────────────────

  // Page background
  const pageBg = isLight
    ? "linear-gradient(135deg,#dce8f7 0%,#e8f2fd 50%,#dce8f7 100%)"
    : "#0d0f1a";

  // Card
  const cardBg = isLight ? "#ffffff" : "rgba(15,22,40,0.95)";
  const cardBorder = isLight ? "1px solid rgba(13,37,64,0.1)" : "1px solid rgba(81,148,246,0.15)";
  const cardShadow = isLight
    ? "0 20px 60px rgba(13,37,64,0.1)"
    : "0 20px 60px rgba(0,0,0,0.5)";

  // Logo badge (always gold/navy — same in both modes per brand requirement)
  const logoBg = "linear-gradient(135deg,#1C3656,#5194F6)";

  // Headings / text
  const headingColor = isLight ? "#0d1b2a" : "white";
  const subTextColor = isLight ? "rgba(13,37,64,0.55)" : "rgba(148,163,184,1)";

  // Error block
  const errorBg = isLight ? "#fef2f2" : "rgba(254,202,202,0.06)";
  const errorBorder = isLight ? "1px solid #fecaca" : "1px solid rgba(254,202,202,0.2)";
  const errorTitleColor = isLight ? "#991b1b" : "#fca5a5";
  const errorBodyColor = isLight ? "#b91c1c" : "#fca5a5";
  const errorIconColor = isLight ? "#dc2626" : "#f87171";

  // Google button
  const googleBtnCls = isLight
    ? "w-full h-12 mb-6 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium bg-white"
    : "w-full h-12 mb-6 border border-white/20 hover:border-white/40 text-white font-medium bg-white/10 hover:bg-white/15";

  // Divider
  const dividerBorder = isLight ? "border-t border-slate-200" : "border-t border-white/10";
  const dividerTextBg = isLight ? "bg-white" : "bg-transparent";
  const dividerTextColor = isLight ? "text-slate-400" : "text-slate-500";

  // Input
  const inputCls = isLight
    ? "pl-11 h-12 text-base border-slate-200 focus:border-[#5194F6] focus:ring-[#5194F6]/30 bg-white text-slate-900"
    : "pl-11 h-12 text-base border-white/10 focus:border-[#5194F6] focus:ring-[#5194F6]/30 bg-white/5 text-white placeholder:text-slate-500";
  const passwordInputCls = isLight
    ? "pl-11 pr-12 h-12 text-base border-slate-200 focus:border-[#5194F6] focus:ring-[#5194F6]/30 bg-white text-slate-900"
    : "pl-11 pr-12 h-12 text-base border-white/10 focus:border-[#5194F6] focus:ring-[#5194F6]/30 bg-white/5 text-white placeholder:text-slate-500";
  const iconColor = isLight ? "text-slate-400" : "text-slate-500";
  const labelColor = isLight ? "text-slate-700" : "text-slate-300";

  // Forgot password
  const forgotColor = isLight ? "text-[#5194F6] hover:text-[#7ab8fa]" : "text-[#5194F6] hover:text-[#7ab8fa]";

  // Submit button (always gold — brand standard)
  const submitBtn =
    "w-full h-12 text-base font-semibold bg-gradient-to-r from-[#5194F6] to-[#3a7de0] hover:from-[#3a7de0] hover:to-[#5194F6] text-white shadow-lg hover:shadow-xl transition-all";

  // Footer text
  const footerColor = isLight ? "text-slate-500" : "text-slate-500";
  const linkColor = isLight ? "text-[#5194F6] hover:text-[#7ab8fa]" : "text-[#5194F6] hover:text-[#7ab8fa]";
  const signupLinkColor = isLight ? "font-semibold text-[#5194F6] hover:text-[#7ab8fa]" : "font-semibold text-[#5194F6] hover:text-[#7ab8fa]";

  // Caption at bottom
  const captionColor = isLight ? "text-slate-400" : "text-slate-500";

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: pageBg }}
      >
        <div className="w-full max-w-md">

          {/* ── Main card ── */}
          <div
            className="rounded-3xl p-8 sm:p-10"
            style={{ background: cardBg, border: cardBorder, boxShadow: cardShadow }}
          >
            {/* Logo & heading */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer mx-auto"
                  style={{ background: logoBg }}
                >
                  {/* Same logo in both modes — brand requirement */}
                  <span className="text-white text-2xl font-bold">IB</span>
                </div>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: headingColor }}>
                Welcome Back
              </h1>
              <p className="mt-2 text-sm" style={{ color: subTextColor }}>
                Sign in to continue to InvestBeans
              </p>
            </div>

            {/* Error alert */}
            {error && (
              <div className="mb-6 rounded-xl p-4" style={{ background: errorBg, border: errorBorder }}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: errorIconColor }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: errorTitleColor }}>Error</p>
                    <p className="text-sm mt-1" style={{ color: errorBodyColor }}>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Google sign-in */}
            <Button
              variant="outline" size="lg" type="button"
              className={googleBtnCls}
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
            >
              {googleLoading
                ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Connecting...</>
                : <><FcGoogle className="mr-2 h-6 w-6" />Continue with Google</>}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className={`w-full ${dividerBorder}`} />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`${dividerTextBg} px-3 ${dividerTextColor} font-medium`}>
                  Or sign in with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className={`text-sm font-medium ${labelColor}`}>
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-3.5 h-5 w-5 ${iconColor}`} />
                  <Input
                    id="email" type="email" placeholder="you@example.com"
                    className={inputCls}
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    required disabled={loading || googleLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className={`text-sm font-medium ${labelColor}`}>
                  Password
                </Label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3.5 h-5 w-5 ${iconColor}`} />
                  <Input
                    id="password" type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={passwordInputCls}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    required disabled={loading || googleLoading}
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-3.5 transition disabled:opacity-50 ${iconColor} hover:text-[#5194F6]`}
                    disabled={loading || googleLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Forgot password */}
                <div className="text-right">
                  <Link to="/forgot-password" className={`text-xs font-medium hover:underline ${forgotColor}`}>
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" size="lg" className={submitBtn} disabled={loading || googleLoading}>
                {loading
                  ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Signing in...</>
                  : "Sign In"}
              </Button>
            </form>

            {/* Sign up link */}
            <p className={`text-center text-sm mt-6 ${footerColor}`}>
              Don't have an account?{" "}
              <Link to="/signup" className={signupLinkColor}>Create one now</Link>
            </p>
          </div>

          {/* Page caption */}
          <p className={`text-center text-xs mt-8 ${captionColor}`}>
            © 2025 INVESTBEANS • Secure • Regulated • Trusted
          </p>
        </div>
      </div>
    </>
  );
};

export default SignInView;