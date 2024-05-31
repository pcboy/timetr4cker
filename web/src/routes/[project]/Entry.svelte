<script lang="ts">
  import { DateTime, Duration } from 'luxon';
  import RIEInput from './RIEInput.svelte';
  import MdDeleteSweep from 'svelte-icons/md/MdDeleteSweep.svelte';
  import { computeDuration, projectStore, type Entry } from './stores.svelte';
  import Button from './Button.svelte';

  let { entry }: { entry: Entry } = $props();

  const updateEntryTime = (field: 'startTime' | 'endTime', value: string) => {
    const [, hours, minutes] = value.match(/^(\d{1,2}):(\d{1,2})$/) || [];
    entry[field] =
      DateTime.fromISO(entry[field])
        .set({ hour: parseInt(hours), minute: parseInt(minutes) })
        .toISO() || '';

    entry.duration = computeDuration(entry);

    projectStore.saveEntry(entry);
  };

  const handleStartTimeChange = (value: string) => updateEntryTime('startTime', value);
  const handleEndTimeChange = (value: string) => updateEntryTime('endTime', value);

  const deleteEntry = () => {
    projectStore.deleteEntry(entry);
  };

  let startTime = $derived(
    DateTime.fromISO(entry.startTime).toLocaleString(DateTime.TIME_24_SIMPLE)
  );
  let endTime = $derived(
    entry.endTime ? DateTime.fromISO(entry.endTime).toLocaleString(DateTime.TIME_24_SIMPLE) : ''
  );

  let duration = $derived(
    entry.endTime ? Duration.fromObject({ minutes: entry.duration }).toFormat('hh:mm') : '-'
  );
</script>

<div
  class="
    relative flex w-full cursor-pointer justify-between rounded-md
    print:text-sm
    screen:mb-5 screen:mt-3 screen:bg-white screen:p-2 screen:px-5
    screen:shadow-md screen:hover:shadow-md
  "
>
  <div class="flex">
    <RIEInput
      onvalueChanged={handleStartTimeChange}
      value={startTime}
      className="editable has-text-left mr-2 w-10"
    ></RIEInput>
    ~
    {#if endTime}
      <RIEInput
        onvalueChanged={handleEndTimeChange}
        value={endTime}
        className="editable has-text-right ml-2 w-10"
      ></RIEInput>
    {/if}
  </div>
  <div class="duration group relative flex font-bold">
    <p>{duration}</p>
    {#if !endTime}
      <p>-</p>
    {/if}
    <Button
      className="
        absolute -right-20 hidden
        group-hover:block
      "
      onclick={() => deleteEntry()}
    >
      <div
        class="
          relative -right-7 -top-3 flex h-8 w-20 justify-center text-gray-700
          hover:text-red-500
        "
      >
        <MdDeleteSweep></MdDeleteSweep>
      </div>
    </Button>
  </div>
</div>
