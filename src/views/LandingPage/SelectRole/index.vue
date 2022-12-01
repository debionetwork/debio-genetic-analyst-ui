<template lang="pug">
  LandingPagePopUp(:previous="previous")
    template(v-slot:header) Select Role
    .select-role(slot="main")
      .select-role__desc Select role to access Decentralized Bio Network Apps
      .select-role__roles
        .select-role__button(v-for="role in roles" :key="role.route")
          router-link.select-role__icon(:to="{ name: role.route }")
            v-img(
              :src="role.icon"
              role="button"
              max-width="50px"
              max-height="56px"
            )
          span.select-role__title {{ role.title }}
</template>

<script>
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"
import geneticAnalystIcon from "@/assets/genetic-analyst-icon.png"
import healthProfessionalIcon from "@/assets/health-professional-icon.png"




export default {
  name: "SelectRole",

  components: { LandingPagePopUp },

  data: () => ({
    geneticAnalystIcon,
    healthProfessionalIcon,

    roles: [
      { title: "Genetic Analyst", route: "genetic-analyst", icon: geneticAnalystIcon },
      { title: "Health Professional", route: "health-professional", icon: healthProfessionalIcon }
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

  &__roles
    padding: 100px 0 // TODO: Update with grid-template-columns: 1fr 1fr instead of padding when DEBIO have 4 roles
    display: grid
    grid-template-columns: 1fr 1fr

  &__button
    display: flex
    flex-direction: column
    align-items: center

  &__desc
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
    &:hover
      border: solid 5px #FF6DD7
      background-color: #FCF0FF
      box-shadow: 0px 2px 20px 0px #a9a9a9

  @keyframes dash
    to
      stroke-dashoffset: 0
</style>
