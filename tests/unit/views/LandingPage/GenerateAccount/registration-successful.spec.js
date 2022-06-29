import { shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import RegistrationSuccessful from "@/views/LandingPage/GenerateAccount/RegistrationSuccessful"

describe("Registration Successful Page", () => {
  let localVue = null

  beforeEach(() => {
    localVue = require("vue")
    localVue.use(Vuetify)
    localVue.use(VueRouter)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    const wrapper = shallowMount(RegistrationSuccessful, {
      localVue,
      router: new VueRouter(),
      vuetify: new Vuetify()
    })
      
    expect(wrapper.exists()).toBe(true)
  })
})
