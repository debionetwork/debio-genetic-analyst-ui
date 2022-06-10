<template lang="pug">
  .dialog-success
    v-dialog(:value="show" height="500" width="400" persistent )
      v-card 
        v-app-bar( flat dense color="white" ) 
          v-spacer
          v-btn(icon @click="closeDialog")
            v-icon mdi-close 

        v-card-text
          .dialog-success__title Insufficient Balance

          ui-debio-icon.dialog-success__image(
            :icon="alertTriangleIcon"
            size="87"
            stroke
          )

          .dialog-success__message Your transaction cannot succeed due to insufficient balance, check your account balance

          ui-debio-button.dialog-success__buttons(
            color="secondary"
            block
            @click="closeDialog"
          ) DISMIS

</template>

<script>

import {alertTriangleIcon} from "@debionetwork/ui-icons"


export default {
  name: "SuccessDialog",

  data: () => ({
    alertTriangleIcon
  }),


  props: {
    show: Boolean
  },

  methods: {
    closeDialog() {
      this.$emit("close")
    }
  }
}
</script>


<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .dialog-success
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
      align-items: center
      text-align: center
      letter-spacing: -0.0075em
      margin: 0px 27px
      font-weight: 600
      @include button-2

    &__buttons
      margin-top: 20px 

</style>
