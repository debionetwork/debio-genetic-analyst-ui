<template lang="pug">
  .customer-geneticAnalysts-registration
    .customer-geneticAnalysts-registration__wrapper
      .customer-geneticAnalysts-registration__nav
        .customer-geneticAnalysts-registration__nav-button(@click="handleBack")
          v-icon.customer-geneticAnalysts-registration__nav-icon mdi-chevron-left
      
      .customer-geneticAnalysts-registration__main
        .customer-geneticAnalysts-registration__stepper
          ui-debio-stepper(
            :items="stepperItems"
          )
        .customer-geneticAnalysts-registration__title Set Up Account

        .customer-geneticAnalysts-registration__form
          formRegistration

        
</template>

<script>
import formRegistration from "./formRegistration.vue"

export default {
  name: "GeneticAnalystsRegistration",

  components: { formRegistration },

  data: () => ({
    stepperItems: [
      {number: 1, title: "Set Up Account", active: true},
      {number: 2, title: "Set Up Service", active: false}
    ]

  }),

  methods: {
    handleBack() {
      console.log("handle back")
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-geneticAnalysts-registration
    width: 100%
    height: 100%
    background: #FFFFFF

    &__wrapper
      width: 100%
      height: 100%
      background: #FFFFFF
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
      border-radius: 0.25rem

    &__nav
      padding: 2.313rem 3.125rem

    &__nav-button
      display: flex
      align-items: center
      gap: 0.625rem
      max-width: max-content
      color: #757274
      cursor: pointer
      @include body-text-3
    
    &__main
      padding-bottom: 100px
      width: 100%
      display: flex
      flex-direction: column
      align-items: center

    &__title
      display: flex
      flex-direction: column
      align-items: center
      margin-top:50px
      @include h6-opensans

    


</style>
