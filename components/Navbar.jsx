'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-[#04162a]/95 border-b border-[#07243a] backdrop-blur-md sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4 px-6">
        {/* Left: Logo and Branding */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/wallex-logo.png"
              alt="Wallex Logo"
              width={40}
              height={40}
              className="rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent tracking-wide">
                WALLEX
              </h1>
              <p className="text-xs text-gray-400 tracking-widest">Decentralize Finance Solutions</p>
            </div>
          </Link>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-sm text-gray-300 hover:text-yellow-400 transition">Home</Link>
            <Link href="/wallexusd" className="text-sm text-gray-300 hover:text-yellow-400 transition">WallexUSD</Link>
            <Link href="/faq" className="text-sm text-gray-300 hover:text-yellow-400 transition">FAQ</Link>
          </div>

          <WalletConnectInfo />
        </div>
      </div>
    </nav>
  )
}

function WalletConnectInfo() {
  return (
    <a
      href="https://dapp.wallex.ws"
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm px-4 py-1.5 border border-yellow-400 rounded-full text-yellow-400 hover:bg-yellow-400 hover:text-[#04162a] transition-all duration-300"
    >
      Open DApp
    </a>
  )
}
