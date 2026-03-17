import { Link } from "react-router-dom";

const NotFoundView = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950/95">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">404</h1>
        <p className="mb-4 text-xl text-white/60">Oops! Page not found</p>
        <Link to="/" className="text-[#5194F6] underline hover:text-[#7ab8fa]">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundView;