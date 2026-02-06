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
      console.log('🚀 Sending forgot password request to:', `${API_URL}/api/v1/users/forgot-password`);
      console.log('📧 Email:', email);

      // ✅ ADD TIMEOUT - If no response in 30 seconds, show error
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.error('⏱️ Request timed out after 30 seconds');
      }, 30000); // 30 second timeout

      const { data } = await axios.post(
        `${API_URL}/api/v1/users/forgot-password`, 
        { email },
        {
          signal: controller.signal,
          timeout: 30000, // 30 second axios timeout
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      clearTimeout(timeoutId);

      console.log('✅ Response received:', data);
      
      if (data.success) {
        setEmailSent(true);
        showSuccess("Password reset link sent! Check your email.");
      } else {
        throw new Error(data.message || "Failed to send reset email");
      }
    } catch (err: any) {
      console.error('❌ Forgot password error:', err);

      let errorMsg = "Failed to send reset email. Please try again.";

      // ✅ HANDLE DIFFERENT ERROR TYPES
      if (err.code === 'ECONNABORTED' || err.name === 'AbortError') {
        errorMsg = "Request timed out. The server is taking too long to respond. Please check your email inbox anyway - the email might have been sent.";
      } else if (err.code === 'ERR_NETWORK') {
        errorMsg = "Network error. Please check your internet connection and try again.";
      } else if (err.response) {
        // Server responded with error
        errorMsg = err.response.data?.message || `Server error: ${err.response.status}`;
        console.error('Server error response:', err.response.data);
      } else if (err.request) {
        // Request made but no response
        errorMsg = "No response from server. The email might still be sent - please check your inbox.";
        console.error('No response received:', err.request);
      }

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
                        {error.includes('timed out') && (
                          <p className="text-xs text-red-600 mt-2">
                            💡 Tip: Check your email inbox anyway - the reset link might have been sent successfully.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ✅ INFO BOX - Show while loading */}
                {loading && (
                  <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Sending reset link...</p>
                        <p className="text-xs text-blue-700 mt-1">
                          This may take up to 30 seconds. Please wait.
                        </p>
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

                {/* ✅ DEBUG INFO - Only in development */}
                {import.meta.env.DEV && (
                  <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
                    <p><strong>Debug Info:</strong></p>
                    <p>API URL: {import.meta.env.VITE_API_URL}</p>
                    <p>Endpoint: /api/v1/users/forgot-password</p>
                  </div>
                )}
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

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      <strong>💡 Can't find the email?</strong>
                    </p>
                    <ul className="text-xs text-yellow-700 mt-2 space-y-1 text-left">
                      <li>• Check your spam/junk folder</li>
                      <li>• Wait a few minutes - emails can be delayed</li>
                      <li>• Make sure you entered the correct email</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      onClick={() => {
                        setEmailSent(false);
                        setEmail("");
                        setError(null);
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