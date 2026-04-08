// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Vuetify
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import FlexRow from '@/components/base/flex/FlexRow.vue';
import FlexCol from '@/components/base/flex/FlexCol.vue';
import IconButton from '@/components/base/IconButton.vue';
import HoverIcon from '@/components/base/HoverIcon.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import BaseDialog from '@/components/base/dialog/BaseDialog.vue';

import PairedDatePicker from '@/components/base/form-input/PairedDatePicker.vue';
import PairedTextField from '@/components/base/form-input/PairedTextField.vue';
import PairedNumberInput from '@/components/base/form-input/PairedNumberInput.vue';
import PairedSelect from '@/components/base/form-input/PairedSelect.vue';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark', // Or 'light'
  },
});

// Export a helper function to register your custom components
export function registerComponents(app) {
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
}