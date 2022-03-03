<template lang="pug">
  .loading-screen
    ui-debio-icon.loading-screen__icon(
      :icon="heartBeatIcon"
      width="187"
      height="85"
      view-box= "0 0 187 85"
    )
    h5.loading-screen__loading-text LOADING
    p.loading-screen__loading-description It will take a few seconds
</template>

<script>
import { heartBeatIcon } from "@debionetwork/ui-icons"

export default {
  name: "LoadingScreen",

  data: () => ({ heartBeatIcon })
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .loading-screen
    height: 100vh
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center

    &__icon
      margin-bottom: 1.5rem
      stroke-dasharray: 1000
      stroke-dashoffset: 1000
      animation: dash linear 3s forwards infinite

    &__loading-text
      margin-bottom: 1rem
      @include h5-opensans

    &__loading-description
      @include body-text-1-opensans

    @keyframes dash
      to
        stroke-dashoffset: 0

</style>
