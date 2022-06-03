import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import GAServiceRegistration from "@/views/Dashboard/GeneticAnalyst/Registration/AddService"
import Vuex from "vuex"

config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-button"] = { template: "<div></div>" }

describe("Genetic Analysis Registration Service", () => {
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
    GAServiceRegistration.methods = {
      getServices: jest.fn(), 
      cancelEdit: jest.fn(),
      deleteService: jest.fn(),
      onSubmit: jest.fn() 
    };
    container = shallowMount(GAServiceRegistration, {
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
          metamask: {
            web3: "WEB3"
          }
        }
      })
    })

    expect(container.exists()).toBeTruthy()
  })
})
