<template lang="pug">
  .warning-dialog
    v-dialog(:value="show" height="500" width="400" persistent )
      v-card 
        v-app-bar( flat dense color="white" ) 
          v-spacer
          v-btn(icon @click="closeDialog")
            v-icon mdi-close 

        v-card-text
          .warning-dialog__title {{ title }}

          .warning-dialog__image
            ui-debio-icon(:icon="alertIcon" stroke size="100")

          .warning-dialog__message {{ message }}

          ui-debio-button.warning-dialog__buttons(
            color="primary"
            block
            @click="onSubmit"
          ) {{ btnMessage }}

</template>

<script>

import { alertIcon } from "@debionetwork/ui-icons"

export default {
  name: "WarningDialog",

  data: () => ({
    alertIcon
  }),


  props: {
    show: Boolean,
    title: { type: String, default: "Title" },
    btnMessage: { type: String, default: "Submit" },
    message: { type: String, default: "" }
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

  .warning-dialog
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
      letter-spacing: -0.0075em
      margin: 0px 27px
      font-weight: 600
      @include button-2

    &__buttons
      margin-top: 30px 

</style>
