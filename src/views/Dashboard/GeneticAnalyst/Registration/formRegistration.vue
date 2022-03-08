<template lang="pug">
  .geneticAnalysts-registration-form
    .geneticAnalysts-registration-form__card
      .geneticAnalysts-registration-form__avatar-wrapper
        .geneticAnalysts-registration-form__avatar-image
          ui-debio-avatar(
            :src="computedImageLink"
            size="100"
            rounded
            borderSize="1"
            borderColor="#000000"
          )
            ui-debio-file(
              v-model="profileImage"
              accept="[.jpg, .png, .jpeg]"

            )
      .geneticAnalysts-registration-form__informasion-wrapper
        .geneticAnalysts-registration-form__informasion-title
          .geneticAnalysts-registration-form__name-wrapper Basic Information
            .geneticAnalysts-registration-form__firstName
              ui-debio-input(
                :rules="$options.rules.emr.title"
                variant="small"
                label="EMR Title"
                :error="isDirty.emr && isDirty.emr.title"
                placeholder="Type EMR Title"
                v-model="emr.title"
                outlined
                block
                validate-on-blur
                @isError="handleError"
              )
            .geneticAnalysts-registration-form__lastName
        


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

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .geneticAnalysts-registration-form
    margin: 40px 15px 15px 15px

    &__card
      border: solid 1px black
      width: 250px
      height: 250px
      padding: 10px

    &__avatar-wrapper
      border: solid 0.5px black
      padding: 5px
</style>
