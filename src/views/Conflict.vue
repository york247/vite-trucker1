<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import HeaderComponent from '@/components/Headercomponent.vue';
import AppShell from '@/components/AppShell.vue';
import ConflictCard from '@/components/ConflictCard.vue';
import ConflictFilters from '@/components/ConflictFilters.vue';
import CountryPicker from '@/components/CountryPicker.vue';
import { useConflictStore } from '../stores/Conflicts';
import { getCountryName } from '@/data/countryCodes';

const conflictStore = useConflictStore();
const statusOptions = [
    { label: 'Actiu', value: 'ACTIVE' },
    { label: 'Pausat', value: 'FROZEN' },
    { label: 'Finalitzat', value: 'ENDED' },
];

const newConflict = reactive({
    name: '',
    startDate: '',
    status: 'ACTIVE',
    description: '',
    countryCodes: [],
});

const query = ref('');
const statusFilter = ref('all');

const canSubmitConflict = computed(() => newConflict.countryCodes.length === 2);

const filteredConflicts = computed(() => {
    const search = query.value.trim().toLowerCase();
    const status = statusFilter.value.toLowerCase();

    return conflictStore.conflicts.filter((conflict) => {
        const conflictStatus = String(conflict.status || '').toLowerCase();
        if (status !== 'all' && conflictStatus !== status) {
            return false;
        }

        if (!search) {
            return true;
        }

        const haystack = [
            conflict.title,
            conflict.name,
            conflict.description,
            conflict.countryCode,
            ...(Array.isArray(conflict.countryCodes) ? conflict.countryCodes : []),
            ...(Array.isArray(conflict.countryCodes) ? conflict.countryCodes.map((code) => getCountryName(code)) : []),
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return haystack.includes(search);
    });
});

const submitConflict = async () => {
    const created = await conflictStore.addConflict(newConflict);
    if (!created) return;

    newConflict.name = '';
    newConflict.startDate = '';
    newConflict.status = 'ACTIVE';
    newConflict.description = '';
    newConflict.countryCodes = [];
};

onMounted(async () => {
    if (!conflictStore.conflicts.length) {
        await conflictStore.getConflicts();
    }
});
</script>

<template>
    <main class="conflicts-page">
        <div class="backdrop" aria-hidden="true"></div>
        <HeaderComponent />

        <AppShell title="Conflictes globals">
            <form class="new-form" @submit.prevent="submitConflict">
                <h3>Nou conflicte</h3>
                <div class="grid-form">
                    <input v-model="newConflict.name" class="input" type="text" required placeholder="Nom del conflicte" />
                    <input
                        v-model="newConflict.startDate"
                        class="input"
                        type="date"
                        required
                    />
                    <select v-model="newConflict.status" class="input" required>
                        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                    <input v-model="newConflict.description" class="input" type="text" placeholder="Descripcio" />
                </div>
                <CountryPicker v-model="newConflict.countryCodes" />
                <button class="btn-primary" type="submit" :disabled="!canSubmitConflict">Crear conflicte</button>
            </form>

            <section class="filters-card" aria-label="Filtrar conflictes">
                <ConflictFilters v-model:query="query" v-model:status="statusFilter" />
            </section>

            <h3 v-if="conflictStore.loading">Carregant...</h3>
            <div v-else-if="conflictStore.error" class="error-box">
                <h3>No s'han pogut carregar les dades</h3>
                <p>{{ conflictStore.errorMessage }}</p>
            </div>
            <p v-else-if="!filteredConflicts.length" class="empty">No hi ha conflictes que coincideixin amb el filtre.</p>

            <ul v-else class="conflict-list">
                <li v-for="conflict in filteredConflicts" :key="conflict.id">
                    <ConflictCard 
                        :conflict="conflict"
                        @delete="conflictStore.deleteConflict"
                        @mark-read="conflictStore.markAsRead"
                    />
                </li>
            </ul>
        </AppShell>
    </main>
</template>

<style scoped>
.conflicts-page {
    position: relative;
    min-height: calc(100vh - 1.5rem);
    padding: 0 0 1rem;
    isolation: isolate;
}

.backdrop {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
        radial-gradient(circle at 20% 18%, rgba(46, 129, 238, 0.18) 0 10%, transparent 23%),
        radial-gradient(circle at 85% 12%, rgba(16, 42, 67, 0.22) 0 12%, transparent 26%),
        radial-gradient(circle at 72% 80%, rgba(31, 95, 191, 0.14) 0 12%, transparent 28%),
        linear-gradient(135deg, rgba(7, 18, 31, 0.05), rgba(7, 18, 31, 0.02)),
        linear-gradient(140deg, var(--bg-1), var(--bg-2));
}

.backdrop::before,
.backdrop::after {
    content: '';
    position: absolute;
    inset: 0;
}

.backdrop::before {
    background-image:
        linear-gradient(rgba(16, 42, 67, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16, 42, 67, 0.08) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: radial-gradient(circle at center, black 45%, transparent 92%);
    opacity: 0.42;
}

.backdrop::after {
    background:
        linear-gradient(118deg, transparent 0 46%, rgba(255, 255, 255, 0.08) 46% 48%, transparent 48% 100%),
        linear-gradient(302deg, transparent 0 60%, rgba(46, 129, 238, 0.08) 60% 63%, transparent 63% 100%);
    mix-blend-mode: multiply;
    opacity: 0.72;
}

.new-form {
    background: #f7fbff;
    border: 1px solid #d9e4ef;
    border-radius: 14px;
    padding: 0.9rem;
    display: grid;
    gap: 0.7rem;
}

.filters-card {
    background: #fff;
    border: 1px solid #d9e4ef;
    border-radius: 14px;
    padding: 0.9rem;
}

.new-form h3 {
    margin: 0;
}

.grid-form {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.6rem;
}

.input {
    border: 1px solid #c4d0db;
    border-radius: 10px;
    padding: 0.7rem;
    width: 100%;
    min-width: 0;
}

.btn-primary {
    width: fit-content;
    border: none;
    border-radius: 10px;
    padding: 0.6rem 0.85rem;
    background: #1ccf0b;
    color: #fff;
    font-weight: 700;
}

.btn-primary:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.conflict-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
}

.error-box {
    border: 1px solid #f0b7b7;
    background: #fff5f5;
    color: #8d2424;
    border-radius: 12px;
    padding: 0.8rem;
}

.error-box h3,
.error-box p {
    margin: 0;
}

.empty {
    margin: 0;
    border: 1px dashed #b8c4ce;
    border-radius: 10px;
    padding: 0.75rem;
    color: #5e7286;
}

@media (max-width: 860px) {
    .conflicts-page {
        min-height: calc(100vh - 1rem);
    }

    .new-form {
        padding: 0.8rem;
    }

    .filters-card {
        padding: 0.8rem;
    }

    .grid-form {
        grid-template-columns: 1fr;
    }

    .btn-primary {
        width: 100%;
    }

    .conflict-list {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 520px) {
    .new-form h3 {
        font-size: 1.05rem;
    }

    .input {
        padding: 0.68rem;
        font-size: 0.95rem;
    }

    .backdrop::before {
        background-size: 54px 54px;
        opacity: 0.3;
    }
}
</style>