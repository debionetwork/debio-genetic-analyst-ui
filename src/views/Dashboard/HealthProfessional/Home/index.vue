<template lang="pug">
  .hp-dashboard
    .hp-dashboard__wrapper
      HealthProfessionalBanner

      ui-debio-button.hp-dashboard__button(
        color="#FF8EF4"
        dark
        @click="toGiveOpinion"
      ) + Give Opinion

      .hp-dashboard__content
        .hp-dashboard__alert 
          ui-debio-icon(
            :icon="alertIcon"
            size="25"
            stroke
          )
          template
            span.hp-dashboard__alert-text Your verification submission is being reviewed by Daogenics

            ui-debio-modal.hp-dashboard__modal(
              :show="isNotInstalled"
              :show-title="false"
              :show-cta="false"
              @onClose="isNotInstalled = false"
            )
              h2.mt-5 Install Polkadot Extension
              ui-debio-icon.mb-8(:icon="alertTriangleIcon" stroke size="80")
              p.hp-dashboard__subtitle Press install Polkadot Extensions button below to continue, your second opinion will be redirected to myriad.social platform.

              ui-debio-button(
                block
                color="secondary"
                @click="toInstall"
              ) Install

            ui-debio-modal.hp-dashboard__modal-connect(
              :show="showConnect"
              :show-title="false"
              :show-cta="false"
              @onClose="showConnect = false"
            )
              v-img(
                alt="debio-to-myriad"
                src="@/assets/debio-to-myriad.svg"
                max-width="129px"
                max-height="48px"
              )

              h2.mt-5 Redirecting You to Myriad
              .hp-dashboard__subtitle
                p The Second Opinion Marketplace requires a Polkadot account to conduct transactions.
                p By clicking this button below, you will download your account's keystore and you will be asked to upload that keystore in the Polkadot extension to export your account.
                p Do you wish to continue?


              ui-debio-button(
                width="304px"
                block
                color="secondary"
                @click="toContinue"
              ) CONTINUE & EXPORT KEYSTORE


            ui-debio-modal.hp-dashboard__modal-connect(
              :show="isConnectToMyriad"
              :show-title="false"
              :show-cta="false"
              @onClose="isConnectToMyriad = false"
            )
              p.hp-dashboard__subtitle Connecting your request into Myriad

              v-img(
                alt="debio-logo-loading"
                :src="require(`../../../../assets/${logo}.svg`)"
                max-width="360px"
                max-height="72px"
              )

</template>

<script>

import { mapState } from "vuex"
import HealthProfessionalBanner from "@/common/components/HealthProfessionalBanner.vue"
import { alertIcon, alertTriangleIcon } from "@debionetwork/ui-icons"
import { isWeb3Injected, web3Enable, web3Accounts, web3FromAddress } from "@polkadot/extension-dapp"
import localStorage from "@/common/lib/local-storage"

export default {
  name: "PHDashboard",

  data: () => ({
    alertIcon,
    alertTriangleIcon,
    isNotInstalled: false,
    showConnect: false,
    isConnectToMyriad: false,
    isConnecting: false,
    isConnected: false,
    logo: "debio-logo-loading"
  }),

  components: {
    HealthProfessionalBanner
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet
    })
  },

  methods: {
    async toGiveOpinion() {
      this.isNotInstalled = !isWeb3Injected
      if (!this.isNotInstalled) {
        this.showConnect = true
      }

    },

    async toInstall() {
      window.open("https://polkadot.js.org/extension/", "_blank")
    },

    exportKeystoreAction(){
      try {
        const keystore = localStorage.getKeystore()
        const address = localStorage.getAddress()
        const file = new Blob([keystore], {type: "text/json;charset=utf-8"})
        const downloadUrl = window.URL.createObjectURL(file)
        const downloadLink = document.createElement("a")
        downloadLink.href = downloadUrl
        downloadLink.target = "_blank"
        downloadLink.download = `${address}.json`

        downloadLink.click()

        window.URL.revokeObjectURL(downloadUrl)
      } catch (err) {
        console.error(err)
      }
    },

    async toContinue() {
      const sender = this.wallet.address 
      const allInjected = await web3Enable("DeBio Network");
      if (!allInjected) return this.isNotInstalled = false

      const allAccounts = await web3Accounts()
      if (!allAccounts.length) await this.exportKeystoreAction()

      const account = allAccounts.find(account => account.address === sender)
      if(!account) await this.exportKeystoreAction()

      const injector = await web3FromAddress(sender)
      if (injector) {
        this.showConnect = false
        this.$router.push({ name: "connecting-page"})
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/functions.sass"
  @import "@/common/styles/mixins.sass"

   
  .hp-dashboard
    &__wrapper
      height: 100%

    &__button
      margin-top: 30px

    &__content
      background: #FFFFFF
      border-radius: 4px
      margin-top: 35px
      min-height: 70vh
      padding: 30px

    &__alert
      display: flex
      padding: 15px 20px
      background: #F5F7F9
      border-radius: 4px
      font-weight: 600

    &__alert-text
      margin-left: 10px

    &__subtitle 
      max-width: 304px
      text-align: left
      color: #595959
      @include new-body-text-2-medium

</style>
