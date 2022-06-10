<template lang="pug">
  .dialog-success
    v-dialog(:value="show" height="500" width="400" persistent )
      v-card 
        v-app-bar( flat dense color="white" ) 
          v-spacer
          v-btn(icon @click="closeDialog")
            v-icon mdi-close 

        v-card-text
          .dialog-success__title Delete Service

          ui-debio-icon.dialog-success__image(
            :icon="alertTriangleIcon"
            size="87"
            stroke
          )

          .dialog-success__message By delete this Service, you might not be able to retrieve it back

          div.dialog-success__space-between(class="mt-10" v-if="isEdit")
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

          ui-debio-button.dialog-success__buttons(
            color="secondary"
            block
            @click="handleSubmit"
          ) DELETE

</template>

<script>
import {mapState} from "vuex"
import {alertTriangleIcon} from "@debionetwork/ui-icons"
import {deleteGeneticAnalystServiceFee} from "@/common/lib/polkadot-provider/command/genetic-analyst/services"

export default {
  name: "DeleteServiceDialog",

  data: () => ({
    alertTriangleIcon,
    txWeight: 0
  }),

  props: {
    show: Boolean,
    isEdit: {type: Boolean, default: false}
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      web3: (state) => state.metamask.web3,
      wallet: (state) => state.substrate.wallet
    })
  },

  async created() {
    await this.getTxWeight()
  },

  methods: {
    async getTxWeight() {
      const getTxWeight = await deleteGeneticAnalystServiceFee(this.api, this.wallet, this.show)

      this.txWeight = `${this.web3.utils.fromWei(String(getTxWeight.partialFee), "ether")}`
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

    &__space-between
      display: flex
      flex-direction: row
      justify-content: space-between

  .text-label
    @include body-text-3-opensans

  .trans-weight-icon
    font-size: 12px
    margin-left: 5px

</style>
