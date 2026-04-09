<template>
  <section class="filters-wrap">
    <input
      :value="query"
      type="search"
      class="input"
      placeholder="Cerca per titol, pais o descripcio"
      @input="$emit('update:query', $event.target.value)"
    />

    <select
      class="input"
      :value="status"
      @change="$emit('update:status', $event.target.value)"
    >
      <option value="all">Tots els estats</option>
      <option value="active">Actius</option>
      <option value="frozen">Pausats</option>
      <option value="ended">Finalitzats</option>
    </select>
  </section>
</template>

<script setup>
defineProps({
  query: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: 'all',
  },
});

defineEmits(['update:query', 'update:status']);
</script>

<style scoped>
.filters-wrap {
  display: grid;
  grid-template-columns: 1fr 190px;
  gap: 0.75rem;
}

.input {
  border: 1px solid #c5d0db;
  border-radius: 10px;
  padding: 0.7rem 0.8rem;
  background: #f8fbfe;
  width: 100%;
  min-width: 0;
}

@media (max-width: 720px) {
  .filters-wrap {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .input {
    padding: 0.68rem 0.75rem;
  }
}
</style>
