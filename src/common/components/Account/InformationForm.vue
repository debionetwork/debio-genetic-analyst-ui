<template lang="pug">
  .ga-account__form
    .avatar
      v-avatar.avatar__image(
        size="100"
        tile
      ) 
        img(:src="computeAvatar")
      div.avatar__upload
        span Upload file (.jpg, .png - Maximum file size is 2MB)
        input.file-input(
          type="file" 
          ref="input-file" 
          accept=".png, .jpg" 
          @change="onAvatarChange" 
          :rules="$options.rules.profile.profileImage"
        )
        ui-debio-button(
          color="primary"
          @click="handleChooseFile"
          :loading="isProfileLoading"
          :disabled="isProfileLoading || submitLoading"
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
      :rules="$options.rules.profile.date"
      :error="error && !profile.dateOfBirth"
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
      max="12"
    )

    div(v-if="isEdit")
      label.text-label Staking Amount
      v-row(no-gutters)
        v-col(style="padding-right: 10px;")
          ui-debio-input(
            :error="false"
            variant="small"
            placeholder="50,000 DBIO"
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
            :disabled="stakingStatus != 'Staked'"
            @click="showUnstakeDialog = true"
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
          :disabled="stakingStatus != 'Staked'"
        ) Available
        ui-debio-button(
          color="secondary"
          width="135px"
          height="35px"
          :outlined="profile.availabilityStatus !== 'Unavailable' || stakingStatus != 'Staked'"
          :disabled="stakingStatus != 'Staked'"
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
      item-text="category"
      item-value="category"
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
        @click="showCertDialog = true"
        :disabled="submitLoading"
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
              @click="deleteCertificate(index)"
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
            .ga-account__file-name {{ item.file ? limitChar(item.file.name, 32) : "" }}

          .avatar 
            ui-debio-icon.icon-text.icon-button(
              :icon="pencilIcon"
              size="15"
              color="#989898"
              stroke
              @click="onEditCertificate(item, index)"
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
      :loading="isLoading || submitLoading"
      :disabled="isLoading || disable || submitLoading"
      @click="handleSubmit"
      block
    ) Next

    CertificationDialog(
      :show="showCertDialog" 
      :onSubmit="onSubmitCertificate"
      @close="showCertDialog = false"
      :data="document"
    )

    InsufficientDialog(
      :show="showInsufficientDialog" 
      @close="showInsufficientDialog = false"
    )
</template>

<script>
import {mapState} from "vuex"
import errorMessages from "@/common/constants/error-messages"
import {uploadFile, getFileUrl} from "@/common/lib/pinata-proxy"
import {getSpecializationCategory} from "@/common/lib/api"
import {registerGeneticAnalystFee} from "@/common/lib/polkadot-provider/command/genetic-analyst"
import {createQualificationFee} from "@/common/lib/polkadot-provider/command/genetic-analyst/qualification"
import { fileTextIcon, pencilIcon, trashIcon } from "@debionetwork/ui-icons"
import rulesHandler from "@/common/constants/rules"
import CertificationDialog from "@/common/components/Dialog/CertificateDialog"
import InsufficientDialog from "@/common/components/Dialog/InsufficientBalanceDialog"

const imageType = ["image/jpg", "image/png", "image/jpeg"]

const initialData = {
  title: "",
  issuer: "",
  month: "",
  year: "",
  description: "",
  file: {name: ""},
  supportingDocument: null /* eslint-disable camelcase */
}

export default {
  name: "GAForm",

  data: () => ({
    fileTextIcon,
    pencilIcon,
    trashIcon,
    showModalConfirm: null,
    error: false,
    isProfileLoading: false,

    showCertDialog: false,
    showUnstakeDialog: false,
    showInsufficientDialog: false,
    isLoading: false,
    profile: {
      profileImage: "",
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: null,
      email: "",
      phoneNumber: "",
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
    categories: [],
    editId: null,
    txWeight: null
  }),

  components: { CertificationDialog, InsufficientDialog},

  props: {
    onSubmit: {type: Function, default: () => {}},
    isEdit: {type: Boolean, default: false},
    submitLoading: {type: Boolean, default: false}
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      web3: (state) => state.metamask.web3,
      wallet: (state) => state.substrate.wallet,
      walletBalance: (state) => state.substrate.walletBalance
    }),

    computeAvatar() {
      return this.profile.profileImage
        ? this.profile.profileImage
        : require("@/assets/image-placeholder.png")
    },

    disable() {
      const valid = formValidation(this.profile)
      
      return valid
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
      ]
    }
  },

  async created() {
    this.isLoading = true
    await this.getTxWeight()
    await this.getSpecialization()

    this.isLoading = false
  },

  methods: {
    async getSpecialization() {
      const categories = await getSpecializationCategory()

      this.categories = categories
    },

    async getTxWeight() {
      const qualification = {
        experience: [],
        certification: []
      }

      const getTxWeightProfile = await registerGeneticAnalystFee(this.api, this.wallet, this.profile)
      const getTxWeightQualification = await createQualificationFee(this.api, this.wallet, qualification)

      const txWeightProfile = `${this.web3.utils.fromWei(String(getTxWeightProfile.partialFee), "ether")}`
      const txWeightQualification = `${this.web3.utils.fromWei(String(getTxWeightQualification.partialFee), "ether")}`

      const txWeight = Number(txWeightProfile) + Number(txWeightQualification)
      this.txWeight = txWeight
    },

    addExperience() {
      const experiences = this.profile.experiences
      experiences.push({title: ""})

      this.profile.experiences = experiences
    },

    removeExperience(idx) {
      const experiences = this.profile.experiences
      experiences.splice(idx, 1)

      this.profile.experiences = experiences
    },

    onSubmitCertificate(data) {
      if (this.editId === null) {
        this.profile.certification.push({...data})
      } else {
        this.profile.certification[this.editId] = {...data}
      }
      this.editId = null
      this.document = initialData
    },

    onEditCertificate(item, index) {
      this.document = {...item}
      this.editId = index
      this.showCertDialog = true
    },

    deleteCertificate(idx) {
      this.showModalConfirm = null
      const files = this.profile.certification
      files.splice(idx, 1)

      this.profile.certification = files
    },

    handleSubmit() {
      if (formValidation(this.profile)) return this.error = true
      if (this.walletBalance < this.txWeight) return this.showInsufficientDialog = true

      this.onSubmit(this.profile)
    },

    handleChooseFile() {
      if (this.$refs["input-file"]) this.$refs["input-file"].click()
    },

    async onAvatarChange(event) {
      if (!event.target.value) return
      const file = event.target.files[0]

      if (!imageType.includes(file.type))
        return (this.errorProfile = errorMessages.FILE_FORMAT("PNG/JPG"))
      else if (file.size > 2000000)
        return (this.errorProfile = errorMessages.FILE_SIZE(2))

      this.isProfileLoading = true
      const dataFile = await this.setupFileReader(file)
      const result = await uploadFile({
        title: dataFile.name,
        type: dataFile.type,
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

    limitChar(value, limit) {
      return value.length > limit ? `${value.substring(0, limit)}...` : value
    }
  }
}

function formValidation(data) {
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
    experiences
  } = data
  const experienceValidation = experiences.length === 1 && experiences.find(value => value.title === "")
  const _specialization = specialization == "Other" ? specifyOther : specialization

  if (!profileImage || !firstName || !lastName || !gender || !dateOfBirth || !email || !phoneNumber || !_specialization || experienceValidation) {
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

.modal-confirm
  &__title
    width: 212px
    text-align: center

  &__cta
    width: 250px
    margin: 0 auto
</style>