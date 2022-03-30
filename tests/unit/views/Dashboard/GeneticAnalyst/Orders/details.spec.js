import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import GAOrderDetails from "@/views/Dashboard/GeneticAnalyst/Orders/Details"
import Vuex from "vuex"
import Vuetify from "vuetify"

config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-modal"] = { template: "<div></div>" }
config.stubs["ui-debio-input"] = { template: "<div></div>" }
config.stubs["ui-debio-avatar"] = { template: "<div></div>" }
config.stubs["ui-debio-stepper"] = { template: "<div></div>" }
config.stubs["ui-debio-textarea"] = { template: "<div></div>" }

describe("Genetic Analysis Order Details", () => {
  let container
  let localVue = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    GAOrderDetails.methods = {
      initialDataKey: jest.fn(), 
      metamaskDispatchAction: jest.fn() 
    };
    container = shallowMount(GAOrderDetails, {
      localVue,
      vuetify: new Vuetify(),
      $route: {
        params: {
          id: "ID"
        }
      },
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
          metamask: {
            web3: "WEB3"
          }
        }
      })
    })

    expect(container.exists()).toBe(true)
  })
})
