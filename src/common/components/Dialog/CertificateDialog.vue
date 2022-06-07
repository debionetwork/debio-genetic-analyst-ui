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
      :error="isDirty.document && isDirty.document.title"
      :rules="$options.rules.document.title"
    )
    ui-debio-input(
      variant="small"
      label="Issuing organization"
      placeholder="Add issuing organization"
      v-model="document.issuer"
      outlined
      block
      validate-on-blur
      :error="isDirty.document && isDirty.document.issuer"
      :rules="$options.rules.document.issuer"
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
          :error="isDirty.document && isDirty.document.month"
          :rules="$options.rules.document.month"
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
          :error="isDirty.document && isDirty.document.year"
          :rules="$options.rules.document.year"
        )
    ui-debio-textarea(
      variant="small"
      label="Description"
      placeholder="Add Description"
      v-model="document.description"
      validate-on-blur
      outlined
      block
      :error="isDirty.document && isDirty.document.description"
      :rules="$options.rules.document.description"
    )

    div.text-label Add supporting document (.pdf, .doc, .jpg, .png - Maximum fle size is 2MB)
    v-row(style="width: 100%")
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
          :loading="uploading"
          :disabled="uploading"
        ) Choose File
    div.text-label(v-if="errorFileMessage")
      span.text-label__error {{ errorFileMessage }}
    ui-debio-button(
      color="secondary"
      block
      @click="handleSubmit"
    ) Submit

</template>

<script>
import errorMessages from "@/common/constants/error-messages"
import {uploadFile, getFileUrl} from "@/common/lib/pinata-proxy"
import rulesHandler from "@/common/constants/rules"
import { validateForms } from "@/common/lib/validate"

const documentFormat = ["image/jpg", "image/png", "application/pdf", "application/msword"]

export default {
  name: "GACertificateDialog",
  mixins: [validateForms],

  data: () => ({
    document: {
      title: "",
      issuer: "",
      month: "",
      year: "",
      description: ""
    },
    file: {name: ""},
    supportingDocument: null, /* eslint-disable camelcase */
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
      this.document = {
        title: newVal.title,
        issuer: newVal.issuer,
        month: newVal.month,
        year: newVal.year,
        description: newVal.description
      }
      this.file = newVal.file
      this.supportingDocument = newVal.supportingDocument
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
        year
      } = this.document

      if (!title || !issuer || !month || !year || !this.supportingDocument ) return true
      return false
    }
  },

  rules: {
    document: {
      title: [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.ENGLISH_ALPHABET,
        rulesHandler.MAX_CHARACTER(50)
      ],
      issuer: [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.ENGLISH_ALPHABET,
        rulesHandler.MAX_CHARACTER(50)
      ],
      month: [
        rulesHandler.FIELD_REQUIRED
      ],
      year: [
        rulesHandler.FIELD_REQUIRED
      ],
      description: [
        rulesHandler.MAX_CHARACTER(255),
        rulesHandler.ENGLISH_ALPHABET
      ]
    }
  },

  methods: {
    handleSubmit() {
      this._touchForms("document")
      
      const isDocumentValid = Object.values(this.isDirty?.document).every(v => v !== null && v === false)
      
      if (!isDocumentValid) {
        if (!this.supportingDocument) this.errorFileMessage = errorMessages.REQUIRED

        return
      }
      
      const document = {
        ...this.document,
        file: this.file,
        supportingDocument: this.supportingDocument
      }

      this.onSubmit(document)
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
      this.errorFileMessage = ""

      const dataFile = await this.setupFileReader(file)
      const result = await uploadFile({
        title: dataFile.name,
        type: dataFile.type,
        file: dataFile
      })
      const link = getFileUrl(result.IpfsHash)
      this.supportingDocument = link
      this.file = file
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
