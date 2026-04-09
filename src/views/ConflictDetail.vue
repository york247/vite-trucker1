<script setup>
import { useRoute, useRouter } from 'vue-router';
import HeaderComponent from '../components/Headercomponent.vue';
import AppShell from '@/components/AppShell.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { useConflictStore } from '../stores/Conflicts';
import CountryPicker from '@/components/CountryPicker.vue';

const route = useRoute();
const router = useRouter();
const conflict = ref(null);
const isEditing = ref(false);
const statusOptions = [
    { label: 'Actiu', value: 'ACTIVE' },
    { label: 'Pausat', value: 'FROZEN' },
    { label: 'Finalitzat', value: 'ENDED' },
];

const conflictStore = useConflictStore();

const editForm = reactive({
    name: '',
    startDate: '',
    status: 'ACTIVE',
    description: '',
    countryCodes: [],
});

const canSaveEdit = computed(() => editForm.countryCodes.length === 2);

const statusLabel = computed(() => {
    const current = (conflict.value?.status || '').toLowerCase();
    if (current === 'ended' || current === 'resolved') return 'Finalitzat';
    if (current === 'frozen' || current === 'paused') return 'Pausat';
    return 'Actiu';
});

const updatedAtLabel = computed(() => {
    if (!conflict.value?.updatedAt) return 'Sense data';
    return new Date(conflict.value.updatedAt).toLocaleString('ca-ES');
});

const countryCodes = computed(() => {
    if (Array.isArray(conflict.value?.countryCodes) && conflict.value.countryCodes.length) {
        return conflict.value.countryCodes
            .map((code) => String(code).toUpperCase())
            .filter((code) => /^[A-Z]{2}$/.test(code));
    }

    if (conflict.value?.countryCode) {
        return [String(conflict.value.countryCode).toUpperCase()];
    }

    return ['UN'];
});

const flagUrl = (code) => `https://flagcdn.com/w80/${String(code).toLowerCase()}.png`;


const startEditing = () => {
    editForm.name = conflict.value.name || conflict.value.title;
    editForm.startDate = String(conflict.value.startDate || '').slice(0, 10);
    editForm.status = String(conflict.value.status || 'ACTIVE').toUpperCase();
    editForm.description = conflict.value.description || '';
    editForm.countryCodes = [...countryCodes.value];
    isEditing.value = true;
};

const submitEdit = async () => {
    const updated = await conflictStore.updateConflict(conflict.value.id, editForm);
    if (updated) {
        conflict.value = updated;
        isEditing.value = false;
    }
};

const cancelEdit = () => {
    isEditing.value = false;
};

const handleDelete = async () => {
    if (!confirm('Estàs segur de que vols eliminar aquest conflicte?')) {
        return;
    }

    const success = await conflictStore.deleteConflict(conflict.value.id);
    if (success) {
        router.push('/conflicts');
    }
};

onMounted(async () => {
    const id = route.params.id;
    const cached = conflictStore.conflicts.find(c => String(c.id) === String(id));
    conflict.value = cached || await conflictStore.getConflictById(id);
});
</script>

<template>
    <HeaderComponent />

    <AppShell title="Detall del conflicte">
        <div v-if="conflict" class="detail-conflict">
            <div class="hero">
                <div class="hero-flags">
                    <img
                        v-for="code in countryCodes"
                        :key="code"
                        class="flag"
                        :src="flagUrl(code)"
                        :alt="`Bandera ${code}`"
                        loading="lazy"
                    />
                </div>
                <h1>{{ conflict.title || conflict.name || conflict.firstName }}</h1>
                <p class="hero-status">Estat: <strong>{{ statusLabel }}</strong></p>
            </div>

            <div v-if="!isEditing" class="view-mode">
                <p class="description">{{ conflict.description || 'Sense descripcio disponible.' }}</p>

                <div class="meta-grid">
                    <p><strong>Darrera actualitzacio:</strong> {{ updatedAtLabel }}</p>
                    <p><strong>Data inici:</strong> {{ conflict.startDate || 'Sense data' }}</p>
                    <div class="flags-box">
                        <strong>Països:</strong>
                        <div class="flags-row">
                            <img
                                v-for="code in countryCodes"
                                :key="`meta-${code}`"
                                class="flag"
                                :src="flagUrl(code)"
                                :alt="`Bandera ${code}`"
                                loading="lazy"
                            />
                        </div>
                    </div>
                    <p><strong>Marcat com llegit:</strong> {{ conflict.isRead ? 'Si' : 'No' }}</p>
                    <p v-if="conflict.email"><strong>Contacte:</strong> {{ conflict.email }}</p>
                </div>

                <section v-if="conflict.incidencies?.length">
                    <h3>Incidencies relacionades</h3>
                    <ul>
                        <li v-for="inc in conflict.incidencies" :key="inc.id">
                            {{ inc.titol }} - {{ inc.estat }}
                        </li>
                    </ul>
                </section>

                <div class="actions">
                    <button class="btn-edit" @click="startEditing">Editar</button>
                    <button class="btn-delete" @click="handleDelete">Eliminar</button>
                </div>
            </div>

            <form v-else class="edit-form" @submit.prevent="submitEdit">
                <h3>Editar conflicte</h3>
                <div class="form-group">
                    <label>Nom</label>
                    <input v-model="editForm.name" class="input" type="text" required />
                </div>
                <div class="form-group">
                    <label>Data inici</label>
                    <input v-model="editForm.startDate" class="input" type="date" required />
                </div>
                <div class="form-group">
                    <label>Estat</label>
                    <select v-model="editForm.status" class="input" required>
                        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Descripcio</label>
                    <textarea v-model="editForm.description" class="input" rows="4"></textarea>
                </div>
                <CountryPicker v-model="editForm.countryCodes" />
                <div class="form-actions">
                    <button type="submit" class="btn-save" :disabled="!canSaveEdit">Guardar</button>
                    <button type="button" class="btn-cancel" @click="cancelEdit">Cancelar</button>
                </div>
            </form>
        </div>

        <p v-else-if="conflictStore.loading">Carregant detall...</p>
        <p v-else>No s'ha trobat el conflicte.</p>
    </AppShell>
</template>

<style scoped>
.detail-conflict {
    display: grid;
    gap: 1rem;
}

.hero {
    background: linear-gradient(125deg, #f2f9ff, #fff3ea);
    border: 1px solid #d8e3ee;
    border-radius: 16px;
    padding: 1rem;
}

.hero-meta {
    margin: 0;
    color: #4d6174;
}

.hero-flags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0.5rem 0 0.15rem;
}

.flag {
    width: 36px;
    height: 24px;
    border-radius: 4px;
    object-fit: cover;
    border: 1px solid #d8e3ee;
}

h1 {
    margin: 0.25rem 0;
    color: #0c253b;
}

.hero-status {
    margin: 0;
}

.view-mode {
    display: grid;
    gap: 1rem;
}

.description {
    margin: 0;
    line-height: 1.6;
}

.meta-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.7rem;
}

.meta-grid p {
    margin: 0;
    border: 1px solid #d8e3ee;
    border-radius: 12px;
    padding: 0.7rem;
    background: #fff;
}

.flags-box {
    margin: 0;
    border: 1px solid #d8e3ee;
    border-radius: 12px;
    padding: 0.7rem;
    background: #fff;
    display: grid;
    gap: 0.5rem;
}

.flags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.flags-row .flag {
    width: 34px;
    height: 22px;
}

.actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.btn-edit,
.btn-delete {
    border: none;
    border-radius: 10px;
    padding: 0.6rem 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-edit {
    background: #2d9cdb;
    color: #fff;
}

.btn-edit:hover {
    opacity: 0.9;
}

.btn-delete {
    background: #e74c3c;
    color: #fff;
}

.btn-delete:hover {
    opacity: 0.9;
}

.edit-form {
    background: #f7fbff;
    border: 1px solid #d9e4ef;
    border-radius: 14px;
    padding: 1rem;
    display: grid;
    gap: 1rem;
}

.edit-form h3 {
    margin: 0;
}

.form-group {
    display: grid;
    gap: 0.3rem;
}

.form-group label {
    font-weight: 700;
    color: #0c253b;
}

.input {
    border: 1px solid #c4d0db;
    border-radius: 10px;
    padding: 0.7rem;
    font-family: inherit;
    width: 100%;
    min-width: 0;
}

.form-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.btn-save,
.btn-cancel {
    border: none;
    border-radius: 10px;
    padding: 0.6rem 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-save {
    background: #33a26d;
    color: #fff;
}

.btn-save:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.btn-save:hover {
    opacity: 0.9;
}

.btn-cancel {
    background: #c2d0dc;
    color: #0c253b;
}

.btn-cancel:hover {
    opacity: 0.9;
}

@media (max-width: 860px) {
    .meta-grid {
        grid-template-columns: 1fr;
    }

    .actions,
    .form-actions {
        flex-direction: column;
    }

    .btn-edit,
    .btn-delete,
    .btn-save,
    .btn-cancel {
        width: 100%;
    }
}

@media (max-width: 520px) {
    .hero,
    .edit-form {
        padding: 0.9rem;
    }

    .flag {
        width: 32px;
        height: 21px;
    }

    .hero-meta,
    .hero-status,
    .description,
    .meta-grid p,
    .hint {
        font-size: 0.95rem;
    }
}
</style>