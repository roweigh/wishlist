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
  // 1. Improved Helper: Single-pass reduction
    getGroupedSpending(arr) {
      if (!arr) return {};

      return arr.reduce((acc, item) => {
      // Normalize to YYYY-MM-DD
        const date = new Date(item.date.seconds * 1000);
        const dateKey = date.toISOString().split('T')[0];

        acc[dateKey] = (acc[dateKey] || 0) + item.amtSpent;
        return acc;
      }, {});
    },

    transformData(user) {
    // 2. Aggregate data without mutating the original user object
    // This allows us to combine filters (e.g. 'singles' and 'entries') into one object
      const aggregated = this.selected.reduce((acc, filter) => {
        if (user[filter]) {
          const grouped = this.getGroupedSpending(user[filter]);

          // Merge this category's dates into the master list
          Object.entries(grouped).forEach(([date, amount]) => {
            acc[date] = (acc[date] || 0) + amount;
          });
        }
        return acc;
      }, {});

      // 3. Sort and calculate cumulative totals
      const sortedDates = Object.keys(aggregated).sort();
      let runningTotal = 0;

      const chartData = sortedDates.map(dateStr => {
        runningTotal += aggregated[dateStr];
        return [
          new Date(dateStr).getTime(),
          Number(runningTotal.toFixed(2)),
        ];
      });

      if (chartData.length === 0) return [];

      // 4. Return Final Data with boundary points
      const lastTotal = chartData[chartData.length - 1][1];

      return [
        [chartData[0][0] - 86400000, 0], // One day before first entry
        ...chartData,
        [Date.now(), lastTotal],         // Current time with last total
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