<script lang="ts">
  import { DateTime } from 'luxon';
  import Entry from './Entry.svelte';
  import { type Entry as EntryType } from './stores.svelte';
  import { projectStore } from './stores.svelte';
  import ProgressChart from './ProgressChart.svelte';

  const {
    entries
  }: {
    entries: EntryType[];
  } = $props();

  const sortedDays = $derived(
    Object.keys(projectStore.groupedEntries).sort(
      (a, b) => DateTime.fromISO(b).toMillis() - DateTime.fromISO(a).toMillis()
    )
  );

  $effect(() => {
    sortedDays; /* force sortedDays to be recomputed */
  });
</script>

<div class="flex w-full screen:mt-16 flex-col">
  {#if entries?.length === 0}
    <div class="flex w-full justify-center">
      <h1>You have no Time Entries yet for this period</h1>
    </div>
  {:else}
    <div class="print:hidden">
      <ProgressChart />
    </div>
    <div class="screen:flex screen:flex-col print:block w-full relative">
      <div class="flex w-full justify-between text-xl text-gray-600 screen:hidden">
        <b>Hours</b>
        <b>Duration</b>
      </div>
      {#each sortedDays as day (day)}
        <div class="screen:mb-8 screen:mt-5 keep-together relative print:mt-3">
          <div class="flex items-center">
            <div class="border-t border-gray-300 flex-grow print:border-t-2"></div>
            <div class="flex-shrink ml-5 screen:text-xl print:text-sm font-bold">{day}</div>
          </div>
          {#each projectStore.groupedEntries[day] as entry (entry.id)}
            <Entry {entry} />
          {/each}
          <div class="flex items-center mt-5 justify-end print:hidden">
            <p class="ml-5">Subtotal: {projectStore.subTotals[day]} hours</p>
          </div>
        </div>
      {/each}
    </div>
    <div class="flex items-center mt-5">
      <div class="border-t border-gray-300 flex-grow"></div>
      <p class="flex-shrink ml-5 font-bold">
        TOTAL: {((projectStore.currentMinutes || 0) / 60.0).toFixed(1)} hours
      </p>
    </div>
  {/if}
</div>
