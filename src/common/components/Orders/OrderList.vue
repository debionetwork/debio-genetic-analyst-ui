<template lang="pug">
  .ga-dashboard
    .ga-dashboard__wrapper
      ui-debio-banner.ga-dashboard__banner(
        title="Genetic Analyst"
        subtitle="Povide service for customer who have been tested in previous years can get interpretation that leads to improved maintenance."
        gradient-color="tertiary"
        with-decoration
      )
        template(slot="illustration")
          ui-debio-icon(
            :icon="geneticAnalystIllustration"
            :size="cardBlock ? 250 : 120"
            view-box="0 0 120 120"
            fill
          )
      transition(name="transition-slide-x" mode="out-in")
        .ga-dashboard__verification-status(v-if="verificationStatus !== null && verificationStatus !== 'Verified'")
          .verification-status
            ui-debio-icon.verification-status__icon(
              :icon="alertIcon"
              size="25"
              stroke
            )
            .verification-status__text
              | Your verification submission is {{ verificationStatus === 'Unverified' ? " being reviewed" : verificationStatus }} by Daogenic

        .ga-dashboard__table(v-else)
          ui-debio-data-table(:headers="headers" :items="orderLists" :loading="isLoading")
            template(slot="prepend")
              .ga-dashboard__nav
                .ga-dashboard__text
                  h2.ga-dashboard__table-title Order Lists
                  p.ga-dashboard__table-subtitle.mb-0 List of all services ordered by Customers
                ui-debio-input.ga-dashboard__search-bar(
                  v-model="searchQuery"
                  variant="small"
                  width="270"
                  placeholder="Service Name, Status"
                  outlined
                )
                  ui-debio-icon(
                    slot="icon-append"
                    size="20"
                    @click="getOrdersData(searchQuery)"
                    role="button"
                    :icon="searchIcon"
                    stroke
                  )

            template(v-slot:[`item.id`]="{ item }")
              span {{ `${item.id.substr(0, 4)}...${item.id.substr(item.id.length - 3)}` }}

            template(v-slot:[`item.action`]="{ item }")
              .ga-dashboard__table-action.d-flex.justify-center
                router-link(:to="{ name: 'ga-order-details', params: { id: item.id, item } }")
                  ui-debio-icon(
                    :icon="eyeIcon"
                    role="button"
                    size="16"
                    stroke
                  )

</template>

<script>
import { GAGetOrders } from "@/common/lib/api"
import { queryGeneticAnalystByAccountId, queryGeneticAnalysisByGeneticAnalysisTrackingId } from "@debionetwork/polkadot-provider"
import { generalDebounce } from "@/common/lib/utils"
import { geneticAnalystIllustration, eyeIcon, alertIcon, searchIcon } from "@debionetwork/ui-icons"
import { mapState } from "vuex"

import metamaskDispatchAction from "@/common/lib/metamask/mixins/metamaskServiceHandler"
import localStorage from "@/common/lib/local-storage";

export default {
  name: "OrderList",
  mixins: [metamaskDispatchAction],

  data: () => ({
    geneticAnalystIllustration,
    eyeIcon,
    alertIcon,
    searchIcon,

    searchQuery: "",
    verificationStatus: null,
    cardBlock: false,
    orderLists: [],
    headers: [
      {
        text: "Order ID",
        value: "id",
        sortable: true
      },
      {
        text: "Service Name",
        value: "service_info.name",
        sortable: true
      },
      {
        text: "Order Date",
        value: "created_at",
        sortable: true
      },
      {
        text: "Price",
        value: "price",
        sortable: true
      },
      {
        text: "Status",
        value: "status",
        sortable: true
      },
      {
        text: "Action",
        value: "action",
        align: "center",
        sortable: false
      }
    ]
  }),

  props: {
    filter: { type: Array, default: () => [] }
  },

  computed: {
    ...mapState({
      lastEventData: (state) => state.substrate.lastEventData,
      api: (state) => state.substrate.api,
      web3: (state) => state.metamask.web3
    })
  },

  watch: {
    lastEventData: {
      deep: true,
      immediate: true,
      handler: generalDebounce(async function(val) {
        if (val?.section === "geneticAnalysisOrders") await this.getOrdersData()
        if (val?.method === "GeneticAnalystUpdateVerificationStatus") await this.getVerificationStatus()
      }, 100)
    },

    searchQuery: generalDebounce(async function (newVal) {
      await this.metamaskDispatchAction(this.getOrdersData, newVal)
    }, 500)
  },

  async created() {
    try {
      this.isLoading = true

      await this.getVerificationStatus()
      await this.getOrdersData()
    } catch (e) {
      console.error(e)
    } finally {
      this.isLoading = false
    }
  },

  mounted() {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 959) this.cardBlock = true
      else this.cardBlock = false
    })
  },

  methods: {
    async getVerificationStatus() {
      const { verificationStatus } = await queryGeneticAnalystByAccountId(this.api, localStorage.getAddress())
      this.verificationStatus = verificationStatus
    },

    async getOrdersData(keyword) {
      this.orderLists = []
      this.isLoading = true

      try {
        let orders = []
        const orderData = await GAGetOrders(keyword)
        // const page = this.$router?.history?.current

        for (const order of orderData.data) {
          const sourceData = order._source
          const analysisData = await queryGeneticAnalysisByGeneticAnalysisTrackingId(this.api, sourceData.genetic_analysis_tracking_id)
          const GENETIC_STATUS = {
            REGISTERED: "Open",
            INPROGRESS: "In Progress",
            REJECTED: "Rejected",
            RESULTREADY: "Done"
          }
          const formatedPrice = `
            ${Number(this.web3.utils.fromWei(String(sourceData.service_info?.prices_by_currency[0]?.total_price.replaceAll(",", "") || 0), "ether")).toFixed(4)} 
            ${sourceData?.currency}
          `

          const data = {
            ...sourceData,
            price: formatedPrice,
            status: GENETIC_STATUS[analysisData.status.toUpperCase()],
            created_at: new Date(+sourceData.created_at.replaceAll(",", "")).toLocaleString("en-GB", {
              day: "numeric",
              year: "numeric",
              month: "short"
            })
          }

          if (this.filter?.includes(data.status)) orders.push(data)
        }

        this.orderLists = orders
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/functions.sass"
  @import "@/common/styles/mixins.sass"

  .ga-dashboard
    &__wrapper
      display: flex
      flex-direction: column
      gap: toRem(35px)

    &__nav
      display: flex
      align-items: center
      justify-content: space-between

    &__table-title
      @include body-text-medium-1

    &__table-subtitle
      @include body-text-3


    &::v-deep
      .v-data-table > .v-data-table__wrapper > table > tbody > tr > td
        @include body-text-3

      .banner__content-description
        margin-left: 10.25rem

      .banner__subtitle
        max-width: 32.2rem !important

  .verification-status
    display: flex
    align-items: center
    background: #FFFFFF
    border-radius: toRem(8px)
    transition: all cubic-bezier(.7,-0.04,.61,1.14) .3s
    padding: toRem(20px)

    &:hover
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
      border-bottom: toRem(5px) solid rgba(0, 0, 0, 0.15)
      transform: translateY(toRem(-5px))

    &__icon
      margin-right: toRem(18px)

    &__text
      pointer-events: none
      @include body-text-medium-1

  .transition-slide-x
    &-enter-active,
    &-leave-active
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

    &-enter
      opacity: 0
      transform: translateX(1.563rem)

    &-leave-to
      opacity: 0
      transform: translateX(-12.813rem)
</style>
