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
      return this.data.map(user => ({
        name: user.name,
        color: user.color,
        data: this.generateChartData(user),
      }));
    },
  },
  methods: {
    // Group all the array purchases into one key/value pair
    groupByDay(arr) {
      if (!arr) return {};

      return arr.reduce((acc, item) => {
        const dateKey = new Date(item.date.seconds * 1000)
          .toISOString()
          .split('T')[0];

        if (acc[dateKey]) {
          acc[dateKey] += item.amtSpent;
        } else {
          acc[dateKey] = item.amtSpent;
        }

        return acc;
      }, {});
    },

    // Generate spendings graph data based on selected filters
    generateChartData(user) {
      // Create one big data array for the line graph, combining all the individual categories
      const transformedData = this.selected.reduce((acc, filter) => {
        if (user[filter]) {
          const grouped = this.groupByDay(user[filter]);

          Object.entries(grouped).forEach(([date, amount]) => {
            if (acc[date]) {
              acc[date] += amount;
            } else {
              acc[date] = amount;
            }
          });
        }
        return acc;
      }, {});
      const sorted = Object.keys(transformedData).sort();

      let runningTotal = 0;
      const chartData = sorted.map(date => {
        runningTotal += transformedData[date]; // Cumulative add spending at each date point
        return [
          new Date(date).getTime(),
          Number(runningTotal.toFixed(2)),
        ];
      });
      if (chartData.length === 0) return [];

      // Add start and end boundaries to graph so they don't just 'float'
      const totalSpending = chartData[chartData.length - 1][1];
      return [
        [chartData[0][0] - 86400000, 0], // Day before first entry
        ...chartData,
        [Date.now(), totalSpending], // Current date with last total
      ];
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