<script>
  let { children, type = 'button', variant = 'primary', onclick, ...restProps } = $props();
</script>

<button {type} class="btn {variant}" onclick={onclick} {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</button>

<style>
  .btn {
    font-family: var(--font-sans);
    font-size: 0.85rem;
    font-weight: 500;
    padding: 10px 16px;
    border-radius: 4px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    outline: none;
  }

  .btn:active {
    transform: scale(0.98);
  }

  .primary {
    background-color: var(--text-primary);
    color: var(--bg-primary);
  }

  .primary:hover {
    background-color: var(--text-secondary);
  }

  .secondary {
    background-color: var(--bg-card);
    border-color: var(--border-color);
    color: var(--text-primary);
  }

  .secondary:hover {
    background-color: var(--bg-hover);
    border-color: var(--text-light);
  }

  .danger {
    background-color: transparent;
    border-color: var(--danger-color);
    color: var(--danger-color);
  }

  .danger:hover {
    background-color: var(--danger-color);
    color: #ffffff;
  }

  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
</style>
