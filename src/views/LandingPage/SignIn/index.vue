<style scoped lang="scss">
@import "@/common/styles/variables.scss";

.pop-up-main{
    justify-content: space-between;
    height: 100%;
    
    & > div > div.forgot-password-text {
        width: 100%;
        height: 51px;

        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 150%;
        color: $color-primary;

        display: flex;
        justify-content: flex-end;

        & > * {
            cursor: pointer;
        }
    }

    p {
        height: 27px;
    }
    .v-btn {
        margin-bottom: 16px;
    }

    .pop-up-title{
      font-family: Roboto;
      font-style: normal;
      font-weight: bold;
      font-size: 35px;
      line-height: 41px;
      color: #363636;
    }
}
</style>

<template lang="pug">
  .sign-in-page
    LandingPagePopUp(:previous="previous" v-if="!isNoAccount")
      template(v-slot:header) Sign In
      template(v-slot:main): div.pop-up-main
        div.d-flex.flex-column
          p Your Address
          ui-debio-input( disabled :value="address" block)

          p.mt-8 Please input your password
          v-text-field(
            label="Type in your password"
            v-model="password"
            class="password-field"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            :rules="passwordRules"
            :error-messages="errorMsg"
            :disabled="isLoading"
            @click:append="showPassword = !showPassword"
            @keyup.enter="decryptWallet"
            outlined
          )
          .forgot-password-text: div(v-on:click="forgotPassword") Forgot your password?

          div: v-btn.white--text(
            :disabled="!password"
            elevation="0" 
            color="primary" 
            @click="decryptWallet"
          ) Continue
          
    LandingPagePopUp(v-if="isNoAccount")
      template(v-slot:main): div.pop-up-main
        img(src="@/assets/alert-circle.png")
        div.pop-up-title No Account Found
        div.d-flex.flex-column
          div: v-btn.white--text(
              elevation="0"
              color="primary"
              @click="generateAccount"
          ) Generate Account

          div: v-btn(
              elevation="0"
              color="primary"
              outlined 
              @click="inputMnemonic"
          ) Input Mnemonic
          
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex"
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"
import localStorage from "@/common/lib/local-storage"
import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"	
import { u8aToHex } from "@polkadot/util"
import errorMessage from "@/common/constants/error-messages"


export default {
  name: "InputPassword",

  components: {
    LandingPagePopUp
  },

  data: () => ({
    keystore: "",
    password: "",
    fileName: "",
    showPassword: false,
    isLoading: false,
    snackbar: false,
    timeout: 2000,
    errorMessage,
    dataAccount: null,
    dataAccountJson: "",
    dataMnemonic: null,
    dataMnemonicJson: null,
    isNoAccount: false,
    keystoreInputErrors: [],
    address: "",
    errorMsg: ""
  }),

  computed: {
    ...mapGetters({
      pair: "substrate/wallet"
    }),
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet
    }),

    passwordRules() {
      return [
        val => !!val || errorMessage.REQUIRED
      ]
    }
  },

  async mounted() {
    await this.getKeyStoreLocal()
    this.setKeystore()
    if (this.dataAccount) {
      this.address = this.dataAccount.address
    }
  },

  methods: {
    ...mapActions({
      restoreAccountKeystore: "substrate/restoreAccountKeystore"
    }),
    previous() {
      this.$router.push({name: "landing-page"})
    },

    forgotPassword() {
      this.$router.push({name: "forgot-password"})
    },

    inputMnemonic() {
      this.$router.push({name: "input-mnemonic"})
    },

    generateAccount() {
      this.$router.push({name: "generate-account"})
    },

    async getKeyStoreLocal() {
      try {
        this.dataAccountJson = localStorage.getKeystore()
        if (this.dataAccountJson === null) {
          this.isNoAccount = true
        }
        this.dataAccount = JSON.parse(this.dataAccountJson)
      } catch (err) {
        console.log(err)
        this.isloading = false
      }
    },

    setKeystore() {
      this.keystore = this.dataAccountJson;
      this.fileName = "keystore";
    },

    async decryptWallet() {
      this.isLoading = true
      this.keystoreInputErrors = []
      let dataKeystore = []

      const keystore = JSON.parse(this.keystore)

      if (keystore === null) {
        this.keystoreInputErrors = "no keystore"
        return
      }

      if (Array.isArray(keystore)) {
        dataKeystore = keystore
        return
      }

      dataKeystore.push(keystore)

      this.dataMnemonicJson = localStorage.getLocalStorageByName("mnemonic_data")
      const encryptedMnemonic = this.dataMnemonicJson

      const mnemonic  = CryptoJS.AES.decrypt(encryptedMnemonic, this.password).toString(CryptoJS.enc.Utf8)
      const identity = await Kilt.Identity.buildFromMnemonic(mnemonic)

      const dataMnemonic = {
        privateKey: u8aToHex(identity.boxKeyPair.secretKey),
        publicKey: u8aToHex(identity.boxKeyPair.publicKey),
        mnemonic
      }

      if (mnemonic) {
        dataKeystore.push(dataMnemonic)
      }

      const result = await this.restoreAccountKeystore({
        file: dataKeystore,
        password: this.password
      })

      this.isLoading = false
      this.keystoreInputErrors = ""

      if (!result.success) {
        if (result.error === "Unable to decode using the supplied passphrase") {
          return this.errorMsg = this.errorMessage.INCORRECT_PASSWORD          
        }
      }

      this._show = false
      this.clearInput()
      this.$router.push({ name: "customer-dashboard" })
    },

    clearInput() {
      (this.keystore = ""),
      (this.password = ""),
      (this.fileName = ""),
      (this.keystoreInputErrors = []);
    },

    toGenerateAccount() {
      this.$router.push({name: "generate-account"})
    }

  }
}
</script>
