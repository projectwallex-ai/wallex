import { ethers } from 'ethers';
import { WALXUSD_ADDRESS, WALXUSD_ABI, USDT_ADDRESS, ERC20_ABI } from './contract';

export function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  // fallback to public RPC
  return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BSC_RPC || 'https://bsc-dataseed1.binance.org');
}

export function getContract(providerOrSigner) {
  return new ethers.Contract(WALXUSD_ADDRESS, WALXUSD_ABI, providerOrSigner);
}

export function getERC20(address, providerOrSigner) {
  return new ethers.Contract(address, ERC20_ABI, providerOrSigner);
}
