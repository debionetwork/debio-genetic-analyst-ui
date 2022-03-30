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
      status: ["Done"]
    }
  })
}
</script>

<style lang="sass">

</style>
