
import { createApp } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

// Vuetify
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import '@/style.css';

import App from './App.vue';
import router from './router/index.js';

import FlexRow from './components/base/flex/FlexRow.vue';
import FlexCol from './components/base/flex/FlexCol.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const app = createApp(App);

app
  .use(VueApexCharts)
  .use(vuetify)
  .use(router);
router.isReady().then(() => app.mount('#app'));

app.component('FlexCol', FlexCol);
app.component('FlexRow', FlexRow);