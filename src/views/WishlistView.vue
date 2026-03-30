<script>
import SinglesTable from '@/components/wishlist/singles/SinglesTable.vue';
import SalesTable from '@/components/wishlist/sales/SalesTable.vue';
import EntriesTable from '@/components/wishlist/tournament/EntriesTable.vue';
import OtherPurchasesTable from '@/components/wishlist/others/OtherPurchasesTable.vue';

export default {
  components: {
    SinglesTable,
    SalesTable,
    EntriesTable,
    OtherPurchasesTable,
  },
  data () {
    return {
      tab: 'singles',
      tabs: [
        { value: 'singles', title: 'Singles', icon: 'mdi-cards-outline' },
        { value: 'sales', title: 'Sales', icon: 'mdi-finance' },
        { value: 'tournament', title: 'Entry Fees', icon: 'mdi-trophy-outline'  },
        { value: 'others', title: 'Other Purchases', icon: 'mdi-view-grid-outline'  },
      ],
    };
  },
};
</script>

<template>
  <flex-col class="pa-5 grow">
    <flex-row>
      <v-tabs
        v-model="tab"
        color="teal-accent-3"
        grow
      >
        <v-tab
          v-for="{value, title, icon} in tabs"
          :key="value"
          :value="value"
          icon
        >
          <v-icon
            :icon="icon"
            class="mx-2"
          />
          {{ title }}
        </v-tab>
      </v-tabs>
    </flex-row>

    <v-card class="mt-5">
      <v-tabs-window v-model="tab">
        <singles-table value="singles" />
        <sales-table value="sales" />
        <entries-table value="tournament" />
        <other-purchases-table value="others" />
      </v-tabs-window>
    </v-card>
  </flex-col>
</template>