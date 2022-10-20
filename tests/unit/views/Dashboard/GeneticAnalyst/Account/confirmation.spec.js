import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import GAAccountConfirmation from "@/views/Dashboard/GeneticAnalyst/Account/ConfirmationDialog"
import Vuex from "vuex"
import Vue from "vue"
import Vuetify from "vuetify"

config.stubs["ui-debio-button"] = { template: "<div></div>" }

Vue.use(Vuetify)

describe("Genetic Analyst Account Confirmation Dialog", () => {
  let container
  let localVue = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    container = shallowMount(GAAccountConfirmation, {
      localVue,
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET",
            mnemonicData: "oil spend nation obey lecture behave lake diary reward forest gym apple"
          },
          auth: {
            loadingData: "LOADING"
          },
          web3Store: {
            web3: "WEB3"
          }
        }
      })
    })

    expect(container.exists()).toBe(true)
  })
})
