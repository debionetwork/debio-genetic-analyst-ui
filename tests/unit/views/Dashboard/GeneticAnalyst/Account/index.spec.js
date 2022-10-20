import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import GAAccount from "@/views/Dashboard/GeneticAnalyst/Account"
import Vuex from "vuex"
import Vue from "vue"
import Vuetify from "vuetify"

config.stubs["ui-debio-button"] = { template: "<div></div>" }
config.stubs["ui-debio-input"] = { template: "<div></div>" }
config.stubs["ui-debio-dropdown"] = { template: "<div></div>" }
config.stubs["ui-debio-modal"] = { template: "<div></div>" }
config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-textarea"] = { template: "<div></div>" }
config.stubs["ui-debio-file"] = { template: "<div></div>" }

Vue.use(Vuetify)

describe("Genetic Analyst Account Dashboard", () => {
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
    container = shallowMount(GAAccount, {
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
