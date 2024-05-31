<script lang="ts">
  import { DateTime, Interval } from 'luxon';
  import { projectStore, type Entry } from './stores.svelte';
  import { echarts } from '../../lib/echarts';

  let option = $derived.by(() => {
    const dates = getDatesArray(projectStore.project.startDate, projectStore.project.endDate);
    const idealProgress = getIdealProgressData(dates, projectStore.timeBudget);
    const actualProgress = getActualProgressData(dates, projectStore.entries);

    return {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Ideal Progress', 'Actual Progress']
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          align: 'bottom'
        }
      },
      yAxis: {
        type: 'value',
        name: 'Hours',
        axisLabel: {
          align: 'left'
        }
      },
      series: [
        {
          name: 'Ideal Progress',
          type: 'line',
          data: idealProgress
        },
        {
          name: 'Actual Progress',
          type: 'line',
          data: actualProgress
        }
      ]
    };
  });

  function getDatesArray(start: string, end: string) {
    const dates = [];
    const interval = Interval.fromDateTimes(DateTime.fromISO(start), DateTime.fromISO(end));

    if (!interval || !interval.start) return [];
    let cursor = interval.start.startOf('day');
    while (cursor < interval.end) {
      if (cursor.weekday <= 5) {
        // Only include weekdays (Monday to Friday)
        dates.push(cursor.toISODate());
      }
      cursor = cursor.plus({ days: 1 });
    }

    return dates;
  }

  function getIdealProgressData(dates: string[], timeBudget: number): number[] {
    const minutesPerDay = timeBudget / dates.length;

    return dates.map((_, index) => Number(((minutesPerDay * (index + 1)) / 60).toFixed(2)));
  }

  function getActualProgressData(dates: string[], entries: Entry[]): number[] {
    let cumulativeHours = 0;

    return dates
      .filter((date) => DateTime.fromISO(date) < DateTime.now())
      .map((date) => {
        const dayEntries = entries.filter((entry) => {
          return DateTime.fromISO(entry.startTime).toISODate() === date;
        });

        const dayMinutes = dayEntries.reduce((sum, entry) => sum + entry.duration, 0);
        cumulativeHours += dayMinutes / 60;

        return Number(cumulativeHours.toFixed(2));
      });
  }
</script>

<span class="flex w-full justify-center text-center font-bold">Work Progress</span>
<div class="h-96 w-full" use:echarts={option}></div>
<p class="text-center">
  Recommended time to finish today: {projectStore.recommendedStopTime} ({projectStore.recommendedHours}
  hours of work)
</p>
