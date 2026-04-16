import { defineStore } from "pinia";
import { ref } from "vue";

export const useConflictStore = defineStore("conflict", () => {
const API_BASE = import.meta.env.VITE_API_URL || "";
const API_URL = API_BASE ? `${API_BASE}/api/v1/conflicts` : "/api/v1/conflicts";
const COUNTRY_CODE_TO_ID = {
    ES: 1,
    DO: 2,
    US: 3,
    FR: 4,
    SA: 5,
    AU: 6,
    PH: 7,
    CN: 8,
    JP: 9,
    BR: 10,
    IN: 11,
    IT: 12,
    DE: 13,
    UK: 14,
  };
  const COUNTRY_ID_TO_CODE = Object.fromEntries(
    Object.entries(COUNTRY_CODE_TO_ID).map(([code, id]) => [Number(id), code])
  );

  const conflicts = ref([]);
  const loading = ref(false);
  const errorMessage = ref("");

  const error = ref(false);

  const clearError = () => {
    error.value = false;
    errorMessage.value = "";
  };

  const setError = (message) => {
    error.value = true;
    errorMessage.value = message;
  };

  const normalizeConflict = (item) => {
    const countryIds = Array.isArray(item?.countryIds)
      ? item.countryIds.map((id) => Number(id)).filter((id) => Number.isFinite(id))
      : [];

    const countryCodesFromItem = Array.isArray(item?.countryCodes)
      ? item.countryCodes.map((code) => String(code).toUpperCase()).filter(Boolean)
      : [];

    const countryCodesFromIds = countryIds
      .map((id) => COUNTRY_ID_TO_CODE[id])
      .filter(Boolean);

    const countryCodes = countryCodesFromItem.length ? countryCodesFromItem : countryCodesFromIds;
    const normalizedCountryCodes = countryCodes.map((code) => (String(code).toUpperCase() === "RD" ? "DO" : String(code).toUpperCase()));

    const countryIdsFromCodes = normalizedCountryCodes
      .map((code) => COUNTRY_CODE_TO_ID[code])
      .filter((id) => Number.isFinite(Number(id)));

    return {
      ...item,
      id: item?.id,
      name: item?.name || "Conflicte sense nom",
      title: item?.name || "Conflicte sense nom",
      description: item?.description || "",
      startDate: item?.startDate || "",
      status: String(item?.status || "ACTIVE").toLowerCase(),
      countryIds: countryIds.length ? countryIds : countryIdsFromCodes,
      countryCodes: normalizedCountryCodes,
      countryCode: normalizedCountryCodes[0] || countryCodesFromIds[0] || "UN",
      isRead: Boolean(item?.isRead),
      updatedAt: item?.updatedAt || "",
    };
  };

  const parseCountryIds = (value) => {
    if (Array.isArray(value)) {
      return value.map((id) => Number(id)).filter((id) => Number.isFinite(id));
    }

    return String(value || "")
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((id) => Number.isFinite(id));
  };

  const getCodeToIdMap = () => {
    const map = { ...COUNTRY_CODE_TO_ID };

    for (const conflict of conflicts.value) {
      if (!Array.isArray(conflict.countryCodes) || !Array.isArray(conflict.countryIds)) {
        continue;
      }

      for (let i = 0; i < conflict.countryCodes.length; i += 1) {
        const code = String(conflict.countryCodes[i] || "").toUpperCase();
        const id = Number(conflict.countryIds[i]);
        if (code && Number.isFinite(id)) {
          map[code] = id;
        }
      }
    }

    return map;
  };

  const countryCodesToIds = (codes) => {
    const codeToId = getCodeToIdMap();
    return (codes || [])
      .map((code) => String(code).toUpperCase())
      .map((code) => (code === "RD" ? "DO" : code))
      .map((code) => codeToId[code])
      .filter((id) => Number.isFinite(Number(id)));
  };

  const toRequestBody = (data) => {
    const selectedCodes = Array.isArray(data?.countryCodes) ? data.countryCodes : [];
    const idsFromCodes = countryCodesToIds(selectedCodes);
    const idsFromText = parseCountryIds(data?.countryIds ?? data?.countryIdsText);

    return {
      name: String(data?.name || "").trim(),
      startDate: String(data?.startDate || "").slice(0, 10),
      status: String(data?.status || "ACTIVE").toUpperCase(),
      description: String(data?.description || "").trim(),
      countryIds: idsFromCodes.length ? idsFromCodes : idsFromText,
      countryCodes: selectedCodes.map((code) => String(code).toUpperCase()).map((code) => (code === "RD" ? "DO" : code)),
    };
  };

  const getConflicts = async () => {
    loading.value = true;
    clearError();

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`No s'han pogut carregar els conflictes (${response.status}).`);
      }

      const list = await response.json();
      conflicts.value = list.map(normalizeConflict);
    } catch (e) {
      setError(e?.message || "Error desconegut llegint conflictes.");
    } finally {
      loading.value = false;
    }
  };

  const getConflictById = async (id) => {
    loading.value = true;
    clearError();

    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`No s'ha pogut carregar el conflicte ${id} (${response.status}).`);
      }

      return normalizeConflict(await response.json());
    } catch (e) {
      setError(e?.message || `Error desconegut llegint el conflicte ${id}.`);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const addConflict = async (newConflict) => {
    loading.value = true;
    clearError();

    try {
      const requestBody = toRequestBody(newConflict);
      const selectedCount = (requestBody.countryCodes || []).length;

      if (selectedCount !== 2) {
        throw new Error("Has de seleccionar exactament 2 països.");
      }

      if (!requestBody.name || !requestBody.startDate || !requestBody.countryIds.length) {
        throw new Error("Has d'omplir nom, data i seleccionar països que existeixin al backend.");
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`No s'ha pogut crear (${response.status}). ${detail}`);
      }

      const created = normalizeConflict(await response.json());
      conflicts.value = [created, ...conflicts.value];
      return created;
    } catch (e) {
      setError(e?.message || "Error desconegut afegint conflicte.");
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateConflict = async (id, updatedData) => {
    loading.value = true;
    clearError();

    try {
      const requestBody = toRequestBody(updatedData);
      const selectedCount = (requestBody.countryCodes || []).length;

      if (selectedCount !== 2) {
        throw new Error("Has de seleccionar exactament 2 països.");
      }

      if (!requestBody.name || !requestBody.startDate || !requestBody.countryIds.length) {
        throw new Error("Has d'omplir nom, data i seleccionar països que existeixin al backend.");
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`No s'ha pogut actualitzar (${response.status}). ${detail}`);
      }

      const updated = normalizeConflict(await response.json());
      conflicts.value = conflicts.value.map((c) =>
        String(c.id) === String(id) ? updated : c
      );
      return updated;
    } catch (e) {
      setError(e?.message || `Error desconegut actualitzant el conflicte ${id}.`);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteConflict = async (id) => {
    loading.value = true;
    clearError();

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`No s'ha pogut eliminar (${response.status}). ${detail}`);
      }

      conflicts.value = conflicts.value.filter((c) => String(c.id) !== String(id));
      return true;
    } catch (e) {
      setError(e?.message || `Error desconegut eliminant el conflicte ${id}.`);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = (id) => {
    conflicts.value = conflicts.value.map((conflict) => {
      if (String(conflict.id) !== String(id)) {
        return conflict;
      }

      return {
        ...conflict,
        isRead: true,
      };
    });
  };

  return {
    conflicts,
    loading,
    error,
    errorMessage,
    getConflicts,
    getConflictById,
    addConflict,
    updateConflict,
    deleteConflict,
    markAsRead,
  };
});