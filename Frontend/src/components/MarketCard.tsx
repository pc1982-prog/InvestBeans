interface MarketCardProps {
  name: string;
  value: string;
  change: string;
  percentage: string;
  isPositive: boolean;
}

const MarketCard = ({ name, value, change, percentage, isPositive }: MarketCardProps) => {
  // Generate random data points for the line chart
  const dataPoints = Array.from({ length: 30 }, () => Math.random() * 40 + 30);
  
  // Create SVG path for line chart
  const createPath = (points: number[]) => {
    const width = 100;
    const height = 100;
    const xStep = width / (points.length - 1);
    
    const pathData = points.map((point, index) => {
      const x = index * xStep;
      const y = height - (point / 70) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return pathData;
  };

  const gradientId = `gradient-${name.replace(/\s+/g, "-")}`;

  return (
    <div className="group bg-card rounded-xl p-6 border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in gradient-card">
      <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{name}</h3>
      <p className="text-4xl font-bold text-foreground mb-1">{value}</p>
      <div className="flex items-center gap-3 mb-5">
        <span className={`font-semibold text-base ${isPositive ? "text-positive" : "text-negative"}`}>
          {change}
        </span>
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${isPositive ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"}`}>
          {percentage}
        </span>
      </div>
      {/* Line chart */}
      <div className="h-20 w-full relative overflow-hidden rounded-lg">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isPositive ? "hsl(var(--positive))" : "hsl(var(--negative))"} stopOpacity="0.4" />
              <stop offset="100%" stopColor={isPositive ? "hsl(var(--positive))" : "hsl(var(--negative))"} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d={createPath(dataPoints)}
            fill="none"
            stroke={isPositive ? "hsl(var(--positive-light))" : "hsl(var(--negative-light))"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />
          <path
            d={`${createPath(dataPoints)} L 100 100 L 0 100 Z`}
            fill={`url(#${gradientId})`}
          />
        </svg>
      </div>
    </div>
  );
};

export default MarketCard;
