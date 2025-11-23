import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NotFoundView from "@/views/NotFoundView";

const NotFoundController = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return <NotFoundView />;
};

export default NotFoundController;


