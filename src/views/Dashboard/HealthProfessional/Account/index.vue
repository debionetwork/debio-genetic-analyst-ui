<template lang="pug">
  .hp-account
    .hp-account__wrapper
      .hp-account__title Set Up Account
      .hp-account__wrapper
      GAForm(
        role="health-professional" 
        :onSubmit="onSubmitInformation"
        :onUpdate="onUpdateInformation"
      )
      StakeDialog(
        :show="showStakeDialog" 
        @close="showStakeDialog = false"
        @submit="onSubmit"
      )

      SuccessDialogGeneral(
        :show="showSuccessDialog"
        :title="title"
        buttonTitle="Back to Home"
        :message="message"
        @close="toHomePage"
        @submit="toHomePage"
      )



</template>

<script>

import { mapMutations } from "vuex"
import GAForm from "@/common/components/Account/InformationForm"
import StakeDialog from "@/common/components/Dialog/StakeDialog"
import SuccessDialogGeneral from "@/common/components/Dialog/SuccessDialogGeneral.vue"


export default {
  name: "PHAccount",

  data: () => ({
    showStakeDialog: false,
    showSuccessDialog: false,
    account: null
  }),

  components: {
    GAForm,
    StakeDialog,
    SuccessDialogGeneral
  },

  methods: {

    ...mapMutations({
      setAccount: "auth/SET_ACCOUNT"      
    }),


    async onSubmitInformation(val) {
      this.account = val
      this.showStakeDialog = true
    },

    onSubmit() {
      this.showStakeDialog = false
      this.setAccount(this.account)
      this.title="Registration Sent!"
      this.message="Your verification submission is being reviewed by Daogenics"
      this.showSuccessDialog = true
    },

    onUpdateInformation(val) {
      this.setAccount(val)
      this.title="Success"
      this.message="Your account has been edited!"      
      this.showSuccessDialog = true
    },

    toHomePage() {
      this.showSuccessDialog = false
      this.$router.push({ name: "hp-dashboard"})
    }
  }
}
</script>

<style lang="sass">
@import "@/common/styles/mixins.sass"

.hp-account
  width: 100%
  height: 100%

  &__wrapper
    display: flex
    flex-direction: column
    gap: 35px
    background: #FFFFFF
    box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
    border-radius: 0.25rem

  &__title
    display: flex
    flex-direction: column
    align-items: center
    margin-top:60px
    @include h6-opensans

  &__form
    padding-bottom: 100px
    width: 40%
    display: flex
    flex-direction: column
    align-self: center
    gap: 20px


</style>
