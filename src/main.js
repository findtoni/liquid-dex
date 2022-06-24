import { createApp } from 'vue'
import app from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts';
import 'ant-design-vue/lib/message/style/index.css';
import './assets/styles/tailwind.css'
import './assets/global.scss'

createApp(app)
  .use(createPinia())
  .use(router)
  .use(VueApexCharts)
  .mount('#app')
