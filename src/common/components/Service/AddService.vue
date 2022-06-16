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
        :error="isDirty.service && isDirty.service.name"
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
        :error="isDirty.service && isDirty.service.description"
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
            :error="isDirty.service && isDirty.service.totalPrice"
            :rules="$options.rules.service.totalPrice"
          )
        v-col(md="3")
          ui-debio-dropdown(
            :items="currency"
            variant="small"
            label="Currency"
            placeholder=""
            outlined
            close-on-select
            validate-on-blur
            item-text="currency"
            item-value="currency"
            block
            v-model="service.currency"
            :error="isDirty.service && isDirty.service.currency"
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
        :error="isDirty.service && isDirty.service.duration"
        :rules="$options.rules.service.duration"
      )

      div.text-label Result Sample (.pdf, .doc, .jpg, .png - Maximum file size is 2MB)
      v-row
        v-col.file-wrapper(class="pr-2")
          ui-debio-input(
            variant="small"
            v-model="file.name"
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
            :disabled="disableService"
            block
            @click="handleSubmit"
          ) Submit

      v-row(v-else)
        v-col.file-wrapper(class="pr-2")
          ui-debio-button(
            color="secondary"
            height="2.5rem"
            :loading="loading"
            :disabled="disableService"
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
import rulesHandler from "@/common/constants/rules"
import { validateForms } from "@/common/lib/validate"

const documentFormat = [
  "image/jpg",
  "image/png",
  "application/pdf",
  "application/msword"
]

export default {
  name: "GAAddService",
  mixins: [validateForms],

  data: () => ({
    currency: [{currency: "DBIO"}],
    service: {
      name: "",
      currency: "DBIO",
      totalPrice: "",
      duration: "",
      description: ""
    },
    durationType: "Days",
    testResultSample: null,
    file: {name: ""},
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
      this.service = {
        name: newVal.name,
        totalPrice: newVal.totalPrice,
        duration: newVal.duration,
        description: newVal.description,
        currency: newVal.currency
      },
      this.durationType = newVal.durationType
      this.testResultSample = newVal.testResultSample
      this.file = newVal.file
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
      wallet: (state) => state.substrate.wallet
    }),

    disableService() {
      const {
        name,
        totalPrice,
        duration,
        description
      } = this.service

      if (!name || !totalPrice || !duration || !description || !this.testResultSample) {
        return true
      }
      return false
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
      ]
    }
  },

  methods: {
    handleSubmit() {
      this._touchForms("service")
      const isDocumentValid = Object.values(this.isDirty?.service).every(v => v !== null && v === false)
      
      if (!isDocumentValid) {
        if (!this.testResultSample) this.errorFileMessage = errorMessages.REQUIRED
        
        return
      }

      const service = {
        ...this.service,
        durationType: this.durationType,
        testResultSample: this.testResultSample,
        file: this.file
      }
      
      this.onSubmit(service)
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
      this.errorFileMessage = ""
      const dataFile = await this.setupFileReader(file)
      const result = await uploadFile({
        title: dataFile.name,
        type: dataFile.type,
        file: dataFile
      })
      const link = getFileUrl(result.IpfsHash)

      this.testResultSample = link
      this.file = file
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
