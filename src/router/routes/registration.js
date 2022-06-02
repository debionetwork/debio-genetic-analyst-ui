import store from "@/store/index"

const registrationRouter = [
  {
    path: "registration",
    name: "ga-registration",
    meta: { pageHeader: "Registration" },
    component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Registration/AccountInformation"),
    beforeEnter: async (to, from, next) => {
      const accountInfo = await store.dispatch("substrate/getGAAccount")
      
      if (accountInfo.success) next({name: "ga-registration-service"})
      else next()
    }
  },
  {
    path: "registration/service",
    name: "ga-registration-service",
    meta: { pageHeader: "Registration" },
    component: () => import(/* webpackChunkName */ "@/views/Dashboard/GeneticAnalyst/Registration/AddService"),
    beforeEnter: async (to, from, next) => {
      const accountInfo = await store.dispatch("substrate/getGAAccount")
      
      if (accountInfo.success) {
        if (accountInfo.GAAccount.services.length > 0) next({ name: "ga-dashboard" })
        else next()
      } else next()
    }
  }
]

export default registrationRouter
