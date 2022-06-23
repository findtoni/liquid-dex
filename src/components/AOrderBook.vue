<template>
  <div class="w-full h-full">
    <AHeaderSection name="Order Book" />
    <div class="container flex flex-col">
      <ATableHeader :options="headers" />
      <ATableBody class="h-[235px] overflow-y-auto pb-5" :data="orderBook?.sell" :selectors="['tokenAmount', 'tokenPrice', 'etherAmount']" />
      <ATableBody class="h-[235px] overflow-y-auto pt-5" :data="orderBook?.buy" :selectors="['tokenAmount', 'tokenPrice', 'etherAmount']" />
    </div>
  </div>
</template>

<script setup>
import { useStore } from '../store';
import { storeToRefs } from 'pinia';

const store = useStore();
const { orderBook, token } = storeToRefs(store);
const headers = ref([token.value.symbol || 'LQD', `${token.value.symbol || 'LQD'}/ETH`, 'ETH']);
</script>