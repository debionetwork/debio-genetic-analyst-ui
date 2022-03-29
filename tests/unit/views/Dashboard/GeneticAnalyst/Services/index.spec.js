import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import GAServices from "@/views/Dashboard/GeneticAnalyst/Services"
import Vuex from "vuex"
import Vuetify from "vuetify"
import _ from "lodash"
import {
  deleteGeneticAnalystService,
  deleteGeneticAnalystServiceFee
} from "../../../../../../src/common/lib/polkadot-provider/command/genetic-analyst/services"
// import {
//   errorHandler
// } from "../../../../../../src/common/lib/error-handler"

config.stubs["ui-debio-error-dialog"] = { template: "<div></div>" }
config.stubs["ui-debio-modal"] = { template: "<div></div>" }
config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-button"] = { template: "<div></div>" }
config.stubs["ui-debio-banner"] = { template: "<div></div>" }
config.stubs["ui-debio-card"] = { template: "<div></div>" }
config.stubs["ui-debio-data-table"] = { template: "<div></div>" }

jest.mock("../../../../../../src/common/lib/polkadot-provider/command/genetic-analyst/services", () => ({
  deleteGeneticAnalystService: jest.fn(),
  deleteGeneticAnalystServiceFee: jest.fn(() => {
    return {
      partialFee: "partialFee"
    }
  })
}));

describe("Genetic Analyst Services Dashboard", () => {
  let container
  let store
  let localVue = null

  beforeEach(() => {
    deleteGeneticAnalystService.mockClear()
    deleteGeneticAnalystServiceFee.mockClear()

    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(Vuetify)

    store = new Vuex.Store({
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

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    // Arrange
    let gaServices = _.cloneDeep(GAServices)
    gaServices.methods = {
      getDeleteServiceFee: jest.fn(),
      getServiceList: jest.fn(),
      onDelete: jest.fn()
    }

    container = shallowMount(gaServices, {
      localVue,
      vuetify: new Vuetify(),
      store: store
    })

    // Assert
    expect(container.exists()).toBeTruthy()
  })

  it("watch.lastEventData should return when supplied null", () => {
    // Arrange
    let gaServices = _.cloneDeep(GAServices)

    // Assert
    expect(gaServices.watch.lastEventData(null)).toBeUndefined()
    expect(gaServices.watch.showModal).toBeUndefined()
    expect(gaServices.watch.isLoading).toBeUndefined()
    expect(gaServices.watch.serviceId).toBeUndefined()
  })

  it("watch.lastEventData should return when supplied false address", () => {
    // Arrange
    const gaServices = _.cloneDeep(GAServices)
    gaServices.watch.wallet = {
      address: 1
    }

    const PARAM = {
      data: `[0,0]`
    }

    // Assert
    expect(gaServices.watch.lastEventData(PARAM)).toBeUndefined()
    expect(gaServices.watch.showModal).toBeUndefined()
    expect(gaServices.watch.isLoading).toBeUndefined()
    expect(gaServices.watch.serviceId).toBeUndefined()
  })

  it("watch.lastEventData should return when supplied false method", () => {
    // Arrange
    const gaServices = _.cloneDeep(GAServices)
    gaServices.watch.wallet = {
      address: 1
    }
    
    const PARAM = {
      data: `[0,${gaServices.watch.wallet.address}]`,
      method: "GeneticAnalystServiceCreated"
    }

    // Assert
    expect(gaServices.watch.lastEventData(PARAM)).toBeUndefined()
    expect(gaServices.watch.showModal).toBeUndefined()
    expect(gaServices.watch.isLoading).toBeUndefined()
    expect(gaServices.watch.serviceId).toBeUndefined()
  })

  it("watch.lastEventData should return", () => {
    // Arrange
    const gaServices = _.cloneDeep(GAServices)
    gaServices.watch.wallet = {
      address: 1
    }
    gaServices.watch.getServiceList = jest.fn()
    
    const PARAM = {
      data: `[0,${gaServices.watch.wallet.address}]`,
      method: "GeneticAnalystServiceDeleted"
    }

    // Assert
    expect(gaServices.watch.lastEventData(PARAM)).toBeUndefined()
    expect(gaServices.watch.getServiceList).toBeCalledTimes(1)
    expect(gaServices.watch.showModal).toBeFalsy()
    expect(gaServices.watch.isLoading).toBeFalsy()
    expect(gaServices.watch.serviceId).toEqual("")
  })

  it("mounted should return", async () => {
    // Arrange
    const gaServices = _.cloneDeep(GAServices)
    gaServices.getServiceList = jest.fn()

    // Assert
    expect(await gaServices.mounted()).toBeUndefined()
    expect(gaServices.getServiceList).toBeCalledTimes(1)
  })

  it("methods.getDeleteServiceFee should return", async () => {
    // Arrange
    const WEIGHT = 1
    const gaServices = _.cloneDeep(GAServices)
    gaServices.methods.api = "API"
    gaServices.methods.wallet = "WALLET"
    gaServices.methods.serviceId = "SERVICE_ID"
    gaServices.methods.web3 = {
      utils: {
        fromWei: jest.fn(() => {
          return WEIGHT
        })
      }
    }

    // Assert
    expect(await gaServices.methods.getDeleteServiceFee()).toBeUndefined()
    expect(deleteGeneticAnalystServiceFee).toBeCalledTimes(1)
    expect(deleteGeneticAnalystServiceFee).toBeCalledWith(
      gaServices.methods.api,
      gaServices.methods.wallet,
      gaServices.methods.serviceId
    )
    expect(gaServices.methods.web3.utils.fromWei).toBeCalledTimes(1)
    expect(gaServices.methods.web3.utils.fromWei).toBeCalledWith("partialFee", "ether")
    expect(gaServices.methods.txWeight).toEqual(`${WEIGHT.toFixed(4)} DBIO`)
  })

  it("methods.getServiceList should return", async () => {
    // Arrange
    const WEIGHT = 1
    const gaServices = _.cloneDeep(GAServices)
    gaServices.methods.api = "API"
    gaServices.methods.wallet = "WALLET"
    gaServices.methods.serviceId = "SERVICE_ID"
    gaServices.methods.web3 = {
      utils: {
        fromWei: jest.fn(() => {
          return WEIGHT
        })
      }
    }

    // Assert
  })

  it("methods.formatPrice should return", () => {
    // Arrange
    const WEIGHT = 1
    const PRICE = {
      replaceAll: jest.fn(() => WEIGHT)
    }
    const gaServices = _.cloneDeep(GAServices)
    gaServices.methods.web3 = {
      utils: {
        fromWei: jest.fn(() => {
          return WEIGHT
        })
      }
    }

    // Assert
    expect(gaServices.methods.formatPrice(PRICE)).toEqual(WEIGHT)
    expect(gaServices.methods.web3.utils.fromWei).toBeCalledTimes(1)
    expect(gaServices.methods.web3.utils.fromWei).toBeCalledWith(`${WEIGHT}`, "ether")
  })

  it("methods.showDialog should return", async () => {
    // Arrange
    const ID = 1
    const gaServices = _.cloneDeep(GAServices)
    gaServices.methods.getDeleteServiceFee = jest.fn()

    // Assert
    expect(await gaServices.methods.showDialog(ID)).toBeUndefined()
    expect(gaServices.methods.serviceId).toEqual(ID)
    expect(gaServices.methods.showModal).toBeTruthy()
    expect(gaServices.methods.getDeleteServiceFee).toBeCalledTimes(1)
  })

  it("methods.onDelete should return", async () => {
    // Arrange
    const gaServices = _.cloneDeep(GAServices)
    gaServices.methods.api = "API"
    gaServices.methods.wallet = "WALLET"
    gaServices.methods.serviceId = "SERVICE_ID"

    // Assert
    expect(await gaServices.methods.onDelete()).toBeUndefined()
    expect(gaServices.methods.isLoading).toBeTruthy()
    expect(deleteGeneticAnalystService).toBeCalledTimes(1)
    expect(deleteGeneticAnalystService).toBeCalledWith(
      gaServices.methods.api,
      gaServices.methods.wallet,
      gaServices.methods.serviceId
    )
  })
})
