<template lang="pug">
  .dialog-loading
    v-dialog(:value="show" height="500" width="400" persistent )
      v-card
        v-app-bar( flat dense color="white" )

        v-card-text
          .dialog-loading__card-loading
            SpinnerLoader(
              :color="'#C400A5'"
              :size="140"
            )

          .dialog-loading__message
            b Loading...
          
          .dialog-loading__desc
            b Please wait while we're processing your payment

</template>

<script>
import SpinnerLoader from "@bit/joshk.vue-spinners-css.spinner-loader"

export default {
  name: "LoadingDialog",

  components: {
    SpinnerLoader
  },

  props: {
    show: Boolean
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .dialog-loading
    &__card-loading
      padding: 50px 0 50px 105px
      
    &__title
      display: flex
      justify-content: center
      align-items: center
      letter-spacing: 0.0044em
      margin-top: 12px
      @include h6-opensans

    &__image
      display: flex
      justify-content: center
      align-items: center
      margin: 30px 0px

    &__message
      display: flex
      justify-content: center
      align-items: center
      text-align: center
      letter-spacing: -0.0075em
      @include h6
      margin-bottom: 25px
    
    &__desc
      display: flex
      justify-content: center
      align-items: center
      text-align: center
      letter-spacing: -0.0075em
      @include body-text-2
      margin-bottom: 25px


    

</style>
