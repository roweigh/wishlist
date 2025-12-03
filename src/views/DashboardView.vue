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
      data: [],
      selected: [
        'accessories',
        'singles',
        'boosters',
        'tournaments',
      ],
    };
  },
  async mounted () {
    this.data = data;
  },
};
</script>

<template>
  <v-container class="d-flex flex-grow-1 ma-auto justify-center">
    <v-checkbox
      v-model="selected"
      value="singles"
      label="Singles"
      hide-details
    />
    <v-checkbox
      v-model="selected"
      value="accessories"
      label="Accessories"
      hide-details
    />
    <v-checkbox
      v-model="selected"
      value="boosters"
      label="Boosters"
      hide-details
    />
    <v-checkbox
      v-model="selected"
      value="tournaments"
      label="tournaments Entry"
      hide-details
    />
  </v-container>

  <div class="d-flex ma-auto">
    <line-graph
      :data="data"
      :selected="selected"
    />
    <donut-graph />
  </div>
</template>