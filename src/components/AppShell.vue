<template>
  <section class="app-shell">
    <header class="shell-head">
      <div>
        <p class="eyebrow">The Global Conflict Monitor</p>
        <h2 class="page-title">{{ title }}</h2>
      </div>
      <div class="actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="shell-content">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.app-shell {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(11, 31, 51, 0.12);
  border-radius: 20px;
  padding: clamp(0.9rem, 2vw, 1.25rem);
  box-shadow: 0 18px 38px rgba(11, 31, 51, 0.08);
}

.shell-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(11, 31, 51, 0.12);
  padding-bottom: 0.9rem;
  margin-bottom: 1rem;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7a88;
  font-size: 0.8rem;
}

.page-title {
  margin: 0.2rem 0 0;
  color: #0f2940;
}

.actions {
  min-height: 36px;
}

.shell-content {
  display: grid;
  gap: 1rem;
}

@media (max-width: 720px) {
  .shell-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .actions {
    width: 100%;
  }
}
</style>
