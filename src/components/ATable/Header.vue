<template>
  <div :class="['py-3 flex justify-between items-center text-white border-[#272c39]', {'mb-3 border-b': !props.noSpace}]">
    <span v-for="item in props.options" :key="item" class="text-xs font-semibold">
      {{ item }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  noSpace: {
    type: Boolean,
    required: false
  }
})
</script>