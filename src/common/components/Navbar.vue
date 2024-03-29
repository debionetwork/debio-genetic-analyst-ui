<template lang="pug">
  .navbar(@mouseleave.prevent="handleHideDropdown(computeMouseLeave)")
    .navbar__wrapper
      .navbar__breadcrumbs(@mouseenter.prevent="handleHideDropdown(computeMouseLeave)")
        ui-debio-breadcrumbs(v-if="!error" :base-router="$route.meta.parent")

      .navbar__user-menu(ref="menu" :class="{ 'navbar__user-menu--settings': !!getActiveMenu && getActiveMenu.type === 'settings' }")
        template(v-for="(menu, idx) in menus")
          ui-debio-icon(
            :key="menu.id"
            :icon="menu.icon"
            size="24"
            :class="{ 'notification-dot': menu.type === 'notification' && notifications.some(v => v.read === false) }"
            v-if="!menu.isAvatar"
            role="button"
            @click.prevent="handleHover($event, idx)"
            @mouseenter.prevent="handleHover($event, idx)"
            :color="menu.active ? '#C400A5' : '#5640A5'"
            stroke
          )

        transition(name="fade" mode="out-in")
          .navbar__dropdown(v-if="!!getActiveMenu")
            .navbar__triangle
              .navbar__triangle-object(:class="{ 'navbar__triangle-object--active': !!getActiveMenu }" :style="{'--arrow-position': arrowPosition}")

            ui-debio-card(:width="getActiveMenu.type === 'settings' ? '225' : '368'")
              template(slot="header" v-if="getActiveMenu.title")
                span {{ getActiveMenu.title }}

              template
                section.navbar__dropdown-content(v-if="getActiveMenu.type === 'notification'")
                  .navbar__notification
                    .notification-item.text-center(v-if="!notifications.length") No notifications yet
                    router-link.notification-item(
                      role="button"
                      v-for="(notif, idx) in notifications"
                      :class="{ 'notification-item--new': !notif.read }"
                      :key="idx"
                      @click.native="handleNotificationRead(notif)"
                      :to="{ name: notif.route, params: notif.params }"
                    )
                      .notification-item__wrapper
                        .notification-item__title(:aria-label="notif.message")
                          | {{ notif.message }}

                        .notification-item__description(
                          :aria-label="compareDate(new Date(), new Date(parseInt(notif.timestamp)))"
                        )
                          | {{ compareDate(new Date(), new Date(parseInt(notif.timestamp))) }}

                section.navbar__dropdown-content(v-if="getActiveMenu.type === 'polkadot'")
                  .navbar__wallet-header
                    ui-debio-icon.mb-5(
                      :icon="getActiveMenu.icon"
                      size="24"
                      :class="{ 'notification-dot': getActiveMenu.type === 'notification' && notifications.some(v => v.read === false) }"
                      :color="getActiveMenu.active ? '#C400A5' : '#5640A5'"
                      stroke
                    )
                    h4.ml-5 Polkadot


                  ui-debio-input(label="Address" variant="small" :data-wallet="walletAddress" ref="polkadot" disabled :value="walletAddress" block)
                    ui-debio-icon(
                      slot="icon-append"
                      :icon="copyIcon"
                      view-box="0 0 40 40"
                      stroke
                      color="#5640A5"
                      size="20"
                      role="button"
                      @click="handleCopy(walletAddress)"
                    )
                  .navbar__balance
                    .navbar__balance-wrapper
                      .navbar__balance-type Balance
                      .navbar__balance-instruction 
                        v-icon(size="10" type="button") mdi-open-in-new
                        span.ml-2 How to add balance

                    v-divider.navbar__balance-divider
                    .navbar__balance-amount(v-for="wallet in polkadotWallets")
                      v-img(
                        alt="no-list-data"
                        :src="require(`../../assets/${wallet.icon}.svg`)"
                        max-width="24px"
                        max-height="24px"
                      )
                      span {{ wallet.balance }} {{ wallet.currency === "USDTE" ? "USDT.e" : wallet.currency }} 

                    v-divider.navbar__balance-divider-sec


              template(slot="footer" v-if="getActiveMenu.type === 'polkadot'")
                v-btn.navbar__footer-button(outlined block color="#FE379E" dark @click="exportKeystoreAction") Export Keystore
                v-btn.navbar__footer-button(block dark color="#FE379E" @click="signOut()") Sign Out

    v-progress-linear.navbar__loading(
      v-if="loading"
      color="primary"
      indeterminate
    )
</template>

<script>
import { compareDate } from "@/common/lib/utils"
import { mapActions, mapMutations, mapState } from "vuex"

import {
  searchIcon,
  bellIcon,
  settingIcon,
  userIcon,
  daiIcon,
  debioIcon,
  usersIcon,
  logoutIcon,
  polkadotIcon,
  copyIcon
} from "@debionetwork/ui-icons"

import localStorage from "@/common/lib/local-storage"
import { generalDebounce } from "@/common/lib/utils"
import { queryAccountBalance } from "@debionetwork/polkadot-provider"
import { setReadNotification } from "@/common/lib/api"
import { queryGetAssetBalance, queryGetAllOctopusAssets } from "@/common/lib/polkadot-provider/query/octopus-assets"
import getEnv from "@/common/lib/utils/env"


let timeout

export default {
  name: "Navbar",

  props: {
    notifications: { type: Array, default: () => [] },
    error: { type: [Object, Boolean], default: null }
  },

  data: () => ({
    compareDate,

    bellIcon,
    settingIcon,
    userIcon,
    daiIcon,
    debioIcon,
    usersIcon,
    logoutIcon,
    polkadotIcon,
    searchIcon,
    copyIcon,
    searchQuery: "",
    contentHover: false,
    loginStatus: false,
    notifReads: [],
    arrowPosition: "",
    balance: 0,
    walletAddress: "",
    activeBalance: 0,
    loading: false,
    menus: [
      {
        id: 1,
        icon: bellIcon,
        type: "notification",
        title: "Notifications",
        active: false
      },
      {
        id: 2,
        icon: polkadotIcon,
        type: "polkadot",
        title: "Wallet",
        currency: "DBIO",
        active: false
      }
    ],
    polkadotWallets: [
      {
        id: null,
        name: "debio",
        icon: "debio-logo",
        currency: "DBIO",
        unit: "ether",
        balance: 0,
        tokenId: ""
      },
      {
        id: null,
        name: "usdt",
        icon: "tether-logo",
        currency: "USDTE",
        unit: "mwei",
        balance: 0,
        tokenId: ""
      }
    ],
    octopusAsset: []
  }),

  created() {
    this.polkadotWallets.forEach(wallet => {
      if(wallet.name ==="usdt") {
        wallet.tokenId = getEnv("VUE_APP_DEBIO_USDT_TOKEN_ID")
      }
    })
  },

  computed: {
    ...mapActions({
      clearAuth: "auth/clearAuth"
    }),

    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      web3: (state) => state.web3Store.web3,
      lastEventData: (state) => state.substrate.lastEventData
    }),

    getActiveMenu() {
      return this.menus.find(menu => menu.active)
    },

    computeMouseLeave() {
      return this.getActiveMenu
        ? this.getActiveMenu.id - 1
        : null
    }
  },

  async mounted () {
    this.refetchBalance()
  },

  watch: {
    lastEventData(val) {
      if(!val) return

      this.refetchBalance()
      this.loading = false
    }
  },

  methods: {
    ...mapMutations({
      setWalletBalance: "substrate/SET_WALLET_BALANCE"
    }),

    async handleNotificationRead(notif) {
      clearTimeout(timeout)
      if (notif.read) return

      notif.read = true
      this.notifReads.push(notif.id)
      timeout = setTimeout(async () => {
        await setReadNotification(this.notifReads)
      }, 2000)
    },

    async handleCopy(text) {
      await navigator.clipboard.writeText(text)

      this.$refs.polkadot.$el.querySelector("input").value = "Address Copied!"

      generalDebounce(
        () => {
          this.$refs.polkadot.$el.querySelector("input").value = this.$refs.polkadot.$attrs["data-wallet"]
        },
        1000
      )
    },

    handleAvatar() {
      this.handleHideDropdown(this.computeMouseLeave)
    },

    async handleHover(e, idx) {
      this.menus.forEach(menu => menu.active = false)
      const selectedMenu = this.menus[idx]

      if (selectedMenu.type === "polkadot") {
        this.walletAddress = this.wallet.address
        this.activeBalance = Number(this.walletBalance).toFixed(3)
      }

      selectedMenu.active = true

      const calculateFinalPosition = this.$refs.menu.getBoundingClientRect().width + 200

      this.arrowPosition = `${
        e.target.getBoundingClientRect().left -
        this.$refs.menu.offsetLeft +
        calculateFinalPosition
      }px`
    },

    handleHideDropdown(idx) {
      if (idx === null) return

      this.menus[idx].active = false
    },

    async fetchWalletBalance() {
      try {
        const balanceNummber = await queryAccountBalance(
          this.api,
          this.wallet.address
        )
        this.setWalletBalance(balanceNummber)
        this.polkadotWallets[0].balance = this.walletBalance
      } catch (err) {
        console.error(err)
      }
    },

    async fetchPolkadotBallance() {
      this.polkadotWallets.forEach(async (w) => {
        if (w && w.name !== "debio") {
          const octopusData = this.octopusAsset.find(data => data.tokenId === w.tokenId)
          w.balance = octopusData.data ? this.web3.utils.fromWei(octopusData.data.balance.replaceAll(",", ""), w.unit) : 0
        }
      })
    },

    async getOctopusAsset() {
      this.octopusAsset = []
      const assets = await queryGetAllOctopusAssets(this.api)
      for (let i = 0; i < assets.length; i++) {
        const tokenId = assets[i][0].toHuman()[0]
        const id = assets[i][1].toHuman()
        const data = await queryGetAssetBalance(this.api, id, this.wallet.address)
        const assetData = {id, data, name:  tokenId.split(".")[0], tokenId}
        this.octopusAsset.push(assetData)
      }
      await this.fetchPolkadotBallance()
    },

    async refetchBalance() {
      try {
        await this.fetchWalletBalance()
        await this.getOctopusAsset()
      } catch (err) {
        console.error(err)
      }
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

    signOut () {
      localStorage.clear()
      this.clearAuth
      this.loginStatus = false
      this.$router.push({ name: "sign-in"})
      const accounts = Object.keys(window.localStorage).filter((v) =>
        /account:/.test(v)
      )

      accounts.forEach((a) => {
        window.localStorage.removeItem(a)
      })
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .navbar
    padding: 3rem
    width: 100%
    z-index: 100

    &__loading
      margin-top: 10px

    &__triangle
      height: 1.25rem
      overflow: hidden

    &__triangle-object
      position: absolute
      top: -0.313rem
      z-index: -1
      border-style: solid
      border-width: 0 0.875rem 1.875rem 0.875rem
      border-color: transparent transparent #FFFFFF transparent
      opacity: 0
      transform: translateX(var(--arrow-position))
      filter: drop-shadow(0 0.125rem 0.625rem rgba(0, 0, 0, 0.15))
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

      &--active
        opacity: 1

    &__wrapper
      display: flex
      align-items: center
      justify-content: space-between

    &__user-menu
      display: flex
      align-items: center
      position: relative
      gap: 0 1.875rem

    &__user-menu--settings
      .ui-debio-card__body
        padding-top: 0
        padding-bottom: 0

    &__connect
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

      &:hover
        margin-left: calc(1.875rem * 3.3)
        width: 2.75rem !important
        height: 2.75rem !important

      &--logged:hover
          margin-left: unset !important
          width: 1.5rem !important
          height: 1.5rem !important

          .navbar__connect-icon
            width: unset !important
            height: unset !important
            animation: unset !important

    &__dropdown
      position: absolute
      z-index: 9
      top: 3.125rem
      right: 0

    &__wallet-header
      display: flex

    &__balance
      margin-top: 0.75rem
      display: flex
      flex-direction: column

    &__balance-type
      @include body-text-medium-1

    &__balance-instruction
      color: #8F98AA
      @include tiny-reg
   

    &__balance-wrapper
      display: inherit
      align-items: center
      justify-content: space-between

    &__balance-amount
      padding: 6px
      display: flex
      align-items: center
      gap: 0.375rem

    &__balance-divider
      margin-top: 0.75rem
      margin-bottom: 0.9rem

    &__balance-usd
      display: inherit
      justify-content: flex-end

    &__balance-desc
      font-size: 0.625rem
      font-weight: 400
      line-height: 0.938rem

    &__footer-button
      margin-bottom: 0.938rem

    &__notification
      max-height: 13.55rem
      display: flex
      flex-direction: column
      overflow-y: scroll

      &::-webkit-scrollbar-track
        background-color: #FFFFFF

      &::-webkit-scrollbar
        width: 0.438rem

      &::-webkit-scrollbar-thumb
        border-radius: 0.625rem
        background: #D3C9D1

  .notification-item
    color: #000000 !important
    text-decoration: none

    &--new
      color: #5640A5 !important

    &__wrapper
      position: relative
      padding: 0.688rem 1.438rem
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

      &::before
        content: ""
        display: block
        position: absolute
        opacity: 0
        left: 0
        width: 0.313rem
        height: 90%
        border-radius: 0 0.25rem 0.25rem 0
        background: #C400A5
        top: 50%
        transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
        transform: translateY(-50%)

      &:hover
        background: #F5F7F9

        &::before
          opacity: 1

        .notification-item__title
          color: #C400A5

    &__title
      font-size: 0.75rem
      font-weight: 500
      line-height: 0.875rem
      margin-bottom: 0.313rem

    &__description
      font-size: 0.75rem
      font-weight: 400
      line-height: 0.875rem
      color: #D3C9D1

  .settings-item
    &:not(:last-of-type)
      border-bottom: solid 0.063rem #757274

    &__wrapper
      position: relative
      height: 3.75rem
      display: flex
      justify-content: space-between
      align-items: center

      &::before
        content: ""
        display: block
        position: absolute
        left: -1.563rem
        width: 0.313rem
        height: 2.063rem
        opacity: 0
        border-radius: 0 0.25rem 0.25rem 0
        background: #C400A5
        top: 50%
        transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
        transform: translateY(-50%)

      &:hover

        &::before
          opacity: 1

        .settings-item__title
          color: #5640A5

    &__title
      font-size: 0.938rem
      line-height: 150%
      color: #757274

  .notification-dot
    position: relative
    transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

    &::after
      content: ""
      display: block
      width: 13px
      height: 13px
      position: absolute
      bottom: 2px
      right: -1px
      border-radius: 50%
      background: #FF56E0

  .fade
    &-enter-active,
    &-leave-active
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

    &-enter,
    &-leave-to
      transform: translateY(1.563rem)
      opacity: 0
</style>
