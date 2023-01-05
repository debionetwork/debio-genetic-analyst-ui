<template lang="pug">
  .dialog-stake
    v-dialog(:value="show" height="500" width="400" persistent )
      v-card 
        v-app-bar( flat dense color="white" ) 
          v-spacer
          v-btn(icon @click="closeDialog")
            v-icon mdi-close 

        v-card-text
          .dialog-stake__title(class="mb-10") Stake Onboarding

          ol.dialog-stake__content
            li.dialog-stake__message(class="mb-4") You need to stake DBIO to activate your account. There’s no locking period. Your fund can be unstaked anytime with your consent but there will be a period of 6 days to process it.
            li.dialog-stake__message(class="mb-4") By Unstaking your fund, you will be an inactive users.
            li.dialog-stake__message On the condition that your verification is rejected, your fund will be refunded.

          div.dialog-stake__space-between(class="mt-5")
            span.text-label__title Staking Amount
            span.text-label__title {{ Number(minimumStaking).toFixed(0) }} DBIO

          div.dialog-stake__space-between(class="mt-5" v-if="!sufficientBalance")
            span.text-label__error Insufficient Balance

          div.dialog-stake__space-between(class="mt-5")
            span.text-label Estimated transaction weight
              v-tooltip.visible(right)
                template(v-slot:activator="{ on, attrs }")
                  v-icon.trans-weight-icon(
                    style="font-size: 12px;"
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  ) mdi-alert-circle-outline
                span(style="font-size: 10px;") Total fee paid in DBIO to execute this transaction.
            span.text-label {{ Number(txWeight).toFixed(4) }} DBIO

          ui-debio-button.dialog-stake__buttons(
            color="secondary"
            block
            @click="handleSubmit"
            :loading="loading"
            :disabled="!sufficientBalance || loading"
          ) Stake

</template>

<script>
import {mapState} from "vuex"
import {alertTriangleIcon} from "@debionetwork/ui-icons"
import {stakeGeneticAnalystFee, queryGeneticAnalystMinimumStakeAmount} from "@debionetwork/polkadot-provider"
import { queryProfessionalHealthMinimumStakeAmount } from "@/common/lib/polkadot-provider/query/health-professional"

export default {
  name: "StakeDialog",

  data: () => ({
    alertTriangleIcon,
    txWeight: 0,
    minimumStaking: 0,
    sufficientBalance: false
  }),

  props: {
    show: Boolean,
    isEdit: {type: Boolean, default: false},
    loading: {type: Boolean, default: false},
    role: { type: String }
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      web3: (state) => state.web3Store.web3,
      wallet: (state) => state.substrate.wallet,
      walletBalance: (state) => state.substrate.walletBalance
    })
  },

  async created() {
    if (this.role === "health-professional") {
      await this.getHPMinStakingAmount()
    } else {
      await this.getMinimumStakingAmount()
    }
  },

  methods: {

    async getHPMinStakingAmount() {
      try {
        const minimumStaking = await queryProfessionalHealthMinimumStakeAmount(this.api)
        const getTxWeight = await this.getTxWeight()
        this.txWeight = `${this.web3.utils.fromWei(String(getTxWeight.partialFee), "ether")}`
        this.minimumStaking = this.web3.utils.fromWei(String(minimumStaking.toString().split(",").join("")), "ether")
        this.sufficientBalance = this.walletBalance > (Number(this.minimumStaking) + Number(this.txWeight))
      } catch (err) {
        console.error(err)
      }
    },

    async getMinimumStakingAmount() {
      try {
        const minimumStaking = await queryGeneticAnalystMinimumStakeAmount(this.api)
        const getTxWeight = await this.getTxWeight()
        this.txWeight = `${this.web3.utils.fromWei(String(getTxWeight.partialFee), "ether")}`
        this.minimumStaking = this.web3.utils.fromWei(String(minimumStaking.toString().split(",").join("")), "ether")
        this.sufficientBalance = this.walletBalance > (Number(this.minimumStaking) + Number(this.txWeight))
      } catch (err) {
        console.error(err)
      }
    },

    async getTxWeight() {
      const txWeight = await stakeGeneticAnalystFee(this.api, this.wallet.address)
      return txWeight
    },

    closeDialog() {
      this.$emit("close")
    },

    handleSubmit() {
      this.$emit("submit")
    }
  }
}
</script>


<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .dialog-stake
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
      margin: 0px 27px
      font-weight: 600
      @include button-2

    &__buttons
      margin-top: 20px 

    &__space-between
      display: flex
      flex-direction: row
      justify-content: space-between

    &__content
      background: #F5F7F9
      border-radius: 4px
      padding: 20px

  .text-label
    @include body-text-3-opensans

    &__title
      font-weight: 600
      color: #000

    &__error
      font-weight: 600
      color: #F5222D

  .trans-weight-icon
    font-size: 12px
    margin-left: 5px

</style>
