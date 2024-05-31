<script lang="ts">
  import { projectStore } from './stores.svelte';

  import Entries from './Entries.svelte';

  import CurrentDate from './CurrentDate.svelte';
  import ProjectConfiguration from './ProjectConfiguration.svelte';

  let { projectName }: { projectName: string } = $props();

  let notFound = $state(false);

  $effect(() => {
    projectStore
      .fetchProject(projectName)
      .then(() =>
        projectStore.loadEntries(projectStore.project.startDate, projectStore.project.endDate)
      )
      .catch((_) => {
        notFound = true;
      });
  });
</script>

{#if projectStore.project.id}
  <div
    class="
      min-h-screen
      md:px-0
      screen:px-10
    "
  >
    <div
      class="
        container mx-auto pb-40 pt-5
        screen:max-w-5xl
      "
    >
      <CurrentDate />
      <ProjectConfiguration />
      <p
        class="
          mb-8 flex w-full justify-center text-3xl font-bold
          screen:hidden
        "
      >
        {projectStore.name}
      </p>
      <Entries entries={projectStore.entries} />
    </div>
  </div>
{:else}
  <div class="flex h-screen w-screen items-center justify-center">
    {#if notFound}
      <b>Project not found</b>
    {:else}
      <b>Loading project...</b>
    {/if}
  </div>
{/if}
