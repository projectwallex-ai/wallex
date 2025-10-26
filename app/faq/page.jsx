'use client';
import { useState } from 'react';

const FAQS = [
  { q: 'How do I mint WALXUSD?', a: 'Connect wallet, approve USDT, then mint via the dashboard.' },
  { q: 'What is the redemption fee?', a: '0.25% is charged on redemption to the treasury.' },
  { q: 'Is WALXUSD fully backed?', a: 'Yes — minted only after USDT is deposited to the contract.' }
];

export default function FAQPage(){
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold accent mb-4">FAQ</h1>
      {FAQS.map((f,i)=>(
        <div key={i} className="card p-4">
          <button onClick={()=>setOpen(open===i?null:i)} className="w-full text-left font-semibold">{f.q}</button>
          {open===i && <p className="small-muted mt-2">{f.a}</p>}
        </div>
      ))}
    </div>
  )
}
