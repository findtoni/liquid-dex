<template>
  <div class="w-full h-full">
    <AHeaderSection name="Trades" />
    <div class="container">
      <ATableHeader :options="headers" />
      <ATableBody :data="orders.filled" :selectors="['formattedTimestamp', 'tokenAmount', 'tokenPrice']" :color="3" />
    </div>
  </div>
</template>

<script setup>
import { useStore } from '../store';
import { storeToRefs } from 'pinia';

const store = useStore();
const { orders } = storeToRefs(store);
const headers = ref(['Time', 'Amount', 'Price']);
</script>