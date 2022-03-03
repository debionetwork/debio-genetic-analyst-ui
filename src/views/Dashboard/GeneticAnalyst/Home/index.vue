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

      ui-debio-data-table(:headers="headers" :items="orderLists")
        template(slot="prepend")
          .ga-dashboard__text
            h2.ga-dashboard__table-title Order Lists
            p.ga-dashboard__table-subtitle.mb-0 List of all services ordered by Customers

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
import { analysisDetails } from "@/common/lib/polkadot-provider/query/genetic-analyst/analysis"
import { generalDebounce } from "@/common/lib/utils"
import { geneticAnalystIllustration, eyeIcon } from "@debionetwork/ui-icons"

import { mapState } from "vuex"


export default {
  name: "GADashboard",

  data: () => ({
    geneticAnalystIllustration,
    eyeIcon,

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
      }, 100)
    }
  },

  async created() {
    await this.getOrdersData()
  },

  mounted() {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 959) this.cardBlock = true
      else this.cardBlock = false
    })
  },

  methods: {
    async getOrdersData() {
      this.orderLists = []

      try {
        let orders = []
        const orderData = await GAGetOrders()

        for (const order of orderData.data) {
          const sourceData = order._source
          const analysisData = await analysisDetails(this.api, order._source.genetic_analysis_tracking_id)
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

          orders.push(data)
        }

        this.orderLists = orders
      } catch (e) {
        console.error(e);
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .ga-dashboard
    &__wrapper
      display: flex
      flex-direction: column
      gap: 35px

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
</style>
