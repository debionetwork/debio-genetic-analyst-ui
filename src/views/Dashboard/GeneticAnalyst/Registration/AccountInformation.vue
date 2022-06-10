<template lang="pug">
  .ga-account
    .ga-account__wrapper
      .ga-account__stepper-wrapper
        .stepper(v-for="(item, idx) in stepData" :key="idx")
          .stepper__box-active(v-if="item.active")
            span.stepper__box-text {{ idx + 1 }}
          .stepper__box-inactive(v-else)
            span.stepper__box-text {{ idx + 1 }}
          .stepper__label {{ item.label }}
      .ga-account__title Set Up Account
      GAForm(:onSubmit="onSubmitInformation" :submitLoading="loading")
</template>

<script>
import {mapState} from "vuex"
import {registerGeneticAnalyst, createQualification} from "@debionetwork/polkadot-provider"
import { u8aToHex } from "@polkadot/util"
import CryptoJS from "crypto-js"
import Kilt from "@kiltprotocol/sdk-js"
import GAForm from "@/common/components/Account/InformationForm"

const stepData = [
  {label: "Set Up Account", active: true},
  {label: "Set Up Service", active: false}
]

export default {
  name: "GARegistration",

  components: {GAForm},

  data: () => ({
    stepData: stepData,
    publicKey: null,
    loading: false
  }),

  computed: {
    ...mapState({
      mnemonicData: (state) => state.substrate.mnemonicData,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet
    })
  },

  mounted() {
    if (this.mnemonicData) this.initialDataKey()
  },

  methods: {
    initialDataKey() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
      const publicKey = u8aToHex(cred.boxKeyPair.publicKey)
      this.publicKey = publicKey
      return publicKey
    },

    async onSubmitInformation(value) {
      this.loading = true
      const {
        certification,
        dateOfBirth,
        email,
        experiences,
        firstName,
        gender,
        lastName,
        phoneNumber,
        profileImage,
        specialization,
        specifyOther
      } = value
      const _experiences = experiences.filter(value => value != "")
      const _specialization = specialization == "Other" ? specifyOther : specialization
      const _dateOfBirth = new Date(+dateOfBirth).toLocaleString("fr-CA", {
        day: "numeric",
        year: "numeric",
        month: "numeric"
      })
      const qualification = {
        experience: _experiences,
        certification: certification
      }

      try {
        await registerGeneticAnalyst(
          this.api,
          this.wallet,
          {
            boxPublicKey: this.initialDataKey(),
            firstName,
            lastName,
            gender,
            dateOfBirth: _dateOfBirth,
            email,
            phoneNumber,
            specialization: _specialization,
            profileImage
          }
        )

        await createQualification(
          this.api,
          this.wallet,
          qualification
        )

        this.$router.push("registration/service")
      } catch (error) {
        console.error(error)
      }
      
      this.loading = false
    }
  }
}
</script>

<style lang="sass">
@import "@/common/styles/mixins.sass"

.ga-account
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

  &__stepper-wrapper
    margin-top:60px
    display: flex
    justify-content: center
    gap: 50px

.stepper
  display: flex
  flex-direction: column
  align-items: center
  gap: 10px

  &__box-active,
  &__box-inactive
    border-radius: 4px
    height: 40px
    width: 40px
    display: flex
    justify-content: center
    align-items: center
    font-weight: 600

  &__box-active
    background: #5640A5
    color: #FFFFFF

  &__box-inactive
    background: #F5F7F9
    color: #000

  &__label
    font-weight: 400
    font-size: 14px
</style>
