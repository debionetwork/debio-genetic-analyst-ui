<template lang="pug">
  .customer-geneticAnalysts-createService
    .customer-geneticAnalysts-createService__wrapper
      .customer-geneticAnalysts-createService__nav
        .customer-geneticAnalysts-createService__nav-button(@click="handleBack")
          v-icon.customer-geneticAnalysts-createService__nav-icon mdi-chevron-left
      
      .customer-geneticAnalysts-createService__main
        .customer-geneticAnalysts-createService__stepper
          ui-debio-stepper(
            :items="stepperItems"
          )
        .customer-geneticAnalysts-createService__title Set Up Service

        .customer-geneticAnalysts-createService__form
          GeneticAnalystsFormCreateService

        
</template>

<script>
// import GeneticAnalystsFormCreateService from "./GeneticAnalystsFormRegistration.vue"
import GeneticAnalystsFormCreateService from "./GeneticAnalystsFormCreateService.vue"
export default {
  name: "GeneticAnalystsCreateService",

  components: { GeneticAnalystsFormCreateService },

  data: () => ({
    stepperItems: [
      {number: 1, title: "Set Up Account", active: false},
      {number: 2, title: "Set Up Service", active: true}
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

  .customer-geneticAnalysts-createService
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
