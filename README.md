# The Global Conflict Monitor

Aplicacio front-end amb Vue 3 + Pinia + Vue Router per consumir una API de conflictes.

## Requisits implementats

- `v-model`: formulari de creacio i filtres en temps real.
- `v-bind`: classes d'estat i imatge de bandera dinamica.
- `v-for` i `v-if`: render de llistes i estats (carrega, error, buit).
- `props` i `emits`: `ConflictCard` rep dades i emet `mark-read`.
- `computed`: filtres i comptadors en viu.
- rutes dinamiques: `/conflicts/:id`.
- Pinia com a estat global.
- slots: `AppShell` amb `slot` principal i `slot` d'accions.

## Connexio amb backend IntelliJ

L'app detecta automàticament l'endpoint correcte (suporta Spring Boot com el teu).

1. Copia `.env.example` a `.env` (opcional, ja té defaults).
2. Si vols ser explícit, especifica la URL:

```env
# Opció 1: proxy de Vite (detecta automàticament)
VITE_BACKEND_URL=http://localhost:8080
VITE_API_BASE_PATH=/api
```

O bé, endpoint directe:

```env
# Opció 2: URL completa
VITE_API_URL=http://localhost:8080/api/v1/conflicts
```

3. Inicia el backend a IntelliJ.
4. Inicia el front:

```bash
npm install
npm run dev
```

L'app provará automàticament aquestes rutes (en ordre):
- `/api/v1/conflicts` (Spring Boot v1)
- `/api/conflict` (REST simple)
- `/api/conflicts` (REST plural)

Usa la primera que respongui amb 200 OK.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```
