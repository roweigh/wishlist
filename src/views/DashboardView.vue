<script>
import { data } from '../api/test-api';
import {
  getPurchaseHistory,
  getTournamentEntry,
  updateTournamentEntry,
} from '@/api/purchases';

import TournamentEntryInput from '@/components/wishlist/TournamentEntryInput.vue';
import DonutGraph from '../components/dashboard/DonutGraph.vue';
import LineGraph from '../components/dashboard/LineGraph.vue';

export default {
  components: {
    LineGraph,
    DonutGraph,
    TournamentEntryInput,
  },
  data () {
    return {
      user: null,

      selectedDates: [],
      donutData: [1],
      data: [],
      selected: [
        'accessories',
        'singles',
        'boosters',
        'tournaments',
      ],
    };
  },
  watch: {
    user (v) {
      const found = this.data.find(el => el.name === v);
      if (found) {
        const { singles, accessories, boosters, tournaments } = found;

        this.donutData = [{
          data: [
            {
              x: 'Singles',
              y: singles[singles.length - 1][1],
            },
            {
              x: 'Accessories',
              y: accessories[accessories.length - 1][1],
            },
            {
              x: 'Boosters',
              y: boosters[boosters.length - 1][1],
            },
            {
              x: 'Tournament Entry',
              y: tournaments[tournaments.length - 1][1],
            },
          ],
        }];
      } else this.donutData = [1];
    },
  },
  async mounted () {
    await Promise.all([
      this.getTournamentAttendance(),
    ]);
    const selectedDates = await getTournamentEntry();

    const result = await getPurchaseHistory();
    const selectedDatesWResult = [...selectedDates[0].dates.map(v => ({ date: v, amtSpent: 12 })), ...result];
    console.log(selectedDatesWResult);
    const sortedAscending = selectedDatesWResult.sort((a, b) => {
      const aDate = new Date(a?.date?.seconds * 1000 + a?.date?.nanoseconds / 1_000_000);
      const bDate = new Date(b?.date?.seconds * 1000 + b?.date?.nanoseconds / 1_000_000);
      return new Date(aDate) - new Date(bDate);
    });

    const rawData = sortedAscending.map((item) => {return {
      date: new Date(item?.date?.seconds * 1000 + item?.date?.nanoseconds / 1_000_000).toISOString(),
      amtSpent: item.amtSpent,
    };});


    // 1. Group and Sum by Day
    const grouped = rawData.reduce((acc, item) => {
      // Normalize date to YYYY-MM-DD to strip the specific time
      const dateKey = item.date.split('T')[0];

      if (!acc[dateKey]) {
        acc[dateKey] = 0;
      }
      acc[dateKey] += item.amtSpent;

      return acc;
    }, {});

    // 2. Convert to Array and Sort Chronologically
    const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

    // 3. Create Cumulative Total
    let runningTotal = 0;
    const chartData = sortedKeys.map(dateStr => {
      runningTotal += grouped[dateStr];

      return [
        new Date(dateStr).getTime(), // Timestamp for the start of that day
        Number(runningTotal.toFixed(2)),
      ];
    });

    this.data = data;
    this.data[0].singles = chartData;
  },
  methods: {
    async getTournamentAttendance () {
      try {
        this.selectedDates = await getTournamentEntry().then(response => response[0].dates.map(v => new Date(v?.seconds * 1000 + v?.nanoseconds / 1_000_000)));
      } catch {
        // handle(error)
      }
    },

    async saveTournamentEntry() {
      await updateTournamentEntry({
        dates: this.selectedDates,
      });
    },

  },
};
</script>

<template>
  <v-col>
    <flex-row class="justify-end mb-3">
      <tournament-entry-input
        v-model="selectedDates"
        @save="saveTournamentEntry()"
      />
    </flex-row>
    <div class="d-flex flex-row ma-auto">
      <line-graph
        v-model:user="user"
        :selected="selected"
        :data="data"
      />
      <donut-graph
        :key="donutData"
        :user="user"
        :data="donutData"
      />
    </div>
  </v-col>
</template>