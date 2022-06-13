import moment from 'moment';

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DECIMALS = (10**18);
export const ether = (wei) => {
  if (wei) return (wei/DECIMALS);
}
export const tokens = ether;
export const tokenPrice = (precision, etherAmount, tokenAmount) => {
  let tokenPrice = (etherAmount / tokenAmount);
  return Math.round(tokenPrice * precision) / precision;
}
export const addOrderFormat = (order) => {
  let etherAmount = null;
  let tokenAmount = null;
  if (order.tokenGive == ETHER_ADDRESS) {
    etherAmount = order.amountGive;
    tokenAmount = order.amountGet;
  } else {
    etherAmount = order.amountGet;
    tokenAmount = order.amountGive;
  }

  return {
    ...order,
    etherAmount: ether(etherAmount),
    tokenAmount: tokens(tokenAmount),
    tokenPrice: tokenPrice(100000, etherAmount, tokenAmount),
    formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ss a M/D')
  }
}

export function addTokenPriceClass(order, previousOrder) {
  return {
    ...order,
    tokenPriceClass: (previousOrder.orderId == order.id) ? 'text-green' : (previousOrder.tokenPrice <= order.tokenPrice) ? 'text-green' : 'text-red'
  }
}

export function formatOrder(orders) {
  let previousOrder = orders[0];
  return orders.map(order => {
    order = addOrderFormat(order);
    order = addTokenPriceClass(order, previousOrder);
    previousOrder = order;
    return order;
  });
}

export function formatUserOrder(account, orders) {
  let userOrders = orders.filter(order => order.user === account);
  userOrders = formatOrder(userOrders);
  return userOrders.map(order => {
    let orderType = null;
    order.user === account
      ? orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
      : orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy';
    return {
      ...order,
      orderType,
      orderTypeClass: orderType === 'buy' ? 'text-green' : 'text-red',
    }
  })
}