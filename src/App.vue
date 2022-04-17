<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { useStore } from './store';
const store = useStore();

fetchStore();
async function fetchStore() {
  const web3 = await store.fetchWeb3();
  await store.fetchToken(web3);
  await store.fetchExchange(web3);
}
</script>