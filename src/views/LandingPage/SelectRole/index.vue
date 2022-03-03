<template lang="pug">
  LandingPagePopUp(:previous="previous")
    .select-role(slot="main")
      .select-role__button(v-for="role in roles" :key="role.route")
        router-link.select-role__icon(:to="{ name: role.route }")
          ui-debio-icon(
            :icon="role.icon"
            role="button"
            size="50"
            stroke
          )
        span.select-role__title {{ role.title }}
</template>

<script>
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"
import { usersIcon, userIcon } from "@debionetwork/ui-icons"

export default {
  name: "InputPassword",

  components: { LandingPagePopUp },

  data: () => ({
    usersIcon,
    userIcon,

    roles: [
      { title: "Customer", route: "customer-dashboard", icon: usersIcon },
      { title: "Genetic Analyst", route: "genetic-analyst", icon: userIcon }
    ]
  }),

  methods: {
    previous() {
      this.$router.push({ name: "landing-page" })
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/common/styles/variables.scss"

.select-role
  width: 500px
  height: 400px
  padding: 100px 0 // TODO: Update with grid-template-columns: 1fr 1fr instead of padding when DEBIO have 4 roles
  display: grid
  grid-template-columns: 1fr 1fr

  &__button
    display: flex
    flex-direction: column
    align-items: center

  &__title
    margin-top: 10px
    transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

  &__icon
    width: 110px
    height: 110px
    border-radius: 50%
    text-align: center
    box-shadow: 0px 2px 10px 0px #a9a9a9
    display: flex
    justify-content: center
    align-items: center
    border: solid 50px #FFFFFF
    transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

    &:hover
      border: solid 5px #C400A5
      box-shadow: 0px 2px 20px 0px #a9a9a9

      & + span
        color: #C400A5
        pointer-events: none

      &::v-deep
        svg
          stroke-width: 3
          stroke-dasharray: 130
          stroke-dashoffset: 130
          animation: dash linear 1s forwards
          animation-delay: .25s

  @keyframes dash
    to
      stroke-dashoffset: 0
</style>
