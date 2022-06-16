<template lang="pug">
  .ga-account
    .ga-account__wrapper
      .ga-account__title(ref="title") Edit Service

      .ga-account__form
        AddServiceForm(
          :onSubmit="onSubmitService" 
          :data="service" 
          :isEdit="editId !== null"
          :txWeight="Number(txWeight)"
          @cancelEdit="cancelEdit"
          editPage
        )

    SuccessDialog(
      :show="showSuccessDialog"
      title="Success"
      message="Your service has been edited!"      
      @close="showSuccessDialog = false"
      @submit="goToServicePage"
    ) 

</template>

<script>
import {mapState, mapGetters} from "vuex"
import {
  queryGeneticAnalystServicesByHashId,
  updateGeneticAnalystServiceFee,
  updateGeneticAnalystService
} from "@debionetwork/polkadot-provider"
import { getIpfsMetaData } from "@/common/lib/pinata-proxy"
import {pencilIcon, trashIcon} from "@debionetwork/ui-icons"
import AddServiceForm from "@/common/components/Service/AddService"
import DeleteDialog from "@/common/components/Dialog/DeleteServiceDialog"
import SuccessDialog from "@/common/components/Dialog/SuccessDialogGeneral"

const stepData = [
  {label: "Set Up Account", active: false},
  {label: "Set Up Service", active: true}
]

export default {
  name: "GARegistration",

  components: {AddServiceForm, DeleteDialog, SuccessDialog},

  data: () => ({
    pencilIcon,
    trashIcon,
    stepData: stepData,
    services: [],
    service: {
      name: "",
      currency: "DBIO",
      totalPrice: "",
      duration: "",
      durationType: "Days",
      description: "",
      testResultSample: null,
      file: {name: ""}
    },
    submitLoading: false,
    servicesLoading: false,
    modalDelete: null,
    editId: null,
    txWeight: 0,
    showSuccessDialog: false
  }),

  computed: {
    ...mapState({
      lastEventData: (state) => state.substrate.lastEventData,
      api: (state) => state.substrate.api,
      web3: (state) => state.metamask.web3,
      wallet: (state) => state.substrate.wallet
    }),

    ...mapGetters({
      pair: "substrate/wallet"
    })
  },

  async created() {
    await this.getData(this.$route.params.id)
    await this.getTxWeight()
  },

  methods: {
    async getData(id) {
      const data = await queryGeneticAnalystServicesByHashId(this.api, id)
      const testResultLink = await getIpfsMetaData(data?.info?.testResultSample.split("/").pop())
      const totalPrice = String(this.web3.utils.fromWei(String(data?.info?.pricesByCurrency[0].totalPrice.replaceAll(",", "") || 0), "ether"))
      
      const service = {
        name: data?.info?.name,
        currency: data?.info?.pricesByCurrency[0].currency,
        totalPrice: totalPrice,
        duration: data?.info?.expectedDuration.duration,
        durationType: data?.info?.expectedDuration.durationType,
        description: data?.info?.description,
        testResultSample: data?.info?.testResultSample,
        file: {name: testResultLink.rows[0].metadata.name}

      }
      this.service = {...service}
    },

    async getTxWeight() {
      const getTxWeight = await updateGeneticAnalystServiceFee(this.api, this.wallet, this.service)

      this.txWeight = `${this.web3.utils.fromWei(String(getTxWeight.partialFee), "ether")}`
    },

    async onSubmitService(value) {
      const id = this.$route.params.id
      const {
        currency,
        description,
        duration,
        durationType,
        name,
        testResultSample,
        totalPrice
      } = value
      const price = this.web3.utils.toWei(String(totalPrice), "ether")

      const dataToSend = {
        name,
        pricesByCurrency: [{
          currency, 
          totalPrice: price,
          priceComponents: [{component: "Main Price", value: price}]
        }],
        expectedDuration: {duration, durationType},
        description,
        testResultSample
      }

      try {
        await updateGeneticAnalystService(this.api, this.pair, id, dataToSend)

        this.showSuccessDialog = true
      } catch (error) {
        console.error(error)
      }
    },

    async goToServicePage() {
      this.$router.push({ name: "ga-services"})
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
    padding-bottom: 100px


  &__title
    display: flex
    flex-direction: column
    align-items: center
    margin-top:60px
    @include h6-opensans

  &__form
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

  &__space-between
    display: flex
    flex-direction: row
    justify-content: space-between

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

.file-item
  width: 100%
  gap: 20px
  display: flex
  flex-direction: column
  align-self: center
  padding: 12px 20px
  border-radius: 4px
  border: 2px dashed
  border-color: #8AC1FF
  background: #F9F9FF
  transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

  &:hover
    background: #f2f2ff
    border-color: #a1a1ff

.text-title,
.text-secondary,
.text-link
  @include body-text-2-opensans

.text-secondary
  color: #757274
  font-size: 12px !important

.text-link
  color: #5640A5
  font-weight: 600

.text-title
  font-weight: 600

.flex-row-wrapper
  display: flex
  flex-direction: row
</style>
