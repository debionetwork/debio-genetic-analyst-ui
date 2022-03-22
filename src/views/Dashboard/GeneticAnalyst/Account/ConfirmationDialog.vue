<template lang="pug">
  v-dialog.dialog-confirmation(:value="show" height="535" width="400" persistent)
    v-card
      v-app-bar(flat dense color="white")
        v-spacer
        v-btn(icon @click="closeDialog")
          v-icon mdi-close
      
      .dialog-confirmation__card
        .dialog-confirmation__title(align="center") {{ title }}

        .dialog-confirmation__icon
          v-img(v-bind:src="require('@/assets/alert-triangle.png')" max-width="87.07")


        v-card-text.dialog-confirmation__description {{ message}}

        .dialog-confirmation__trans-weight 
          .dialog-confirmation__trans-weight-text Estimated transaction weight
            v-tooltip.visible(bottom )
              template(v-slot:activator="{ on, attrs }")
                v-icon.dialog-confirmation__trans-weight-icon(
                  style="font-size: 12px; margin-left: 5px;"
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                ) mdi-alert-circle-outline 
              span(style="font-size: 10px;") Total fee paid in DBIO to execute this transaction.

          div( style="font-size: 12px;" ) {{ Number(txWeight).toFixed(4) }} DBIO

        .dialog-confirmation__button
          ui-debio-button(
            color="secondary" 
            width="280px"
            height="35px"
            @click="onSubmit"
          ) {{ btnMessage }}
  
      v-progress-linear(
        v-if="loading"
        indeterminate
        color="primary"
      )
      
</template>

<script>

export default {
  name: "ConfirmationDialog",

  props: {
    show: Boolean,
    message:String,
    title: String,
    loading:Boolean,
    txWeight: String,
    btnMessage: String
  },

  methods: {
    closeDialog() {
      this.$emit("close")
    },

    onSubmit() {
      this.$emit("click")
    }
  }
}
</script>


<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .dialog-confirmation
    &__card
      padding: 0px 50px

    &__title
      display: flex
      justify-content: center
      align-items: center
      text-align: center
      letter-spacing: 0.0044em
      padding-top: 10px
      padding-bottom: 50px
      @include h6

    &__icon
      display: flex
      justify-content: center
      align-items: center

    &__description
      display: flex
      justify-content: center
      text-align: center
      letter-spacing: -0.0044em
      margin-top: 40px
      
    &__button
      padding-bottom: 60px

    &__trans-weight
      margin-top: 20px
      margin-bottom: 20px
      display: flex
      justify-content: space-between

    &__trans-weight-text
      color: #595959
      letter-spacing: -0.004em
      display: flex
      align-items: center
      @include body-text-3-opensans
    

</style>
