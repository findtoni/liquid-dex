<template>
  <section class="main py-10 md:h-screen">
    <div class="container h-full">
      <AHeaderMain />
      <div class="bg-[#171C28] text-white rounded-lg space-y-6 md:space-y-0 flex flex-col md:flex-row justify-between items-stretch h-full md:h-5/6">
        <div class="w-full space-y-4 md:space-y-0 md:w-1/4 flex flex-col justify-between items-stretch">
          <ATrades />
          <APlaceOrder />
        </div>
        <div class="w-full md:w-1/4 flex flex-col justify-between items-stretch border-x border-[#272c39]">
          <AOrderBook />
        </div>
        <div class="w-full space-y-4 md:space-y-0  md:w-2/4 flex flex-col justify-between items-stretch">
          <APriceChart />
          <AUserTransactions />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useStore } from '../store';
const store = useStore();
</script>