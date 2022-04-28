<template lang="pug">
  OrdersPage(:filter="dataFilter")
</template>

<script>
import OrdersPage from "@/common/components/Orders/OrderList"

export default {
  name: "GADashboard",

  components: {OrdersPage},

  data: () => ({
    dataFilter: {
      trackingStatus: ["Open", "In Progress"],
      orderStatus: ["Paid"]
    }
  })
}
</script>

<style lang="sass"></style>
