import { createLocalVue, shallowMount } from "@vue/test-utils"
import GAEditService from "@/views/Dashboard/GeneticAnalyst/Services/EditService"
import Vuex from "vuex"

describe("Genetic Analysis Edit Service", () => {
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
    GAEditService.methods = {
      cancelEdit: jest.fn(),
      goToServicePage: jest.fn(),
      onSubmitService: jest.fn({
        currency: "",
        description: "",
        duration: "",
        durationType: "",
        name: "",
        testResultSample: "",
        totalPric: ""
      })
    };
    container = shallowMount(GAEditService, {
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
