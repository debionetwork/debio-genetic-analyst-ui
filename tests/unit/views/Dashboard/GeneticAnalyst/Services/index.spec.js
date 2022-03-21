import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import GAServices from "@/views/Dashboard/GeneticAnalyst/Services"
import Vuex from "vuex"
import Vuetify from "vuetify"

config.stubs["ui-debio-error-dialog"] = { template: "<div></div>" }
config.stubs["ui-debio-modal"] = { template: "<div></div>" }
config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-button"] = { template: "<div></div>" }
config.stubs["ui-debio-banner"] = { template: "<div></div>" }
config.stubs["ui-debio-card"] = { template: "<div></div>" }
config.stubs["ui-debio-data-table"] = { template: "<div></div>" }

describe("Genetic Analyst Services Dashboard", () => {
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
    GAServices.methods = {
      getDeleteServiceFee: jest.fn(),
      getServiceList: jest.fn(),
      onDelete: jest.fn()
    }

    container = shallowMount(GAServices, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET"
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
