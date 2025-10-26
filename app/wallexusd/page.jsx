'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ethers } from 'ethers';
import { FaCoins, FaUniversity, FaUsers } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import StatCard from '../../components/StatCard';
import {
  WALXUSD_ADDRESS,
  WALXUSD_ABI,
  USDT_ADDRESS,
  ERC20_ABI,
  DECIMALS,
} from '../../lib/contract';
import { getProvider, getContract, getERC20 } from '../../lib/ethers';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function shortAddr(a) {
  return a ? a.slice(0, 6) + '...' + a.slice(-4) : '';
}

export default function WallexUSDPage() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [totalMinted, setTotalMinted] = useState(null);
  const [collateral, setCollateral] = useState(null);
  const [holders, setHolders] = useState(0);
  const [userBal, setUserBal] = useState('0');
  const [usdtBal, setUsdtBal] = useState('0');
  const [bnbBal, setBnbBal] = useState('0');
  const [allowance, setAllowance] = useState('0');
  const [amount, setAmount] = useState('');
  const [growth, setGrowth] = useState(0);
  const [chartData, setChartData] = useState([]);
  const intervalRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  // Provider
  useEffect(() => {
    const p = getProvider();
    setProvider(p);
  }, []);

  // Connect MetaMask
  async function connectWallet() {
    if (!window.ethereum) return alert('MetaMask not installed');
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const p = new ethers.BrowserProvider(window.ethereum);
      const s = await p.getSigner();
      const addr = await s.getAddress();
      setProvider(p);
      setSigner(s);
      setAccount(addr);
    } catch (e) {
      console.error(e);
      alert('Could not connect MetaMask');
    }
  }

  // Load stats
  async function loadStats() {
    try {
      const p = provider || getProvider();
      const contract = getContract(p);
      const [supply, coll] = await Promise.all([
        contract.totalSupply(),
        contract.collateralBalance(),
      ]);
      const minted = Number(ethers.formatUnits(supply, DECIMALS));
      const collateralVal = Number(ethers.formatUnits(coll, DECIMALS));
      setTotalMinted(minted.toString());
      setCollateral(collateralVal.toString());

      setChartData((prev) => {
        const updated = [...prev.slice(-9), minted];
        if (updated.length > 1) {
          const diff = minted - updated[updated.length - 2];
          const perc = ((diff / updated[updated.length - 2]) * 100).toFixed(2);
          setGrowth(isNaN(perc) ? 0 : perc);
        }
        return updated;
      });
    } catch (e) {
      console.error('loadStats', e);
    }
  }

  // Fetch holders from logs
  async function fetchHolders() {
    try {
      const p = provider || getProvider();
      const iface = new ethers.Interface(WALXUSD_ABI);
      const latest = await p.getBlockNumber();
      const fromBlock = Math.max(latest - 100000, 0);
      const logs = await p.getLogs({
        address: WALXUSD_ADDRESS,
        fromBlock,
        toBlock: latest,
      });
      const addresses = new Set();
      logs.forEach((log) => {
        try {
          const parsed = iface.parseLog(log);
          if (parsed.name === 'Transfer') {
            addresses.add(parsed.args.from);
            addresses.add(parsed.args.to);
          }
        } catch {}
      });
      setHolders(addresses.size);
    } catch (err) {
      console.error('fetchHolders', err);
    }
  }

  async function loadUserBalances(addr) {
    try {
      const p = provider || getProvider();
      const contract = getContract(p);
      const usdt = getERC20(USDT_ADDRESS, p);

      const bnbBalRaw = await p.getBalance(addr);
      setBnbBal(Number(ethers.formatEther(bnbBalRaw)).toFixed(4));

      const bal = await contract.balanceOf(addr);
      setUserBal(Number(ethers.formatUnits(bal, DECIMALS)).toFixed(2));

      const ub = await usdt.balanceOf(addr);
      setUsdtBal(Number(ethers.formatUnits(ub, DECIMALS)).toFixed(2));

      const al = await usdt.allowance(addr, WALXUSD_ADDRESS);
      setAllowance(Number(ethers.formatUnits(al, DECIMALS)).toFixed(2));
    } catch (e) {
      console.error('loadUserBalances', e);
    }
  }

  // Auto-refresh
  useEffect(() => {
    loadStats();
    fetchHolders();
    if (account) loadUserBalances(account);
    intervalRef.current = setInterval(() => {
      loadStats();
      fetchHolders();
      if (account) loadUserBalances(account);
    }, 10000);
    return () => clearInterval(intervalRef.current);
  }, [provider, account]);

  // Approve / Mint / Redeem
  async function handleAction(type) {
    if (!signer) return alert('Connect MetaMask first');
    try {
      const amt = ethers.parseUnits(amount || '0', DECIMALS);

      if (type === 'approve') {
        const erc = getERC20(USDT_ADDRESS, signer);
        const tx = await erc.approve(WALXUSD_ADDRESS, amt);
        await tx.wait();
        alert('Approved successfully');
      }

      if (type === 'mint') {
        const contract = getContract(signer);
        const tx = await contract.mint(amt);
        await tx.wait();
        alert('Mint successful');
      }

      if (type === 'redeem') {
        const contract = getContract(signer);
        const tx = await contract.redeem(amt);
        await tx.wait();
        alert('Redeem successful');
      }

      loadStats();
      loadUserBalances(account);
    } catch (e) {
      console.error(e);
      alert('Transaction failed');
    }
  }

  const faqItems = [
    {
      q: 'How does WALXUSD stay stable?',
      a: 'Each WALXUSD is backed 1:1 by USDT in the Wallex smart contract, ensuring transparency and full collateralization.',
    },
    {
      q: 'Who can mint WALXUSD?',
      a: 'Anyone with BSC-USDT and MetaMask connected wallet can mint directly on-chain using our decentralized app.',
    },
    {
      q: 'Is there any fee?',
      a: 'Only a 0.25% fee applies during redemption — minting and holding WALXUSD is completely free.',
    },
    {
      q: 'What makes WallexUSD unique?',
      a: 'WallexUSD is governed by the Wallex community and built for sustainable, transparent, and decentralized growth.',
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-indigo-900 via-[#081f38] to-sky-900 rounded-xl p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <img
            src="/wallex-coin.png"
            alt="WallexUSD Coin"
            className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-lg border-2 border-cyan-300"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">WallexUSD (WALXUSD)</h1>
            <p className="text-gray-300 max-w-2xl leading-relaxed">
              <strong>WALXUSD</strong> is a next-generation stablecoin, backed 1:1 by BSC-USDT.
              Mint with USDT, redeem anytime with a 0.25% fee — built for transparency and
              stability by the <strong>Wallex DeFi</strong> community.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid md:grid-cols-4 gap-4">
        <StatCard icon={<FaCoins />} label="Total Minted" value={totalMinted ? `${totalMinted} WALXUSD` : '—'} />
        <StatCard icon={<FaUniversity />} label="Collateral (USDT)" value={collateral ? `${collateral} USDT` : '—'} />
        <StatCard icon={<FaUsers />} label="Total Holders" value={holders || '—'} />
        <StatCard icon={<FaUsers />} label="Your Balance" value={`${userBal} WALXUSD`} />
      </section>

      {/* Wallet + Chart */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* Wallet */}
        <div className="bg-[#0b1e33]/60 backdrop-blur-lg border border-[#10304f] p-6 rounded-xl shadow-lg">
          <h3 className="font-semibold text-lg mb-4 text-cyan-400">Wallet Actions</h3>
          {!account ? (
            <button
              onClick={connectWallet}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow hover:opacity-90 text-white font-semibold"
            >
              Connect MetaMask
            </button>
          ) : (
            <>
              <div className="text-sm text-gray-400 mb-4">
                Connected: <span className="text-cyan-400">{shortAddr(account)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="bg-[#071620] p-3 rounded-lg border border-[#10304f]">
                  <div className="text-gray-400">BNB</div>
                  <div className="text-cyan-400 font-semibold">{bnbBal}</div>
                </div>
                <div className="bg-[#071620] p-3 rounded-lg border border-[#10304f]">
                  <div className="text-gray-400">USDT</div>
                  <div className="text-cyan-400 font-semibold">{usdtBal}</div>
                </div>
                <div className="bg-[#071620] p-3 rounded-lg border border-[#10304f] col-span-2">
                  <div className="text-gray-400">USDT Allowance</div>
                  <div className="text-cyan-400 font-semibold">{allowance}</div>
                </div>
              </div>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 mb-4 rounded-lg bg-[#071620] text-white border border-[#10304f] focus:outline-none focus:border-cyan-400"
                placeholder="Enter amount"
              />
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleAction('approve')}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 py-2 rounded font-semibold"
                >
                  Approve USDT
                </button>
                <button
                  onClick={() => handleAction('mint')}
                  className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold"
                >
                  Mint WALXUSD
                </button>
                <button
                  onClick={() => handleAction('redeem')}
                  className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-semibold"
                >
                  Redeem USDT
                </button>
              </div>
            </>
          )}
        </div>

        {/* Chart */}
        <div className="bg-[#0b1e33]/60 backdrop-blur-lg border border-[#10304f] p-6 rounded-xl shadow-lg">
          <h3 className="font-semibold text-lg mb-4 text-cyan-400">WALXUSD Growth</h3>
          <div className="h-[240px]">
            <Line
              data={{
                labels: chartData.map((_, i) => `T-${chartData.length - i}`),
                datasets: [
                  {
                    label: 'Supply',
                    data: chartData,
                    borderColor: '#00FFC6',
                    backgroundColor: 'rgba(0,255,198,0.2)',
                    tension: 0.35,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: '#bbb' }, grid: { color: '#0c314d' } },
                  y: { ticks: { color: '#bbb' }, grid: { color: '#0c314d' } },
                },
              }}
            />
          </div>
          <div
            className={`mt-3 text-sm font-semibold ${
              growth >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            WALXUSD {growth >= 0 ? '+' : ''}
            {growth}% today
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gradient-to-r from-[#0a192f] via-[#10243e] to-[#0a192f] border border-[#10304f] rounded-xl shadow-xl p-6">
        <h3 className="text-cyan-400 font-semibold text-lg mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="bg-[#071620] rounded-lg border border-[#10304f] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-200 font-medium hover:text-cyan-300"
              >
                <span>{item.q}</span>
                <span className="text-cyan-400">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3 text-gray-400 text-sm border-t border-[#10304f]">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
