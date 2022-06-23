<template>
  <div class="w-full h-full">
    <AHeaderSection name="Create Order" />
    <div class="container">
      <a-tabs v-model:activeKey="state.activeKey">
        <a-tab-pane key="1" tab="Buy">
          <div class="flex flex-col space-y-4 w-full">
            <a-input v-model:value="state.buyOrder.amount" placeholder="Enter buy amount" :suffix="token.symbol" />
            <a-input-number v-model:value="state.buyOrder.price" :min="0" :max="100" :step="0.01" placeholder="Enter buy price" />
            <span class="text-white">Total: {{ state.buyOrder.amount * state.buyOrder.price }} ETH</span>
            <a-button type="primary" :loading="state.loading" :disabled="isDisabled('buy')"
              @click="buyOrder(state.buyOrder.amount, state.buyOrder.price)">Place Order
            </a-button>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Sell">
          <div class="flex flex-col space-y-4 w-full">
            <a-input v-model:value="state.sellOrder.amount" placeholder="Enter sell amount" suffix="LQD" />
            <a-input-number v-model:value="state.sellOrder.price" :min="0" :max="100" :step="0.01" placeholder="Enter sell price" />
            <span class="text-white">Total: {{ state.sellOrder.amount * state.sellOrder.price }} ETH</span>
            <a-button type="primary" :loading="state.loading" :disabled="isDisabled('sell')"
              @click="sellOrder(state.sellOrder.amount, state.sellOrder.price)">Place Order
            </a-button>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { useStore } from '../store';
const store = useStore();
const { orderBook, token } = storeToRefs(store);

const state = reactive({
  activeKey: '1',
  buyOrder: {
    amount: null,
    price: null
  },
  sellOrder: {
    amount: null,
    price: null
  },
  loading: false,
});


watch(store.status.fill, () => {
  store.setStatus('fill', false);
  message.success('Transaction complete!', 0);
})

async function buyOrder(amount, price) {
  state.loading = true;
  isDisabled('all', true);
  const order = await store.buyOrder(state.buyOrder.amount, state.buyOrder.price);
  const canFillOrder = confirmOrder('buy', order);
  if (canFillOrder.length >=1) {
    message.loading('Filling order...', 0);
    await store.fillOrder(canFillOrder[0]);
  }
  state.buyOrder.amount = null;
  state.buyOrder.price = null;
  state.loading = false;
}
async function sellOrder(amount, price) {
  state.loading = true;
  isDisabled('all', true);
  const order = await store.sellOrder(state.sellOrder.amount, state.sellOrder.price);
  const canFillOrder = confirmOrder('sell', order);
  if (canFillOrder.length >=1) {
    message.loading('Filling order...', 0);
    await store.fillOrder(canFillOrder[0]);
  }
  state.sellOrder.amount = null;
  state.sellOrder.price = null;
  state.loading = false;
}
function confirmOrder(type, order) {
  if (type == 'buy') {
    return store.orderBook.sell.filter(o => o.tokenPrice === order.price && o.tokenAmount.toString() === order.amount);
  } else {
    return store.orderBook.buy.filter(o => o.tokenPrice === order.price && o.tokenAmount.toString() === order.amount);
  }
}
function isDisabled(type, action) {
  if (action) {
    return true;
  } else {
    if (type == 'buy') {
      return state.buyOrder.amount && !state.buyOrder.price || (!state.buyOrder.amount && !state.buyOrder.price);
    } else {
      return state.sellOrder.amount && !state.sellOrder.price || (!state.sellOrder.amount && !state.sellOrder.price)
    }
  }
}
</script>