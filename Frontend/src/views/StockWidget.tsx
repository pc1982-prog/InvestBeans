import { useEffect, useState } from "react";
import axios from "axios";
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

  if (!data.length) return <p>Loading {symbol}...</p>;

  return (
    <div className="p-4 border rounded-lg bg-background/50">
      <h2 className="font-bold mb-2">{symbol} ({market})</h2>
      <p className="text-xl mb-2">₹ {latestPrice}</p>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={['dataMin', 'dataMax']} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockWidget;
