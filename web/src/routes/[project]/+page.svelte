<script lang="ts">
  import MainControls from './MainControls.svelte';
  import { DateTime } from 'luxon';
  import { projectStore } from './stores.svelte';

  const { data } = $props();

  $effect(() => {
    projectStore.project.startDate = data.startDate || DateTime.now().startOf('month').toISO();
    projectStore.project.endDate = data.endDate || DateTime.now().endOf('month').toISO();
  });
</script>

{#if data.project}
  <MainControls projectName={data.project} />
{/if}
