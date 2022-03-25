<template lang="pug">
  .geneticAnalysts-createService-form
    .geneticAnalysts-createService-form__card
      .geneticAnalysts-createService-form__input-wrapper
        .geneticAnalysts-createService-form__input-serviceName
          ui-debio-input(
            variant="small"
            label="Service Name"
            placeholder="Service Name"
            outlined
            block
          )
        .geneticAnalysts-createService-form__input-description
          ui-debio-textarea(
            variant="small"
            label="Description"
            placeholder="Description"
            outlined
            block
          )
        .geneticAnalysts-createService-form__input-price-wrapper
          .geneticAnalysts-createService-form__input-servicePrice-title Service price
            .geneticAnalysts-createService-form__input-servicePrice
              ui-debio-input(
              variant="small"
              outlined
              block
            )
          .geneticAnalysts-createService-form__input-currencyPrice-title Currency
            .geneticAnalysts-createService-form__input-currencyPrice
              v-autocomplete(
                dense
                :items="currencyList"
                placeholder="DBIO"
                autocomplete="off"
                outlined
                label="Currency"
              )
        .geneticAnalysts-createService-form__input-expected-duration-label Expected Duration
          .geneticAnalysts-createService-form__input-expected-duration-wrapper
            v-autocomplete(
              dense
              placeholder="In Day"
              autocomplete="off"
              outlined
              :items="durationList"
            )

        .geneticAnalysts-createService-form__input-support-document
          ui-debio-file(
            variant="small"
            accept="[.pdf, .doc, .jpg, .png]"
            label="Result Sample (.pdf, .doc, .jpg, .png - Maximum fle size is 2MB)"
            validate-on-blur
          )
        
        .geneticAnalysts-createService-form__txWeight-wrapper
          .geneticAnalysts-createService-form__txWeight-label Estimated Transaction Weight
          .geneticAnalysts-createService-form__txWeight-data 135dummy

        .geneticAnalysts-createService-form__button-action
          ui-debio-button()





</template>

<script>


export default {
  name: "GeneticAnalystsFormCreateService",

  data: () => ({
    currencyList: ["DAI", "ETH", "DBIO"],
    durationList: ["Day", "Working Day", "Week"]
  })
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .geneticAnalysts-createService-form
    margin: 40px 15px 15px 15px

    &__card
      border: solid 1px black
      width: 100%
      height: 100%
      padding: 10px
      
    &__input-wrapper
      width: 416px

    &__input-price-wrapper
      display: flex
      flex-direction: row
      gap: 20px
      align-items: center

    &__input-servicePrice-title
      width: 110%

    &__input-currencyPrice-title
      width: 75%

</style>
