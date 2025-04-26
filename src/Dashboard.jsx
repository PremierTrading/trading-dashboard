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
        setTrades(data.trades);
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trading Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
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
