<template>
  <div class="flex flex-col text-white">
    <div v-for="item in data" :key="item" :class="['flex justify-between space-y-1.5 items-center', {'text-xs': props.isSmall}]">
      <span class="w-1/3 text-left">{{ item[props.selectors[0]] }}</span>
      <span :class="props.color === 2 ? `${item.orderTypeClass} w-1/3 text-center` : 'text-center w-1/3'">{{ item[props.selectors[1]] }}</span>
      <span :class="[props.color === 3 ? `${item.tokenPriceClass} w-1/3 text-right` : 'w-1/3 text-right', props.hasCancel ? 'mr-10 text-center' : '']">{{ item[props.selectors[2]] }}</span>
      <span v-if="props.hasCancel" @click="store.cancelOrder(item)" class="w-1/3 pr-3 cursor-pointer">
        <XIcon class="text-right float-right h-3 w-3" />
      </span>
    </div>
  </div>
</template>

<script setup>
import { XIcon } from '@heroicons/vue/solid';
import { useStore } from '../../store';
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  selectors: {
    type: Array,
    required: true
  },
  hasCancel: {
    type: Boolean,
    required: false
  },
  isSmall: {
    type: Boolean,
    required: false,
    default: true
  },
  color: {
    type: Number,
    required: false,
    default: 2
  }
});
const emits = defineEmits(['cancel']);
const store = useStore();
</script>