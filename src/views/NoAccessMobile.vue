<template lang="pug">
  .no-access
    .no-access__wrapper
      ui-debio-icon.no-access__icon(:icon="debioFullIcon" view-box="0 0 146 52" width="245" height="100" fill)
      h5.mb-5.no-access__title We are truly sorry
      p.no-access__subtitle Please note that our interface isn't optimized for mobile yet, by signing-in, you understand that you will encounter errors or inaccuracies
      a.no-access__cta(color="primary" @click="$emit('close')") I understand
</template>

<script>
import { debioFullIcon } from "@debionetwork/ui-icons"

export default {
  name: "NoAccessMobile",

  data: () => ({ debioFullIcon })
}
</script>

<style lang="sass">
  .no-access
    &__wrapper
      width: 100vw
      height: 100vh
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center

    &__icon
      margin-bottom: 3.75rem

    &__title
      font-size: 0.875rem

    &__title,
    &__subtitle,
    &__text
      text-align: center

    &__subtitle,
    &__text
      font-size: 0.75rem

    &__subtitle
      margin-bottom: 4.75rem !important

    &__text
      margin: 0 !important

    &__cta
      background: #C400A5
      color: #FFFFFF !important
      text-decoration: none
      border-radius: 5px
      padding: 7px 16px
      font-size: 0.75rem !important
      text-transform: capitalize
      margin-top: 4.75rem
</style>
