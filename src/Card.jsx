import React from 'react';

export default function Card({ trade }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-semibold">{trade.symbol}</h2>
      <p>Action: {trade.action}</p>
      <p>Price: {trade.price}</p>
      <p>Result: {trade.result}</p>
    </div>
  );
}
