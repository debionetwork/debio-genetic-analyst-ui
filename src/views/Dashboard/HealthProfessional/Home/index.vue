<template lang="pug">
  .hp-dashboard
    .hp-dashboard__wrapper
      HealthProfessionalBanner

      ui-debio-button.hp-dashboard__button(
        color="#FF8EF4"
        dark
        @click="toGiveOpinion"
      ) + Give Opinion

      v-row.hp-dashboard__cards(v-if="isVerified")
        ui-debio-card.mr-5(
          width="280px"
          height="108px"
        )
          v-row
            v-img.mr-2(
              alt="opinion-icon"
              src="@/assets/opinion-icon.svg"
              max-width="64px"
              max-height="64px"
            )
            .hp-dashboard__card-text
              span Opinion Given
              h1 {{ opinionGiven }}
          
        ui-debio-card(
          width="280px"
          height="108px"
        )
          v-row
            v-img.mr-2(
              alt="income-icon"
              src="@/assets/income-icon.svg"
              max-width="64px"
              max-height="64px"
            )
            .hp-dashboard__card-text
              span Income(USDT)
              h1 {{ totalIncome }}

      .hp-dashboard__content
        template(v-if="!isVerified")
          .hp-dashboard__alert 
            ui-debio-icon(
              :icon="alertIcon"
              size="25"
              stroke
            )
            span.hp-dashboard__alert-text Thank you. Your application is being reviewed by DAOGenics. This might take a while

        template(v-if="isVerified")
          ui-debio-data-table(
            :headers="headers"
            :items="items"
            :loading="isLoadingData"
          )

            template(v-slot:[`item.action`]="{ item }")
              ui-debio-button.hp-dashboard__table-button(
                color="#FF8EF4" 
                dark
                text
                width="120px"
                height="35"
                style="font-size: 6px;"
                @click="toOpinion(item)"
              ) View My Opinion

          ui-debio-modal.hp-dashboard__modal(
            :show="isNotInstalled"
            :show-title="false"
            :show-cta="false"
            @onClose="isNotInstalled = false"
          )
            h2.mt-5 Install Polkadot Extension
            ui-debio-icon.mb-8(:icon="alertTriangleIcon" stroke size="80")
            p.hp-dashboard__subtitle Press install Polkadot Extensions button below to continue, your second opinion will be redirected to myriad.social platform.

            ui-debio-button(
              block
              color="secondary"
              @click="toInstall"
            ) Install

          ui-debio-modal.hp-dashboard__modal-connect(
            :show="showConnect"
            :show-title="false"
            :show-cta="false"
            @onClose="showConnect = false"
          )
            v-img(
              alt="debio-to-myriad"
              src="@/assets/debio-to-myriad.svg"
              max-width="129px"
              max-height="48px"
            )

            h2.mt-5 Redirecting You to Myriad
            .hp-dashboard__subtitle
              p The Second Opinion Marketplace requires a Polkadot account to conduct transactions.
              p By clicking this button below, you will download your account's keystore and you will be asked to upload that keystore in the Polkadot extension to export your account.
              p Do you wish to continue?


            ui-debio-button(
              width="304px"
              block
              color="secondary"
              @click="toContinue"
            ) CONTINUE & EXPORT KEYSTORE


          ui-debio-modal.hp-dashboard__modal-connect(
            :show="isConnectToMyriad"
            :show-title="false"
            :show-cta="false"
            @onClose="isConnectToMyriad = false"
          )
            p.hp-dashboard__subtitle Connecting your request into Myriad

            v-img(
              alt="debio-logo-loading"
              :src="require(`../../../../assets/${logo}.svg`)"
              max-width="360px"
              max-height="72px"
            )

</template>

<script>

import { mapState } from "vuex"
import HealthProfessionalBanner from "@/common/components/HealthProfessionalBanner.vue"
import { alertIcon, alertTriangleIcon } from "@debionetwork/ui-icons"
import { isWeb3Injected, web3Enable, web3Accounts, web3FromAddress } from "@polkadot/extension-dapp"
import { queryGetHealthProfessionalAccount } from "@/common/lib/polkadot-provider/query/health-professional"
import localStorage from "@/common/lib/local-storage"
import { myriadContents, myriadContentTotal, myriadTipTotal, myriadCheckUser } from "@/common/lib/api" 
import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"
import getEnv from "@/common/lib/utils/env"


export default {
  name: "PHDashboard",

  data: () => ({
    account: {},
    alertIcon,
    alertTriangleIcon,
    isNotInstalled: false,
    showConnect: false,
    isConnectToMyriad: false,
    isConnecting: false,
    isConnected: false,
    isVerified: true,
    logo: "debio-logo-loading",
    addressHex: "",
    isLoadingData: false,
    opinionGiven:  0,
    totalIncome: 0,
    myriadAccountDetails: {},
    items: [],
    headers: [
      { text: "User", value: "username", sortable: true },
      { text: "Category", value: "category", sortable: true },
      { text: "Opinion Date", value: "opinionDate", sortable: true },
      { text: "Unlocked Content", value: "unlockedContent", sortable: true },
      { text: "Opinion Fee", value: "opinionFee", width: "115", sortable: true },
      { text: "Actions", value: "action", sortable: false, align: "center" }
    ]
  }),

  components: {
    HealthProfessionalBanner
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      mnemonicData: (state) => state.substrate.mnemonicData
    })
  },

  watch: {
    async mnemonicData(val) {
      if(val) {
        await this.getInitialData()
      }
    }
  },

  async created () {
    await this.getInitialData()
    await this.checkAccount()
  },

  methods: {
    async checkAccount() {
      const account = await queryGetHealthProfessionalAccount(this.api, this.wallet.address)
      if (!account || account?.stakeStatus !== "Staked") {
        this.$router.push({ name: "hp-account" })    
      }
      if (account.verificationStatus === "Unverified") this.isVerified = false
      this.account = account
    },
    
    async toGiveOpinion() {
      this.isNotInstalled = !isWeb3Injected
      if (!this.isNotInstalled) {
        this.showConnect = true
      }
      const timelineId = this.account.info.category === "Physical Health" ? getEnv("VUE_APP_PHYSICAL_HEALTH_TIMELINE_ID") : getEnv("VUE_APP_MENTAL_HEALTH_TIMELINE_ID")
      window.open(`${getEnv("VUE_APP_MYRIAD_URL")}/?type=experience&id=${timelineId}`)
      this.$router.push({ name: "hp-dashboard"})
    },

    async checkMyriadAccount() {
      const jwt = await myriadCheckUser(this.addressHex)
      await this.getMyriadTotal(jwt)
      await this.getContent(jwt)
    },

    async toOpinion(post) {
      window.open(`${getEnv("VUE_APP_MYRIAD_URL")}/login?redirect=${getEnv("VUE_APP_MYRIAD_URL")}%2Fpost%2F${post.postId}`)
    },

    async getInitialData() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
      this.addressHex =  cred.signPublicKeyAsHex
      await this.checkMyriadAccount()
    },

    async toInstall() {
      window.open("https://polkadot.js.org/extension/", "_blank")
    },

    async getMyriadTotal(data) {
      const myriadContent = await myriadContentTotal(data.user_id, data.jwt)
      this.opinionGiven = myriadContent.data.count

      const myriadTip = await myriadTipTotal(data.jwt)
      this.totalIncome = myriadTip.data.data.length
    },

    async getContent(data) {
      const content = await myriadContents(data.jwt)
      content.data.data.data.map(data => {
        const detail = {
          userId: data.userId,
          postId: data.postId,
          username: data.post.user.username,
          category: data.post.experiences[0].name,
          opinionDate: new Date (data.updatedAt).toLocaleString("en-GB", {
            day: "numeric",
            year: "numeric",
            month: "short"
          }),
          unlockedContent: data.post.metric.tips,
          opinionFee: `${data.asset.exclusiveContents[0].price} ${data.asset.exclusiveContents[0].symbol}`
        }
        this.items.push(detail)
      })
    },

    exportKeystoreAction(){
      try {
        const keystore = localStorage.getKeystore()
        const address = localStorage.getAddress()
        const file = new Blob([keystore], {type: "text/json;charset=utf-8"})
        const downloadUrl = window.URL.createObjectURL(file)
        const downloadLink = document.createElement("a")
        downloadLink.href = downloadUrl
        downloadLink.target = "_blank"
        downloadLink.download = `${address}.json`

        downloadLink.click()

        window.URL.revokeObjectURL(downloadUrl)
      } catch (err) {
        console.error(err)
      }
    },

    async toContinue() {
      const sender = this.wallet.address 
      const allInjected = await web3Enable("DeBio Network");
      if (!allInjected) return this.isNotInstalled = false

      const allAccounts = await web3Accounts()
      if (!allAccounts.length) await this.exportKeystoreAction()

      const account = allAccounts.find(account => account.address === sender)
      if(!account) await this.exportKeystoreAction()

      const injector = await web3FromAddress(sender)
      if (injector) {
        this.showConnect = false
        this.$router.push({ name: "connecting-page"})
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/functions.sass"
  @import "@/common/styles/mixins.sass"

   
  .hp-dashboard
    &__wrapper
      height: 100%

    &__button
      margin-top: 30px

    &__cards
      margin-top: 30px
      margin-left: 4px

    &__content
      background: #FFFFFF
      border-radius: 4px
      margin-top: 35px
      min-height: 70vh
      padding: 30px

    &__alert
      display: flex
      padding: 15px 20px
      background: #F5F7F9
      border-radius: 4px
      font-weight: 600

    &__alert-text
      margin-left: 10px

    &__subtitle 
      max-width: 304px
      text-align: left
      color: #595959
      @include new-body-text-2-medium

</style>
