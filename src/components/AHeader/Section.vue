<template>
  <div class="container py-3 border-[#272c39] border-y bg-[#131722] text-white">
    <span class="font-bold">{{ props.name }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>