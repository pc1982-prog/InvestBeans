import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";

interface DummyChartProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  chartType: "line" | "bar" | "area";
  data?: number[];
}

const DummyChart = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  chartType = "line",
  data = [65, 70, 68, 75, 80, 78, 85, 82, 88, 90, 87, 92]
}: DummyChartProps) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;

  const getChartIcon = () => {
    switch (chartType) {
      case "line": return <TrendingUp className="w-4 h-4" />;
      case "bar": return <BarChart3 className="w-4 h-4" />;
      case "area": return <Activity className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const renderLineChart = () => {
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - minValue) / range) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-full h-24" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="2"
          points={points}
          className="drop-shadow-sm"
        />
      </svg>
    );
  };

  const renderBarChart = () => {
    return (
      <div className="flex items-end justify-between h-24 gap-1">
        {data.slice(-8).map((value, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t-sm transition-all duration-300 ${
              isPositive 
                ? 'bg-gradient-to-t from-green-200 to-green-400 hover:from-green-300 hover:to-green-500' 
                : 'bg-gradient-to-t from-red-200 to-red-400 hover:from-red-300 hover:to-red-500'
            }`}
            style={{ height: `${((value - minValue) / range) * 100}%` }}
          />
        ))}
      </div>
    );
  };

  const renderAreaChart = () => {
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - minValue) / range) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-full h-24" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="2"
          points={points}
          className="drop-shadow-sm"
        />
      </svg>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case "line": return renderLineChart();
      case "bar": return renderBarChart();
      case "area": return renderAreaChart();
      default: return renderLineChart();
    }
  };

  return (
    <div className="group bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-xl transition-all duration-500 p-6 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            {getChartIcon()}
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isPositive 
            ? 'bg-green-500/10 text-green-600 border border-green-200/50' 
            : 'bg-red-500/10 text-red-600 border border-red-200/50'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      </div>

      {/* Value */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </div>

      {/* Chart */}
      <div className="mb-4 bg-gradient-to-br from-background/50 to-background/30 rounded-lg p-3 border border-border/30">
        {renderChart()}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Last 24h</span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs">{isPositive ? 'Bullish' : 'Bearish'}</span>
        </div>
      </div>
    </div>
  );
};

export default DummyChart;
