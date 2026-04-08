
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueApexCharts from 'vue3-apexcharts';

import App from './App.vue';
import router from './router/index.js';
import vuetify, { registerComponents } from './plugins/vuetify';
import '@/style.css';

const app = createApp(App);
const pinia = createPinia();
registerComponents(app);
app
  .use(VueApexCharts)
  .use(vuetify)
  .use(router)
  .use(pinia);
router.isReady().then(() => app.mount('#app'));