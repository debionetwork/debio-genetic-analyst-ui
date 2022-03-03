<template lang="pug">
  .error-page
    .error-page__wrapper
      ui-debio-icon(:icon="constructIllustration" view-box="0 0 383 241" width="383" height="241" fill)
      h3.error-page__title This feature is currently unavailable
      h4.error-page__legend Please contact our support team if the problem persists
</template>

<script>
import { constructIllustration } from "@debionetwork/ui-icons"

export default {
  name: "maintenancePageLayout",

  props: {
    error: { type: [Object, Boolean], default: null }
  },

  data: () => ({ constructIllustration })
}
</script>

<style lang="sass">
  .error-page
    &__wrapper
      width: 100%
      height: calc(100vh - 10rem)
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center
      gap: 1.375rem

    &__title
      font-size: 1.125rem

    &__legend
      font-size: 1.375rem
</style>
