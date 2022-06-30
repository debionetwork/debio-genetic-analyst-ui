<style scoped lang="scss">
@import "@/common/styles/variables.scss";

.pop-up-main{
    & > div.copy-text {
        width: 504px;
        height: 51px;

        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 150%;
        color: $color-primary;

        display: flex;
        align-items: center;

        & > * {
            cursor: pointer;
        }
        & > img {
            width: 24px;
            margin-right: 13px;
        }
    }
    ::v-deep .v-snack__wrapper {
        min-width: 0px;
    }
}
</style>

<template lang="pug">
     LandingPagePopUp(:previous='previous')
        template(v-slot:header) Your Mnemonic Phrase
        template(v-slot:main)
            h3 Write down or copy these words in the right order and save them securely.
            MnemonicList(:mnemonicCollection="mnemonicCollection")
            div.copy-text 
                img(src='@/assets/copy.png' v-on:click="copyText")
                div(v-on:click="copyText") Copy this mnemonic phrase to the clipboard, you’ll be asked to fill in these phrase in the next page
            v-btn.white--text(elevation='0' color='primary' @click="verifyMnemonic") Continue
            v-snackbar(
                v-model="snackbar"
                :timeout="timeout"
                right
                bottom
            ) Copied mnemonic!
</template>

<script>
import MnemonicList from "./MnemonicList.vue"
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"
import { mnemonicGenerate } from "@polkadot/util-crypto"

export default {
  name: "GenerateAccount",
  components: {
    LandingPagePopUp,
    MnemonicList
  },
  data: () => ({
    mnemonic: "",
    mnemonicCollection: [],
    snackbar: false,
    timeout: 2000
  }),

  mounted(){
    this.mnemonic = mnemonicGenerate()
        
    const mnemonicCollection = this.mnemonic.split(" ")
    for(let i = 1; i <= mnemonicCollection.length; i++){
      this.mnemonicCollection.push(mnemonicCollection[i-1])
    }
  },

  methods: {
    previous() {
      this.$router.push({name: "generate-account"})
    },

    verifyMnemonic() {
      this.$router.push({
        name: "verify-mnemonic",
        params: { 
          mnemonic: this.mnemonic,
          mnemonicCollection: this.mnemonicCollection
        }
      })
    },
        
    copyText(){
      navigator.clipboard.writeText(this.mnemonic)
      this.snackbar = true
    }
  }
}
</script>
