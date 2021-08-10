import { Interface } from '@ethersproject/abi'
import { ChainId } from 'avalanche-swap-test'
import V1_EXCHANGE_ABI from './v1_exchange.json'
import V1_FACTORY_ABI from './v1_factory.json'

const V1_FACTORY_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.tAVAX]: ''
}

const V1_FACTORY_INTERFACE = new Interface(V1_FACTORY_ABI)
const V1_EXCHANGE_INTERFACE = new Interface(V1_EXCHANGE_ABI)

export { V1_FACTORY_ADDRESSES, V1_FACTORY_INTERFACE, V1_FACTORY_ABI, V1_EXCHANGE_INTERFACE, V1_EXCHANGE_ABI }
