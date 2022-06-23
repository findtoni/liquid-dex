<template>
  <div class="w-full h-full">
    <AHeaderSection :name="`${token.symbol || 'LQD'}/ETH`" />
    <div v-if="!loading" class="container">
      <apexchart width="100%" height="230" type="candlestick" :options="options" :series="priceChart?.series" />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useStore } from '../store';
const store = useStore();
const { priceChart, token } = storeToRefs(store);
const loading = ref(true);

setShow();
function setShow() {
  setTimeout(() => loading.value = false, 100);
}
const options = ref({
  chart: {
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    type: 'datetime',
  },
});
</script>