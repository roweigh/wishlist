<script>
// import { data } from '../api/test-api';
import {
  getCards,
  getEntries,
  getSales,
  getItems,
} from '@/api/purchases';

import DonutGraph from '../components/dashboard/DonutGraph.vue';
import LineGraph from '../components/dashboard/LineGraph.vue';

export default {
  components: {
    LineGraph,
    DonutGraph,
  },
  data () {
    return {
      user: null,

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
    const result = await Promise.all([
      getCards(),
      getSales(),
      getEntries(),
      getItems(),
    ]).then((responses) => {
      console.log(responses[1]);
      const totalSpent= (v) => {
        return v.reduce((acc, item) => acc + item.amtSpent, 0);
      };
      this.donutData = [
        totalSpent([...responses[0], ...responses[1]]),
        totalSpent(responses[2]),
        totalSpent(responses[3]),
      ];
      return [
        ...responses[0],
        ...responses[1],
        ...responses[2],
        ...responses[3],
      ];
    });

    const sortedAscending = result.sort((a, b) => {
      const aDate = new Date(a?.date?.seconds * 1000 + a?.date?.nanoseconds / 1_000_000);
      const bDate = new Date(b?.date?.seconds * 1000 + b?.date?.nanoseconds / 1_000_000);
      return new Date(aDate) - new Date(bDate);
    });

    const rawData = sortedAscending.map((item) => {return {
      date: new Date(item?.date?.seconds * 1000 + item?.date?.nanoseconds / 1_000_000).toISOString(),
      amtSpent: item.amtSpent,
    };});

    // console.log(rawData);
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
    console.log(this.donutData);
    this.data = data;
    this.data[0].singles = chartData;
  },
};
</script>

<template>
  <v-col>
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