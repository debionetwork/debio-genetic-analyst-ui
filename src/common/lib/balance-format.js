import store from "@/store"

const web3 = store.getters["web3Store/getWeb3"]

export async function fromEther(balance) {
  const formatedBalance = web3.utils.fromWei(String(balance), "ether")
  return formatedBalance
}

export async function toEther(balance) {
  return web3.utils.toWei(String(balance), "ether")
}
