<template lang="pug">
  .ga-account
    .ga-account__wrapper
      .ga-account__title Account
      .ga-account__form
        .avatar
          v-avatar.avatar__image(
            size="100"
            tile
          ) 
            img(:src="computeAvatar")
          div.avatar__upload
            span Upload fle (.jpg, .png - Maximum fle size is 2MB)
            input.file-input(
              type="file" 
              ref="input-file" 
              accept=".png, .jpg" 
              @change="handleFileChange" 
              :rules="$options.rules.profile.profileImage"
            )
            ui-debio-button(
              color="primary"
              @click="handleChooseFile"
              :loading="isProfileLoading"
              :disabled="isProfileLoading"
            ) Upload
            span.text-error(v-if="error && !profile.profileImage") This field is required
            span.text-error(v-else-if="errorProfile") {{errorProfile}}
        span.text-title Basic Information

        v-row
          v-col
            ui-debio-input(
              :error="error && !profile.firstName"
              :rules="$options.rules.profile.name"
              variant="small"
              label="First Name"
              placeholder="Add First Name"
              v-model="profile.firstName"
              outlined
              block
              validate-on-blur
            )
          v-col
            ui-debio-input(
              :error="error && !profile.lastName"
              :rules="$options.rules.profile.name"
              variant="small"
              label="Last Name"
              placeholder="Add Last Name"
              v-model="profile.lastName"
              outlined
              block
              validate-on-blur
            )

        label.text-label Sex 

        v-radio-group.ga-account__radio-input(
          v-model="profile.gender"
          row
        )
          v-radio(label="Male" value="Male")
          v-radio(label="Female" value="Female")
        span.text-error(v-if="error && !profile.gender") This field is required

        ui-debio-input(
          :error="error && !profile.dateOfBirth"
          :rules="$options.rules.profile.date"
          variant="small"
          label="Date of Birth"
          placeholder="Add Date of Birth"
          v-model="profile.dateOfBirth"
          outlined
          block
          validate-on-blur
          type="date"
          :max="new Date().toISOString().slice(0, 10)"
        )

         ui-debio-input(
          :error="error && !profile.phoneNumber"
          :rules="$options.rules.profile.phoneNumber"
          variant="small"
          label="Phone"
          placeholder="Add Phone Number"
          v-model="profile.phoneNumber"
          outlined
          block
          validate-on-blur
          style="margin-top: 15px;"
        )

        ui-debio-input(
          :error="error && !profile.email"
          :rules="$options.rules.profile.email"
          variant="small"
          label="Email"
          placeholder="Add Email"
          v-model="profile.email"
          outlined
          block
          validate-on-blur
        )

        ui-debio-input(
          :error="error && !profile.profileLink"
          :rules="$options.rules.profile.profileLink"
          variant="small"
          label="Linkedin URL"
          placeholder="Add Linkedin"
          v-model="profile.profileLink"
          outlined
          block
          validate-on-blur
        )
       
        label.text-label Staking Amount

        v-row(no-gutters)
          v-col(style="padding-right: 10px;")
            ui-debio-input(
              :error="false"
              variant="small"
              :placeholder="stakeAmount"
              disabled
              outlined
              block
              validate-on-blur
            )
          v-col(md="3")
            ui-debio-button(
              color="secondary"
              width="auto"
              height="40px"
              :disabled="stakingStatus != 'Staked' || isLoading"
              :loading="unstakeLoading"
              @click="onUnstake"
              block
            ) Unstake
                
        label.text-label(
          v-if="stakingStatus == 'WaitingForUnstaked'"
        ) Your staking amount will be returned on 9/2/2022. You can stake again after your unstake period finished.

        label.text-title Set Availability
          v-tooltip.visible(right)
            template(v-slot:activator="{ on, attrs }")
              v-icon.trans-weight-icon(
                style="font-size: 12px;"
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
              ) mdi-alert-circle-outline
            span(style="font-size: 10px;") You can close your service by turn it to unavailable, and your service won’t be visible for user to order. You can turn it to available if you are ready to take the order again. 

        div.avatar
          ui-debio-button(
            color="secondary"
            width="125px"
            height="35px"
            :outlined="profile.availabilityStatus !== 'Available' || stakingStatus != 'Staked'"
            :disabled="stakingStatus != 'Staked' || isLoading"
            :loading="loadingAvailability"
            @click="handleAvailability('Available')"
          ) Available
          ui-debio-button(
            color="secondary"
            width="135px"
            height="35px"
            :outlined="profile.availabilityStatus !== 'Unavailable' || stakingStatus != 'Staked'"
            :disabled="stakingStatus != 'Staked' || isLoading"
            :loading="loadingAvailability"
            @click="handleAvailability('Unavailable')"
            style="margin-left: 10px;"
          ) Unavailable

        label.text-title Qualification

        ui-debio-dropdown(
          :items="categories"
          :rules="$options.rules.profile.date"
          :error="error && !profile.specialization && !profile.specialization != 'Other'"
          variant="small"
          label="Specialization"
          placeholder="Select Specialization"
          v-model="profile.specialization"
          item-text="specialization"
          item-value="specialization"
          outlined
          close-on-select
          validate-on-blur
          block
        )

        ui-debio-input(
          v-if="profile.specialization == 'Other'"
          :error="error && (!profile.specifyOther && profile.specialization == 'Other')"
          :rules="$options.rules.profile.name"
          variant="small"
          label="Specify Others"
          placeholder="Add Specify Others"
          v-model="profile.specifyOther"
          outlined
          block
          validate-on-blur
        )

        div.ga-account__space-between(
          v-for="(experience, idx) in profile.experiences"
          :key="idx"
        )
          ui-debio-input(
            :error="error && !profile.experiences[idx]"
            :rules="$options.rules.profile.experience"
            variant="small"
            label="Experience"
            placeholder="Add Experience"
            v-model="profile.experiences[idx].title"
            outlined
            block
            validate-on-blur
          )
          v-icon.ga-account__icon-experience(
            color="#C400A5"
            v-if="profile.experiences.length > 1"
            @click="removeExperience(idx)"
          ) mdi-close-circle-outline

        label.text-secondary(
          @click="addExperience"
          v-if="profile.experiences.length < 10"
        ) + Add Experience

        div.ga-account__space-between
          span.text-title Certification
          ui-debio-button(
            color="secondary"
            width="35px"
            height="35px"
            @click="handleAddFile"
          ) 
            v-icon mdi-plus
        
        template(v-if="profile.certification.length > 0")
          .ga-account__file-item(v-for="(item, index) in profile.certification" :key="index + 10")
            ui-debio-modal.modal-confirm(
              :show="showModalConfirm === index"
              title="Do you want to delete ?"
              @onClose="showModalConfirm = null"
            )
              span.modal-confirm__title By deleting this file, your file will not be uploaded
              .modal-confirm__cta.d-flex.justify-space-between(slot="cta")
                ui-debio-button(
                  outlined
                  width="100"
                  color="secondary"
                  @click="showModalConfirm = null"
                ) No
                ui-debio-button(
                  width="100"
                  color="secondary"
                  @click="deleteFile(index)"
                ) Yes

            .text-title {{ item.title }}
            .text-label {{ item.description}}
            .ga-account__space-between
              .avatar
                ui-debio-icon.icon-text(
                  :icon="fileTextIcon"
                  size="28"
                  color="#D3C9D1"
                  fill
                )
                .ga-account__file-name {{ item.file ? limitChar(item.file.name) : "" }}

              .avatar 
                ui-debio-icon.icon-text.icon-button(
                  :icon="pencilIcon"
                  size="15"
                  color="#989898"
                  stroke
                  @click="onEditFile(item, index)"
                )
                ui-debio-icon.icon-button(
                  :icon="trashIcon"
                  size="15"
                  color="#989898"
                  fill
                  @click="showModalConfirm = index"
                )
        span.text-no-file(v-else) You're currently don't have certifcation

        div.ga-account__space-between
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

        ui-debio-button(
          color="secondary"
          height="2.5rem"
          :loading="isLoading"
          :disabled="isLoading"
          @click="handleSave"
          block
        ) Save

        ui-debio-modal(
          :show="showModal"
          :title="`${isEdit ? 'Edit' : 'Add'} license or certification`"
          :showCta="false"
          :cta-outlined="false"
          @onClose="onCloseModalDocument"
        )
          ui-debio-input(
            :error="errorDoc && !document.title"
            :rules="$options.rules.document.title"
            variant="small"
            label="Certification Title"
            placeholder="Add Title"
            v-model="document.title"
            outlined
            block
            validate-on-blur
          )
          ui-debio-input(
            :error="errorDoc && !document.issuer"
            :rules="$options.rules.document.issuer"
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
                :error="errorDoc && !document.month"
                :rules="$options.rules.document.month"
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
                :error="errorDoc && !document.year"
                :rules="$options.rules.document.year"
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
            :error="isDirty.document && isDirty.document.description"
            :rules="$options.rules.document.description"
            v-model="document.description"
            validate-on-blur
            outlined
            block
          )
          ui-debio-file(
            :error="errorDoc && !document.supportingDocument"
            :rules="$options.rules.document.file"
            :clearFile="clearFile"
            v-model="document.file"
            variant="small"
            accept=".pdf, .doc, .jpg, .png"
            label="Add supporting file"
            notes="(.pdf, .doc, .jpg, .png - Maximum fle size is 2MB)"
            validate-on-blur
          )
          ui-debio-button(
            :loading="loadingDoc"
            :disabled="loadingDoc"
            @click="onSubmitFile"
            color="secondary"
            block
          ) Submit

    SuccessDialog(
      :show="isSuccess"
      title="Success"
      message="Your account has been edited!"      
      @close="isSuccess = false"
      @submit="goToDashboard"
    ) 

    ConfirmationDialog(
      :show="showUnstakeDialog"
      :txWeight="unstakeTxWeight"
      title="Unstake"
      btnMessage="Unstake"
      message="Your account will be deactivated until you stake again and your staking amount will be returned after 144 hours or 6 days"
      this.isLoding = true
      @close="showUnstakeDialog = false"
      @click="handleUnstake"
    )

    WarningDialog(
      :show="showActiveOrder"
      title="Unfinished Order"
      btnMessage="Go to Dashboard"
      message="You still have active orders to complete. Resume any pending orders before continuing with this process."
      @close="showActiveOrder = false"
      @submit="goToDashboard"
    )
</template>

<script>
import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"
import { u8aToHex } from "@polkadot/util"
import {
  updateGeneticAnalyst,
  updateGeneticAnalystAvailabilityStatus,
  unstakeGeneticAnalyst,
  queryGeneticAnalystByAccountId,
  queryGeneticAnalystQualificationsByHashId,
  updateQualification,
  unstakeGeneticAnalystFee,
  createQualificationFee,
  registerGeneticAnalystFee
} from "@debionetwork/polkadot-provider"
import { uploadFile, getFileUrl, getIpfsMetaData } from "@/common/lib/pinata-proxy"
import { getSpecializationCategory, GAGetOrders } from "@/common/lib/api"
import { fileTextIcon, pencilIcon, trashIcon } from "@debionetwork/ui-icons"
import { mapState } from "vuex"
import { validateForms } from "@/common/lib/validate"
import localStorage from "@/common/lib/local-storage"
import rulesHandler from "@/common/constants/rules"
import errorMessage from "@/common/constants/error-messages"
import SuccessDialog from "@/common/components/Dialog/SuccessDialogGeneral"
import ConfirmationDialog from "./ConfirmationDialog.vue"
import WarningDialog from "@/common/components/Dialog/WarningDialog"
import errorMessages from "@/common/constants/error-messages"

const initialData = {
  title: "",
  issuer: "",
  month: "",
  year: "",
  description: "",
  file: null,
  supportingDocument: null /* eslint-disable camelcase */
}

const imageType = ["image/jpg", "image/png", "image/jpeg"]

export default {
  name: "GAAccount",
  mixins: [validateForms],

  components: { SuccessDialog, ConfirmationDialog, WarningDialog },

  data: () => ({
    fileTextIcon,
    pencilIcon,
    trashIcon,
    publicKey: null,
    secretKey: null,
    showModalConfirm: null,
    isSuccess: false,
    error: false,
    errorDoc: false,
    isProfileLoading: false,
    showModal: false,
    showUnstakeDialog: false,
    isEdit: false,
    cardBlock: false,
    clearFile: false,
    loadingDoc: false,
    isLoading: false,
    loadingAvailability: false,
    unstakeLoading: false,
    showActiveOrder: false,
    hasActiveOrder: false,
    orderLists: [],
    profile: {
      profileImage: "",
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: null,
      email: "",
      phoneNumber: "",
      profileLink: "",
      specialization: null,
      specifyOther: "",
      availabilityStatus: "",
      experiences: [{title: ""}],
      certification: [],
      qualificationId: null
    },
    document: {...initialData},
    stakingStatus: "",
    errorProfile: "",
    countries: [],
    categories: [],
    certificate: null,
    editId: null,
    txWeight: null,
    unstakeTxWeight: null,
    stakeAmount: "",
    selectMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  }),

  computed: {
    ...mapState({
      mnemonicData: (state) => state.substrate.mnemonicData,
      api: (state) => state.substrate.api,
      web3: (state) => state.web3Store.web3,
      wallet: (state) => state.substrate.wallet
    }),

    computeAvatar() {
      return this.profile.profileImage
        ? this.profile.profileImage
        : require("@/assets/image-placeholder.png")
    },

    selectYears() {
      const years = []
      const thisYear = new Date().getFullYear()
      for (let i = thisYear; i >= 1900; i--) {
        years.push(String(i))
      }
      return years
    }
  },

  watch: {
    mnemonicData(val) {
      if (val) this.initialDataKey()
    }
  },

  rules: {
    profile: {
      name: [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.MAX_CHARACTER(50),
        rulesHandler.ENGLISH_ALPHABET
      ],
      experience: [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.MAX_CHARACTER(100),
        rulesHandler.ENGLISH_ALPHABET
      ],
      date: [
        rulesHandler.FIELD_REQUIRED
      ],
      email:  [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.EMAIL,
        rulesHandler.MAX_CHARACTER(255),
        rulesHandler.ENGLISH_ALPHABET
      ],
      phoneNumber:  [
        rulesHandler.FIELD_REQUIRED,
        val => /^[0-9]+$/.test(val) || "Phone number is invalid",
        rulesHandler.MAX_CHARACTER(12)
      ],
      profileImage: [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.FILE_SIZE(2000000),
        rulesHandler.DEFAULT_IMAGE
      ],
      profileLink: [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.ENGLISH_ALPHABET,
        rulesHandler.MAX_CHARACTER(255),
        rulesHandler.WEBSITE
      ]
    },
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
        (val) => !!val || errorMessage.REQUIRED
      ],
      year: [
        (val) => !!val || errorMessage.REQUIRED
      ],
      description: [
        rulesHandler.MAX_CHARACTER(255),
        rulesHandler.ENGLISH_ALPHABET
      ],
      file: [
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.FILE_SIZE(2000000),
        rulesHandler.DEFAULT_IMAGE && rulesHandler.DEFAULT_ACCEPT_DOCUMENTS
      ]
    }
  },

  async created() {
    if (this.mnemonicData) this.initialDataKey()
    this.isLoading = true
    await this.getAccountData()
    await this.getSpecialization()
    await this.getActiveOrders()
    await this.getTxWeight()
    this.isLoading = false
  },


  methods: {
    initialDataKey() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
      this.publicKey = u8aToHex(cred.boxKeyPair.publicKey)
      this.secretKey = u8aToHex(cred.boxKeyPair.secretKey)
    },

    async getActiveOrders() {
      const orders = await GAGetOrders()
      this.hasActiveOrder = orders?.data?.some(order => order._source.status === "Paid")
    },

    async getTxWeight() {
      const qualification = {
        experience: [],
        certification: []
      }

      const getTxWeightProfile = await registerGeneticAnalystFee(this.api, this.wallet, this.profile)
      const getTxWeightQualification = await createQualificationFee(this.api, this.wallet, qualification)
      const getTxWeightUnstake = await unstakeGeneticAnalystFee(this.api, this.wallet)

      const txWeightProfile = `${this.web3.utils.fromWei(String(getTxWeightProfile.partialFee), "ether")}`
      const txWeightQualification = `${this.web3.utils.fromWei(String(getTxWeightQualification.partialFee), "ether")}`
      const txWeightUnstake = `${this.web3.utils.fromWei(String(getTxWeightUnstake.partialFee), "ether")}`

      const txWeight = Number(txWeightProfile) + Number(txWeightQualification)
      this.txWeight = txWeight
      this.unstakeTxWeight = txWeightUnstake
    },

    async getSpecialization() {
      const categories = await getSpecializationCategory()

      this.categories = categories;
    },

    async getAccountData() {
      const accountId = localStorage.getAddress()
      let profileData = this.profile
      const analystData = await queryGeneticAnalystByAccountId(this.api, accountId)

      if (analystData) {
        profileData = {
          ...profileData,
          profileImage: analystData?.info?.profileImage,
          firstName: analystData?.info?.firstName,
          lastName: analystData?.info?.lastName,
          gender: analystData?.info?.gender,
          email: analystData?.info?.email,
          phoneNumber: analystData?.info?.phoneNumber,
          specialization: analystData?.info?.specialization,
          availabilityStatus: analystData?.availabilityStatus,
          profileLink: analystData?.info?.profileLink
        }

        const dateOfBirth = analystData.info.dateOfBirth.replaceAll(",", "")
        const _dateOfBirth = new Date(+dateOfBirth).toLocaleString("fr-CA", {
          day: "numeric",
          year: "numeric",
          month: "numeric"
        })
        const stakeAmount = String(this.web3.utils.fromWei(String(analystData?.stakeAmount?.replaceAll(",", "") || 0), "ether"))

        this.profile = profileData
        this.profile.dateOfBirth = _dateOfBirth
        this.stakingStatus = analystData?.stakeStatus
        this.stakeAmount = `${stakeAmount} DBIO`

        if (analystData.qualifications.length) {
          const qualificationId = analystData.qualifications[0]
          const qualification = await queryGeneticAnalystQualificationsByHashId(this.api, qualificationId)

          this.profile.qualificationId = qualificationId

          if (qualification.info.experience.length) {
            this.profile.experiences = qualification.info.experience
          }

          if (qualification.info.certification.length) {
            let certifications = []
            for (const cert of qualification.info.certification) {
              const {rows} = await getIpfsMetaData(cert.supportingDocument?.split("/").pop())

              const _certificate = {
                ...cert,
                file: {
                  name: rows[0].metadata.name ?? "Supporting Document File"
                }
              }

              certifications.push(_certificate)
            }
            this.profile.certification = certifications
          }
        }
      }
    },

    onCloseModalDocument() {
      this.showModal = false
      this.clearFile = true
      this.errorDoc = false
      this.editId = null
      this.isEdit = false
      this.document = {...initialData}
    },

    async onSubmitFile() {
      this._touchForms("document")

      const { title, issuer, month, year, description, file, supportingDocument } = this.document
      const doc = file
      if (!title || !issuer || !month || !year) {
        this.errorDoc = true
        return 
      }

      const document = {
        title,
        issuer,
        month,
        year,
        description,
        file: doc
      }
      
      if (this.editId != null) {
        this.profile.certification[this.editId] = {...document, supportingDocument}
      } else {
        if (!doc) {
          this.errorDoc = true
          return 
        }
        this.loadingDoc = true

        const dataFile = await this.setupFileReader(doc)
        const result = await uploadFile({
          title: dataFile.name,
          type: dataFile.type,
          size: dataFile.size,
          file: dataFile
        })
        const linkFile = getFileUrl(result.IpfsHash)
        
        this.profile.certification.push({...document, supportingDocument: linkFile})
      }

      this.loadingDoc = false
      this.onCloseModalDocument()
    },

    handleAddFile() {
      this.showModal = true
      this.isEdit = false
      this.clearFile = false
    },

    deleteFile(idx) {
      this.showModalConfirm = null
      const files = this.profile.certification
      files.splice(idx, 1)

      this.profile.certification = files
    },

    onEditFile(file, index) {
      this.document = {...file}
      this.editId = index
      this.isEdit = true
      this.clearFile = true
      this.showModal = true
    },

    async handleAvailability(value) {
      this.loadingAvailability = true
      if (value === "Unavailable" && this.hasActiveOrder) {
        this.showActiveOrder = true
        return
      }

      this.profile.availabilityStatus = value

      try {
        await updateGeneticAnalystAvailabilityStatus(this.api, this.wallet, value)
        this.loadingAvailability = false
      } catch (error) {
        console.error(error)
        this.loadingAvailability = false
      }
    },

    async handleUnstake() {
      this.unstakeLoading = true
      this.showUnstakeDialog = false
      
      try {
        await unstakeGeneticAnalyst(this.api, this.wallet)
        this.getAccountData()
        this.unstakeLoading = false
      } catch (error) {
        console.error(error)
        this.unstakeLoading = false
      }
    },

    onUnstake() {
      if (this.hasActiveOrder) this.showActiveOrder = true
      else this.showUnstakeDialog = true
    },

    addExperience(){
      const experiences = this.profile.experiences
      experiences.push({title: ""})

      this.profile.experiences = experiences
    },

    removeExperience(idx) {
      const experiences = this.profile.experiences
      experiences.splice(idx, 1)

      this.profile.experiences = experiences
    },

    async handleSave() {
      this._touchForms("profile")
      const {
        profileImage,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        email,
        phoneNumber,
        specialization,
        specifyOther,
        experiences,
        certification,
        profileLink
      } = this.profile
      const _dateOfBirth = new Date(dateOfBirth).getTime()
      const experienceValidation = experiences.length === 1 && experiences.find(value => value.title === "")
      const certificateValidation = certification.length > 0 && certification.find(value => !value.supportingDocument)
      const _specialization = specialization == "Other" ? specifyOther : specialization
      const _experiences = experiences.filter(value => value != "")
      const qualification = {
        experience: _experiences,
        certification: certification
      }

      if (!profileImage || !firstName || !lastName || !gender || !dateOfBirth || !email || !phoneNumber || !_specialization || experienceValidation || certificateValidation || !profileLink) {
        return this.error = true
      }
      this.isLoading = true

      try {
        await updateGeneticAnalyst(
          this.api,
          this.wallet,
          {
            boxPublicKey: this.publicKey,
            firstName,
            lastName,
            gender,
            dateOfBirth: _dateOfBirth,
            email,
            phoneNumber,
            specialization: _specialization,
            profileImage,
            profileLink
          }
        )
        await updateQualification(
          this.api,
          this.wallet,
          this.profile.qualificationId,
          qualification
        )

        this.isSuccess = true
      } catch (error) {
        console.error(error)
      }

      this.isLoading = false
    },

    handleChooseFile () {
      if (this.$refs["input-file"]) this.$refs["input-file"].click()
    },

    
    async handleFileChange (event) {
      if (!event.target.value) return
      const file = event.target.files[0]
      
      if (!imageType.includes(file.type)) return this.errorProfile = errorMessages.FILE_FORMAT("PNG/JPG")
      // if (file.type != "image/jpg" && file.type != "image/png") return this.errorProfile = errorMessages.FILE_FORMAT("PNG/JPG")
      else if (file.size > 2000000) return this.errorProfile = errorMessages.FILE_SIZE(2)

      this.isProfileLoading = true

      const dataFile = await this.setupFileReader(file)
      const result = await uploadFile({
        title: dataFile.name,
        type: dataFile.type,
        size: dataFile.size,
        file: dataFile
      })
      const link = getFileUrl(result.IpfsHash)
      
      this.profile.profileImage = link
      this.isProfileLoading = false
      this.errorProfile = ""
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
    },

    limitChar(value) {
      return value.length > 32 ? `${value.substring(0, 32)}...` : value
    },

    goToDashboard() {
      this.$router.push({ name: "ga-dashboard"})
    }
  }
}
</script>

<style lang="sass" scoped>
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

  &__radio-input
    padding: 0
    margin: -10px 0px -20px

  &__space-between
    display: flex
    flex-direction: row
    justify-content: space-between

  &__icon-experience
    padding-left: 10px
    margin-top: 25px

  &__file-item
    gap: 20px
    display: flex
    flex-direction: column
    padding: 12px 20px
    border-radius: 4px
    border: 2px dashed
    border-color: #8AC1FF
    background: #F9F9FF
    transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

    &:hover
      background: #f2f2ff
      border-color: #a1a1ff

.avatar
  display: flex
  flex-direction: row

  &__image
    margin-right: 16px

  &__upload
    display: flex
    flex-direction: column
    font-size: 13px
    justify-content: space-between

.text-title,
.text-secondary,
.text-no-file
  @include body-text-2-opensans

.text-label,
.text-error
  margin-bottom: 0
  @include body-text-3-opensans

.text-secondary
  color: #5640A5
  cursor: pointer

.text-title
  font-weight: 600

.text-error
  color: #c400a5

.trans-weight-icon
  font-size: 12px
  margin-left: 5px

.icon-text,
.icon-button
  margin-right: 10px

.icon-button
  cursor: pointer

.file-input
  display: none

.modal-confirm
  &__title
    width: 212px
    text-align: center

  &__cta
    width: 250px
    margin: 0 auto
</style>
