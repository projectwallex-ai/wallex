'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Coins, Shield, Globe, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Powering the Future of Decentralized Finance
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            Wallex (WALX) — a next-generation DeFi ecosystem redefining
            stability, liquidity, and global accessibility through innovation and transparency.
          </p>

          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/wallexusd"
              className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition flex items-center gap-2"
            >
              Explore WallexUSD <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://dapp.wallex.com"
              target="_blank"
              className="px-6 py-3 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-500 hover:text-black transition"
            >
              Join the Ecosystem
            </a>
          </div>
        </motion.div>

        {/* Decorative glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-500/5 to-transparent blur-3xl pointer-events-none" />
      </section>

      {/* About Wallex */}
      <section className="py-24 px-6 md:px-16 bg-[#0b1120]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Image
              src="/walx-coin.png"
              alt="Wallex Coin"
              width={350}
              height={350}
              className="mx-auto drop-shadow-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              What is Wallex (WALX)?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Wallex (WALX) is a decentralized financial solution built to merge
              traditional stability with blockchain innovation. It enables a
              borderless, transparent, and secure financial ecosystem powered by
              smart contracts and backed by real collateral.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-[#1e293b] p-4 rounded-xl border border-yellow-600/30">
                <Coins className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
                <h4 className="font-semibold">WALX</h4>
                <p className="text-xs text-gray-400">Native Governance Token</p>
              </div>
              <div className="bg-[#1e293b] p-4 rounded-xl border border-yellow-600/30">
                <Shield className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
                <h4 className="font-semibold">WALXUSD</h4>
                <p className="text-xs text-gray-400">Stablecoin 1:1 USDT</p>
              </div>
              <div className="bg-[#1e293b] p-4 rounded-xl border border-yellow-600/30">
                <Zap className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
                <h4 className="font-semibold">Rewards</h4>
                <p className="text-xs text-gray-400">Earn & Participate</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 md:px-16 text-center bg-gradient-to-r from-[#0f172a] to-[#1e293b]">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-transparent"
        >
          Our Mission & Vision
        </motion.h2>
        <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
          To become the leading decentralized financial ecosystem offering
          stable value, seamless usability, and limitless opportunities —
          empowering individuals to access fair, transparent, and efficient
          finance.
        </p>
      </section>

      {/* Ecosystem Highlights */}
      <section className="py-24 px-6 md:px-16 bg-[#0b1120] text-center">
        <h2 className="text-4xl font-bold mb-10 bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-transparent">
          Why Choose Wallex?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: <Shield />, title: 'Security', text: 'Audited smart contracts for safety.' },
            { icon: <Coins />, title: 'Stability', text: '1:1 collateralized stablecoin model.' },
            { icon: <Globe />, title: 'Accessibility', text: 'Available worldwide with no barriers.' },
            { icon: <Zap />, title: 'Automation', text: 'Instant minting and redemption process.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-[#1e293b] p-6 rounded-2xl border border-yellow-600/30 shadow-lg"
            >
              <div className="flex justify-center mb-3 text-yellow-400">{item.icon}</div>
              <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center bg-gradient-to-b from-[#1e293b] to-[#0b1120]">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-transparent">
          Join Wallex Today
        </h2>
        <p className="text-gray-300 mb-8">
          Be part of a transparent, decentralized, and sustainable DeFi movement.
        </p>
        <Link
          href="/wallexusd"
          className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-800 bg-[#020617] text-gray-400 text-sm">
        © {new Date().getFullYear()} Wallex Labs — Built for a Decentralized Future
      </footer>
    </main>
  );
}
