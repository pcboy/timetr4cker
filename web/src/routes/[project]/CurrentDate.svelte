<script lang="ts">
  import { DateTime } from 'luxon';
  import MdKeyboardArrowLeft from 'svelte-icons/md/MdKeyboardArrowLeft.svelte';
  import MdKeyboardArrowRight from 'svelte-icons/md/MdKeyboardArrowRight.svelte';
  import { projectStore } from './stores.svelte';

  let prevStartDate = $derived(
    DateTime.fromISO(projectStore.project.startDate).minus({ months: 1 }).startOf('month').toISO()!
  );
  let prevEndDate = $derived(
    DateTime.fromISO(projectStore.project.startDate).minus({ months: 1 }).endOf('month').toISO()!
  );
  let nextStartDate = $derived(
    DateTime.fromISO(projectStore.project.endDate).plus({ months: 1 }).startOf('month').toISO()!
  );
  let nextEndDate = $derived(
    DateTime.fromISO(projectStore.project.endDate).plus({ months: 1 }).endOf('month').toISO()!
  );
</script>

<div
  class="
    mb-12 mt-10 flex w-full
    md:flex-row
    print:flex-row
    screen:justify-between
  "
>
  <div class="w-1/2">
    <div class="flex flex-row items-center justify-start">
      <a
        class="
          h-14 w-24 text-sky-400
          hover:text-sky-500
          print:hidden
        "
        href={`?startDate=${encodeURIComponent(prevStartDate)}&endDate=${encodeURIComponent(prevEndDate)}`}
      >
        <MdKeyboardArrowLeft size="20" />
      </a>
      <h1
        class="
          font-bold
          md:text-xl
          print:text-2xl
        "
      >
        {DateTime.fromISO(projectStore.project.startDate).toLocaleString(DateTime.DATE_FULL)}
      </h1>
    </div>
  </div>

  <div class="screen:hidden">~</div>

  <div class="w-1/2">
    <div class="flex flex-row items-center justify-end">
      <h1
        class="
          font-bold
          md:text-xl
          print:text-2xl
        "
      >
        {DateTime.fromISO(projectStore.project.endDate).toLocaleString(DateTime.DATE_FULL)}
      </h1>
      <a
        class="
          h-14 w-24 text-sky-400
          hover:text-sky-500
          print:hidden
        "
        href={`?startDate=${encodeURIComponent(nextStartDate)}&endDate=${encodeURIComponent(nextEndDate)}`}
      >
        <MdKeyboardArrowRight />
      </a>
    </div>
  </div>
</div>
