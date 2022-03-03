<template lang="pug">
  .ga-order-details
    ui-debio-modal.ga-order-details__modal-error(
      :show="!!messageError"
      :show-title="false"
      :show-cta="false"
      @onClose="$router.push({ name: 'ga-dashboard' })"
    )
      | {{ messageError }}

    ui-debio-modal(
      :show="showModalReject"
      title="Reject Order"
      cta-title="Submit"
      :cta-action="handleSubmitRejection"
      :cta-outlined="false"
      @onClose="handleHideModalReject"
    )
      ui-debio-input(
        :error="isDirty.rejectionTitle && isDirty.rejectionTitle"
        :rules="$options.rules.rejectionTitle"
        variant="small"
        label="Title"
        placeholder="Add Title"
        v-model="rejectionTitle"
        outlined
        block
        validate-on-blur
        @change="handleRejectionTitle"
      )
      ui-debio-textarea(
        :error="isDirty.rejectionDesc && isDirty.rejectionDesc"
        :rules="$options.rules.rejectionDesc"
        variant="small"
        label="Reason"
        placeholder="Add Description"
        v-model="rejectionDesc"
        validate-on-blur
        outlined
        block
        @change="handleRejectionDesc"
      )

      .upload-section
        .upload-section__tx-details.d-flex.justify-space-between.background--primary(@mouseleave="handleShowTooltip")
          .upload-section__tx-title
            span Estimated transaction weight
            ui-debio-icon.ml-1(
              :icon="alertIcon"
              size="14"
              stroke
              @mouseenter="handleShowTooltip"
            )
            span.upload-section__tx-tooltip(
              :class="{ 'upload-section__tx-tooltip--show': showTooltip }"
            ) Total fee paid in DBIO to execute this transaction.

          span.upload-section__tx-price {{ txWeight }}

    ui-debio-icon.ga-order-details__back-button(
      :icon="chevronLeftIcon"
      size="20"
      color="#5640A5"
      role="button"
      @click="handlePrevious"
      stroke
    )

    .ga-order-details__wrapper
      ui-debio-stepper.ga-order-details__stepper(:items="computeStepper")

      h6.order-section__title {{ computeDetailsTitle }}

      section.order-section
        transition(name="transition-slide-x" mode="out-in")
          Card.order-section__hilight-description.mb-6(
            :title="rejectedOrder ? 'Title' : 'DNA Result'"
            v-if="rejectedOrder || (step === 3 && orderDataDetails.analysis_info.status !== 'Rejected')"
          )
            template(v-if="step === 1 && rejectedOrder")
              p {{ orderDataDetails.analysis_info.rejectedTitle }}
              p.order-section__subtitle Reason of rejection

            p.order-section__result-file(
              v-if="step === 3 && !rejectedOrder"
              :title="`Download ${orderDataDetails.analysis_info.fileName}`"
              :aria-label="orderDataDetails.analysis_info.fileName"
              role="button"
              @click="handleDownloadFile(orderDataDetails.analysis_info.reportLink, orderDataDetails.analysis_info.fileName)"
            ) {{ orderDataDetails.analysis_info.fileName }}

            p(v-if="hilightDescription")
              | {{ readMore ? hilightDescription : hilightDescription.substr(0, 130) }}
              a(
                v-if="hilightDescription.length >= 130"
                @click="readMore = !readMore"
                role="button"
              ) {{ readMore ? " Read less" : " Read more..." }}

        .order-section__services
          Card.service-details(:title="orderDataDetails.service_info.name")
            p.service-details__description(
              :title="orderDataDetails.service_info.description"
              :aria-label="orderDataDetails.service_info.description"
            ) {{ computeServiceDesc }}

            .service-details__time.d-flex.align-center
              ui-debio-icon.mr-2(:icon="timerIcon" size="20" stroke color="#000000")
              span(
                :title="`Expected Duration (${orderDataDetails.service_info.expectedDuration})`"
                :aria-label="orderDataDetails.service_info.expectedDuration"
              ) {{ orderDataDetails.service_info.expectedDuration }}

            .service-details__detail.d-flex.mt-5
              ui-debio-avatar.service-details__avatar.mr-4(
                :src="computeAvatar"
                :alt="orderDataDetails.analyst_info.name"
                :title="orderDataDetails.analyst_info.name"
                size="80"
              )
              .service-details__analyst
                p.service-details__analyst-name.mb-0(
                  :title="orderDataDetails.analyst_info.name"
                  :aria-label="orderDataDetails.analyst_info.name"
                ) {{ orderDataDetails.analyst_info.name }}

                p.service-details__analyst-specialization.mb-0(
                  :title="orderDataDetails.analyst_info.specialization"
                  :aria-label="orderDataDetails.analyst_info.specialization"
                ) {{ orderDataDetails.analyst_info.specialization }}

                span.service-details__analyst-price {{ orderDataDetails.service_info.price }}

          Card.order-details(title="Order ID")
            .order-details__wrapper
              span.order-details__hash(:title="orderDataDetails.id" :aria-label="orderDataDetails.id") {{ orderDataDetails.id }}
              .order-details__date.mb-4.mt-4
                b.order-details__date-label Date: 
                span.order-details__date-detail {{ orderDataDetails.createdAt }}

              b.order-details__name(
                :title="orderDataDetails.document.title"
                :aria-label="orderDataDetails.document.title"
              ) {{ orderDataDetails.document.title }}
              span.order-details__file(
                :title="`Download ${orderDataDetails.document.fileName}`"
                :aria-label="orderDataDetails.document.fileName"
                role="button"
                @click="handleDownloadFile(orderDataDetails.geneticLink, orderDataDetails.document.fileName)"
              ) {{ orderDataDetails.document.fileName }}

              .order-details__actions.d-flex.justify-space-between(v-if="orderDataDetails.analysis_info.status !== 'Rejected' && step === 1")
                ui-debio-button(
                  :disabled="computeDisabledRejection || isLoading"
                  width="130px"
                  outlined
                  color="secondary"
                  @click="handleShowModalReject"
                ) REJECT
                ui-debio-button(
                  :disabled="completed"
                  :loading="isLoading"
                  width="130px"
                  color="secondary"
                  @click="handleAcceptOrder"
                ) {{ computeButtonText }}

      transition(name="transition-slide-x" mode="out-in")
        section.upload-section.mt-6(v-if="step === 2")
          form.upload-section__forms(@submit.prevent="handleSubmitForms")
            ui-debio-file(
              v-model="document.file"
              :error="isDirty.document && isDirty.document.file"
              :rules="$options.rules.document.file"
              variant="medium"
              label="Upload Genetic Result"
              label-rules="(.pdf, .doc - Maximum fle size is 2MB)"
            )
            ui-debio-textarea(
              v-model="document.description"
              :error="isDirty.document && isDirty.document.description"
              :rules="$options.rules.document.description"
              variant="medium"
              rows="3"
              placeholder="Add comment / feedback"
              label="Comment / Feedback (Optional)"
              outlined
              block
            )

          .upload-section__tx-details.d-flex.justify-space-between(@mouseleave="handleShowTooltip")
            .upload-section__tx-title
              span Estimated transaction weight
              ui-debio-icon.ml-1(
                :icon="alertIcon"
                size="14"
                stroke
                @mouseenter="handleShowTooltip"
              )
              span.upload-section__tx-tooltip(
                :class="{ 'upload-section__tx-tooltip--show': showTooltip }"
              ) Total fee paid in DBIO to execute this transaction.

            span.upload-section__tx-price {{ txWeight }}
          ui-debio-button(block :loading="isLoading" :disabled="isLoading" @click="handleSubmitForms" color="secondary") SUBMIT

    UploadingDialog(
      :show="downloading"
      type="download"
    )
</template>

<script>
import CryptoJS from "crypto-js"
import Kilt from "@kiltprotocol/sdk-js"
import cryptWorker from "@/common/lib/ipfs/crypt-worker"

import { u8aToHex } from "@polkadot/util"
import { chevronLeftIcon, timerIcon, alertIcon } from "@debionetwork/ui-icons"
import { validateForms } from "@/common/lib/validate"
import {
  updateStatusOrder,
  rejectOrder,
  rejectOrderFee,
  submitOrderReportFee,
  submitOrderReport
} from "@/common/lib/polkadot-provider/command/genetic-analyst/orders"
import { orderDetails } from "@/common/lib/polkadot-provider/query/genetic-analyst/orders"
import { analysisDetails } from "@/common/lib/polkadot-provider/query/genetic-analyst/analysis"
import { geneticDataById } from "@/common/lib/polkadot-provider/query/genetic-analyst/geneticData"
import { serviceDetails } from "@/common/lib/polkadot-provider/query/genetic-analyst/services"
import { analystDetails } from "@/common/lib/polkadot-provider/query/genetic-analyst/analyst"
import { mapState } from "vuex"
import { generalDebounce } from "@/common/lib/utils"
import { uploadFile, getFileUrl, downloadFile, decryptFile, downloadDocumentFile, getIpfsMetaData } from "@/common/lib/pinata"
import rulesHandler from "@/common/constants/rules"

import Card from "./Card.vue"
import UploadingDialog from "@/common/components/Dialog/UploadingDialog"

export default {
  name: "GAOrderDetails",
  mixins: [validateForms],

  components: { Card, UploadingDialog },

  data: () => ({
    chevronLeftIcon,
    timerIcon,
    alertIcon,

    step: 1,
    readMore: false,
    showTooltip: false,
    isLoading: false,
    downloading: false,
    showModalReject: false,
    orderAccepted: false,
    orderRejected: false,
    messageError: null,
    publicKey: null,
    secretKey: null,
    rejectionTitle: null,
    rejectionDesc: null,
    txWeight: null,
    documentLink: null,
    orderDataDetails: {
      analysis_info: {},
      document: {},
      analyst_info: {},
      service_info: {}
    },
    hilightDescription: "",
    document: {
      file: null,
      recordLink: null,
      description: null
    },
    steppers: [
      { number: 1, title: "Confirm", active: false },
      { number: 2, title: "Upload Result", active: false },
      { number: 3, title: "Success", active: false }
    ]
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      web3: (state) => state.metamask.web3,
      mnemonicData: (state) => state.substrate.mnemonicData,
      lastEventData: (state) => state.substrate.lastEventData,
      wallet: (state) => state.substrate.wallet
    }),

    rejectedOrder() {
      return this.orderDataDetails?.analysis_info?.status === "Rejected"
    },

    completed() {
      return this.orderDataDetails?.analysis_info?.status === "ResultReady"
    },

    computeDisabledRejection() {
      return this.orderAccepted || this.orderDataDetails?.analysis_info?.status === "InProgress" || this.completed || this.orderRejected
    },

    computeButtonText() {
      return this.orderDataDetails.analysis_info.status === "InProgress" || this.orderAccepted
        ? "Upload"
        : "ACCEPT"
    },

    computeAvatar() {
      return this.orderDataDetails.analyst_info.profileImage
        ? this.orderDataDetails.analyst_info.profileImage
        : require("@/assets/defaultAvatar.svg")
    },

    computeStepper() {
      return this.steppers.map(stepper => {
        if (stepper.number === 1) return {
          ...stepper,
          active: stepper.number === this.step
        }
        return { ...stepper, active: stepper.number === this.step }
      })
    },

    computeServiceDesc() {
      const formatedDesc = this.orderDataDetails?.service_info?.description?.length >= 140
        ? `${this.orderDataDetails?.service_info?.description.slice(0, 140)}...`
        : this.orderDataDetails?.service_info?.description

      return this.orderDataDetails?.service_info?.description
        ? formatedDesc
        : "No Description"
    },

    computeDetailsTitle() {
      const sectionTitles = ["Upload Result", "Completed"]
      const GENETIC_STATUS = {
        REGISTERED: "Open",
        INPROGRESS: "In Progress",
        REJECTED: "Rejected",
        RESULTREADY: "Done"
      }

      if (this.step === 1) return this.orderDataDetails?.analysis_info?.status === "Registered"
        ? "Awaiting Order"
        : `${GENETIC_STATUS[this.orderDataDetails?.analysis_info?.status?.toUpperCase()]} Order`

      else return sectionTitles[this.step - 2]
    }
  },

  watch: {
    mnemonicData(val) {
      if (val) this.initialDataKey()
    },

    lastEventData: {
      deep: true,
      immediate: true,
      handler: generalDebounce(async function(val) {
        if (val?.section === "geneticAnalysisOrders" || val?.section === "geneticAnalysis") await this.prepareData(this.$route.params.id)
        if (val?.method === "GeneticAnalysisResultReady") this.step = 3
      }, 100)
    },

    document: {
      deep: true,
      immediate: true,
      handler: generalDebounce(async function() {
        await this.calculateDocumentFee()
      }, 500)
    }
  },

  async created() {
    if (this.mnemonicData) this.initialDataKey()
    await this.prepareData(this.$route.params.id)
  },

  rules: {
    rejectionTitle: [
      rulesHandler.FIELD_REQUIRED,
      rulesHandler.ENGLISH_ALPHABET,
      rulesHandler.MAX_CHARACTER(50)
    ],
    rejectionDesc: [
      rulesHandler.FIELD_REQUIRED,
      rulesHandler.ENGLISH_ALPHABET,
      rulesHandler.MAX_CHARACTER(255)
    ],
    document: {
      file: [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.DEFAULT_ACCEPT_DOCUMENTS,
        rulesHandler.FILE_SIZE(2000000)
      ],
      description: [
        rulesHandler.ENGLISH_ALPHABET,
        rulesHandler.MAX_CHARACTER(255)
      ]
    }
  },

  methods: {
    initialDataKey() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))

      this.publicKey = u8aToHex(cred.boxKeyPair.publicKey)
      this.secretKey = u8aToHex(cred.boxKeyPair.secretKey)
    },

    async prepareData(id) {
      try {
        const data = await orderDetails(this.api, id)

        // Prevent continue requests if the order doesn't exist on the data records
        if (!data) {
          this.messageError = "Oh no! We can't find your selected order. Please select another one"
          return
        }

        const serviceData = await serviceDetails(this.api, data.serviceId)
        const analystData = await analystDetails(this.api, data.sellerId)
        const analysisData = await analysisDetails(this.api, data.geneticAnalysisTrackingId)
        const geneticData = await geneticDataById(this.api, data.geneticDataId)

        const geneticLinkName = await getIpfsMetaData(JSON.parse(data.geneticLink)[0].split("/").pop())
        const analystReportDocument = await getIpfsMetaData(analysisData.reportLink.split("/").pop())

        this.orderDataDetails = {
          ...data,
          analysis_info: {
            ...analysisData,
            fileName: analystReportDocument?.rows[0].metadata.name
          },
          document: {
            ...geneticData,
            fileName: geneticLinkName?.rows[0].metadata.name
          },
          createdAt: new Date(+data.createdAt.replaceAll(",", "")).toLocaleString("en-GB", {
            day: "numeric",
            year: "numeric",
            month: "short"
          }),
          analyst_info: {
            ...analystData.info,
            id: analystData.accountId,
            name: `${analystData.info.firstName} ${analystData.info.lastName}`
          },
          service_info: {
            ...serviceData,
            ...serviceData.info,
            price: `
              ${Number(this.web3.utils.fromWei(String(serviceData.info.pricesByCurrency[0].totalPrice.replaceAll(",", "") || 0), "ether")).toFixed(4)}
              ${serviceData.info.pricesByCurrency[0].currency}
            `,
            expectedDuration: `${serviceData.info.expectedDuration.duration} ${serviceData.info.expectedDuration.durationType}`
          }
        }

        if (this.orderDataDetails?.analysis_info?.status === "Rejected") this.hilightDescription = this.orderDataDetails.analysis_info.rejectedDescription
        if (this.orderDataDetails?.analysis_info?.status === "InProgress") {
          const txWeight = await submitOrderReportFee(
            this.api,
            this.wallet,
            this.orderDataDetails.geneticAnalysisTrackingId,
            this.document.recordLink,
            this.document.description
          )

          this.txWeight = "Calculating..."
          this.txWeight = `${Number(this.web3.utils.fromWei(String(txWeight.partialFee), "ether")).toFixed(4)} DBIO`
          this.step = 2
          this.orderAccepted = true
        }
        if (this.completed) {
          this.hilightDescription = this.orderDataDetails?.analysis_info?.comment
          this.step = 3
        }
      } catch {
        this.messageError = "Something went wrong. Please try again later"
      }
    },

    handlePrevious() {
      if (this.step === 1 || (this.step === 3 && this.completed)) {
        this.$router.go(-1)
        return
      }

      else { this.step-- }
    },

    async handleAcceptOrder() {
      if (this.orderDataDetails.analysis_info?.status === "InProgress" || this.orderAccepted) {
        this.step = 2
        return
      }

      try {
        this.isLoading = true
        await updateStatusOrder(this.api, this.wallet, this.orderDataDetails.geneticAnalysisTrackingId, "InProgress")
        await this.calculateDocumentFee()

        this.orderAccepted = true
        this.step = 2
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async handleShowModalReject() {
      await this.calculateRejectFee()

      this.showModalReject = true
    },

    async handleHideModalReject() {
      this.showModalReject = false
      this.txWeight = null
    },

    async handleSubmitRejection() {
      try {
        await rejectOrder(
          this.api,
          this.wallet,
          this.orderDataDetails.geneticAnalysisTrackingId,
          this.rejectionTitle,
          this.rejectionDesc
        )

        this.showModalReject = false
        this.orderRejected = true
      } catch (e) {
        this.orderRejected = false
        console.error(e);
      } finally {
        this.txWeight = null
      }
    },

    async handleRejectionTitle() {
      await this.calculateRejectFee()
    },

    async handleRejectionDesc() {
      await this.calculateRejectFee()
    },

    async calculateRejectFee() {
      const txWeight = await rejectOrderFee(this.api, this.wallet, this.orderDataDetails.geneticAnalysisTrackingId, this.rejectionTitle, this.rejectionDesc)
      this.txWeight = "Calculating..."
      this.txWeight = `${Number(this.web3.utils.fromWei(String(txWeight.partialFee), "ether")).toFixed(4)} DBIO`
    },

    async calculateDocumentFee() {
      const txWeight = await submitOrderReportFee(
        this.api,
        this.wallet,
        this.orderDataDetails.geneticAnalysisTrackingId,
        this.document.recordLink,
        this.document.description
      )

      this.txWeight = "Calculating..."
      this.txWeight = `${Number(this.web3.utils.fromWei(String(txWeight.partialFee), "ether")).toFixed(4)} DBIO`
    },

    async handleDownloadFile(link, name) {
      try {
        this.downloading = true
        let decryptedArrays = []
        const pair = { publicKey: this.orderDataDetails.customerBoxPublicKey, secretKey: this.secretKey }
        const computeFileName = name ? name : link.split("/").pop()

        if (/^\[/.test(link)) {
          const links = JSON.parse(link)
          let fileType

          for (let i = 0; i < links.length; i++) {
            const { type, data } = await downloadFile(links[i], true)
            const decryptedFile = decryptFile([data], pair, type)
            fileType = type
            decryptedArrays = [...decryptedArrays, ...decryptedFile]
          }

          const unit8Arr = new Uint8Array(decryptedArrays)
          await downloadDocumentFile(unit8Arr, computeFileName, fileType)
        } else {
          const { type, data } = await downloadFile(link, true)
          const decryptedFile = decryptFile(data, pair, type)
          await downloadDocumentFile(decryptedFile, computeFileName, type)
        }

      } catch (error) {
        console.error(error)
      } finally {
        this.downloading = false
      }
    },

    async handleSubmitForms() {
      this._touchForms("document")
      this._resetForms("document", "description")
      const { description: docDescription, file: docFile } = this.isDirty?.document
      if (docDescription || docFile) return

      try {
        this.isLoading = true
        const dataFile = await this.processFile()
        await this.upload({
          encryptedFileChunks: dataFile.chunks,
          fileName: dataFile.fileName,
          fileType: dataFile.fileType
        })

        await submitOrderReport(
          this.api,
          this.wallet,
          this.orderDataDetails.geneticAnalysisTrackingId,
          this.document.recordLink,
          this.document.description
        )

        await updateStatusOrder(this.api, this.wallet, this.orderDataDetails.geneticAnalysisTrackingId, "ResultReady")
      } catch (e) {
        this.isLoading = false
        console.error(e)
      }
    },

    async processFile() {
      const context = this
      const fr = new FileReader()
      const { file } = this.document
      return new Promise((resolve, reject) => {
        fr.onload = async function() {
          try {
            const encrypted = await context.encrypt({
              text: fr.result,
              fileType: file.type,
              fileName: file.name
            })

            resolve(encrypted)
          } catch(e) {
            console.error(e)
          }
        }

        fr.onerror = reject
        fr.readAsArrayBuffer(file)
      })
    },

    async encrypt({ text, fileType, fileName }) {
      const context = this
      const arrChunks = []
      let chunksAmount

      const pair = {
        secretKey: this.secretKey,
        publicKey: this.orderDataDetails.customerBoxPublicKey
      }

      return await new Promise((resolve, reject) => {
        try {
          cryptWorker.workerEncryptFile.postMessage({ pair, text, fileType }) // Access this object in e.data in worker
          cryptWorker.workerEncryptFile.onmessage = async (event) => {
            if (event.data.chunksAmount) {
              chunksAmount = event.data.chunksAmount
              return
            }

            arrChunks.push(event.data)
            context.encryptProgress = (arrChunks.length / chunksAmount) * 100

            if (arrChunks.length === chunksAmount) {
              resolve({
                fileName: fileName,
                chunks: arrChunks,
                fileType: fileType
              })
            }
          }
        } catch (err) {
          reject(new Error(err.message))
        }
      })
    },

    async upload({ encryptedFileChunks, fileType, fileName }) {
      const data = JSON.stringify(encryptedFileChunks)
      const blob = new Blob([data], { type: fileType })

      const result = await uploadFile({
        title: fileName,
        type: fileType,
        file: blob
      })

      const link = getFileUrl(result.IpfsHash)

      this.document.recordLink = link
    },

    handleShowTooltip(e) {
      if (e.type === "mouseenter") {
        this.showTooltip = true
      } else {
        this.showTooltip = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .ga-order-details
    padding: 15px 15px 80px
    background: #ffffff
    border-radius: 4px

    &__modal-error
      &::v-deep
        .ui-debio-modal__card
          width: unset !important

    &__wrapper
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center

    &__back-button
      width: max-content
      border-radius: 4px
      padding: 5px
      margin-bottom: 1rem
      background: #F5F7F9

    &__stepper
      margin-bottom: 40px

    &::v-deep
      .ui-debio-modal__card
        width: 400px

  .order-section
    width: 100%
    max-width: 704px
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center

    &__hilight-description
      width: 100%

    &__result-file
      overflow: hidden
      text-overflow: ellipsis
      white-space: pre
      width: max-content
      max-width: 470px
      color: #5640A5

    &__subtitle
      @include button-2

    &__title
      color: #595959
      margin-bottom: 40px
      @include h6-opensans

    &__services
      display: flex
      gap: 24px

  .upload-section,
  .upload-section__forms
    display: flex
    flex-direction: column
    gap: 16px
    width: 100%
    max-width: 704px

  .upload-section
    &__tx-title,
    &__tx-price
      @include body-text-3

    &__tx-title
      position: relative
      display: flex
      align-items: center

    &__tx-tooltip
      max-width: 143px
      padding: 10px
      position: absolute
      top: 35px
      z-index: 10
      background: #fff
      border: 1px solid #D3C9D1
      right: -120px
      transition: all .3s ease-in-out
      visibility: hidden
      opacity: 0
      @include tiny-reg

      &::after
        position: absolute
        content: ""
        display: block
        top: -20px
        height: 20px
        border-color: transparent transparent #FFF transparent
        border-style: solid
        border-width: 8px

      &::before
        position: absolute
        content: ""
        display: block
        top: -21px
        height: 20px
        border-color: transparent transparent #D3C9D1 transparent
        border-style: solid
        border-width: 8px

      &--show
        opacity: 1
        visibility: visible

    &__tx-price
      color: #444444

  .service-details
    &__description
      width: 280px
      font-size: 14px
      text-align: justify

    &__analyst-name,
    &__analyst-specialization
      overflow: hidden
      text-overflow: ellipsis
      white-space: pre
      max-width: 170px

    &__analyst
      width: 100%
      position: relative

    &__analyst-name
      @include button-2

    &__analyst-specialization
      @include body-text-2

    &__analyst-price
      position: absolute
      bottom: 0
      right: 0
      color: #F006CB
      @include body-text-3-opensans-medium

  .transition-slide-x
    &-enter-active,
    &-leave-active
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

    &-enter
      opacity: 0
      transform: translateX(1.563rem)

    &-leave-to
      opacity: 0
      transform: translateX(-12.813rem)

  .order-details
    &__wrapper
      display: flex
      flex-direction: column

    &__actions
      margin-top: 53px

    &__hash,
    &__name,
    &__file
      overflow: hidden
      text-overflow: ellipsis
      max-width: 279px

    &__name
      white-space: pre
      @include button-2

    &__file
      width: max-content
      margin-top: 10px
      font-size: 14px
      color: #5640A5

    &__date-label
      @include button-2

    &__date-detail
      @include body-text-2
</style>
