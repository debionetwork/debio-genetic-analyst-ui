<template lang="pug">
  .geneticAnalysts-registration-form
    .geneticAnalysts-registration-form__card
      .geneticAnalysts-registration-form__avatar-wrapper
        .geneticAnalysts-registration-form__avatar-image
          ui-debio-avatar(
            :src="computedImageLink"
            size="100"
            rounded
          )
            ui-debio-file(
              v-model="profileImage"
              accept="[.jpg, .png, .jpeg]"

            )


</template>

<script>
export default {
  name: "GeneticAnalystsForm",

  data: () => ({
    profileImage: null
  }),

  computed: {
    computedImageLink() {
      return this.profileImage ? this.profileImage : require("@/assets/add-image-placeholder.png")
    }
  },

  methods: {
    clickAvatar() {
      console.log("clicked")
    }
  }
}
</script>

<style>

</style>
