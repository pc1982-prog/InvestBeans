import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import StockWidget from "./StockWidget";

const DashboardView: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/"); // Redirect to home page
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 bg-[#101527]">
      {/* Back to Dashboard button */}
      <div className="mb-4 sm:mb-6">
        <Button
          onClick={handleBackToDashboard}
          className="bg-gradient-to-r from-[#5194F6] to-[#3a7de0] text-white hover:opacity-90 font-semibold transition-all shadow-md hover:shadow-lg hover:shadow-[#5194F6]/25 hover:scale-105"
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-white">
          Live Stock Dashboard
        </h1>
        <p className="text-white/50 mb-6 text-sm sm:text-base">
          Real-time NSE & US stock data.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <StockWidget symbol="RELIANCE" market="NSE" />
          <StockWidget symbol="TCS" market="NSE" />
          <StockWidget symbol="AAPL" market="US" />
          <StockWidget symbol="TSLA" market="US" />
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default DashboardView;