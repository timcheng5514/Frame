<script>
  let { label, min = 0, max = 100, step = 1, value = $bindable(), suffix = '' } = $props();
</script>

<div class="slider-container">
  <div class="slider-header">
    <span class="slider-label">{label}</span>
    <span class="slider-value">{value}{suffix}</span>
  </div>
  <input type="range" {min} {max} {step} bind:value={value} class="slider-input" />
</div>

<style>
  .slider-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
  }

  .slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .slider-value {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-light);
  }

  .slider-input {
    -webkit-appearance: none;
    width: 100%;
    height: 3px;
    border-radius: 2px;
    background: var(--border-color);
    outline: none;
    margin: 8px 0;
    transition: background 0.2s ease;
  }

  .slider-input:focus-visible {
    background: var(--text-light);
  }

  /* Slider Thumb Custom Styling */
  .slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--text-primary);
    cursor: pointer;
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .slider-input::-webkit-slider-thumb:hover {
    transform: scale(1.25);
    background: var(--accent-color);
  }

  .slider-input::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border: none;
    border-radius: 50%;
    background: var(--text-primary);
    cursor: pointer;
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .slider-input::-moz-range-thumb:hover {
    transform: scale(1.25);
    background: var(--accent-color);
  }
</style>
