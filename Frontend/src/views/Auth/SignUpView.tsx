import { FormEvent, useState } from "react";
import { useAuth } from "@/controllers/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Mail, User, Eye, EyeOff, Loader2 } from "lucide-react";

const SignUpView = () => {
  const { signUp, loginWithGoogle } = useAuth(); // ✅ loginWithGoogle (not signInWithGoogle)
  const navigate = useNavigate();

  const [name, setName] = useState("");
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
      await signUp(name, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.message ?? "Unable to create account. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setError(null);
    setGoogleLoading(true);
    
    // This will redirect, so no try-catch needed
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          {/* Logo & Heading */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-primary tracking-tight">INVESTBEANS</h1>
            <p className="text-muted-foreground mt-2 text-base">Create your account and start investing</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-lg mb-6 text-center font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-11 h-12 text-base"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-11 h-12 text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="pr-12 h-12 text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition disabled:opacity-50"
                  disabled={loading || googleLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use 8+ characters with letters, numbers & symbols
              </p>
            </div>

            {/* Sign Up Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 text-base font-semibold"
              disabled={loading || googleLoading}
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

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">Or sign up with</span>
            </div>
          </div>

          {/* Google Button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 flex items-center justify-center gap-3 font-medium"
            onClick={handleGoogleSignUp}
            type="button"
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting to Google...
              </>
            ) : (
              <>
                <FcGoogle className="h-6 w-6" />
                Continue with Google
              </>
            )}
          </Button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/signin" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-10">
          © 2025 INVESTBEANS • Secure • Regulated • Trusted
        </p>
      </div>
    </div>
  );
};

export default SignUpView;