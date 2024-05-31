<script lang="ts">
  import { projectStore } from './stores.svelte';
  import Button from './Button.svelte';
  import ProgressBar from './ProgressBar.svelte';

  import RIEInput from './RIEInput.svelte';
</script>

<div
  class={`
    flex w-full flex-col rounded bg-white p-5 shadow-md
    print:hidden
  `}
>
  <div class="flex justify-center">
    <div class="min-w-min">
      <Button
        className={projectStore.isTimerStarted
          ? `
            bg-red-400
            hover:bg-red-500
          `
          : `
            bg-sky-400
            hover:bg-sky-500
          `}
        onclick={() => (projectStore.timerStatus = projectStore.isTimerStarted ? false : true)}
      >
        <span>{projectStore.isTimerStarted ? `STOP TIMER` : `START TIMER`}</span>
      </Button>
    </div>
  </div>

  <div class="flex flex-col">
    <div class="flex">
      <span class="mr-1 font-bold">Time Budget:</span>
      <div class="flex">
        {(projectStore.currentMinutes / 60.0).toFixed(1)} hours /
        <RIEInput
          value={((projectStore.timeBudget || 0) / 60.0).toFixed(1)}
          onvalueChanged={(value) => {
            projectStore.setTimeBudget(parseFloat(value) * 60);
          }}
        ></RIEInput>
        hours
      </div>
    </div>

    <ProgressBar percent={projectStore.progressMinutes}></ProgressBar>
  </div>

  <div class="mt-5 flex flex-col">
    <div class="flex">
      <div class="mr-1 font-bold">Budget:</div>
      (Rate: <RIEInput
        value={projectStore.rate?.toString()}
        onvalueChanged={(value) => {
          projectStore.setRate(parseFloat(value));
        }}
      ></RIEInput>
      monies/h)
    </div>

    <div class="flex">
      {((projectStore.currentMinutes / 60.0) * (projectStore.rate || 1)).toFixed(0)} Monies /
      <RIEInput
        value={projectStore.budget.toString()}
        onvalueChanged={(value) => {
          projectStore.setBudget(parseFloat(value));
        }}
      ></RIEInput>
      Monies
    </div>
    <ProgressBar percent={projectStore.moniesPercentage}></ProgressBar>
  </div>
</div>
