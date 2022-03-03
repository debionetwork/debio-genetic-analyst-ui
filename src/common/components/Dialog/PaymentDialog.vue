<template lang="pug">
  .dialog-uploading
    v-dialog(:value="show" height="500" width="400" persistent )
      v-card 
        v-app-bar( flat dense color="white" ) 

        v-card-text
          .dialog-uploading__title Payment in Progress...

          .dialog-uploading__card-loading
            SpinnerLoader(
              :color="'#C400A5'"
              :size="140"
            )

          .dialog-uploading__message
            b Please wait, do not close this tab. 
          .dialog-uploading__border-text It may take a while, 
            a.link(
              target="_blank"
              href="https://docs.debio.network/complete-guidelines/user-guideline/upload-and-encrypt-data"
              @click.stop
            ) here’s why

</template>

<script>
import checkCircle from "@/assets/check-circle-primary.png"
import SpinnerLoader from "@bit/joshk.vue-spinners-css.spinner-loader"

export default {
  name: "PaymentDialog",

  data: () => ({
    checkCircle
  }),

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

  .dialog-uploading
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
      flex-direction: column
      justify-content: center
      align-items: center
      text-align: center
      letter-spacing: -0.0075em
      text-transform: initial
      @include button-2

    &__border
      border: 1px solid #E9E9E9
      border-radius: 4px
      margin: 20px 27px

    &__border-text
      display: flex
      padding: 12px 16px
      justify-content: center
      letter-spacing: -0.004em
      @include body-text-3-opensans

    &__card-loading
      padding: 50px 0 50px 105px

  .link
    margin-left: 3px

</style>
