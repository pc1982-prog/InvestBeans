import { useEffect, useState } from "react";
import axios from "axios";
import { StockInfo } from "./types";

interface NSEStockTableProps {
  symbols: string[];
}

const API_KEY = "0ISQKTHNCW02QC5K";

const NSEStockTable: React.FC<NSEStockTableProps> = ({ symbols }) => {
  const [stockData, setStockData] = useState<StockInfo[]>([]);

  const fetchStockData = async () => {
    try {
      const allData: StockInfo[] = [];

      for (const symbol of symbols) {
        const res = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}.NS&interval=5min&apikey=${API_KEY}`
        );

        const timeSeriesKey = Object.keys(res.data).find((k) =>
          k.includes("Time Series")
        );
        const timeSeries = timeSeriesKey ? res.data[timeSeriesKey] : null;
        if (!timeSeries) continue;

        const latestTime = Object.keys(timeSeries)[0];
        const latest = timeSeries[latestTime];

        const lastPrice = parseFloat(latest["4. close"]);
        const open = parseFloat(latest["1. open"]);
        const high = parseFloat(latest["2. high"]);
        const low = parseFloat(latest["3. low"]);
        const change = lastPrice - open;
        const percentChange = (change / open) * 100;
        const volume = parseFloat(latest["5. volume"] || "0");

        allData.push({
          symbol,
          lastPrice,
          change,
          percentChange,
          volume,
          open,
          high,
          low,
        });
      }

      setStockData(allData);
    } catch (err) {
      console.error("Error fetching stock data:", err);
    }
  };

  useEffect(() => {
    fetchStockData();
    const interval = setInterval(fetchStockData, 60000);
    return () => clearInterval(interval);
  }, [symbols]);

  return (
    <div className="overflow-x-auto border rounded-lg p-4 bg-white shadow-md">
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">Last Price</th>
            <th className="px-4 py-2">Change</th>
            <th className="px-4 py-2">% Change</th>
            <th className="px-4 py-2">Volume</th>
            <th className="px-4 py-2">Open</th>
            <th className="px-4 py-2">High</th>
            <th className="px-4 py-2">Low</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((stock) => (
            <tr key={stock.symbol} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-bold">{stock.symbol}</td>
              <td className="px-4 py-2">{stock.lastPrice.toFixed(2)}</td>
              <td
                className={`px-4 py-2 ${
                  stock.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stock.change.toFixed(2)}
              </td>
              <td
                className={`px-4 py-2 ${
                  stock.percentChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stock.percentChange.toFixed(2)}%
              </td>
              <td className="px-4 py-2">{stock.volume}</td>
              <td className="px-4 py-2">{stock.open.toFixed(2)}</td>
              <td className="px-4 py-2">{stock.high.toFixed(2)}</td>
              <td className="px-4 py-2">{stock.low.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NSEStockTable;
