<template lang="pug">
  .layout-dashboard
    ui-debio-modal.modal-error(
      :show="showModalError"
      disable-dismiss
      :show-title="false"
      :showCta="true"
      ctaTitle="Back To Home"
      :ctaOutlined="false"
      :ctaAction="goToDashboard"
    )
      ui-debio-icon(:icon="cableErrorIcon" fill size="100")
      h6.modal-error__title Aw, Snap!
      p.modal-error__subtitle An Internal error occured during your request! try again later!
    ui-debio-modal.font-weight-bold(
      :show="showModalPassword"
      title="Unlock Wallet"
      :icon="checkCircleIcon"
      :showCta="!success"
      :showTitle="!success"
      disable-dismiss
    )
      ui-debio-input(
        v-if="!success"
        :error="!!error"
        :errorMessages="!!error ? error.message : null"
        :rules="$options.rules.password"
        :type="showPassword ? 'text' : 'password'"
        variant="small"
        placeholder="Input Password"
        v-model="password"
        outlined
        block
        validate-on-blur
        @keyup.enter="handleSubmitPassword"
        @blur="error = null"
        @isError="handleError"
      )
        ui-debio-icon(
          slot="icon-append"
          role="button"
          size="18"
          @click="handleShowPassword"
          :icon="showPassword ? eyeIcon : eyeOffIcon"
          stroke
        )

      .modal-password__cta.d-flex.flex-column(slot="cta")
        .modal-password__cta.d-flex.align-center.justify-between
          ui-debio-button.router-link.modal-password__cta-submit(
            color="secondary"
            width="130"
            :to="{ name: 'forgot-password' }"
            outlined
          ) Forgot Password

          ui-debio-button.modal-password__cta-submit(
            color="secondary"
            width="130"
            @click="handleSubmitPassword"
          ) Submit

        .modal-password__cta.d-flex.align-center.justify-space-between
          div.modal-password__divider
          span.modal-password__cta-forgot OR
          div.modal-password__divider

        .modal-password__cta-change-account(
          @click="signOut"
        ) Not you? Try different account

    NavigationDrawer.layout-dashboard__sidebar(:items="computeNavs")

    .layout-dashboard__wrapper
      Navbar.layout-dashboard__navbar(:error="pageError" :notifications="localListNotification")
      .layout-dashboard__main
        transition(name="transition-slide-x" mode="out-in")
          maintenancePageLayout(v-if="pageError" :error="pageError")
          router-view(v-else @onPageError="handlePageError")
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex"
import store from "@/store"
import { validateForms } from "@/common/lib/validate"
import {
  gridIcon,
  boxIcon,
  eyeIcon,
  eyeOffIcon,
  checkCircleIcon,
  userIcon,
  fileTextIcon,
  cableErrorIcon
} from "@debionetwork/ui-icons"

import NavigationDrawer from "@/common/components/NavigationDrawer"
import Navbar from "@/common/components/Navbar.vue"
import maintenancePageLayout from "@/views/Dashboard/maintenancePageLayout"
import errorMessage from "@/common/constants/error-messages"
import localStorage from "@/common/lib/local-storage"
import VueRouter from "@/router"

export default {
  name: "MainPage",

  mixins: [validateForms],

  components: { NavigationDrawer, Navbar, maintenancePageLayout },

  data: () => ({
    checkCircleIcon,
    eyeIcon,
    eyeOffIcon,
    cableErrorIcon,

    showModalError: false,
    showModalPassword: false,
    pageError: null,
    showPassword: false,
    success: false,
    error: null,
    password: null,

    navs: [
      { text: "Dashboard", disabled: false, active: false, route: "ga-dashboard", icon: gridIcon },
      { text: "My Account", disabled: false, active: false, route: "ga-account", icon: userIcon },
      { text: "My Services", disabled: false, active: false, route: "ga-services", icon: fileTextIcon },
      { text: "Orders", disabled: false, active: false, route: "ga-orders", icon: boxIcon }
    ]
  }),

  computed: {
    ...mapState({
      lastEventData: (state) => state.substrate.lastEventData,
      wallet: (state) => state.substrate.wallet,
      localListNotification: (state) => state.substrate.localListNotification,
      mnemonicData: (state) => state.substrate.mnemonicData
    }),

    computeNavs() {
      const setActive = name => {
        return (
          this.$route.name === name ||
          this.$route.meta.parent === name
        )
      }

      return this.navs.map(nav => ({ ...nav, active: setActive(nav.route) }))
    },

    computeButtonActive() {
      return !/(\/customer\/request-test)/.test(this.$route.path)
    }
  },

  watch: {
    $route(val) {
      const query = VueRouter?.history?.current?.query

      if (val.meta.maintenance) this.pageError = true
      else this.pageError = null

      if (query.error) this.showModalError = true
    },

    lastEventData(event) {
      if (event !== null) {
        this.$store.dispatch("substrate/addListNotification", {
          address: this.wallet.address,
          event: event,
          role: "customer"
        });
      }
    }
  },

  async mounted() {
    if (!this.mnemonicData) this.showModalPassword = true
    if (this.$route.meta.maintenance) this.pageError = true
    await this.getListNotification()
  },

  rules: {
    password: [ val => !!val || errorMessage.PASSWORD(8) ]
  },

  methods: {
    ...mapMutations({
      clearWallet: "metamask/CLEAR_WALLET"
    }),

    ...mapActions({
      clearAuth: "auth/clearAuth"
    }),

    handlePageError(error) {
      this.pageError = error
    },

    async getListNotification() {
      await this.$store.dispatch("substrate/getListNotification", {
        address: this.wallet.address,
        role: "customer"
      })
    },

    goToRequestTestPage() {
      this.$router.push({ name: "customer-request-test" })
    },

    goToUploadEMR() {
      this.$router.push({ name: "customer-emr-create" })
    },

    goToDashboard() {
      this.showModalError = false
      this.$router.push({ name: "dashboard", query: {}})
    },

    handleShowPassword() {
      this.showPassword = !this.showPassword
    },

    signOut() {
      this.$router.push({name: "landing-page"})
      localStorage.clear()
      this.clearAuth()
      this.clearWallet()
    },

    async handleSubmitPassword() {
      try {
        await this.wallet.unlock(this.password)
        await store.dispatch("substrate/getEncryptedAccountData", {
          password: this.password
        })

        this.success = true

        setTimeout(() => {
          this.showModalPassword = false
        }, 1300)
      } catch (e) {
        this.error = e
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap')
  @import "@/common/styles/variables.scss"
  @import "@/common/styles/mixins.sass"

  .layout-dashboard
    width: 100%
    min-height: 100vh
    background: #F5F7F9
    display: flex

    &__wrapper
      width: 70%
      flex: 1
      display: flex
      flex-direction: column

    &__navbar
      padding: 2.5rem 1.563rem 1.563rem !important

    &__main
      padding: 0 1.563rem 1.563rem !important

  .modal-password
    &__cta
      gap: 20px
      align-items: center

    &__cta-forgot,
    &__cta-submit
      font-size: 10px

    &__cta-forgot,
    &__cta-change-account
      color: #5640A5 !important
      font-weight: bold
      text-transform: uppercase

    &__cta-change-account
      font-size: 12px
      cursor: pointer

    &__divider
      border-top: 1px solid #E9E9E9
      width: 110px

  
  .transition-slide-x
    &-enter-active,
    &-leave-active
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

    &-enter
      opacity: 0
      transform: translateX(1.563rem)

    &-leave-to
      opacity: 0
      transform: translateX(-12.813rem)

  .modal-error 
    .ui-debio-modal__card 
      width: 300px
      gap: 1rem

    &__title
      @include h6-opensans
    
    &__subtitle 
      max-width: 200px
      text-align: center
      color: #595959
      @include body-text-3-opensans
</style>
