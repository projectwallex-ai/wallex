'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ethers } from 'ethers';
import { FaCoins, FaUniversity, FaUsers } from 'react-icons/fa';
import StatCard from '../../components/StatCard';
import { WALXUSD_ADDRESS, WALXUSD_ABI, USDT_ADDRESS, ERC20_ABI, DECIMALS } from '../../lib/contract';
import { getProvider, getContract, getERC20 } from '../../lib/ethers';

function shortAddr(a){ return a ? a.slice(0,6)+'...'+a.slice(-4):''; }

export default function WallexUSDPage(){
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [totalMinted, setTotalMinted] = useState(null);
  const [collateral, setCollateral] = useState(null);
  const [userBal, setUserBal] = useState('0');
  const [amount, setAmount] = useState('');
  const [events, setEvents] = useState([]);
  const intervalRef = useRef(null);

  // init provider (fallback to RPC if metamask not present)
  useEffect(()=>{
    const p = getProvider();
    setProvider(p);
  },[]);

  // connect MetaMask
  async function connectMetaMask(){
    if(!window.ethereum) return alert('MetaMask not installed');
    try{
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const p = new ethers.BrowserProvider(window.ethereum);
      const s = await p.getSigner();
      const addr = await s.getAddress();
      setProvider(p);
      setSigner(s);
      setAccount(addr);
    }catch(e){ console.error(e); alert('Could not connect MetaMask') }
  }

  // load stats
  async function loadStats(){
    try{
      const p = provider || getProvider();
      const contract = getContract(p);
      const [supply, coll] = await Promise.all([
        contract.totalSupply(),
        contract.collateralBalance()
      ]);
      setTotalMinted(Number(ethers.formatUnits(supply, DECIMALS)).toString());
      setCollateral(Number(ethers.formatUnits(coll, DECIMALS)).toString());
    }catch(e){ console.error('loadStats', e) }
  }

  // load user balance
  async function loadUserBalance(addr){
    try{
      const p = provider || getProvider();
      const contract = getContract(p);
      if(!addr) return setUserBal('0');
      const b = await contract.balanceOf(addr);
      setUserBal(Number(ethers.formatUnits(b, DECIMALS)).toString());
    }catch(e){ console.error(e) }
  }

  // fetch events (last 10) - using provider.getLogs
  async function loadEvents(){
    try{
      const p = provider || getProvider();
      const iface = new ethers.Interface(WALXUSD_ABI);
      const latest = await p.getBlockNumber();
      const fromBlock = latest - 5000 > 0 ? latest - 5000 : 0;
      const logs = await p.getLogs({ address: WALXUSD_ADDRESS, fromBlock, toBlock: latest });
      const parsed = logs.map(l => {
        try { return iface.parseLog(l); } catch(e){ return null; }
      }).filter(Boolean).slice(-10).reverse();
      setEvents(parsed.map(p=>({ name: p.name, args: p.args })));
    }catch(e){ console.error('loadEvents', e) }
  }

  // auto-refresh every 10s
  useEffect(()=>{
    loadStats();
    loadEvents();
    if(account) loadUserBalance(account);
    intervalRef.current = setInterval(()=>{
      loadStats();
      loadEvents();
      if(account) loadUserBalance(account);
    }, 10000);
    return ()=>clearInterval(intervalRef.current);
  },[provider, account]);

  // approve USDT
  async function handleApprove(){
    try{
      if(!signer) return alert('Connect MetaMask first');
      const erc = getERC20(USDT_ADDRESS, signer);
      const amt = ethers.parseUnits(amount || '0', DECIMALS);
      const tx = await erc.approve(WALXUSD_ADDRESS, amt);
      await tx.wait();
      alert('Approved');
    }catch(e){ console.error(e); alert('Approve failed'); }
  }

  // mint
  async function handleMint(){
    try{
      if(!signer) return alert('Connect MetaMask first');
      const contract = getContract(signer);
      const amt = ethers.parseUnits(amount || '0', DECIMALS);
      const tx = await contract.mint(amt);
      await tx.wait();
      alert('Mint successful');
      loadStats(); loadUserBalance(account); loadEvents();
    }catch(e){ console.error(e); alert('Mint failed'); }
  }

  // redeem
  async function handleRedeem(){
    try{
      if(!signer) return alert('Connect MetaMask first');
      const contract = getContract(signer);
      const amt = ethers.parseUnits(amount || '0', DECIMALS);
      const tx = await contract.redeem(amt);
      await tx.wait();
      alert('Redeem successful');
      loadStats(); loadUserBalance(account); loadEvents();
    }catch(e){ console.error(e); alert('Redeem failed'); }
  }

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="text-2xl font-semibold accent">What is WallexUSD (WALXUSD)?</h2>
        <p className="small-muted mt-2">WALXUSD is a fully-collateralized stablecoin minted 1:1 against BSC-USDT. Users deposit USDT to mint WALXUSD; redemption returns USDT minus a 0.25% fee to treasury.</p>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <StatCard icon={<FaCoins/>} label="Total Minted" value={totalMinted ? `${totalMinted} WALXUSD` : '—'} />
        <StatCard icon={<FaUniversity/>} label="Collateral (USDT)" value={collateral ? `${collateral} USDT` : '—'} />
        <StatCard icon={<FaUsers/>} label="Your WALXUSD" value={`${userBal} WALXUSD`} />
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 card">
          <h3 className="font-semibold">Wallet</h3>
          {account ? (
            <div className="mt-3">
              <div className="small-muted">Address</div>
              <div className="font-mono text-sm mt-1">{shortAddr(account)}</div>
              <div className="small-muted mt-3">MetaMask connected</div>
            </div>
          ) : (
            <div className="mt-3 small-muted">Not connected</div>
          )}

          <div className="mt-4">
            <button onClick={connectMetaMask} className="w-full bg-indigo-600 py-2 rounded mb-3">Connect MetaMask</button>
            <label className="small-muted">Amount (WALXUSD)</label>
            <input value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full mt-2 p-2 rounded bg-[#071620] text-white" placeholder="e.g. 10" />
            <div className="flex gap-2 mt-3">
              <button onClick={handleApprove} className="flex-1 bg-indigo-600 py-2 rounded">Approve USDT</button>
              <button onClick={handleMint} className="flex-1 bg-green-600 py-2 rounded">Mint</button>
            </div>
            <button onClick={handleRedeem} className="w-full mt-3 bg-red-600 py-2 rounded">Redeem</button>
          </div>
        </div>

        <div className="md:col-span-2 card">
          <h3 className="font-semibold mb-3">How WALXUSD Works</h3>
          <p className="small-muted">Deposit USDT to the WALXUSD contract → the contract mints WALXUSD tokens to your wallet at 1:1. To redeem, burn WALXUSD and receive USDT minus the 0.25% fee.</p>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Recent activity (last 10)</h4>
            <div className="space-y-2 small-muted">
              {events.length===0 && <div>No recent events found in last 5k blocks</div>}
              {events.map((e,i)=>(
                <div key={i} className="p-2 border border-gray-700 rounded">
                  <div className="text-sm font-semibold">{e.name}</div>
                  <div className="text-xs">Args: {JSON.stringify(Object.fromEntries(Object.entries(e.args).filter(([k])=>isNaN(Number(k)))))}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="card p-4">
        <h3 className="font-semibold">FAQs</h3>
        <div className="mt-3 small-muted">
          <p><strong>Minting:</strong> Approve USDT first, then Mint.</p>
          <p className="mt-2"><strong>Redemption fee:</strong> 0.25% goes to treasury.</p>
        </div>
      </section>
    </div>
  )
}
