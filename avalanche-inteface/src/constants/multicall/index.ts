import { ChainId } from 'avalanche-swap-test'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.tAVAX]: '0x62e911eD8B6766E5076Bd9Ac485C4703Bc49944D'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
