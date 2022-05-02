<template>
  <div class="py-5 bg-sky-900 text-white">
    <div class="container">
      <div class="flex justify-between items-center">
        <h1>Liquid</h1>
        <div class="flex justify-end items-center">
          <p>{{ store.account }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '../store';
const store = useStore();
</script>