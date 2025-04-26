import React from 'react';

export default function Card({ trade }) {
  return (
    <div className="bg-white shadow-md rounded p-4 m-2">
      <h2 className="text-xl font-bold">{trade.symbol}</h2>
      <p>Action: {trade.action}</p>
      <p>Price: {trade.price}</p>
      <p>Result: {trade.result}</p>
    </div>
  );
}
