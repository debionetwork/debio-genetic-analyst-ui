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
        font-family: "Roboto" sans-serif;
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
            img(src='@/assets/check-circle-primary.png')
            h2 {{ text }}
            v-btn.white--text(elevation='0' color='primary' @click="onContinue") Select Role
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
      this.$router.push({ name: "select-role" })
    }
  },
  computed: {
    text() {
      if(this.$route.params.flag === "changed") return "Your password is successfully changed."
      return "Your account has been successfully created."
    }
  }
}
</script>
