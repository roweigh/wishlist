<script>
export default {
  props: {
    user: { type: null, required: true },
    data: { type: null, required: true },
  },

  computed: {
    chartOptions () {
      const options = {
        chart: { type: 'donut' },
        tooltip: { enabled: false },
        // dataLabels: { enabled: false },
        labels: ['Singles', 'Entry Fees', 'Others'],
        states: {
          active: {
            filter: {
              type: 'none',
            },
          },
          hover: {
            filter: {
              type: 'none',
            },
          },
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              labels: {
                show: true,
                value: {
                  formatter: function (val) {
                    const result = Number(val).toFixed(2);
                    return `$${result}`;
                  },
                },
                total: {
                  show: true,
                  formatter: function (w) {
                    const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                    const result = Number(total).toFixed(2);
                    return `$${result}`;
                  },
                },
              },
            },
          },
        },
        legend: {
          position: 'bottom',
          onItemClick: {
            toggleDataSeries: false,
          },
        },
      };

      if (this.user === null) {
        options.colors = ['#e0e0e0'];
        options.plotOptions.pie.donut.labels.value.show = false;
        options.plotOptions.pie.donut.labels.total.label = 'Pick a degen';
        options.plotOptions.pie.donut.labels.total.color = '#999';
        options.legend.show = false;
      }

      return options;
    },
  },
};
</script>

<template>
  <v-card class="pa-5 ma-5">
    <apexchart
      :options="chartOptions"
      :series="data"
      height="600px"
      width="600px"
      type="donut"
    />
  </v-card>
</template>