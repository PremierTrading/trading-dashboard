import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "./components/ui/card.jsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs.jsx";

export default function Dashboard() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    fetch("https://tradingview-webhook-1.onrender.com/trades")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Trades fetched:", data);
        if (Array.isArray(data)) {
          setTrades(data);
        } else {
          setTrades([]);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch trades:", err);
        setTrades([]);
      });
  }, []);

  const totalTrades = trades.length;
  const winners = trades.filter(t => t.result === "win");
  const losers = trades.filter(t => t.result === "loss");
  const winRate = totalTrades ? ((winners.length / totalTrades) * 100).toFixed(2) : 0;
  const pnl = trades.reduce((acc, t) => acc + (t.result === "win" ? 100 : -50), 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Trading Dashboard</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => {
            if (window.confirm("Are you sure you want to clear all trades? This cannot be undone.")) {
              fetch("https://tradingview-webhook-1.onrender.com/reset", {
                method: "POST"
              })
                .then(() => {
                  console.log("🔁 Trades cleared");
                  setTrades([]);
                })
                .catch((err) => {
                  console.error("Failed to reset trades:", err);
                });
            }
          }}
        >
          Clear Trades
        </button>
      </div>

      {trades.length === 0 ? (
        <p className="text-gray-500">No trades found or still loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold">Total P&L</h2>
                <p className="text-lg">${pnl}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold">Win Rate</h2>
                <p className="text-lg">{winRate}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold">Total Trades</h2>
                <p className="text-lg">{totalTrades}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold">Winners / Losers</h2>
                <p className="text-lg">{winners.length} / {losers.length}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">All Trades</TabsTrigger>
              <TabsTrigger value="winners">Winners</TabsTrigger>
              <TabsTrigger value="losers">Losers</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ul className="space-y-2">
                {trades.map((trade, index) => (
                  <li key={index} className="p-2 border rounded">
                    {trade.symbol} - {trade.action} @ {trade.price} ({trade.result})
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="winners">
              <ul className="space-y-2">
                {winners.map((trade, index) => (
                  <li key={index} className="p-2 border rounded">
                    {trade.symbol} - {trade.action} @ {trade.price}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="losers">
              <ul className="space-y-2">
                {losers.map((trade, index) => (
                  <li key={index} className="p-2 border rounded">
                    {trade.symbol} - {trade.action} @ {trade.price}
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
