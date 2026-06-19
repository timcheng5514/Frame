<script>
  let { label, checked = $bindable() } = $props();
</script>

<label class="toggle-container">
  <span class="toggle-label">{label}</span>
  <div class="toggle-switch">
    <input type="checkbox" bind:checked={checked} class="toggle-input" />
    <span class="toggle-slider"></span>
  </div>
</label>

<style>
  .toggle-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
    width: 100%;
    padding: 2px 0;
  }

  .toggle-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 18px;
  }

  .toggle-input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--border-color);
    transition: .2s cubic-bezier(0.16, 1, 0.3, 1);
    border-radius: 9px;
  }

  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 3px;
    bottom: 3px;
    background-color: var(--bg-card);
    transition: .2s cubic-bezier(0.16, 1, 0.3, 1);
    border-radius: 50%;
  }

  .toggle-input:checked + .toggle-slider {
    background-color: var(--accent-color);
  }

  .toggle-input:checked + .toggle-slider:before {
    transform: translateX(14px);
  }
</style>
