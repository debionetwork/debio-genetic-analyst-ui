import localStorage from "./local-storage"
import store from "@/store/index"

async function dispatchGetAccount(wallet, address, func) {
  if (wallet == null) {
    if (address != "") {
      await store.dispatch("substrate/getAllAccounts", {
        address: address
      })
    }
  }
  func()
}

export async function checkIsLoggedIn(to, from, next) {
  const address = localStorage.getAddress()
  let api = store.getters["substrate/getAPI"]
  if (api == null) {
    await store.dispatch("substrate/connect", address)
  }

  let wallet = store.getters["substrate/wallet"]
  const keystore = localStorage.getAddress()
  const isLoggedIn = !!keystore

  if (to.path == "/sign-in" || to.path == "/generate") {
    if (isLoggedIn) {
      await dispatchGetAccount(wallet, address, () => {
        next("/")
      })
      return address
    }

    next()
    return ""
  }

  if (isLoggedIn) {
    await dispatchGetAccount(wallet, address, () => {
      next()
    })
    return address
  }

  next("/landing-page")
  return ""
}

export async function checkAccountStatus(to, from, next) {
  const { GAAccount } = await store.dispatch("substrate/getGAAccount")
  
  if (!GAAccount) {
    next("/registration")
  } else {
    if (GAAccount.verificationStatus !== "Verified") {
      if (from.name === "ga-registration-service") next() 
      else if (GAAccount.stakeStatus === "Unstaked") next({ name: "ga-registration" })
      else next({ name: "ga-dashboard-verification" })
    } else {
      next()
    }
  }

}
