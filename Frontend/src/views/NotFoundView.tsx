import { Link } from "react-router-dom";
import { useTheme } from "@/controllers/Themecontext";

const NotFoundView = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`flex min-h-screen items-center justify-center ${isLight ? "bg-[#f5f4f0]" : "bg-slate-950/95"}`}>
      <div className="text-center">
        <h1 className={`mb-4 text-4xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>404</h1>
        <p className={`mb-4 text-xl ${isLight ? "text-gray-500" : "text-white/60"}`}>Oops! Page not found</p>
        <Link to="/" className="text-[#5194F6] underline hover:text-[#3a7de0] transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundView;