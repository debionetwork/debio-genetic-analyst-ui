import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import MainPage from "@/views/Dashboard/GeneticAnalyst/Layout"
import Vuex from "vuex"
import Vuetify from "vuetify"

config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-modal"] = { template: "<div></div>" }
config.stubs["ui-debio-input"] = { template: "<div></div>" }

describe("Genetic Analyst Layout", () => {
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
    MainPage.computed = {
      computeNavs: jest.fn()
    };
    MainPage.mixins = [];
    MainPage.methods = {
      getListNotification: jest.fn()
    };
    container = shallowMount(MainPage, {
      localVue,
      vuetify: new Vuetify(),
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
