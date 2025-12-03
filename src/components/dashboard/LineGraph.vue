<script>
import dayjs from 'dayjs';

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
          toolbar: {
            show: false,
          },
          events: {
            legendClick(chartContext, seriesIndex, opts) {
              const series = opts.config.series;
              const visible = series.filter((_, i) => !chartContext.w.globals.collapsedSeriesIndices.includes(i));
              const onlyThisVisible = visible.length === 1 && visible[0].name === series[seriesIndex].name;

              // Compute donut data for clicked user
              const clickedUser = vm.data[seriesIndex];
              vm.donutData = vm.selected.map(type => clickedUser[type]?.at(-1) || 0);
              vm.donutChartOptions = {
                ...vm.donutChartOptions,
                labels: vm.selected.map(k => k.charAt(0).toUpperCase() + k.slice(1)),
              };

              // Show/hide series logic
              if (onlyThisVisible) {
                vm.donutData = null; // reset donut when re-showing all
                series.forEach(s => chartContext.showSeries(s.name));
              } else {
                series.forEach((s, i) => {
                  if (i === seriesIndex) chartContext.showSeries(s.name);
                  else chartContext.hideSeries(s.name);
                });
              }

              return false;
            },
          },
        },
        xaxis: {
          categories: this.categories,
        },
        legend: {
          onItemClick: {
            toggleDataSeries: false,
          },
        },
      };
    },
    categories () {
      const result = [];
      const today = dayjs();
      const start = dayjs()
        .set('year', 2025)
        .set('month', 7)
        .set('date', 27);

      let current = start;
      while (current.isBefore(today) || current.isSame(today, 'day')) {
        result.push(current.format('DD/MM/YYYY'));
        current = current.add(1, 'week');
      }
      // result.push(dayjs().format('DD/MM/YYYY'));
      return result;
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
      const result = this.categories.map(() => 0);
      this.selected.forEach((v) => {
        user[v] && result.forEach((_, i) => {
          result[i] += user?.[v]?.[i] ?? 0;
        });
      });
      return result;
    },
  },
};
</script>

<template>
  <apexchart
    :options="chartOptions"
    :series="series"
    width="1200"
  />
</template>