
import { createApp } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

// Vuetify
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyD97hQbJMaVCWx_C4rDZFIfYqf5F4mvzSo',
  authDomain: 'wishlist-596f5.firebaseapp.com',
  projectId: 'wishlist-596f5',
  storageBucket: 'wishlist-596f5.firebasestorage.app',
  messagingSenderId: '452494338050',
  appId: '1:452494338050:web:ab32fb6a04a86928175f1b',
  measurementId: 'G-H7Z98SXCP2',
});
const db = getFirestore(firebaseApp);

import '@/style.css';

import App from './App.vue';
import router from './router/index.js';

import FlexRow from './components/base/flex/FlexRow.vue';
import FlexCol from './components/base/flex/FlexCol.vue';
import BaseDialog from './components/base/dialog/BaseDialog.vue';

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
app.component('BaseDialog', BaseDialog);

export { db };