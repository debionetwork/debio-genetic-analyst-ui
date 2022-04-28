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
      trakingStatus: ["Open", "In Progress", "Rejected"],
      orderStatus: ["Paid"]
    }
  })
}
</script>

<style lang="sass"></style>
