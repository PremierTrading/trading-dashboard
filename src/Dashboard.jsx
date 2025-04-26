import React, { useEffect, useState } from 'react';
import Card from './Card';
import Tabs from './Tabs';

const backendUrl = "https://tradingview-webhook-7lbp.onrender.com"; // ✅ Your backend

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');

  useEffect(() => {
    if (!apiKey) {
      setLoading(false);
      return;
    }

    const fetchTrades = async () => {
      try {
        const response = await fetch(`${backendUrl}/trades?key=${apiKey}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trades');
        }
        const data = await response.json();
        setTrades(data);
      } catch (error) {
        console.error('Error fetching trades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, [apiKey]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('apiKey', data.api_key);
        setApiKey(data.api_key);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('apiKey');
    setApiKey('');
    setTrades([]);
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl mb-4 font-bold text-center">Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    );
  }

  // 🧮 Calculate stats
  let netPL = 0;
  let wins = 0;
  let losses = 0;

  for (const trade of trades) {
    if (typeof trade.pnl === 'number') {
      netPL += trade.pnl;
      if (trade.pnl > 0) wins += 1;
      else if (trade.pnl < 0) losses += 1;
    }
  }

  const totalTrades = wins + losses;
  const winRate = totalTrades > 0 ? (wins / totalTrades * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trading Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* 📈 New stats section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-bold">Net P&L</h2>
          <p className={netPL >= 0 ? "text-green-600 text-xl" : "text-red-600 text-xl"}>
            {netPL.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-bold">Win %</h2>
          <p className="text-xl">{winRate}%</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-bold">Wins</h2>
          <p className="text-xl">{wins}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-bold">Losses</h2>
          <p className="text-xl">{losses}</p>
        </div>
      </div>

      {/* Existing trades display */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : trades.length === 0 ? (
        <div className="text-center">No trades found.</div>
      ) : (
        <Tabs>
          {trades.map((trade, index) => (
            <Card key={index} trade={trade} />
          ))}
        </Tabs>
      )}
    </div>
  );
}

