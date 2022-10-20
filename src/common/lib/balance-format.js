import store from "@/store"

const web3 = store.getters["web3Store/getWeb3"]

export function fromEther(balance, currency) {
  let unit
  let formatedBalance = 0
  currency === "USDT" ? unit = "mwei" : unit = "ether"
  formatedBalance = web3?.utils.fromWei(String(balance.replaceAll(",", "")), unit)
  return formatedBalance
}

export function toEther(balance, currency) {
  let unit
  let formatedBalance = 0
  currency === "USDT" ? unit = "mwei" : unit = "ether"
  formatedBalance = web3?.utils.toWei(String(balance), unit)
  return formatedBalance
}
