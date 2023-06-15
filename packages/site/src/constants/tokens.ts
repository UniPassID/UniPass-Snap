import { Token } from '@/types'

export const TokenList: Token[] = [{
  symbol: 'USDC',
  contractAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  decimals: 6,
  chainId: 42161, // Arbitrum mainnet
}, {
  symbol: 'USDC',
  contractAddress: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e',
  decimals: 6,
  chainId: 80001, // Polygon testnet
}, {
  symbol: 'USDC',
  contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  decimals: 6,
  chainId: 137 // Polygon mainnet
}, {
  symbol: 'USDT',
  contractAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
  decimals: 6,
  chainId: 42161, // Arbitrum mainnet
}, {
  symbol: 'USDT',
  contractAddress: '0x7fbc10850caE055B27039aF31bD258430e714c62',
  decimals: 18,
  chainId: 80001 // Polygon testnet
}, {
  symbol: 'USDT',
  contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  decimals: 6,
  chainId: 137, // Polygon mainnet
}]
