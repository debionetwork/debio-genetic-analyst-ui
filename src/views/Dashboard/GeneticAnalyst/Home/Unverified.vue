<template lang="pug">
  .ga-dashboard
    .ga-dashboard__wrapper
      ui-debio-banner.ga-dashboard(
        title="Genetic Analyst"
        subtitle="Provide service for customer who have been tested previously can get interpretation that leads to improved maintenance."
        gradient-color="tertiary"
        with-decoration
      )
        template(slot="illustration")
          ui-debio-icon(
            :icon="geneticAnalystIllustration"
            size="120"
            view-box="0 0 120 120"
            fill
          )
      .ga-dashboard__content
        .ga-dashboard__alert 
          ui-debio-icon.ga-dashboard__alert__icon(
            :icon="alertIcon"
            size="25"
            stroke
          )
          template(v-if="GAAccount")
            span(v-if="GAAccount.verificationStatus === 'Unverified'") Your verification submission is being reviewed by Daogenic
            span(v-else) Your account has been {{ GAAccount.verificationStatus.toLowerCase() }}
</template>

<script>
import {geneticAnalystIllustration, alertIcon} from "@debionetwork/ui-icons"
import {mapState} from "vuex"

export default {
  name: "GAUnverified",

  data: () => ({
    geneticAnalystIllustration,
    alertIcon
  }),

  computed: {
    ...mapState({
      GAAccount: (state) => state.substrate.GAAccount
    })
  }
}
</script>

<style lang="sass" scoped>
.ga-dashboard
  &__wrapper
    display: flex
    flex-direction: column
    gap: toRem(35px)

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

    &__icon
      margin-right: 20px
</style>
