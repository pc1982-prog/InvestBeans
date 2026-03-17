import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast, ToastContainer } from "@/components/ui/Toasts";
import axios from "axios";

const ForgotPasswordView = () => {
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    const API_URL = import.meta.env.VITE_API_URL;
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/v1/users/forgot-password`, { email });
      
      if (data.success) {
        setEmailSent(true);
        showSuccess("Password reset link sent! Check your email.");
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Failed to send reset email. Please try again.";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="min-h-screen flex items-center justify-center min-h-screen bg-slate-950/95 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 sm:p-10">
            {/* Back Button */}
            <Link 
              to="/signin" 
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>

            {!emailSent ? (
              <>
                {/* Logo & Heading */}
                <div className="text-center mb-8">
                  <div className="inline-block mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1C3656] to-[#5194F6] rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">IB</span>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    Forgot Password?
                  </h1>
                  <p className="text-white/50 mt-2 text-sm">
                    No worries! Enter your email and we'll send you a reset link
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-300">Error</p>
                        <p className="text-sm text-red-400 mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={onSubmit} className="space-y-5">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-white/70">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-white/30" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-11 h-12 text-base border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-[#5194F6] focus:ring-[#5194F6]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#5194F6] to-[#3a7de0] hover:from-[#3a7de0] hover:to-[#5194F6] text-white shadow-lg hover:shadow-xl transition-all"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <h1 className="text-3xl font-bold text-white tracking-tight mb-3">
                    Check Your Email
                  </h1>
                  
                  <p className="text-white/60 mb-2">
                    We've sent a password reset link to:
                  </p>
                  
                  <p className="text-[#5194F6] font-semibold mb-6">
                    {email}
                  </p>
                  
                  <div className="bg-[#5194F6]/10 border border-[#5194F6]/25 rounded-xl p-4 mb-6">
                    <p className="text-sm text-[#5194F6]/90">
                      <strong>Note:</strong> The reset link will expire in 1 hour for security purposes.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-white/50">
                      Didn't receive the email? Check your spam folder or
                    </p>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-12 border border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5"
                      onClick={() => {
                        setEmailSent(false);
                        setEmail("");
                      }}
                    >
                      Try Another Email
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Sign In Link */}
            <p className="text-center text-sm text-white/50 mt-6">
              Remember your password?{" "}
              <Link to="/signin" className="font-semibold text-[#5194F6] hover:text-[#7ab8fa] hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-white/30 mt-8">
            © 2025 INVESTBEANS • Secure • Regulated • Trusted
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordView;