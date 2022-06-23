<template>
  <div class="w-full h-full">
    <AHeaderSection name="My Transactions" />
    <div class="container">
      <a-tabs v-model:activeKey="state.activeKey">
        <a-tab-pane key="1" tab="Trades">
          <ATableHeader :options="state.headers[0]" />
          <ATableBody class="h-[100px] overflow-y-auto" :data="userOrders?.filled" :selectors="['formattedTimestamp', 'tokenPrice', 'tokenAmount']" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="Open">
          <ATableHeader :options="state.headers[1]" />
          <ATableBody class="h-[100px] overflow-y-auto" :data="userOrders?.open" :selectors="['formattedTimestamp', 'tokenPrice', 'tokenAmount']" has-cancel />
        </a-tab-pane>
        <a-tab-pane key="3" tab="Closed">
          <ATableHeader :options="state.headers[0]" />
          <ATableBody class="h-[100px] overflow-y-auto" :data="userOrders?.cancelled" :selectors="['formattedTimestamp', 'tokenPrice', 'tokenAmount']" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useStore } from '../store';
const store = useStore();
const { userOrders, token } = storeToRefs(store);

const state = reactive({
  activeKey: '1',
  headers: [
    ['Time', `${token.value.symbol || 'LQD'}/ETH`, `${token.value.symbol || 'LQD'}`],
    ['Time', `${token.value.symbol || 'LQD'}/ETH`, `${token.value.symbol || 'LQD'}`, 'Cancel']
  ]
})
</script>