import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import GAServiceRegistration from "@/common/components/Service/AddService"
import Vuex from "vuex"

config.stubs["ui-debio-input"] = { template: "<div></div>" }
config.stubs["ui-debio-textarea"] = { template: "<div></div>" }
config.stubs["ui-debio-dropdown"] = { template: "<div></div>" }
config.stubs["ui-debio-button"] = { template: "<div></div>" }
config.stubs["v-row"] = { template: "<div></div>" }
config.stubs["v-col"] = { template: "<div></div>" }
config.stubs["v-tooltip"] = { template: "<div></div>" }

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
      onFileChange: jest.fn(),
      handleChooseFile: jest.fn(),
      handleSubmit: jest.fn(),
      handleCancelEdit: jest.fn()
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
          web3Store: {
            web3: "WEB3"
          }
        }
      }),
      propsData: {
        data: {
          name: "",
          currency: "",
          totalPrice: "",
          duration: "",
          durationType: "",
          description: "",
          testResultSample: null,
          file: { name: "" }
        },
        isBulk: false,
        isEdit: false,
        editPage: false,
        txWeight: 0
      }
    })

    expect(container.exists()).toBeTruthy()
  })
})
