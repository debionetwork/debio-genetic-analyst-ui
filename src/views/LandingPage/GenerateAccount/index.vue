<style scoped lang="scss">
.v-input--checkbox {
    width: 437px;
    height: 53px;
    font-family: "Raleway", sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 150%;
    display: flex;
    align-items: center;
    margin-left: -68px;

    #checkboxLabel {
      font-size: 18px;
      line-height: 150%;
      margin-left: 20px;
      font-family: "Raleway", sans-serif;
    }
}
.link{
  text-decoration: none;
}
</style>

<template lang="pug">
  LandingPagePopUp(:previous='previous')
    template(v-slot:header) Generate an Account
    template(v-slot:main)
      h3 Generate an account to use our features on the AppChain
      p You will receive 12 words as mnemonic phrase that allow you to recover an account.
      p Make sure you save the mnemonic phrase by writing it down and putting it somewhere safe
      v-checkbox(v-model="agreeConditions"): template(v-slot:label): div#checkboxLabel I understand DeBio 
        v-tooltip(bottom)
          template(v-slot:activator="{ on }")
            a.link(target="_blank"
              href="https://docs.debio.network/legal/privacy-policy"
              @click.stop
            ) Privacy Policy
            span  and 
            a.link(target="_blank"
              href="https://docs.debio.network/legal/terms-and-condition"
              @click.stop
            ) Terms and Condition
      .button
        v-btn(elevation='0' color='primary' :disabled="!agreeConditions" @click="generateMnemonic") Continue
</template>

<script>
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"
import localStorage from "@/common/lib/local-storage"

export default {
  name: "GenerateAccount",

  components: {
    LandingPagePopUp
  },

  data: () => ({
    agreeConditions: false
  }),

  created() {
    const hasTerms = localStorage.getLocalStorageByName("TERMS")

    if (hasTerms) this.agreeConditions = hasTerms
  },

  methods: {
    previous() {
      const hasAddress = localStorage.getLocalStorageByName("mnemonic_data")

      if (!hasAddress) localStorage.removeLocalStorageByName("TERMS")

      this.$router.push({name: "landing-page"})
    },

    generateMnemonic() {
      localStorage.setLocalStorageByName("TERMS", this.agreeConditions)
      this.$router.push({name: "generate-mnemonic"})
    }
  }
}
</script>
