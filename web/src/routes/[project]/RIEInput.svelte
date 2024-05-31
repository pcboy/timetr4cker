<script lang="ts">
  import { tick } from 'svelte';

  let {
    value,
    className = '',
    onvalueChanged
  } = $props<{
    value: string;
    className?: string;
    onvalueChanged: (value: string) => void;
  }>();

  let inputElement;

  let isEditing = $state(false);
  let editablevalue = $state(value);

  function handlevalueChange() {
    onvalueChanged(editablevalue);
    isEditing = false;
  }

  function handleBlur() {
    handlevalueChange();
  }

  function handleKeyPress(event: { key: string }) {
    if (event.key === 'Enter') {
      handlevalueChange();
    }
  }

  async function toggleEdit() {
    isEditing = true;
    editablevalue = value;
    await tick();

    inputElement && inputElement.focus();
  }
</script>

<div class={className || ''}>
  {#if isEditing}
    <input
      type="text"
      bind:value={editablevalue}
      onblur={handleBlur}
      onkeypress={handleKeyPress}
      bind:this={inputElement}
      class="w-auto min-w-20"
    />
  {:else}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <span role="contentinfo" class="editable mx-1" onclick={toggleEdit}>{value}</span>
  {/if}
</div>
