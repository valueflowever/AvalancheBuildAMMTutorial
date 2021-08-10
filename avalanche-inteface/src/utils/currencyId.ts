import { Currency, ETHER, Token } from 'avalanche-swap-test'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'tAVAX'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
