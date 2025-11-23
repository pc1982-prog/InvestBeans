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
      <div className="container mx-auto px-6 py-10">
      {/* Back to Dashboard button */}
      <div className="mb-4">
        <Button
          onClick={handleBackToDashboard}
          className="bg-accent text-white hover:bg-white hover:text-navy font-semibold transition-all shadow-md hover:shadow-lg hover:scale-105"
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2">
          Live Stock Dashboard
        </h1>
        <p className="text-muted-foreground mb-6">
          Real-time NSE & US stock data.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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