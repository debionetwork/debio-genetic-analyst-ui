<template lang="pug">
  ui-debio-modal(
    :show="show"
    :title="`${isEdit ? 'Edit' : 'Add'} license or certification`"
    :showCta="false"
    :cta-outlined="false"
    @onClose="handleClose"
  )
    ui-debio-input(
      variant="small"
      label="Certification Title"
      placeholder="Add Title"
      v-model="document.title"
      outlined
      block
      validate-on-blur
    )
    ui-debio-input(
      variant="small"
      label="Issuing organization"
      placeholder="Add issuing organization"
      v-model="document.issuer"
      outlined
      block
      validate-on-blur
    )
    v-row
      v-col
        ui-debio-dropdown(
          :items="selectMonths"
          variant="small"
          label="Month"
          placeholder="Select month"
          v-model="document.month"
          outlined
          close-on-select
          validate-on-blur
          block
        )
      v-col
        ui-debio-dropdown(
          :items="selectYears"
          variant="small"
          label="Year"
          placeholder="Select year"
          v-model="document.year"
          outlined
          close-on-select
          validate-on-blur
          block
        )
    ui-debio-textarea(
      variant="small"
      label="Description"
      placeholder="Add Description"
      v-model="document.description"
      validate-on-blur
      outlined
      block
    )

    div.text-label Add supporting document (.pdf, .doc, .jpg, .png - Maximum fle size is 2MB)
    v-row(style="width: 100%")
      v-col.file-wrapper(class="pr-2")
        ui-debio-input(
          variant="small"
          v-model="document.file.name"
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
          :loading="uploading"
          :disabled="uploading"
        ) Choose File
    div.text-label(v-if="errorFileMessage")
      span.text-label__error {{ errorFileMessage }}
    ui-debio-button(
      color="secondary"
      block
      @click="handleSubmit"
      :disabled="disabled || uploading"
    ) Submit

</template>

<script>
import errorMessages from "@/common/constants/error-messages"
import {uploadFile, getFileUrl} from "@/common/lib/pinata-proxy"

const documentFormat = ["image/jpg", "image/png", "application/pdf", "application/msword"]

export default {
  name: "GACertificateDialog",

  data: () => ({
    document: {
      title: "",
      issuer: "",
      month: "",
      year: "",
      description: "",
      file: {name: ""},
      supportingDocument: null /* eslint-disable camelcase */
    },
    uploading: false,
    errorFileMessage: "",
    selectMonths: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  }),

  props: {
    onSubmit: {type: Function, default: () => {}},
    show: {type: Boolean, default: false},
    isEdit: {type: Boolean, default: false},
    data: {type: Object, default: null}
  },

  watch: { 
    data: function(newVal) {
      this.document = newVal
    }
  },

  computed: {
    selectYears() {
      const years = []
      const thisYear = new Date().getFullYear()
      for (let i = thisYear; i >= 1900; i--) {
        years.push(String(i))
      }
      return years
    },

    disabled() {
      const {
        title,
        issuer,
        month,
        year,
        supportingDocument
      } = this.document

      if (!title || !issuer || !month || !year || !supportingDocument ) return true
      return false
    }
  },

  methods: {
    handleSubmit() {
      this.onSubmit(this.document)
      this.handleClose()
    },

    handleClose() {
      this.document = {
        title: "",
        issuer: "",
        month: "",
        year: "",
        description: "",
        file: {name: ""},
        supportingDocument: null /* eslint-disable camelcase */
      }
      this.$emit("close")
    },

    handleChooseFile() {
      if (this.$refs["input-file"]) this.$refs["input-file"].click()
    },

    async onFileChange(event) {
      if (!event.target.value) return
      const file = event.target.files[0]

      if (!documentFormat.includes(file.type))
        return (this.errorFileMessage = errorMessages.FILE_FORMAT("PNG/JPG/PDF/DOC"))
      else if (file.size > 2000000)
        return (this.errorFileMessage = errorMessages.FILE_SIZE(2))

      this.uploading = true
      const dataFile = await this.setupFileReader(file)
      const result = await uploadFile({
        title: dataFile.name,
        type: dataFile.type,
        file: dataFile
      })
      const link = getFileUrl(result.IpfsHash)
      this.document.supportingDocument = link
      this.document.file = file
      this.uploading = false
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

.file-wrapper
  padding: 0px

.file-input
  display: none

.text-label
  margin-bottom: -10px
  @include body-text-3-opensans
  width: 100%

  &__error
    color: #c400a5
</style>
