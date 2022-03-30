import { shallowMount, config } from "@vue/test-utils"
import GADashboard from "@/common/components/Orders/OrderList"
import Vuex from "vuex"
import Vue from "vue"
import Vuetify from "vuetify"

Vue.use(Vuex)
Vue.use(Vuetify)

config.stubs["router-link"] = { template: "<div></div>" }
config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-banner"] = { template: "<div></div>" }
config.stubs["ui-debio-data-table"] = { template: "<div></div>" }

describe("Genetic Analyst Dashboard", () => {
  let container
  const config = {
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
  }

  it("Should render", async () => {
    GADashboard.methods = { getOrdersData: jest.fn(), getVerificationStatus: jest.fn() }

    container = shallowMount(GADashboard, { ...config })

    expect(container.exists()).toBe(true)
  })

  it("Should not be show table if the account is not Verified yet", async () => {
    container = shallowMount(GADashboard, { ...config })

    await container.setData({ verificationStatus: "Unverified" })

    expect(container.find(".ga-dashboard__verification-status").exists()).toBe(true)
  })

  it("Should be show table if the account is Verified", async () => {
    container = shallowMount(GADashboard, { ...config })

    await container.setData({ verificationStatus: "Verified" })

    expect(container.find(".ga-dashboard__table").exists()).toBe(true)
    expect(container.find(".ga-dashboard__verification-status").exists()).toBeFalsy()
  })
})
