import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import GAAddService from "@/views/Dashboard/GeneticAnalyst/Services/AddService"
import Vuex from "vuex"

config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-button"] = { template: "<div></div>" }
config.stubs["v-progress-circular"] = { template: "<div></div>" }

describe("Genetic Analysis Add Service", () => {
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
    container = shallowMount(GAAddService, {
      localVue,
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

    expect(container.exists()).toBeTruthy()
  })
})
