<template lang="pug">
  .hp-dashboard
    .hp-dashboard__wrapper
      HealthProfessionalBanner

      ui-debio-button.hp-dashboard__button(
        color="#FF8EF4"
        dark
      ) + Give Opinion

      .hp-dashboard__content
        .hp-dashboard__alert 
          ui-debio-icon(
            :icon="alertIcon"
            size="25"
            stroke
          )
          template
            span.hp-dashboard__alert-text Your verification submission is being reviewed by Daogenic

</template>

<script>

import HealthProfessionalBanner from "@/common/components/HealthProfessionalBanner.vue"
import { alertIcon } from "@debionetwork/ui-icons"

export default {
  name: "PHDashboard",

  data: () => ({
    alertIcon
  }),

  components: {
    HealthProfessionalBanner
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

</style>
