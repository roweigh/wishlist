<script>
export default {
  props: {
    data: { type: null, required: true },
    selected: { type: null, required: true },
  },
  computed: {
    chartOptions () {
      const vm = this;
      return {
        chart: {
          animations: {
            initialAnimation: {
              enabled: false,
            },
          },
          events: {
            legendClick(chartContext, seriesIndex, opts) {
            // vm.$emit('update:donut-data', []);
              const series = opts.config.series;
              const visible = series.filter((_, i) => !chartContext.w.globals.collapsedSeriesIndices.includes(i));
              const onlyThisVisible = visible.length === 1 && visible[0].name === series[seriesIndex].name;

              // Show/hide series logic
              if (onlyThisVisible) {
                series.forEach(s => chartContext.showSeries(s.name));
                vm.$emit('update:user', null);
              } else {
                series.forEach((s, i) => {
                  if (i === seriesIndex) chartContext.showSeries(s.name);
                  else chartContext.hideSeries(s.name);
                });
                vm.$emit('update:user', series[seriesIndex].name);
              }

              return false;
            },
          },
        },
        xaxis: {
          type: 'datetime',
          labels: {
            formatter: (value) => new Date(value).toLocaleDateString('en-NZ', { timeZone: 'Pacific/Auckland' }),
          },
        },
        yaxis: {
          labels: {
            formatter: (value) => `$${value.toLocaleString()}`,
          },
        },
        legend: {
          onItemClick: {
            toggleDataSeries: false,
          },
        },
      };
    },
    series () {
      return this.data.map(user => {
        return {
          name: user.name,
          color: user.color,
          data: this.transformData(user),
        };
      });
    },
  },
  methods: {
    transformData(user) {
      const result = this.selected.reduce((acc, filter) => {
        // Check if the property exists on the user object to avoid errors
        if (user[filter]) {
          return { ...acc, ...user[filter] };
        }
        return acc;
      }, {});

      const sortedDates = Object.keys(result).sort((a, b) => new Date(a) - new Date(b));
      let runningTotal = 0;

      // 2. Map through sorted dates to build the cumulative total
      const chartData = sortedDates.map(dateStr => {
        const value = result[dateStr];
        runningTotal += value;

        return [
          new Date(dateStr).getTime(),     // X-axis: Timestamp
          Number(runningTotal.toFixed(2)), // Y-axis: Cumulative total (cleaned up)
        ];
      });

      return chartData;
    },
  },
};
</script>

<template>
  <v-card class="pa-5 ma-5">
    <apexchart
      :series="series"
      :options="chartOptions"
      height="600"
      width="900"
    />
  </v-card>
</template>