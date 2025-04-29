import React from 'react';

export default function Card({ trade }) {
  // Format the timestamp to a human-readable date
  const formattedDate = new Date(trade.timestamp).toLocaleString();

  return (
    <div className="bg-white shadow-md rounded p-4 m-2">
      <h2 className="text-xl font-bold">{trade.symbol}</h2>
      <p><strong>Action:</strong> {trade.action}</p>
      <p><strong>Entry Price:</strong> {trade.entry_price}</p>
      <p><strong>Exit Price:</strong> {trade.exit_price}</p>
      <p><strong>Direction:</strong> {trade.direction}</p>
      <p><strong>Result:</strong> {trade.result}</p>
      <p><strong>PnL:</strong> {trade.pnl}</p>
      <p><strong>Date:</strong> {formattedDate}</p>
    </div>
  );
}
