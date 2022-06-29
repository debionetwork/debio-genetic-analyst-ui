<style lang="scss">
@import "@/common/styles/variables.scss";

.pop-up-header{
  display: flex;
  align-items: center;
  grid-area: header;
  width: 100%;

  .box{
    width: 100%;
    text-align: center;
  }
  .pop-up-title{
    color: $color-primary;
    font-family: "Roboto", sans-serif;
    line-height: 150%;
    font-weight: 500;
    font-size: 25px;
    padding-right: 22px;
  }
}
.button-arrow{
  cursor: pointer;
}
.landing-page-pop-up {
  width: 665px;
  height: 560px;
  background: white;
  border-radius: 16px;
  box-shadow: 0px 2px 10px 0px #0000001A;
  display: grid;
  grid-template-rows: 125px 435px;
  grid-template-areas: 
    "header"
    "main";

  header {
    padding: 42px 33px
  }
}
.pop-up-main{
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-area: main;

  & > * {
      margin-bottom: 20px;
  }
  & > .password-field {
      width: 504px;
      font-family: "Raleway", sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 150%;
  }
  h3 {
      width: 504px;
      height: 60px;
      font-family: "Raleway", sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 150%;
      /* or 30px */
      display: flex;
      align-items: center;
  }
  .v-file-input {
      width: 488px;
      font-family: "Raleway", sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 150%;
  }
  p {
      width: 504px;
      height: 63px;
      /* body-text-1 */
      font-family: "Raleway", sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 150%;
      /* or 27px */
      display: flex;
      align-items: center;
      margin-bottom: 10px;
  }
  .v-btn:not(.mnemonic-list-item) {
    width: 506px;
    height: 53px !important;
    font-family: "Raleway", sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 20px !important;
    line-height: 30px;
    text-transform: none;
    margin-bottom: 20px;
  }
  // Override default Vuetify CSS
  .theme--light.v-btn.v-btn--disabled{
    color: white !important;
  }
  .button{
    .v-btn__content{
      font-family: "Raleway", sans-serif;
    }
  }
}
</style>

<template lang="pug">
  div.landing-page-pop-up
    header
      div(v-if="hasHeaderSlot")
        div.pop-up-header
          img.button-arrow(height='22px' src='@/assets/chevron.png' v-on:click='previous')
          .box
            h2.pop-up-title: slot(name="header")
    div.pop-up-main: slot(name="main")
</template>

<script>
export default {
  name: "LandingPagePopUp",
  props: {
    previous: Function
  },
  computed: {
    hasHeaderSlot() {
      return !!this.previous
    }
  }
}
</script>
