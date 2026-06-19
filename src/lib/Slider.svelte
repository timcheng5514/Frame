<script>
  let { label, min = 0, max = 100, step = 1, value = $bindable(), suffix = '' } = $props();

  function handleBlur() {
    if (value === null || value === undefined || isNaN(value)) {
      value = min;
    } else {
      const stepDecimals = (step.toString().split('.')[1] || '').length;
      let rounded = Math.round(value / step) * step;
      if (stepDecimals > 0) {
        rounded = parseFloat(rounded.toFixed(stepDecimals));
      }
      
      if (rounded < min) {
        value = min;
      } else if (rounded > max) {
        value = max;
      } else {
        value = rounded;
      }
    }
  }
</script>

<div class="slider-container">
  <div class="slider-header">
    <span class="slider-label">{label}</span>
    <div class="slider-value-input-wrapper">
      <input 
        type="number" 
        {min} 
        {max} 
        {step} 
        bind:value={value} 
        onblur={handleBlur}
        class="slider-value-input" 
      />
      {#if suffix}
        <span class="slider-suffix">{suffix}</span>
      {/if}
    </div>
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

  .slider-value-input-wrapper {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .slider-value-input {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-primary);
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 1px 4px;
    width: 46px;
    text-align: right;
    outline: none;
    transition: all 0.15s ease;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    appearance: none;
  }

  .slider-value-input::-webkit-outer-spin-button,
  .slider-value-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .slider-value-input:focus {
    border-color: var(--accent-color);
    background: var(--bg-card);
  }

  .slider-suffix {
    font-size: 0.75rem;
    color: var(--text-light);
    font-family: var(--font-sans);
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
