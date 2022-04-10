import { createApp } from 'vue'
import App from './app.vue'
import './assets/styles/tailwind.css'
import web3 from './plugins/web3'

createApp(App)
  .use(web3)
  .mount('#app')
