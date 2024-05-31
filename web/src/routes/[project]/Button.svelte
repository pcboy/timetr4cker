<script lang="ts">
  const { onclick, className, children } = $props();
</script>

<button
  {onclick}
  class={`
    rounded-lg p-2 px-7 font-bold text-white
    ${className || ''}
  `}
>
  {@render children()}
</button>
