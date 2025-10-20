<script>
import dayjs from 'dayjs';

export default {
  data () {
    return {
      selected: [
        'accessories',
        'singles',
        'boosters',
        'tournaments',
      ],

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
      // Test Data
      data: [
        {
          value: 'roweigh',
          name: 'Roweigh',
          color: '#663399',
          accessories: [0,0,0,0,0,0,0,100,87.10],
          boosters: [0,0,0,0,0,0,0,0,10],
          tournaments: [0,0,0,0,0,0,0,0,177.5],
          singles: [
            0,                                    // "27/08/2025",
            125.68,                               // "03/09/2025",
            (125.68 + 53.83 - 31.83),             // "10/09/2025",
            ((125.68 + 53.83 - 31.83) + 55.83 + 100),   // "17/09/2025",
            ((125.68 + 53.83 - 31.83) + 55.83 + 100),   // "24/09/2025",
            371.28,                               // "01/10/2025",
            484.28,                               // "08/10/2025",
            598.53,                               // "15/10/2025",
            598.53,                               // Today
          ],
        },
        {
          value: 'junyi',
          name: 'Junyi',
          accessories: [0,0,0,0,0,0,0,0,119.26],
          boosters: [0,0,0,0,0,0,0,0,137.50],
          tournaments: [0,0,0,0,0,0,0,0,296.27],
          singles: [
            (6+1+4+8+30), //27
            (16+6+1+4+8+4+2+30), // 3
            (16+6+1+4+8+4+2+30), // 10
            (110.00), // 17
            (198.87), // 24
            218.87,
            438.47,
            637.33,
            643.83,
          ],
        },
        {
          value: 'gary',
          name: 'Gary',
          accessories: [0,0,0,0,0,0,0,0,119.26],
          boosters: [0,0,0,0,0,0,0,0,640],
          tournaments: [0,0,0,0,0,0,0,0,400],
          singles: [
            (0), //27
            (8+28+0.4+0.4+24+90), // 3
            (8+28+0.4+0.4+24+90),
            (8+28+18+30+0.4+0.4+24+200+46+2+4+1.6+0.8+6), // 17
            (8+28+18+30+0.4+0.4+24+200+46+5+2+4+1.6+1.5+0.8+6), // 24
            (1215.70 - 740),
            (1215.70 - 740),
            (1351.70 - 740),
            (1407.70 - 740),
          ],
        },
        {
          value: 'kevin',
          name: 'Kevin',
          accessories: [0,0,0,0,0,0,0,11,80],
          boosters: [0,0,0,0,0,0,0,12,315],
          tournaments: [0,0,0,0,0,0,0,12,92],
          singles: [0,0,0,0,0,0,0,0,200],
        },
      ],
    };
  },
  computed: {
    series () {
      return this.data.map(user => {
        return {
          name: user.name,
          color: user.color,
          data: this.transformData(user),
        };
      });
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
      result.push(dayjs().format('DD/MM/YYYY'));
      return result;
    },
    chartOptions () {
      const vm = this;
      return {
        chart: {
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
  },
  methods: {
    transformData(user) {
      const result = this.categories.map(() => 0);
      this.selected.forEach((v) => {
        user[v] && result.forEach((_, i) => {
          result[i] += user[v][i];
        });
      });
      return result;
    },
  },
};
</script>

<template>
  <v-app class="d-flex">
    <div class="d-flex flex-column">
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

      <div class="d-flex">
        <apexchart
          :options="chartOptions"
          :series="series"
          width="1200"
        />

        <apexchart
          v-if="donutData"
          type="donut"
          class="ma-auto"
          :options="donutChartOptions"
          :series="donutData"
          width="600"
        />
      </div>
    </div>
  </v-app>
</template>