<template lang="pug">
  .ga-account
    .ga-account__form
      ui-debio-input(
        variant="small"
        label="Service Name"
        placeholder="Service Name"
        outlined
        block
        validate-on-blur
        v-model="service.name"
        :error="error && !service.name"
        :rules="$options.rules.service.name"
      )

      ui-debio-textarea(
        variant="small"
        label="Description"
        placeholder="Add Description"
        validate-on-blur
        outlined
        block
        v-model="service.description"
        :error="error && !service.description"
        :rules="$options.rules.service.description"
      )

      v-row(no-gutters)
        v-col(style="padding-right: 10px;")
          ui-debio-input(
            variant="small"
            label="Service Price"
            outlined
            block
            validate-on-blur
            v-model="service.totalPrice"
            :error="error && !service.totalPrice"
            :rules="$options.rules.service.totalPrice"
          )
        v-col(md="3")
          ui-debio-dropdown(
            :items="currency"
            placeholder="DBIO"
            variant="small"
            label="Currency"
            outlined
            close-on-select
            validate-on-blur
            item-text="currency"
            item-value="currency"
            block
            v-model="service.currency"
            :error="error && !service.currency"
            :rules="$options.rules.service.currency"
          )

      ui-debio-input(
        variant="small"
        label="Expected Duration"
        placeholder="In Days"
        outlined
        block
        validate-on-blur
        v-model="service.duration"
        :error="error && !service.duration"
        :rules="$options.rules.service.duration"
      )

      div.text-label Result Sample (.pdf, .doc, .jpg, .png - Maximum fle size is 2MB)
      v-row
        v-col.file-wrapper(class="pr-2")
          ui-debio-input(
            variant="small"
            v-model="service.file.name"
            label=""
            outlined
            block
            validate-on-blur
            readOnly
          )
        v-col.file-wrapper(class="pl-2")
          input.file-input(
            type="file" 
            ref="input-file" 
            accept=".pdf, .doc, .jpg, .png"
            @change="onFileChange"
          )
          ui-debio-button(
            color="secondary"
            block
            height="40px"
            @click="handleChooseFile"
            :loading="loading"
            :disabled="loading"
          ) Choose File

      div.text-label(v-if="errorFileMessage")
        span.text-error {{ errorFileMessage }}

      div.ga-account__space-between(v-if="!isBulk")
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

      v-row(v-if="editPage")
        v-col.file-wrapper
          ui-debio-button(
            color="secondary"
            height="2.5rem"
            :loading="loading"
            :disabled="loading || disableService"
            block
            @click="handleSubmit"
          ) Submit

      v-row(v-else)
        v-col.file-wrapper(class="pr-2")
          ui-debio-button(
            color="secondary"
            height="2.5rem"
            :loading="loading"
            :disabled="loading || disableService"
            block
            @click="handleSubmit"
          ) {{isEdit ? "Save" : "Add"}} Service
        v-col.file-wrapper(class="pl-2" v-if="isEdit")
          ui-debio-button(
            color="default"
            height="2.5rem"
            block
            @click="handleCancelEdit"
          ) Cancel Edit

</template>

<script>
import {mapState} from "vuex"
import errorMessages from "@/common/constants/error-messages"
import {uploadFile, getFileUrl} from "@/common/lib/pinata-proxy"
// import {createGeneticAnalystServiceFee} from "@/common/lib/polkadot-provider/command/genetic-analyst/services"
import rulesHandler from "@/common/constants/rules"

const documentFormat = [
  "image/jpg",
  "image/png",
  "application/pdf",
  "application/msword"
]

export default {
  name: "GAAddService",

  data: () => ({
    currency: [{currency: "DBIO"}],
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
    error: false,
    errorFileMessage: "",
    loading: false
  }),

  props: {
    onSubmit: {type: Function},
    data: {type: Object, default: null},
    isBulk: {type: Boolean, default: false},
    isEdit: {type: Boolean, default: false},
    editPage: {type: Boolean, default: false},
    txWeight: {type: Number, default: 0}
  },

  watch: { 
    data: function(newVal) {
      console.log("newVal", newVal)
      this.service = newVal
    },

    isEdit: function(newVal) {
      this.isEdit = newVal
    },

    txWeight: function(newVal) {
      this.txWeight = newVal
    }
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      web3: (state) => state.metamask.web3,
      wallet: (state) => state.substrate.wallet
    }),

    disableService() {
      const disabled = serviceValidation(this.service)
      
      return disabled 
    }
  },

  rules: {
    service: {
      name: [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.ENGLISH_ALPHABET,
        rulesHandler.MAX_CHARACTER(50)
      ],
      description: [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.MAX_CHARACTER(100),
        rulesHandler.ENGLISH_ALPHABET
      ],
      currency: [
        rulesHandler.FIELD_REQUIRED
      ],
      totalPrice: [
        rulesHandler.FIELD_REQUIRED,
        val => /^[0-9]+$/.test(val) || "Service price is invalid",
        rulesHandler.MAX_CHARACTER(4)
      ],
      duration: [
        rulesHandler.FIELD_REQUIRED,
        val => /^[0-9]+$/.test(val) || "Expected duration is invalid",
        rulesHandler.MAX_CHARACTER(3)
      ],
      file: [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.FILE_SIZE(2000000),
        rulesHandler.DEFAULT_IMAGE && rulesHandler.DEFAULT_ACCEPT_DOCUMENTS
      ]
    }
  },

  // async created() {
  //   await this.getServiceTxWeight()
  // },

  methods: {
    // async getServiceTxWeight() {
    //   const getTxWeight = await createGeneticAnalystServiceFee(this.api, this.wallet, this.service)

    //   this.txWeight = `${this.web3.utils.fromWei(String(getTxWeight.partialFee), "ether")}`
    // },
    
    handleSubmit() {
      if (serviceValidation(this.service)) {
        this.error = true
        return
      }

      this.onSubmit(this.service)
    },
    
    handleCancelEdit() {
      this.$emit("cancelEdit")
    },

    handleChooseFile() {
      if (this.$refs["input-file"]) this.$refs["input-file"].click()
    },

    async onFileChange(event) {
      if (!event.target.value) return
      const file = event.target.files[0]

      if (!documentFormat.includes(file.type))
        return (this.errorFileMessage = errorMessages.FILE_FORMAT(
          "PNG/JPG/PDF/DOC"
        ))
      else if (file.size > 2000000)
        return (this.errorFileMessage = errorMessages.FILE_SIZE(2))

      this.loading = true
      const dataFile = await this.setupFileReader(file)
      const result = await uploadFile({
        title: dataFile.name,
        type: dataFile.type,
        file: dataFile
      })
      const link = getFileUrl(result.IpfsHash)

      this.service.testResultSample = link
      this.service.file = file
      this.loading = false
    },

    setupFileReader(value) {
      return new Promise((resolve, reject) => {
        const file = value
        const fr = new FileReader()
        fr.onload = async function() {
          resolve(value)
        }
        fr.onerror = reject
        fr.readAsArrayBuffer(file)
      })
    }
  }
}

function serviceValidation(data) {
  const {
    name,
    totalPrice,
    duration,
    description,
    testResultSample
  } = data

  if (!name || !totalPrice || !duration || !description || !testResultSample) {
    return true
  }
  return false
}
</script>

<style lang="sass" scoped>
@import "@/common/styles/mixins.sass"

.ga-account
  width: 100%
  height: 100%

  &__form
    width: 100%
    display: flex
    flex-direction: column
    gap: 20px

  &__space-between
    display: flex
    flex-direction: row
    justify-content: space-between

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

.text-label,
.text-error
  margin-bottom: 0
  @include body-text-3-opensans


.text-error
  color: #c400a5

.icon-text,
.icon-button
  margin-right: 10px

.icon-button
  cursor: pointer

.file-input
  display: none

.trans-weight-icon
  font-size: 12px
  margin-left: 5px

</style>
