<template lang="pug">
  .geneticAnalysts-registration-form
    .geneticAnalysts-registration-form__modal
      ui-debio-modal(
        :show="showModalCertification"
        :title="isEdited ? 'Edit license or certification' : 'Add license or certification'"
        cta-title="Submit"
        :cta-action="handleNewFile"
        :cta-outlined="false"
        @onClose="onCloseModalDocument"
      )
        ui-debio-input(
          variant="small"
          label="Certification Title"
          placeholder="EX : Biomedical Equipment Technician Certificate (BMET)"
          v-model="document.title"
          outlined
          block
          validate-on-blur
        )
        ui-debio-input(
          variant="small"
          label="Issuing organization"
          placeholder="EX : International Certification Commission (ICC)"
          v-model="document.issuer"
          outlined
          block
          validate-on-blur
        )
        v-row.d-flex
          v-col
            v-autocomplete(
              dense
              :items="monthList"
              placeholder="Month"
              :rules="[val => !!val || 'number require']"
              autocomplete="off"
              outlined
              v-model="document.month"
            )
          v-col
            v-autocomplete(
              dense
              :items="selectYears"
              v-model="document.year"
              placeholder="Years"
              :rules="[val => !!val || 'number require']"
              autocomplete="off"
              outlined
            )
        ui-debio-textarea.geneticAnalysts-registration-form__modal-description(
          variant="small"
          label="Description"
          placeholder="Add Description"
          v-model="document.description"
          validate-on-blur
          outlined
          block
        )
        ui-debio-file(
          v-model="document.file"
          variant="small"
          accept="[.pdf, .doc, .jpg, .png]"
          label="Add supporting document (.pdf, .doc, .jpg, .png - Maximum fle size is 2MB)"
          :clearFile="!isEdited && clearFile"
          @isError="handleError"
          validate-on-blur
        )

    .geneticAnalysts-registration-form__card
      .geneticAnalysts-registration-form__avatar-wrapper
        .geneticAnalysts-registration-form__avatar-image(@click="handleSeletImage")
          ui-debio-avatar(
            :src="computedImageLink"
            size="100"
            rounded
            borderSize="1"
            borderColor="#000000"
          )
          .geneticAnalysts-registration-form__avatar-file
            ui-debio-file(
              v-model="profileImage"
              accept="[.jpg, .png, .jpeg]"
              variant="small"
              style="display: none"
              hide-input
              validate-on-blur
              outlined
              block
              ref="fileInput"
            )
        .geneticAnalysts-registration-form__avatar-action
          .geneticAnalysts-registration-form__avatar-description
            span Upload file(.jpg, .png -
            span Maximum file size is 2MB)
          
          .geneticAnalysts-registration-form__avatar-button
            ui-debio-button(
              color="secondary" 
              width="160px"
              height="35"
              @click="handleUploadProfile"
              style="font-size: 12px;"
            ) Upload


      .geneticAnalysts-registration-form__informasion-wrapper
        .geneticAnalysts-registration-form__basic-informasion
          .geneticAnalysts-registration-form__basic-informasion-title Basic Information
          .geneticAnalysts-registration-form__name-wrapper
            .geneticAnalysts-registration-form__firstName
              ui-debio-input(
                variant="small"
                label="First Name"
                placeholder="Your First Name"
                outlined
                block
              )
            .geneticAnalysts-registration-form__lastName
              ui-debio-input(
                variant="small"
                label="Last Name"
                placeholder="Your Last Name"
                outlined
                block
              )

          .geneticAnalysts-registration-form__gender-wrapper Sex
            v-radio-group.geneticAnalysts-registration-form__gender-radio(v-model="sex" row)
              v-radio.small-radio(label="Male" value="male")
              v-radio(label="Female" value="female")

          .geneticAnalysts-registration-form__birth-wrapper
            .geneticAnalysts-registration-form__birth-input
              ui-debio-input(
                variant="small"
                label="Date Of Birth"
                placeholder="DD/MM/YYYY"
                outlined
                block
              )
          
          .geneticAnalysts-registration-form__phone-wrapper Phone
            .geneticAnalysts-registration-form__phone-title 
              .geneticAnalysts-registration-form__phone-list
                v-autocomplete(
                  dense
                  v-model="phoneNumber"
                  :items="phoneList"
                  placeholder="+62"
                  :rules="[val => !!val || 'number require']"
                  autocomplete="off"
                  outlined)
              .geneticAnalysts-registration-form__phone-number
                ui-debio-input(
                  variant="small"
                  outlined
                  block
                )
          .geneticAnalysts-registration-form__email-wrapper
            .geneticAnalysts-registration-form__email-input
              ui-debio-input(
                variant="small"
                label="Email"
                placeholder="Email"
                outlined
                block
              )
          
          .geneticAnalysts-registration-form__linkedIn-wrapper
            .geneticAnalysts-registration-form__linkedIn-input
              ui-debio-input(
                variant="small"
                label="Linkedin URL"
                placeholder="Linkedin.com/in/Biomedicaldoctor"
                outlined
                block
              )
        
        .geneticAnalysts-registration-form__qualification-wrapper
          .geneticAnalysts-registration-form__qualification-title Qualification
          .geneticAnalysts-registration-form__specialization-wrapper
           
            ui-debio-dropdown(
              :items="specializationList"
              variant="small"
              label="Specialization"
              placeholder="Select Specialization"
              v-model="specialization"
              outlined
              close-on-select
              validate-on-blur
              block
            )

          .geneticAnalysts-registration-form__experience-wrapper
            .geneticAnalysts-registration-form__experience-title Experience
            .geneticAnalysts-registration-form__experience-input-wrapper(v-for="(i) in expCount" :key="(i)")
              .geneticAnalysts-registration-form__experience-input
                ui-debio-input(
                  variant="small"
                  outlined
                  block
                  v-model="experience"
                  :placeholder="experienceInput[i - 1]"
                )
              .geneticAnalysts-registration-form__experience-button(@click="handleDeleteExp" v-if="expCount > 1 && i > 1")
                v-icon(style="color: #C400A5").geneticAnalysts-registration-form__experience-icon mdi-close-circle-outline
            .geneticAnalysts-registration-form__experience-action(@click="addExperience")
              v-icon.geneticAnalysts-registration-form__experience-action-icon mdi-plus
              .geneticAnalysts-registration-form__experience-action-label Add Experience

        .geneticAnalysts-registration-form__certification-wrapper
          .geneticAnalysts-registration-form__certification-label Certification
          .geneticAnalysts-registration-form__certification-button(@click="certificationForm")
            v-icon(style="color: #5640A5").geneticAnalysts-registration-form__certification-icon mdi-plus-box

        .geneticAnalysts-registration-form__certification-list-wrapper
          .geneticAnalysts-registration-form__certification-list-box
            .geneticAnalysts-registration-form__certification-list(v-for="(i) in 3" :key="(i)")
              .geneticAnalysts-registration-form__certification-list-name Certification Name
              .geneticAnalysts-registration-form__certification-list-description(style="max-width: 390px") lorem
              .geneticAnalysts-registration-form__certification-list-action
              







</template>

<script>
import { mapState } from "vuex"



export default {
  name: "GeneticAnalystsFormRegistration",

  data: () => ({
    profileImage: null,
    firstName: "",
    lastName: "",
    sex: "",
    sexList: ["male", "female"],
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    linkedInURL: "",
    specialization: "",
    specializationList: ["Specialization 1", "Specialization 2", "Specialization 3"],
    experience: "",
    experienceInput: [],
    expCount: 1,
    certification: {},
    phoneList: ["+62", "+22"],
    showModalCertification: false,
    isEdited: false,
    document:{
      title: "",
      issuer: "",
      month: "",
      year: "",
      description: "",
      supportingFile: null
    },
    monthList: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
      mnemonicData: (state) => state.substrate.mnemonicData,
      web3: (state) => state.metamask.web3
    }),
    computedImageLink() {
      return this.profileImage ? this.profileImage : require("@/assets/add-image-placeholder.png")
    },

    selectYears() {
      const years = []
      const thisYear = new Date().getFullYear()
      for (let i = thisYear; i >= 2000; i--) {
        years.push(String(i))
      }
      return years
    }
  },

  watch: {
    experience() {
      console.log(this.experience)
    },

    experienceInput() {
      console.log(this.experienceInput, "exp input")
    }
  },

  methods: {
    clickAvatar() {
      console.log("clicked")
    },

    toTimestamp() {
      this.dateOfBirth
    },

    handleDeleteExp() {
      if (this.expCount == 1) return
      this.experienceInput.pop()
      this.expCount -= 1
    },

    addExperience() {
      console.log("add experience")
      this.experienceInput.push(this.experience)
      this.experience = ""
      this.expCount += 1
    },

    certificationForm() {
      console.log("show certification")
      this.showModalCertification = true
    },

    handleNewFile() {

    },

    onCloseModalDocument() {
      this.showModalCertification = false
    },

    handleSeletImage() {
      this.$refs.fileInput.$refs["input-file"].click()
    },

    handleUploadProfile() {
      console.log("handle updload profile")
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .geneticAnalysts-registration-form
    margin: 40px 15px 15px 15px

    &__card
      border: solid 1px black
      width: 100%
      height: 100%
      padding: 10px
    
    &__modal-description
      margin: -35px 0 0 0 !important

    &__avatar-wrapper
      border: solid 0.5px black
      padding: 5px
      display: flex
      flex-direction: row
      gap: 20px
    
    &__avatar-action
      display: flex
      flex-direction: column
      gap: 17px
      margin: 10px 0 0 0
    
    &__avatar-description
      display: flex
      flex-direction: column
      @include body-text-3-opensans
      gap: 5px

    &__informasion-wrapper
      display: flex
      flex-direction: column
      margin: 10px 0 0 0
    
    &__basic-informasion
      display: flex
      flex-direction: column

    &__basic-informasion-title
      @include button-2

    &__name-wrapper
      margin: 10px 0 0 0
      display: flex
      flex-direction: row
      gap: 20px
      max-width: 450px

    &__gender-wrapper
      font-size: 14px
      margin: 15px 0 0 0
    
    &__gender-radio
      margin: 0 !important

      &::v-deep
        .v-input__control > .v-input__slot > .v-input--radio-group__input > .v-radio > .v-input--selection-controls__input > .v-icon > .v-icon.v-icon
          font-size: 20px !important

    &__phone-wrapper
      font-size: 12px
      margin: 15px 0 0 0

    &__phone-title
      display: flex
      flex-direction: row
      gap: 20px
      margin: 5px 0 0 0


    &__phone-list
      width: 80px

    &__phone-number
      width: 80%

    &__email-wrapper
      margin: -5px 0 0 0
    
    &__linkedIn-wrapper
      margin: 15px 0 0 0

    &__qualification-title
      @include button-2
      margin: 15px 0 0 0
    
    &__specialization-wrapper
      margin: 15px 0 0 0

    &__experience-wrapper
      margin: 15px 0 0 0
    
    &__experience-title
      @include body-text-3-opensans
      margin: 0 0 10px 0

    &__experience-input-wrapper
      display: flex
      flex-direction: row
      gap: 10px
      margin: 0 0 10px 0
    
    &__experience-input
      width: 90%

    &__experience-button
      display: flex
      color: #cf30b6
      cursor: pointer
      align-items: center
    
    &__experience-icon
      color: #cf30b6

    &__experience-action
      display: flex
      color: #5640a5
      cursor: pointer
      align-items: center

    &__experience-action-icon
      font-size: 14px !important

    &__certification-wrapper
      display: flex
      flex-direction: row
      justify-content: space-between
      align-items: center

    &__certification-label
      @include button-2

    &__certification-button
      cursor: pointer

    &__certification-icon
      font-size: 40px !important
      
    &__certification-list-box
      height: 100%
      width: 100%
      border: dashed 1px #8AC1FF
      border-radius: 2px
      background-color: #F9F9FF
      margin: 10px 0 0 0
      padding: 10px

    &__certification-list
      margin: 10px 0
      border: dashed 1px black
</style>
