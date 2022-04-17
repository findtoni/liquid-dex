<template>
  <section class="w-full flex flex-col">
    <AHeader />
    <ATokenBar />
    <div class="flex justify-between items-center">
      <div class="w-1/4 bg-purple-300">
        <AMarkets />
      </div>
      <div class="w-2/4 flex flex-col bg-purple-500">
        <ACharts />
        <APlaceOrder />
      </div>
      <div class="w-1/4 flex flex-col bg-purple-300">
        <AOrderBook />
        <ATrades />
      </div>
    </div>
    <AOpenOrders />
    <AOrderHistory />
  </section>
</template>

<script setup>
</script>