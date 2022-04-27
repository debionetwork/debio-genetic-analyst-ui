<template lang="pug">
  OrdersPage(:filter="dataFilter")
</template>

<script>
import OrdersPage from "@/common/components/Orders/OrderList"

export default {
  name: "GADashboard",

  components: {OrdersPage},

  data: () => ({
    dataFilter: ["Open", "In Progress", "Rejected"]
  })
}
</script>

<style lang="sass">

</style>
