<template lang="pug">
  .dialog-success
    v-dialog(:value="show" height="500" width="400" persistent )
      v-card 
        v-app-bar( flat dense color="white" ) 
          v-spacer
          v-btn(icon @click="closeDialog")
            v-icon mdi-close 

        v-card-text
          .dialog-success__title {{ title }}

          .dialog-success__image
            v-img(v-bind:src="checkCircle" max-width="80")

          .dialog-success__message {{ message }}

          ui-debio-button.dialog-success__buttons(
            color="secondary"
            block
            @click="onSubmit"
          ) {{ buttonTitle }}

</template>

<script>

import checkCircle from "@/assets/check-circle-primary.png"


export default {
  name: "SuccessDialog",

  data: () => ({
    checkCircle
  }),


  props: {
    show: Boolean,
    title: { type: String, default: "Title" },
    message: { type: String, default: "" },
    buttonTitle: { type: String, default: "OK" }
  },

  methods: {
    closeDialog() {
      this.$emit("close")
    },

    onSubmit() {
      this.$emit("submit")
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

    &__border
      border: 1px solid #E9E9E9
      border-radius: 4px
      margin: 20px 27px

    &__buttons
      margin: 40px 0 20px 0
      width: 228px

</style>
