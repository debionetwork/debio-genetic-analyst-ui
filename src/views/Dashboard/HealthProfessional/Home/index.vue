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
</template>

<script>

import HealthProfessionalBanner from "@/common/components/HealthProfessionalBanner.vue"
import { alertIcon, alertTriangleIcon } from "@debionetwork/ui-icons"
import { isWeb3Injected } from "@polkadot/extension-dapp"


export default {
  name: "PHDashboard",

  data: () => ({
    alertIcon,
    alertTriangleIcon,
    isNotInstalled: false
  }),

  components: {
    HealthProfessionalBanner
  },

  methods: {
    async toGiveOpinion() {
      this.isNotInstalled = !isWeb3Injected
    },

    async toInstall() {
      window.open("https://polkadot.js.org/extension/", "_blank")
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
      @include body-text-3-opensans

</style>
