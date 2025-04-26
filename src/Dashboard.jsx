import React, { useEffect, useState } from 'react';
import Card from './Card';
import Tabs from './Tabs'; // ✅ Correct capitalization here!

const backendUrl = "https://tradingview-webhook-7lbp.onrender.com";

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const apiKey = localStorage.getItem('apiKey');
        if (!apiKey) {
          console.error('API Key not found. Please log in again.');
          setLoading(false);
          return;
        }

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('apiKey');
    window.location.reload();
  };

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
        <div className="text-center">No trades found or still loading...</div>
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

