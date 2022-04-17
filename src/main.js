import { createApp } from 'vue'
import app from './app.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/styles/tailwind.css'

createApp(app)
  .use(createPinia())
  .use(router)
  .mount('#app')
