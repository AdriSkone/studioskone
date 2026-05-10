/// <reference types="vite/client" />

// Variables exposées au front (publiques par design — Umami tracking script)
// Tout secret doit passer par les Vercel Functions (api/) et ne JAMAIS porter le préfixe VITE_.
interface ImportMetaEnv {
  readonly VITE_UMAMI_SCRIPT_URL:  string
  readonly VITE_UMAMI_WEBSITE_ID:  string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
