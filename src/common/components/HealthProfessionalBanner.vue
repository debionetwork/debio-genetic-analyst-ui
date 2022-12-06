<template lang="pug">
  ui-debio-card(block)
    .health-professional-banner
      .health-professional-banner__content
        .health-professional-banner__title DeBio Second Opinion
        .health-professional-banner__sub-title Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis

      v-img(
        alt="no-list-data"
        src="@/assets/health-professional-banner.svg"
        max-width="630px"
        max-height="146px"
      )
</template>

<script>

export default {
  name: "HealthProfessionalBanner"
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .health-professional-banner
    margin: -25px
    display: flex
    justify-content: space-between

    &__title
      margin: 32px 0px 8px 24px
      @include h5-opensans

    &__sub-title
      margin-left: 24px
      @include body-text-5

</style>
