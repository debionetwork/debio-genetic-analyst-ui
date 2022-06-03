import { createLocalVue, shallowMount } from "@vue/test-utils"
import GAInformationRegistration from "@/views/Dashboard/GeneticAnalyst/Registration/AccountInformation"
import Vuex from "vuex"

describe("Genetic Analysis Registration Information", () => {
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
    GAInformationRegistration.methods = {
      initialDataKey: jest.fn()
    };
    container = shallowMount(GAInformationRegistration, {
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
