import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "./components/ui/card.jsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs.jsx";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || "");
  const [authenticated, setAuthenticated] = useState(!!apiKey);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    if (authenticated && apiKey) {
      fetchTrades();
    }
  }, [authenticated, apiKey]);

  const fetchTrades = async () => {
    try {
      const res = await fetch(`https://tradingview-webhook-1.onrender.com/trades?key=${apiKey}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTrades(data);
      } else {
        console.error("Unexpected response:", data);
        setTrades([]);
      }
    } catch (err) {
      console.error("Failed to fetch trades:", err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("https://tradingview-webhook-1.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('apiKey', data.api_key);
        setApiKey(data.api_key);
        setAuthenticated(true);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error during login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('apiKey');
    setAuthenticated(false);
    setApiKey("");
    setEmail("");
    setPassword("");
    setTrades([]);
  };

  const totalTrades = trades.length;
  const winners = trades.filter(t => t.result === "win");
  const losers = trades.filter(t => t.result === "loss");
  const winRate = totalTrades ? ((winners.length / totalTrades) * 100).toFixed(2) : 0;
  const pnl = trades.reduce((acc, t) => acc + (t.result === "win" ? 100 : -50), 0);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg p-6 rounded w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4 text-center">Login to Dashboard</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Trading Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={fetchTrades}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      </div>

      {trades.length === 0 ? (
        <p className="text-gray-500">No trades found or still loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card><CardContent className="p-4"><h2 className="font-semibold">Total P&L</h2><p className="text-lg">${pnl}</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="font-semibold">Win Rate</h2><p className="text-lg">{winRate}%</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="font-semibold">Total Trades</h2><p className="text-lg">{totalTrades}</p></CardContent></Card>
            <Card><CardContent className="p-4"><h2 className="font-semibold">Winners / Losers</h2><p className="text-lg">{winners.length} / {losers.length}</p></CardContent></Card>
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

