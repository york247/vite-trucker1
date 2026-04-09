export const COUNTRY_GROUPS = [
  {
    continent: "Europa",
    codes: ["ES", "FR", "IT", "DE", "UK"],
  },
  {
    continent: "Asia",
    codes: ["SA", "PH", "CN", "JP", "IN"],
  },
  {
    continent: "Amèrica",
    codes: ["US", "DO", "BR"],
  },
  {
    continent: "Oceania",
    codes: ["AU"],
  },
];

const COUNTRY_NAME_OVERRIDES = {
  UK: "Reino Unido",
};

export const COUNTRY_CODES = COUNTRY_GROUPS.flatMap((group) => group.codes);

export const getCountryName = (code) => {
  const normalizedCode = String(code || "").toUpperCase();

  if (COUNTRY_NAME_OVERRIDES[normalizedCode]) {
    return COUNTRY_NAME_OVERRIDES[normalizedCode];
  }

  try {
    const displayNames = new Intl.DisplayNames(["ca", "es", "en"], { type: "region" });
    return displayNames.of(normalizedCode) || normalizedCode;
  } catch {
    return normalizedCode;
  }
};