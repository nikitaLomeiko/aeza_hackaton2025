interface ImportMetaEnv {
  readonly VITE_DOMEN: string
  readonly VITE_API_URL: string
  readonly VITE_YANDEX_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
