
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueApexCharts from 'vue3-apexcharts';

// Vuetify
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
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

export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebaseApp);

import '@/style.css';

import App from './App.vue';
import router from './router/index.js';

import FlexRow from './components/base/flex/FlexRow.vue';
import FlexCol from './components/base/flex/FlexCol.vue';
import IconButton from './components/base/IconButton.vue';
import HoverIcon from './components/base/HoverIcon.vue';
import BaseTable from './components/base/BaseTable.vue';
import BaseDialog from './components/base/dialog/BaseDialog.vue';

import PairedDatePicker from '@/components/base/form-input/PairedDatePicker.vue';
import PairedTextField from '@/components/base/form-input/PairedTextField.vue';
import PairedNumberInput from '@/components/base/form-input/PairedNumberInput.vue';
import PairedSelect from '@/components/base/form-input/PairedSelect.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const app = createApp(App);
const pinia = createPinia();

app
  .use(VueApexCharts)
  .use(vuetify)
  .use(router)
  .use(pinia);
router.isReady().then(() => app.mount('#app'));

app.component('IconButton', IconButton);
app.component('HoverIcon', HoverIcon);
app.component('FlexCol', FlexCol);
app.component('FlexRow', FlexRow);
app.component('BaseDialog', BaseDialog);
app.component('BaseTable', BaseTable);

app.component('PairedDatePicker', PairedDatePicker);
app.component('PairedTextField', PairedTextField);
app.component('PairedNumberInput', PairedNumberInput);
app.component('PairedSelect', PairedSelect);

export { db };