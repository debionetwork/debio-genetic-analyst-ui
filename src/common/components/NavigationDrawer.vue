<style lang="sass" scoped>
@import "../styles/mixins.sass"

.dg-raleway-font
  font-family: 'Raleway'

.drawer
  background: unset !important
  border: unset !important
  position: relative
  margin: 0 !important
  height: unset !important
  min-width: max-content

.v-navigation-drawer__content
  overflow: unset !important

.sidebar-text
  text-transform: none !important
  letter-spacing: 0 !important
  font-size: 13pt !important

.btn-drawer
  align-items: center
  text-align: left
  padding-left: 0%
  justify-content: left

  &::before
    background-color: #FFFFFF

.btnDrawerIcon
  margin: 0 16px 0 0

.drawer-item
  margin: 0 1.563rem

.navTitle
  font-size: 15px
  font-weight: 600

.lineDivider
  margin-left: 35px
  margin-right: 35px
  margin-top: 5px
  border-color: #FF56E0 !important

.footerDrawer
  margin: 65px 0 0

.footerDrawer div
  display: flex
  font-weight: 400

.version
  @include body-text-3-opensans

.footerDrawer a
  font-size: 13px
  color: grey

.footer
  align-items: flex-start
  align-content: flex-start
  text-align: left

.dbioLogo
  margin: 0 32px
  margin-bottom: 72px

.iconLogo
  height: 125px
  width: 125px

.textBox
  margin-bottom: -15px
  margin-top: -15px

.textLogo
  font-size: 30px
  color: #FF56E0

.subtexBox
  margin-top: -5px

.subTextLogo
  font-size: 10px
  margin-top: -10px
  color: #FF56E0

.text-left
  align-content: flex-start

.activeButton
  background: linear-gradient(270deg, rgba(255, 255, 255, 0) 75.23%, rgba(195, 0, 164, 0.31) 150.85%)
  border-left: solid #C400A5 5px
  margin-left: -5px


</style>

<template lang="pug">
  v-Navigation-drawer(
    app
    clipped
    fixed
    permanent
    :width="width"
    stateless
    class="mr-10 pt-10 drawer darken-1"
    floating
  )
    div.dbioLogo
      a(
        @click.stop="goToDashboard"
        target="_blank"
        style="text-decoration: none"
      )
        div(class="d-flex align-center")
          v-img(
            alt="dbio Logo"
            class="shrink mr-2"
            contain
            src="@/assets/debio-logo.png"
            transition="scale-transition"
            width="52px"
            height="52px"
          )
          div(class="pt-3 fluid")
            div(class="textBox")
              span(class="textLogo font-weight-bold light_primary--text ") DeBio
            v-row(class="subtextBox")
              v-col(cols="18" class="ml-3 pa-0")
                b(class="subTextLogo font-weight-bold light_primary--text ") Powered by
              v-col(cols="4" class="my-0 ml-0 mt-2 pa-0")
                v-img(
                  alt="Octopus Logo"
                  class="shrink mr-2"
                  contain
                  prepend
                  center
                  src="@/assets/octopus.png"
                  transition="scale-transition"
                  width="9"
                )
    v-flex
      .drawer-item.pt-1.pb-1(v-for="(item, key) in items" :key="key")
        ui-debio-button.btn-drawer(
          :class="customClass(item.active)"
          :to="item.disabled ? {} : { name: item.route } "
          :height="'50px'"
          :color="'none'"
          text
          block
          :style="item.disabled ? 'pointer-events: none' : '' "
        )
          ui-debio-icon.btnDrawerIcon(
            :icon="item.icon"
            size="24"
            stroke
            :color="item.active ? '#C400A5' : item.disabled ? '#D3C9D1' : '#363636'"
          )
          span.navTitle(:style="item.disabled ? 'color: #D3C9D1' : ''") {{ item.text }}

      v-divider.lineDivider
      .d-flex.flex-column.align-center
        slot
        v-spacer

        div.footerDrawer
          a(
            href="https://docs.debio.network/"
            target="_blank"
            rel="noreferrer noopener nofollow"
            style="text-decoration: none"
          )
            div
              ui-debio-icon.btnDrawerIcon(
                :icon="bookIcon"
                size="16"
                stroke
                :color="'#757274'"
                viewBox="0 0 18 18"
              )
              span Customer Care

          a.mt-3.d-block(
            href="https://docs.debio.network/legal/terms-and-condition"
            target="_blank"
            rel="noreferrer noopener nofollow"
            style="text-decoration: none"
          )
            div
              ui-debio-icon.btnDrawerIcon(
                :icon="alertIcon"
                size="16"
                stroke
                :color="'#757274'"
              )
              span Terms and Condition
          div.version.mt-16.mb-10.d-flex
            span.mr-12 DeBio Network
            span {{ version }}
</template>

<script>

import { bookIcon, alertIcon } from "@debionetwork/ui-icons"
import getEnv from "@/common/lib/utils/env"

export default {
  name: "NavigationDrawer",

  props: {
    items: { type: Array, default: () => [] },

    width: { type: String, default: "auto" }
  },

  data: () => ({
    bookIcon,
    alertIcon,

    version: ""
  }),

  created() {
    this.version = `v${getEnv("VUE_APP_VERSION")}`
  },

  methods: {
    customClass(active) {
      if (active) {
        return "font-weight-bold sidebar-text primary--text activeButton"
      }
      return "font-weight-bold sidebar-text"
    },

    goToDashboard() {
      this.$router.push({ path: "/genetic-analyst" });
    }
  }
}
</script>
