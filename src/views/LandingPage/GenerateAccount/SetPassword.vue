<style scoped lang="scss">
.pop-up-main{
    p {
        width: 504px;
        height: 54px;
        margin-bottom: 28px;
    }
    & > .password-field {
        width: 504px;
    }
}
</style>

<template lang="pug">
     LandingPagePopUp(:previous='previous')
        template(v-slot:header) Set Your Password
        template(v-slot:main)
          v-form.pop-up-main(v-model="isPasswordsValid" ref="passwordForm")
            p You will need to input this password later when making transactions with this account.
            v-text-field(
                label="Type in your password"
                v-model="password"
                class="password-field"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                :rules="$options.rules.password"
                :disabled="isLoading"
                @click:append="showPassword = !showPassword"
                @keyup.enter="onPasswordSet"
                outlined
            )
            v-text-field(
                label="Confirm your password"
                v-model="passwordConfirm"
                class="password-field"
                :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPasswordConfirm ? 'text' : 'password'"
                :rules="[passwordConfirmRule]"
                :disabled="isLoading"
                @click:append="showPasswordConfirm = !showPasswordConfirm"
                @keyup.enter="onPasswordSet"
                outlined
            )
            ui-debio-recaptcha(
              :sitekey="sitekey"
              :verify="onVerifyRecaptcha"
            )
            v-btn(
                :disabled="!buttonDisabled || !isPasswordsValid"
                class="white--text" 
                elevation="0" 
                color="primary" 
                :loading="isLoading"
                @click="register"
            ) Continue
</template>

<script>
import apiClientRequest from "@/common/lib/api"
import { mapActions, mapState, mapMutations } from "vuex"
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"
import errorMessage from "@/common/constants/error-messages"


export default {
  name: "SetPassword",

  components: {
    LandingPagePopUp
  },

  data: () => ({
    passwordsValid: false,
    password: "",
    passwordConfirm: "",
    showPassword: false,
    showPasswordConfirm: false,
    recaptchaVerified: false,
    isPasswordsValid: false,
    errorMessage
  }),
  
  computed: {
    buttonDisabled(){
      return this.recaptchaVerified && this.isPasswordConfirmed
    },

    isPasswordConfirmed() {
      if(!!this.password && this.password == this.passwordConfirm) {
        return true
      }
      return false
    },

    passwordConfirmRule() {
      if(this.isPasswordConfirmed) {
        return true
      }
      return "Passwords must match."
    },
    
    ...mapState({
      substrateApi: (state) => state.substrate.api,
      isLoading: (state) => state.substrate.isLoadingWallet
    }),

    sitekey() {
      return process.env.VUE_APP_RECAPTCHA_SITE_KEY
    }
  },

  rules: {
    password: [ 
      val => !!val || errorMessage.REQUIRED,
      val => (val && val.length >= 8) && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(val) || errorMessage.PASSWORD(8, "at least UPPER/lowercase characters, number and special character in (!@#$%^&*)")
    ]
  },

  methods: {
    ...mapActions({
      registerMnemonic: "substrate/registerMnemonic"
    }),

    ...mapMutations({
      setIsLoading: "substrate/SET_LOADING_WALLET"
    }),

    previous() {
      this.$router.push({name: "generate-mnemonic"})
    },

    async register() {
      try {
        const result = await this.registerMnemonic({
          mnemonic: this.$route.params.mnemonic,
          password: this.password
        })
        if (!result.success) {
          throw("Mnemonic registration failed!")
        }
        this.$router.push({name: "registration-successful"})
      } 
      catch (err) {
        console.error(err)
      }
    },
    
    async onVerifyRecaptcha(response) {
      const result = await apiClientRequest.post("/recaptcha", { response })

      if (result.data.success) this.recaptchaVerified = true
    }
  }
}
</script>
