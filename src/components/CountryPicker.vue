<template>
  <section class="country-picker">
    <p class="label">Països</p>

    <select class="select" :value="firstCode" @change="onFirstChange($event.target.value)">
      <option value="">País 1</option>
      <optgroup v-for="group in countriesByContinent" :key="group.continent" :label="group.continent">
        <option v-for="country in group.countries" :key="country.code" :value="country.code">
          {{ country.name }} ({{ country.code }})
        </option>
      </optgroup>
    </select>

    <select class="select" :value="secondCode" @change="onSecondChange($event.target.value)">
      <option value="">País 2</option>
      <optgroup v-for="group in countriesByContinent" :key="`second-${group.continent}`" :label="group.continent">
        <option
          v-for="country in group.countries"
          :key="`second-${country.code}`"
          :value="country.code"
          :disabled="country.code === firstCode"
        >
          {{ country.name }} ({{ country.code }})
        </option>
      </optgroup>
    </select>

    <div v-if="selectedCodes.length" class="preview">
      <div class="preview-item" v-for="code in selectedCodes" :key="code">
        <img class="flag" :src="flagUrl(code)" :alt="`Bandera ${code}`" loading="lazy" />
        <span>{{ getCountryName(code) }} ({{ code }})</span>
      </div>
    </div>

    <p class="hint">Selecciona 2 països.</p>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { COUNTRY_GROUPS, getCountryName } from '@/data/countryCodes';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const countriesByContinent = COUNTRY_GROUPS.map((group) => ({
  continent: group.continent,
  countries: group.codes
    .map((code) => ({ code, name: getCountryName(code) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ca')),
}));

const firstCode = ref('');
const secondCode = ref('');

watch(
  () => props.modelValue,
  (value) => {
    const list = Array.isArray(value)
      ? value.map((code) => String(code).toUpperCase()).filter(Boolean)
      : [];

    firstCode.value = list[0] || '';
    secondCode.value = list[1] || '';
  },
  { immediate: true }
);

const selectedCodes = computed(() => {
  const result = [];
  if (firstCode.value) result.push(firstCode.value);
  if (secondCode.value && secondCode.value !== firstCode.value) result.push(secondCode.value);
  return result;
});

const flagUrl = (code) => `https://flagcdn.com/w40/${String(code).toLowerCase()}.png`;

const emitValue = () => {
  emit('update:modelValue', selectedCodes.value);
};

const onFirstChange = (value) => {
  const code = String(value || '').toUpperCase();
  firstCode.value = code;

  if (secondCode.value === code) {
    secondCode.value = '';
  }

  emitValue();
};

const onSecondChange = (value) => {
  const code = String(value || '').toUpperCase();
  secondCode.value = code;
  emitValue();
};
</script>

<style scoped>
.country-picker {
  display: grid;
  gap: 0.45rem;
}

.hint {
  margin: 0;
  color: #5e7286;
  font-size: 0.82rem;
}

.select {
  border: 1px solid #c4d0db;
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  width: 100%;
  background: #fff;
}

.label {
  margin: 0;
  font-weight: 700;
  color: #0c253b;
}

.preview {
  display: grid;
  gap: 0.45rem;
  border: 1px solid #c4d0db;
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  background: #f7fbff;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.flag {
  width: 22px;
  height: 16px;
  border-radius: 3px;
  object-fit: cover;
  border: 1px solid #d8e3ee;
}
</style>