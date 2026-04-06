<script>
import { getUsers, getUserPurchase } from '@/api/auth';
import DonutGraph from '@/components/dashboard/DonutGraph.vue';
import LineGraph from '@/components/dashboard/LineGraph.vue';

export default {
  components: {
    LineGraph,
    DonutGraph,
  },
  data () {
    return {
      user: null,

      donutData: [1],
      data: [
        {
          value: 'roweigh',
          name: 'Roweigh',
          color: '#663399',
          singles: [],
          others: [],
          entries: [],
        },
      ],
      selected: [
        'singles',
        'others',
        'entries',
      ],
    };
  },
  watch: {
    // user (v) {
    //   const found = this.data.find(el => el.name === v);
    //   if (found) {
    //     const { singles, accessories, boosters, entries } = found;

    //     this.donutData = [{
    //       data: [
    //         {
    //           x: 'Singles',
    //           y: singles[singles.length - 1][1],
    //         },
    //         {
    //           x: 'Accessories',
    //           y: accessories[accessories.length - 1][1],
    //         },
    //         {
    //           x: 'Boosters',
    //           y: boosters[boosters.length - 1][1],
    //         },
    //         {
    //           x: 'Tournament Entry',
    //           y: entries[entries.length - 1][1],
    //         },
    //       ],
    //     }];
    //   } else this.donutData = [1];
    // },
  },
  async mounted () {
    const users = await getUsers();
    const promises = [];
    users.forEach((user) => {
      promises.push(this.getUserPurchases(user));
    });

    const chartData = await Promise.all(promises);
    this.data = chartData;
  },
  methods: {
    helper (arr) {
      const grouped = arr.map((item) => {
        return {
          date: new Date(item?.date?.seconds * 1000 + item?.date?.nanoseconds / 1_000_000).toISOString(),
          amtSpent: item.amtSpent,
        };
      }).reduce((acc, item) => {
        // Normalize date to YYYY-MM-DD to strip the specific time
        const dateKey = item.date.split('T')[0];

        if (!acc[dateKey]) {
          acc[dateKey] = 0;
        }
        acc[dateKey] += item.amtSpent;

        return acc;
      }, {});

      return grouped;
    },

    async getUserPurchases(user) {
      const id = user.id;
      return await Promise.all([
        getUserPurchase(id, 'singles-history'),
        getUserPurchase(id, 'sales-history'),
        getUserPurchase(id, 'tournament-history'),
        getUserPurchase(id, 'others-history'),
      ]).then((responses) => {
        const singles = this.helper([...responses[0],  ...responses[1]]);
        const entries = this.helper(responses[2]);
        const others = this.helper(responses[3]);
        const userResult = {
          value: id,
          name: user.name,
          color: user.color,
          singles,
          entries,
          others,
        };

        // Generate Donut Data
        // const totalSpent= (v) => v.reduce((acc, item) => acc + item.amtSpent, 0);
        // this.donutData = [
        //   totalSpent([...responses[0], ...responses[1]]),
        //   totalSpent(responses[2]),
        //   totalSpent(responses[3]),
        // ];

        return userResult;
      });
    },
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