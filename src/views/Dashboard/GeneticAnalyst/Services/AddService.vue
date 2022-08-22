<template lang="pug">
  .ga-account
    .ga-account__wrapper
      .ga-account__title(ref="title") Add Service

      .ga-account__form
        AddServiceForm(
          :onSubmit="onSubmitService" 
          :data="service" 
          :isEdit="editId !== null"
          @cancelEdit="cancelEdit"
          isBulk
        )

        v-progress-circular(
          indeterminate 
          color="primary" 
          style="align-self: center"
          v-if="servicesLoading"
        )

        .file-item(v-if="services.length > 0" v-for="(item, idx) in services" :key="idx")
          DeleteDialog(
            :show="modalDelete === idx" 
            @close="modalDelete = null"
            @submit="deleteService"
          )
          .ga-account__space-between
            span.text-title {{ item.name }}
            span.text-secondary {{ item.pricesByCurrency[0].totalPrice }} {{ item.pricesByCurrency[0].currency }}
          span.text-secondary {{ item.description }}
          span.text-title Service Duration: {{ item.expectedDuration.duration }} {{ item.expectedDuration.durationType }}
          .ga-account__space-between
            span.text-link {{ item.file ? limitChar(item.file.name, 32) : "" }}
            .flex-row-wrapper 
              ui-debio-icon.icon-text.icon-button(
                :icon="pencilIcon"
                size="15"
                color="#989898"
                stroke
                @click="editService(idx)"
              )
              ui-debio-icon.icon-button(
                :icon="trashIcon"
                size="15"
                color="#989898"
                fill
                class="ml-2"
                @click="modalDelete = idx"
              )
        ui-debio-button(
          color="secondary"
          height="2.5rem"
          :loading="submitLoading"
          :disabled="submitLoading"
          block
          @click="onSubmit"
          v-if="services.length > 0"
        ) Submit

</template>

<script>
import {mapState, mapGetters} from "vuex"
import {
  bulkCreateGeneticAnalystService
} from "@debionetwork/polkadot-provider"
import {pencilIcon, trashIcon} from "@debionetwork/ui-icons"
import AddServiceForm from "@/common/components/Service/AddService"
import DeleteDialog from "@/common/components/Dialog/DeleteServiceDialog"

const stepData = [
  {label: "Set Up Account", active: false},
  {label: "Set Up Service", active: true}
]

export default {
  name: "GARegistration",

  components: {AddServiceForm, DeleteDialog},

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
    editId: null
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      web3: (state) => state.web3Store.web3,
      wallet: (state) => state.substrate.wallet
    }),

    ...mapGetters({
      pair: "substrate/wallet"
    })
  },

  methods: {
    onSubmitService(value) {
      const {
        currency,
        description,
        duration,
        durationType,
        file,
        name,
        testResultSample,
        totalPrice
      } = value

      const dataToSend = {
        name,
        pricesByCurrency: [{currency, totalPrice}],
        expectedDuration: {duration, durationType},
        description,
        testResultSample
      }

      const services = this.services

      if (this.editId !== null) {
        services[this.editId] = {...dataToSend, file: {name: file.name}}
        this.editId = null
      } else {
        services.push({
          ...dataToSend,
          file: {name: file.name}
        })
      }
      
      this.clearForm()
    },

    editService(id) {
      this.editId = id
      const data = this.services[id]
      
      const service = {
        name: data.name,
        currency: "DBIO",
        totalPrice: data.pricesByCurrency[0].totalPrice,
        duration: data.expectedDuration.duration,
        durationType: "Days",
        description: data.description,
        testResultSample: data.testResultSample,
        file: data.file
      }
      
      this.service = service
      const element = this.$refs["title"];
      const top = element.offsetTop;
      window.scrollTo(0, top)
    },

    cancelEdit() {
      this.clearForm()
      this.editId = null
    },

    deleteService() {
      const services = this.services
      services.splice(this.modalDelete, 1)

      this.services = services
      this.modalDelete = null
    },

    async onSubmit() {
      const services = []
      const data = this.services
      this.submitLoading = true

      data.forEach(service => {
        const totalPrice = this.web3.utils.toWei(String(service.pricesByCurrency[0].totalPrice), "ether")
        delete service.file

        services.push({
          ...service, 
          pricesByCurrency: [{
            currency: service.pricesByCurrency[0].currency,
            totalPrice: totalPrice,
            priceComponents: [{component: "Main Price", value: totalPrice}]
          }]
        })
      });

      try {
        await bulkCreateGeneticAnalystService(this.api, this.wallet, services)

        this.$router.push({ name: "ga-services"})
      } catch (error) {
        console.error(error)
      }
      this.submitLoading = false
    },

    clearForm() {
      this.service = {
        name: "",
        currency: "DBIO",
        totalPrice: "",
        duration: "",
        durationType: "Days",
        description: "",
        testResultSample: null,
        file: {name: ""}
      }
    },

    limitChar(value, limit) {
      return value.length > limit ? `${value.substring(0, limit)}...` : value
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
