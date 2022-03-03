<style scoped lang="scss">
.pop-up-main{
    img {
        width: 95px;
        height: 95px;

        margin-top: 20px;
    }
    h2 {
        width: 337px;
        height: 76px;

        font-family: Roboto;
        font-style: normal;
        font-weight: 500;
        font-size: 25px;
        line-height: 150%;
        
        text-align: center;

        margin-bottom: 78px;
    }
}
</style>

<template lang="pug">
     LandingPagePopUp
        template(v-slot:main): div.pop-up-main
            img(src='@/assets/check-circle.png')
            h2 Your account has been successfully created.
            v-btn.white--text(elevation='0' color='primary' @click="onContinue") Continue
</template>

<script>
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"

export default {
  name: "RegistrationSuccessful",
  components: {
    LandingPagePopUp
  },
  methods: {
    onContinue() {
      this.$router.push({ name: "customer-dashboard" })
    }
  }
}
</script>
