import { createApp } from 'vue'
import App from './app.vue'
import './assets/styles/tailwind.css'
import { createPinia } from 'pinia'

createApp(App)
  .use(createPinia())
  .mount('#app')
