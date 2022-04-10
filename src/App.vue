<template>
</template>

<script setup>
import { inject } from 'vue'
const web3 = inject('web3')
const Token = inject('Token')

fetchWeb3()
async function fetchWeb3() {
  const network = await web3.eth.net.getNetworkType();
  const networkId = await web3.eth.net.getId();
  const accounts = await web3.eth.getAccounts();
  const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address);
  const totalSupply = await token.methods.totalSupply().call();
}
</script>