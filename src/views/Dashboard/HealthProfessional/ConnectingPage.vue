<template lang="pug">
  .connecting-page
    p.connecting-page__subtitle Connecting your request into Myriad
    .connecting-page__loading
      .connecting-page__logo-debio(v-if="!isConnected")
        v-img(
          alt="dbio-logo"
          src="@/assets/debio-logo.png"
          width="56px"
          height="56px"
        )

      .connecting-page__logo-myriad(v-if="isConnected")
        v-img(
          alt="myriad-logo"
          src="@/assets/myriad-logo.png"
          width="56px"
          height="56px"
        )
 
</template>

<script>
import { mapState } from "vuex"

export default {
  name: "ConnectingPage",

  data: () => ({
    isConnected: false
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      mnemonicData: (state) => state.substrate.mnemonicData
    })
  },

  watch: {
    mnemonicData(val) {
      if(val) this.initialData()
    }
  },

  async created() {
    if(this.mnemonicData) this.initialData()
  },

  mounted() {
    setTimeout(() => {
      this.isConnected = true
    }, 2400)
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .connecting-page
    height: 100vh
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center

    &__subtitle
      color: #8B93A7
      margin-bottom: 64px
      @include h5-opensans

    &__loading
      position: absolute
      width: 360px
      height: 72px
      top: 50%
      background: linear-gradient(90deg, #FFC6F4 0.79%, #C4DBFF 100%)
      border-radius: 50px

    &__logo-debio
      position: absolute
      top: 8px
      left: 8px
      animation-name: logo
      animation-duration: 3s

      @keyframes logo
        0%   
          left: 8px
        100%  
          left: 300px

    &__logo-myriad
      position: absolute
      top: 8px
      left: 300px
      animation-name: logo

</style>
