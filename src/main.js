
import { createApp } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

// Vuetify
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './App.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const app = createApp(App);


app.use(VueApexCharts)
  .use(vuetify)
  .mount('#app');