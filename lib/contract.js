export const WALXUSD_ADDRESS = process.env.NEXT_PUBLIC_WALXUSD || "0x01073cCAc1269BfE8b44865Ac4005E0b688FbE90";
export const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT || "0x55d398326f99059fF775485246999027B3197955";
export const DECIMALS = Number(process.env.NEXT_PUBLIC_DECIMALS || 18);

export const WALXUSD_ABI = [
  "function totalSupply() view returns (uint256)",
  "function collateralBalance() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function mint(uint256 amount) external",
  "function redeem(uint256 amount) external",
  "event Minted(address indexed user, uint256 amount)",
  "event Redeemed(address indexed user, uint256 burned, uint256 payout, uint256 fee)"
];

export const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];
