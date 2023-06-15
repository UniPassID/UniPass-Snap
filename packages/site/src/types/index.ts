export { type GetSnapsResponse, type Snap } from './snap';

export interface Token {
  symbol: string
  contractAddress: string
  decimals: number
  chainId: number
}