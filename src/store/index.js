import Vue from "vue"
import Vuex from "vuex"
import auth from "./auth"
import web3Store from "./web3Store"
import testRequest from "./test-request"
import substrate from "./substrate"
import lab from "./lab"
import wallet from "./wallet"
import rating from "./rating"
import geneticData from "./genetic-data"



Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    auth,
    web3Store,
    testRequest,
    substrate,
    lab,
    wallet,
    rating,
    geneticData
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {}
})

