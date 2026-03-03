import { FormEvent, useState } from "react";
import { useAuth } from "@/controllers/AuthContext";
import { useTheme } from "@/controllers/Themecontext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Mail, User, Eye, EyeOff, Loader2, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast, ToastContainer } from "@/components/ui/Toasts";

const SignUpView = () => {
  const { signUp, loginWithGoogle } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const navigate = useNavigate();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
    if (!isPasswordValid) {
      const msg = "Password must meet all requirements";
      setError(msg); showError(msg); return;
    }
    setLoading(true);
    try {
      await signUp(name, email, password);
      showSuccess("Account created successfully! Welcome to InvestBeans.");
      setTimeout(() => navigate("/"), 1000);
    } catch (err: any) {
      const msg = err?.message ?? "Unable to create account. Try again.";
      setError(msg); showError(msg);
    } finally { setLoading(false); }
  };

  const handleGoogleSignUp = () => {
    setError(null); setGoogleLoading(true); loginWithGoogle();
  };

  // ── Theme tokens (same philosophy as SignInView) ──────────────────────────

  const pageBg = isLight
    ? "linear-gradient(135deg,#dce8f7 0%,#e8f2fd 50%,#dce8f7 100%)"
    : "linear-gradient(135deg,#0d1b2a 0%,#0e2038 50%,#0b1825 100%)";

  const cardBg = isLight ? "#ffffff" : "rgba(13,30,54,0.95)";
  const cardBorder = isLight ? "1px solid rgba(13,37,64,0.1)" : "1px solid rgba(255,255,255,0.08)";
  const cardShadow = isLight
    ? "0 20px 60px rgba(13,37,64,0.1)"
    : "0 20px 60px rgba(0,0,0,0.5)";

  // Logo — always same brand gradient
  const logoBg = "linear-gradient(135deg,#1a3a5c,#C4941E)";

  const headingColor = isLight ? "#0d1b2a" : "white";
  const subTextColor = isLight ? "rgba(13,37,64,0.55)" : "rgba(148,163,184,1)";

  // Error
  const errorBg = isLight ? "#fef2f2" : "rgba(254,202,202,0.06)";
  const errorBorder = isLight ? "1px solid #fecaca" : "1px solid rgba(254,202,202,0.2)";
  const errorTitleColor = isLight ? "#991b1b" : "#fca5a5";
  const errorBodyColor = isLight ? "#b91c1c" : "#fca5a5";
  const errorIconColor = isLight ? "#dc2626" : "#f87171";

  // Google btn
  const googleBtnCls = isLight
    ? "w-full h-12 mb-6 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium bg-white"
    : "w-full h-12 mb-6 border border-white/20 hover:border-white/40 text-white font-medium bg-white/10 hover:bg-white/15";

  // Divider
  const dividerBorder = isLight ? "border-t border-slate-200" : "border-t border-white/10";
  const dividerTextBg = isLight ? "bg-white" : "bg-transparent";
  const dividerTextColor = isLight ? "text-slate-400" : "text-slate-500";

  // Inputs
  const inputCls = isLight
    ? "pl-11 h-12 text-base border-slate-200 focus:border-[#C4941E] focus:ring-[#C4941E]/30 bg-white text-slate-900"
    : "pl-11 h-12 text-base border-white/10 focus:border-[#C4941E] focus:ring-[#C4941E]/30 bg-white/5 text-white placeholder:text-slate-500";
  const passwordInputCls = isLight
    ? "pl-11 pr-12 h-12 text-base border-slate-200 focus:border-[#C4941E] focus:ring-[#C4941E]/30 bg-white text-slate-900"
    : "pl-11 pr-12 h-12 text-base border-white/10 focus:border-[#C4941E] focus:ring-[#C4941E]/30 bg-white/5 text-white placeholder:text-slate-500";
  const iconColor = isLight ? "text-slate-400" : "text-slate-500";
  const labelColor = isLight ? "text-slate-700" : "text-slate-300";

  // Password indicator
  const strengthMetOk = isLight ? "text-emerald-700" : "text-green-400";
  const strengthMetFail = isLight ? "text-slate-400" : "text-slate-500";
  const checkOk = isLight ? "text-emerald-600" : "text-green-400";
  const checkFail = isLight ? "text-slate-300" : "text-slate-600";

  // Submit
  const submitBtn =
    "w-full h-12 text-base font-semibold bg-gradient-to-r from-[#C4941E] to-[#D4A843] hover:from-[#b47d16] hover:to-[#C4941E] text-[#0d1b2a] shadow-lg hover:shadow-xl transition-all";

  // Links
  const termsColor = isLight ? "text-[#C4941E] hover:underline" : "text-[#D4A843] hover:underline";
  const signInLinkColor = isLight
    ? "font-semibold text-[#C4941E] hover:text-[#b47d16] hover:underline"
    : "font-semibold text-[#D4A843] hover:text-[#e8c45a] hover:underline";
  const footerColor = isLight ? "text-slate-500" : "text-slate-500";
  const termsTextColor = isLight ? "text-slate-500" : "text-slate-400";
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
                Create Account
              </h1>
              <p className="mt-2 text-sm" style={{ color: subTextColor }}>
                Join InvestBeans and start your investment journey
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

            {/* Google sign-up */}
            <Button
              variant="outline" size="lg" type="button"
              className={googleBtnCls}
              onClick={handleGoogleSignUp}
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
                  Or sign up with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Full name */}
              <div className="space-y-2">
                <Label htmlFor="name" className={`text-sm font-medium ${labelColor}`}>Full Name</Label>
                <div className="relative">
                  <User className={`absolute left-3 top-3.5 h-5 w-5 ${iconColor}`} />
                  <Input
                    id="name" type="text" placeholder="John Doe"
                    className={inputCls}
                    value={name} onChange={(e) => setName(e.target.value)}
                    required disabled={loading || googleLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className={`text-sm font-medium ${labelColor}`}>Email Address</Label>
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
                <Label htmlFor="password" className={`text-sm font-medium ${labelColor}`}>Password</Label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3.5 h-5 w-5 ${iconColor}`} />
                  <Input
                    id="password" type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={passwordInputCls}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    required disabled={loading || googleLoading}
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-3.5 transition disabled:opacity-50 ${iconColor} hover:text-[#C4941E]`}
                    disabled={loading || googleLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password strength checklist */}
                {password && (
                  <div className="mt-3 space-y-1.5">
                    {[
                      { ok: passwordStrength.hasLength,  label: "At least 8 characters" },
                      { ok: passwordStrength.hasLetter,  label: "Contains lowercase letters" },
                      { ok: passwordStrength.hasCapital, label: "Contains uppercase letters" },
                      { ok: passwordStrength.hasNumber,  label: "Contains numbers" },
                      { ok: passwordStrength.hasSpecial, label: "Contains special characters" },
                    ].map(({ ok, label }) => (
                      <div key={label} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-4 h-4 ${ok ? checkOk : checkFail}`} />
                        <span className={ok ? strengthMetOk : strengthMetFail}>{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit" size="lg"
                className={submitBtn}
                disabled={loading || googleLoading || !!(password && !isPasswordValid)}
              >
                {loading
                  ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Creating account...</>
                  : "Create Account"}
              </Button>
            </form>

            {/* Terms */}
            <p className={`text-xs text-center mt-4 ${termsTextColor}`}>
              By signing up, you agree to our{" "}
              <Link to="/terms-of-service" className={termsColor}>Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy-policy" className={termsColor}>Privacy Policy</Link>
            </p>

            {/* Sign in link */}
            <p className={`text-center text-sm mt-6 ${footerColor}`}>
              Already have an account?{" "}
              <Link to="/signin" className={signInLinkColor}>Sign In</Link>
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

export default SignUpView;