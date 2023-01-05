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
        role="health-professional"
        :show="showStakeDialog" 
        :loading="isLoading"
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

      ui-debio-modal(
        :show="isUsernameExist"
        :message="message"
        title="Username Exist"
        :cta-outlined="false"
        buttonTitle="Back"
        @onClose="isUsernameExist = false"
      )


</template>

<script>

import { mapState } from "vuex"
import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"
import { u8aToHex } from "@polkadot/util"
import GAForm from "@/common/components/Account/InformationForm"
import StakeDialog from "@/common/components/Dialog/StakeDialog"
import SuccessDialogGeneral from "@/common/components/Dialog/SuccessDialogGeneral.vue"
import { registerProfessionalHealth, stakeProfessionalHealth, createHealtProfessionalQualification } from "@/common/lib/polkadot-provider/command/professional-health"
import { checkMyriadUsername } from "@/common/lib/api" 
import { queryGetHealthProfessionalAccount } from "@/common/lib/polkadot-provider/query/health-professional"
import { generateUsername } from "@/common/lib/username-generator"

export default {
  name: "PHAccount",

  data: () => ({
    showStakeDialog: false,
    showSuccessDialog: false,
    isUsernameExist: false,
    account: {},
    boxPublicKey: "",
    isStaked: true,
    title: "",
    message: "",
    isLoading: false
  }),

  components: {
    GAForm,
    StakeDialog,
    SuccessDialogGeneral
  },

  computed: {
    ...mapState({
      mnemonicData: (state) => state.substrate.mnemonicData,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet
    })
  },

  watch: {
    async mnemonicData(val) {
      if(val) {
        await this.getInitialData()
        await this.getAccountDetail()
      }
    }
  },


  methods: {
    async getInitialData() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
      this.boxPublicKey =  u8aToHex(cred.boxKeyPair.publicKey)
    },

    async getAccountDetail() {
      const data = await queryGetHealthProfessionalAccount(this.api, this.wallet.address)
      if(data?.stakeStatus === "Unstaked"){
        this.isStaked = false
        this.showStakeDialog = true
      }
    },

    async onSubmitInformation(val) {

      console.log(val)
      
      const {
        profileImage,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        email,
        phoneNumber,
        registerAs,
        profHealthCategory,
        profileLink,
        anonymous,
        experiences,
        certification
      } = val



      let isUsernameExist
      let username

      if (!anonymous) {
        username = firstName.toLowerCase()+lastName.toLowerCase()
        do {
          isUsernameExist = await checkMyriadUsername(username)
          let i = 1
          username = username + i
          i++
        } while(!isUsernameExist.status)
      } else {
        username = await generateUsername()
      }

      const info = {
        boxPublicKey: this.boxPublicKey,
        profileImage,
        firstName,
        lastName,
        myriadUsername: username,
        gender,
        dateOfBirth,
        email,
        phoneNumber,
        role: registerAs,
        category: profHealthCategory,
        profileLink,
        anonymous
      }

      const _experiences = experiences.filter(value => value != "")
      await registerProfessionalHealth(
        this.api,
        this.wallet,
        info,
        async () => {
          await createHealtProfessionalQualification(
            this.api,
            this.wallet,
            _experiences,
            certification,
            this.showStakeDialog = true
          )
        }
      )
    },

    async onSubmit() {
      this.isLoading = true
      await stakeProfessionalHealth(
        this.api, 
        this.wallet,
        () => {
          this.showStakeDialog = false
          this.isLoading = false
          this.title="Registration Sent!"
          this.message="Your verification submission is being reviewed by Daogenics"
          this.showSuccessDialog = true
        }
      )
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
