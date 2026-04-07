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
      data: [],
      selected: [
        'singles',
        'others',
        'entries',
      ],
    };
  },
  watch: {
    user (v) {
      const totalSpent= (v) => v.reduce((acc, item) => acc + item.amtSpent, 0);
      if (v !== null) {
        this.donutData = [
          totalSpent(this.data[v].singles),
          totalSpent(this.data[v].entries),
          totalSpent(this.data[v].others),
        ];
      } else {
        this.donutData = [1];
      }
    },
  },
  async mounted () {
    const users = await getUsers();
    const promises = [];
    users.forEach((user) => {
      promises.push(this.getUserPurchases(user));
    });

    this.data = await Promise.all(promises);
  },
  methods: {
    async getUserPurchases(user) {
      const id = user.id;
      return await Promise.all([
        getUserPurchase(id, 'singles-history'),
        getUserPurchase(id, 'sales-history'),
        getUserPurchase(id, 'tournament-history'),
        getUserPurchase(id, 'others-history'),
      ]).then(([
        bought,
        sold,
        entries,
        others,
      ]) => {
        return ({
          value: id,
          name: user.name,
          color: user.color,
          singles: [...bought, ...sold],
          entries,
          others,
        });
      });
    },
  },
};
</script>

<template>
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
</template>