import store from "@/store"

const web3 = store.getters["web3Store/getWeb3"]

export function fromEther(balance, currency) {
  let unit
  let formatedBalance = 0
  currency === "USDT" || currency === "USDTE" ? unit = "mwei" : unit = "ether"
  formatedBalance = web3?.utils.fromWei(String(balance.replaceAll(",", "")), unit)
  return formatedBalance
}

export function toEther(balance, currency) {
  let unit
  let formatedBalance = 0
  currency === "USDT" || currency === "USDTE" || currency === "USDT.e" ? unit = "mwei" : unit = "ether"
  formatedBalance = web3?.utils.toWei(String(balance), unit)
  return formatedBalance
}

export function formatUSDTE(currency) {
  if (currency === "USDT.e") return "USDTE"
  if (currency === "USDTE") return "USDT.e"
  return currency
}
