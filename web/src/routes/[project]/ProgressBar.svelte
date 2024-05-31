<script>
	export let percent = 0;
</script>

<div
	class="
   w-full rounded-l-lg rounded-r-lg bg-gray-200
   dark:bg-gray-700
 "
>
	<div
		class="
    rounded-l-lg rounded-r-lg bg-teal-400 p-2 text-center text-xs font-bold
    text-white
  "
		style="width: {Math.min(100, percent)}%"
	>
		{percent && percent.toFixed(0)}%
	</div>
</div>
