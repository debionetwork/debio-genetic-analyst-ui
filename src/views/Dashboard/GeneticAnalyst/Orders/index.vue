<template lang="pug">
  OrdersPage(:filter="dataFilter")
</template>

<script>
import OrdersPage from "@/common/components/Orders/OrderList"

export default {
  name: "GAOrders",

  components: {OrdersPage},

  data: () => ({
    dataFilter: {
      trackingStatus: ["Done", "Rejected"],
      orderStatus: ["Paid", "Refunded"]
    }
  })
}
</script>

<style lang="sass"></style>
