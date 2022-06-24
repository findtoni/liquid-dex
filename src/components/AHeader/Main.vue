<template>
  <div class="py-5 rounded-t text-white">
    <div class="flex justify-between items-center">
      <img :src="`${bucket}/liquid.svg`" class="h-12 w-auto" alt="Liquid logo">
      <div class="rounded px-4 py-2 bg-accent flex justify-end items-center space-x-3">
        <div v-if="store.account" :class="['truncate inline-flex w-36 md:w-52']">{{ store.account }}</div>
        <div v-else @click="store.getAccount" :class="['truncate inline-flex w-auto cursor-pointer']">{{ 'Connect Wallet' }}</div>
        <LogoutIcon @click="store.removeAccount" class="hidden cursor-pointer hover:scale-125 h-4 w-4" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { LogoutIcon } from '@heroicons/vue/outline';
import { useStore } from '../../store';
import { bucket } from '../../helpers';
const store = useStore();
</script>