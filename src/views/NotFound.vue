<template lang="pug">
  .not-found
    .not-found__wrapper
      ui-debio-icon(:icon="Illustration404" view-box="-23 116 390 80" width="350" height="190" fill)
      h1.not-found__title Page not found
      p.not-found__subtitle Sorry, we can’t find the page you’re looking for.
      ui-debio-button.not-found__button(
        color="primary"
        width="150"
        height="35"
        @click="handleToDashboard"
      ) Back to Dashboard
</template>

<script>
import { Illustration404 } from "@debionetwork/ui-icons"

export default {
  name: "NotFound",

  data: () => ({
    Illustration404
  }),
  
  methods: {
    handleToDashboard() {
      this.$router.push({ name: "customer-dashboard" })
    }
  }
}
</script>

<style lang="sass">
  .not-found
    &__wrapper
      height: 100vh
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center

    &__title
      font-size: 2.375rem
      margin: 2.5rem 0 1.25rem

    &__subtitle
      font-size: 1.125rem
      margin: 0 0 2.5rem !important

    &__button
      font-size: 0.625rem !important
      text-transform: capitalize
</style>
