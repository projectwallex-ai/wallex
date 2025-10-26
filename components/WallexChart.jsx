'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ethers } from 'ethers';
import { getProvider, getContract } from '../lib/ethers';
import { WALXUSD_ADDRESS, WALXUSD_ABI, DECIMALS } from '../lib/contract';

export default function WallexChart() {
  const [data, setData] = useState([]);

  async function fetchSupplyHistory() {
    try {
      const provider = getProvider();
      const contract = getContract(provider);

      // Fetch total supply and timestamp from latest block
      const latestBlock = await provider.getBlockNumber();
      const block = await provider.getBlock(latestBlock);
      const totalSupply = await contract.totalSupply();

      const newPoint = {
        time: new Date(block.timestamp * 1000).toLocaleTimeString(),
        supply: parseFloat(ethers.formatUnits(totalSupply, DECIMALS))
      };

      // Keep only latest 20 data points
      setData(prev => {
        const updated = [...prev, newPoint].slice(-20);
        return updated;
      });
    } catch (e) {
      console.error('fetchSupplyHistory', e);
    }
  }

  useEffect(() => {
    fetchSupplyHistory();
    const interval = setInterval(fetchSupplyHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card p-5 mt-6">
      <h3 className="text-xl font-semibold text-cyan-400 mb-3">WALXUSD Growth Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#0e223d" />
          <XAxis dataKey="time" stroke="#7dd3fc" />
          <YAxis stroke="#7dd3fc" domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ backgroundColor: '#071620', border: '1px solid #1e3a8a', color: '#fff' }}
            labelStyle={{ color: '#a5b4fc' }}
          />
          <Line
            type="monotone"
            dataKey="supply"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={{ fill: '#38bdf8' }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
