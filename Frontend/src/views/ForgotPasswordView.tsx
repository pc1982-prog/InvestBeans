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
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10">
            {/* Back Button */}
            <Link 
              to="/signin" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>

            {!emailSent ? (
              <>
                {/* Logo & Heading */}
                <div className="text-center mb-8">
                  <div className="inline-block mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">IB</span>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Forgot Password?
                  </h1>
                  <p className="text-gray-500 mt-2 text-sm">
                    No worries! Enter your email and we'll send you a reset link
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

                {/* Form */}
                <form onSubmit={onSubmit} className="space-y-5">
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
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
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
                  
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
                    Check Your Email
                  </h1>
                  
                  <p className="text-gray-600 mb-2">
                    We've sent a password reset link to:
                  </p>
                  
                  <p className="text-blue-600 font-semibold mb-6">
                    {email}
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> The reset link will expire in 1 hour for security purposes.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">
                      Didn't receive the email? Check your spam folder or
                    </p>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
            <p className="text-center text-sm text-gray-600 mt-6">
              Remember your password?{" "}
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

export default ForgotPasswordView;