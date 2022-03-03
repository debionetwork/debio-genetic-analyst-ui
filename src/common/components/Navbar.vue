<template lang="pug">
  .navbar(@mouseleave.prevent="handleHideDropdown(computeMouseLeave)")
    .navbar__wrapper
      .navbar__breadcrumbs(@mouseenter.prevent="handleHideDropdown(computeMouseLeave)")
        ui-debio-breadcrumbs(v-if="!error")

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

          ui-debio-avatar.navbar__connect(
            size="24"
            v-else
            :key="menu.id"
            :option="!loginStatus"
            option-text="Connect"
            rounded
            :active="menu.active"
            rounded-type="circle"
            border-size="2"
            border-color="#5640A5"
            :class="{ 'navbar__connect--logged': loginStatus }"
            @optionClicked="connectToMetamask"
          )
            ui-debio-icon.navbar__connect-icon(
              slot="icon"
              :icon="metamaskFoxIcon"
              view-box="0 0 100 100"
              size="16"
              @click.prevent="handleHover($event, idx)"
              @mouseenter.prevent="handleHover($event, idx)"
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

                section.navbar__dropdown-content(v-if="getActiveMenu.type === 'settings'")
                  .navbar__settings
                    .settings-item(role="button")
                      .settings-item__wrapper(@click="signOut")
                        .settings-item__title(aria-label="Signout") Sign Out
                        ui-debio-icon.settings-item__icon(:icon="logoutIcon" size="24" stroke color="#C400A5")

                section.navbar__dropdown-content(v-if="getActiveMenu.type === 'polkadot' || getActiveMenu.type === 'metamask'")
                  ui-debio-input(label="Your Address" :data-wallet="walletAddress" ref="polkadot" disabled :value="walletAddress" block)
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
                      .navbar__balance-type {{ getActiveMenu.currency }} Balance
                      .navbar__balance-amount
                        ui-debio-icon(:icon="getActiveMenu.type === 'metamask' ? daiIcon : debioIcon" size="10")
                        span {{ activeBalance }}

              template(slot="footer" v-if="getActiveMenu.action")
                v-btn.navbar__footer-button(block color="primary" outlined @click="handleDropdownAction(getActiveMenu.type)") {{ getActiveMenu.action }}

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
  metamaskFoxIcon,
  copyIcon
} from "@debionetwork/ui-icons"

import localStorage from "@/common/lib/local-storage"
import { generalDebounce } from "@/common/lib/utils"
import { queryBalance } from "@/common/lib/polkadot-provider/query/balance"
import { ethAddressByAccountId } from "@/common/lib/polkadot-provider/query/user-profile"
import { getBalanceDAI } from "@/common/lib/metamask/wallet"
import { fromEther } from "@/common/lib/balance-format"
import { startApp } from "@/common/lib/metamask"
import { handleSetWallet } from "@/common/lib/wallet"


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
    metamaskFoxIcon,
    searchIcon,
    copyIcon,
    searchQuery: "",
    contentHover: false,
    loginStatus: false,
    debounce: null,
    arrowPosition: "",
    showMetamaskDialog: false,
    balance: 0,
    walletAddress: "",
    activeBalance: 0,
    ethAccount: null,
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
        icon: settingIcon,
        type: "settings",
        active: false
      },
      {
        id: 3,
        icon: polkadotIcon,
        type: "polkadot",
        title: "Polkadot Wallet",
        currency: "DBIO",
        active: false
      },
      {
        id: 4,
        type: "metamask",
        title: "Metamask Wallet",
        currency: "DAI",
        isAvatar: true,
        action: "Disconnect Wallet",
        active: false
      }
    ]
  }),

  computed: {
    ...mapActions({
      clearAuth: "auth/clearAuth"
    }),

    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
      metamaskWalletBalance: (state) => state.metamask.metamaskWalletBalance,
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
    this.checkMetamaskAddress()
    this.fetchWalletBalance()

  },

  watch: {
    lastEventData() {
      if(this.lastEventData) {
        this.fetchWalletBalance()
      }
    }
  },

  methods: {
    ...mapMutations({
      setWalletBalance: "substrate/SET_WALLET_BALANCE",
      setMetamaskAddress: "metamask/SET_WALLET_ADDRESS",
      setMetamaskBalance: "metamask/SET_WALLET_BALANCE",
      clearWallet: "metamask/CLEAR_WALLET"
    }),

    handleNotificationRead(notif) {
      notif.read = true
      this.$store.dispatch("substrate/updateDataListNotification", {
        address: this.wallet.address,
        role: "customer",
        data: this.notifications
      })
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
        const formatedBalance = await fromEther(this.walletBalance)
        this.activeBalance = Number(formatedBalance).toFixed(3)
      }

      if (selectedMenu.type === "metamask" && !this.loginStatus) return

      if (selectedMenu.type === "metamask") {
        this.walletAddress = this.metamaskWalletAddress
        this.activeBalance = await getBalanceDAI(this.metamaskWalletAddress)
      }

      selectedMenu.active = true

      const checkSmallDropdown = selectedMenu.type === "settings"

      const calculateFinalPosition = checkSmallDropdown
        ? 37
        : this.$refs.menu.getBoundingClientRect().width - 7

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
        const balanceNummber = await queryBalance(
          this.api,
          this.wallet.address
        )
        this.setWalletBalance(balanceNummber)
      } catch (err) {
        console.error(err)
      }
    },

    async checkMetamaskAddress() {
      if (this.metamaskWalletAddress === "") {
        const ethRegisterAddress = await ethAddressByAccountId(
          this.api,
          this.wallet.address
        )

        if (ethRegisterAddress !== null) {
          const balance = await getBalanceDAI(ethRegisterAddress)
          this.setMetamaskAddress(ethRegisterAddress)
          this.setMetamaskBalance(balance)
          this.loginStatus = true
        }
      }

      if (this.metamaskWalletAddress) {
        this.loginStatus = true
      }

    },

    async connectToMetamask() {
      this.loading = true
      this.ethAccount = await startApp()

      if (this.ethAccount.currentAccount === "no_install") {
        window.open("https://metamask.io/download/", "_blank")
        this.ethAccount = null
        this.loading = false
        return
      }

      const account = await handleSetWallet("metamask", this.metamaskWalletAddress)
      const accountId = localStorage.getAddress()
      const ethAddress = account[0].address

      await this.$store.dispatch("wallet/walletBinding", {accountId, ethAddress})
      this.setMetamaskAddress(ethAddress)
      this.loading = false
      this.loginStatus = true
      this.menus.find(menu => menu.type === "metamask").active = true
    },

    disconnectWallet() {
      this.loginStatus = false
      this.menus.find(menu => menu.type === "metamask").active = false
    },

    handleDropdownAction(type) {
      if (type === "metamask") this.disconnectWallet()
    },

    signOut () {
      localStorage.clear()
      this.clearAuth
      this.clearWallet()
      this.ethAccount = null
      this.loginStatus = false
      this.menus.find(menu => menu.type === "metamask").active = false
      this.$router.push({ name: "sign-in"})
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

        .navbar__connect-icon
          svg
            width: 1.563rem !important
            height: 1.563rem !important
            animation: animateMetamask .3s infinite alternate !important

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

    &__balance
      margin-top: 0.75rem
      display: flex
      flex-direction: column

    &__balance-wrapper
      display: inherit
      align-items: center
      justify-content: space-between

    &__balance-amount
      display: flex
      align-items: center
      gap: 0.375rem

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

  @keyframes animateMetamask
    0%
      transform: rotate(-6deg)
    50%
      transform: translateY(0.063rem)
    100%
      transform: rotate(6deg)
    
</style>
