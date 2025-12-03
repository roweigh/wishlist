<script>
export default {
  data () {
    return {
      donutData: null,
      donutChartOptions: {
        chart: {
          type: 'donut',
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total Spent',
                  formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
                },
              },
            },
          },
        },
        legend: {
          show:false,
        },
      },
    };
  },
};
</script>

<template>
  <apexchart
    v-if="donutData"
    type="donut"
    :options="donutChartOptions"
    :series="donutData"
    class="ma-auto"
    width="600"
  />
</template>