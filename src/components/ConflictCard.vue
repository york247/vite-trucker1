<template>
  <article class="conflict-card" :class="statusClass">
    <header class="card-header">
      <div class="flags">
        <img
          v-for="code in countryCodes"
          :key="code"
          class="flag"
          :src="flagUrl(code)"
          :alt="`Bandera ${code}`"
          loading="lazy"
        />
      </div>
      <div>
        <h3>{{ conflict.title }}</h3>
      </div>
      <span class="status-pill" :class="statusClass">{{ readableStatus }}</span>
    </header>

    <p class="summary">{{ conflict.description || 'Sense descripcio disponible.' }}</p>

    <footer class="card-actions">
      <router-link :to="`/conflicts/${conflict.id}`" class="btn-link">Veure detall</router-link>
      <button
        class="btn-read"
        :disabled="conflict.isRead"
        @click="$emit('mark-read', conflict.id)"
      >
        {{ conflict.isRead ? 'Llegit' : 'Marcar com a llegit' }}
      </button>
      <button class="btn-delete" @click="$emit('delete', conflict.id)" title="Eliminar conflicte">
        Eliminar
      </button>
    </footer>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  conflict: {
    type: Object,
    required: true,
  },
});

defineEmits(['mark-read', 'delete']);

const countryCodes = computed(() => {
  if (Array.isArray(props.conflict.countryCodes) && props.conflict.countryCodes.length) {
    return props.conflict.countryCodes
      .map((code) => String(code).toUpperCase())
      .filter((code) => /^[A-Z]{2}$/.test(code))
      .slice(0, 2);
  }

  if (props.conflict.countryCode) {
    const code = String(props.conflict.countryCode).toUpperCase();
    return /^[A-Z]{2}$/.test(code) ? [code] : ['UN'];
  }

  return ['UN'];
});

const flagUrl = (code) => `https://flagcdn.com/w80/${String(code).toLowerCase()}.png`;

const readableStatus = computed(() => {
  const current = (props.conflict.status || 'active').toLowerCase();
  if (current === 'ended' || current === 'resolved' || current === 'finalized' || current === 'finalitzat') return 'Finalitzat';
  if (current === 'frozen' || current === 'paused') return 'Pausat';
  return 'Actiu';
});

const statusClass = computed(() => {
  const current = (props.conflict.status || 'active').toLowerCase();
  if (current === 'ended' || current === 'resolved' || current === 'finalized' || current === 'finalitzat') return 'status-resolved';
  if (current === 'frozen' || current === 'paused') return 'status-paused';
  return 'status-active';
});
</script>

<style scoped>
.conflict-card {
  background: #fff;
  border: 1px solid #d8e2eb;
  border-left: 6px solid var(--accent);
  border-radius: 16px;
  padding: 1rem;
  display: grid;
  gap: 0.8rem;
  min-height: 190px;
}

.card-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.8rem;
  align-items: center;
}

.flags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.flag {
  width: 44px;
  height: 30px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid #d8e2eb;
}

.meta {
  margin: 0;
  color: #697989;
  font-size: 0.85rem;
}

h3 {
  margin: 0.15rem 0 0;
  color: #0f2940;
  line-height: 1.2;
}

.summary {
  margin: 0;
  color: #20374d;
}

.status-pill {
  border-radius: 999px;
  font-size: 0.75rem;
  padding: 0.35rem 0.6rem;
  font-weight: 700;
}

.card-actions {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-link,
.btn-read {
  border-radius: 10px;
  border: 1px solid #c2d0dc;
  padding: 0.45rem 0.7rem;
  background: #f2f7fb;
  color: #0f2940;
  text-decoration: none;
  font-weight: 700;
}

.btn-read:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-delete {
  border: 1px solid #d83a3a;
  background: #fff5f5;
  color: #b42318;
  border-radius: 10px;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
  font-weight: 700;
  transition: opacity 0.2s;
}

.btn-delete:hover {
  opacity: 0.9;
}

.status-active {
  border-left-color: var(--accent);
}

.status-active.status-pill {
  background: #eaf2ff;
  color: #1f5fbf;
}

.status-paused {
  border-left-color: #2d9cdb;
}

.status-paused.status-pill {
  background: #ebf7ff;
  color: #0e5178;
}

.status-resolved {
  border-left-color: #33a26d;
}

.status-resolved.status-pill {
  background: #e8f8ef;
  color: #125438;
}

@media (max-width: 720px) {
  .card-header {
    grid-template-columns: auto 1fr;
  }

  .flags {
    grid-column: 1 / -1;
  }

  .status-pill {
    grid-column: 1 / -1;
    justify-self: start;
  }

  .card-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-link,
  .btn-read,
  .btn-delete {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 420px) {
  .conflict-card {
    padding: 0.9rem;
  }

  h3 {
    font-size: 1rem;
  }

  .flag {
    width: 38px;
    height: 26px;
  }
}
</style>
