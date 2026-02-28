import { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "@/controllers/Themecontext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface StockWidgetProps {
  symbol: string;
  market: "NSE" | "US";
}

interface StockData {
  time: string;
  price: number;
}

const StockWidget: React.FC<StockWidgetProps> = ({ symbol, market }) => {
  const [data, setData] = useState<StockData[]>([]);
  const [latestPrice, setLatestPrice] = useState<number | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const API_KEY = import.meta.env.API_KEY;

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const url =
          market === "NSE"
            ? `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}.NS&interval=5min&apikey=${API_KEY}`
            : `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`;

        const res = await axios.get(url);
        const timeSeriesKey = Object.keys(res.data).find((k) =>
          k.includes("Time Series")
        );
        const timeSeries = timeSeriesKey ? res.data[timeSeriesKey] : null;

        if (!timeSeries) return;

        const formattedData: StockData[] = Object.entries(timeSeries).map(
          ([time, values]) => ({
            time: time.split(" ")[1],
            price: parseFloat((values as any)["4. close"]),
          })
        ).reverse();

        setData(formattedData);
        setLatestPrice(formattedData[formattedData.length - 1].price);
      } catch (err) {
        console.error("Error fetching stock data:", err);
      }
    };

    fetchStock();
    const interval = setInterval(fetchStock, 60000);
    return () => clearInterval(interval);
  }, [symbol, market]);

  if (!data.length)
    return (
      <p className={isLight ? "text-navy" : "text-white"}>
        Loading {symbol}...
      </p>
    );

  return (
    <div
      className="p-4 border rounded-lg bg-background/50"
      style={{
        borderColor: isLight ? "rgba(13,37,64,0.15)" : "rgba(255,255,255,0.10)",
      }}
    >
      <h2 className={`font-bold mb-2 ${isLight ? "text-navy" : "text-white"}`}>
        {symbol} ({market})
      </h2>
      <p className={`text-xl mb-2 ${isLight ? "text-navy" : "text-white"}`}>
        ₹ {latestPrice}
      </p>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <CartesianGrid stroke={isLight ? "#cbd5e1" : "#334155"} />
          <XAxis
            dataKey="time"
            tick={{ fill: isLight ? "#0d2540" : "#94a3b8", fontSize: 11 }}
          />
          <YAxis
            domain={["dataMin", "dataMax"]}
            tick={{ fill: isLight ? "#0d2540" : "#94a3b8", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: isLight ? "#ffffff" : "#0e2038",
              border: isLight ? "1px solid rgba(13,37,64,0.15)" : "1px solid rgba(255,255,255,0.10)",
              borderRadius: "8px",
              color: isLight ? "#0d2540" : "#ffffff",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockWidget;