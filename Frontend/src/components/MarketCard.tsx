// ============================================================
// MarketCard.tsx — MOBILE PERFECT + RESPONSIVE + PROFESSIONAL
// ============================================================

interface MarketCardProps {
  name: string;
  value: string;
  change: string;
  percentage: string;
  isPositive: boolean;
}

const MarketCard = ({ name, value, change, percentage, isPositive }: MarketCardProps) => {
  // Random sparkline data (same as before)
  const dataPoints = Array.from({ length: 30 }, () => Math.random() * 40 + 30);

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
    <div className="group bg-card rounded-2xl p-4 sm:p-6 border border-border/70 hover:border-primary/40 hover:shadow-lg transition-all duration-300 min-w-0 overflow-hidden">
      {/* Name */}
      <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-widest truncate">
        {name}
      </h3>

      {/* Value — RESPONSIVE FONT SIZE */}
      <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tighter break-all leading-none mb-3">
        {value}
      </p>

      {/* Change */}
      <div className="flex items-center gap-3">
        <span className={`font-semibold text-base sm:text-lg ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
          {change}
        </span>
        <span
          className={`px-3 py-0.5 rounded-full text-xs sm:text-sm font-medium ${
            isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
          }`}
        >
          {percentage}
        </span>
      </div>

      {/* Sparkline Chart */}
      <div className="h-16 sm:h-20 mt-4 -mx-1 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.35" />
              <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d={createPath(dataPoints)}
            fill="none"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
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