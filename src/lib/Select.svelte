<script>
  let { label, options = [], value = $bindable() } = $props();
</script>

<div class="select-container">
  {#if label}
    <span class="select-label">{label}</span>
  {/if}
  <select bind:value={value}>
    {#each options as opt}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
</div>

<style>
  .select-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
  }

  .select-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
</style>
