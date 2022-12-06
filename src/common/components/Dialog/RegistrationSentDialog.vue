<template lang="pug">
  .dialog-regisrtation
    v-dialog(:value="show" height="360" width="324" persistent )
      v-card 
        v-app-bar( flat dense color="white" ) 
        v-card-text
          .dialog-regisrtation__title Registration Sent!
  
</template>

<script>
export default {
  name: "RegistrationSent",

  props: {
    show: Boolean
  }

}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .dialog-regisrtation
    &__title
      display: flex
      justify-content: center
      align-items: center
      letter-spacing: 0.0044em
      margin-top: 12px
      @include h6-opensans

</style>
