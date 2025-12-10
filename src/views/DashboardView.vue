<script>
import { data } from '../api/test-api';
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
    this.data = data;
  },
};
</script>

<template>
  <v-container class="d-flex flex-grow-1 ma-auto justify-center">
    <div class="d-flex ma-auto">
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
  </v-container>
</template>