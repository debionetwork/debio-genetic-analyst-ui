<template lang="pug">
  .dialog-cancel
    v-dialog(:value="show" height="350" width="400" persistent )
      v-card 
        v-toolbar-title(class="title d-flex justify-end align-center" style="width: 100%;")
          v-btn(icon @click="closeDialog")
            v-icon.me-5.mt-5(style="font-size: 20px;") mdi-close
        

        v-card-text.mt-5.pa-6(align="center" v-if="!inputPassword")
          .dialog-cancel__title
            b.mt-5.pa-5 Do you want to cancel ?
          
          .dialog-cancel__message
            p.mt-5.pl-12.pr-12(class="text-h6" ) Your request test process will be cancelled

          div(class="d-flex justify-space-between align-center pa-10")
            ui-debio-button(
              color="secondary" 
              width="120px"
              height="35"
              @click="closeDialog"
              style="font-size: 10px;"
              outlined 
            ) No

            ui-debio-button(
              color="secondary" 
              width="120px"
              height="35"
              style="font-size: 10px;"
              @click="cancelOrder"
            ) Yes

        div(class="mb-2 ml-10 mr-10 pa-10" v-if="inputPassword")      
          div(align="center") 
            b(class="mb-2" )
            v-text-field(
              label="Input DeBio Password "
              class="mt-2 password-field"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              :rules="[val => !!val || 'Password is required']"
              @click:append="showPassword = !showPassword"
              outlined
              auto-grow
              v-model="password"
            )

            v-btn(
              depressed
              color="secondary"
              large
              width="100%"
              @click="cancelOrder") Continue
            v-alert(v-if="error" dense text type="error") {{ error }}              

          
</template>

<script>
import { mapState } from "vuex"
import { cancelOrder } from "@/common/lib/polkadot-provider/command/orders.js"

export default {
  name: "CancelDialog",

  data: () => ({
    password: "",
    error: "",
    showPassword: false,
    inputPassword: false
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet
    })  
  },

  props: {
    show: Boolean,
    orderId: String
  },

  methods : {
    async cancelOrder() {
      if (this.wallet.isLocked) {
        this.inputPassword = true
        await this.wallet.decodePkcs8(this.password)
      }
      
      await cancelOrder(
        this.api,
        this.wallet,
        this.orderId
      )

      this.password = ""
      this.$emit("cancel")
      this.$emit("close")    
    },

    closeDialog() {
      this.inputPassword = false
      this.$emit("close")
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .dialog-cancel
    &__title
      color: black
      @include h5-opensans

    &__message
      @include body-text-1
</style>
