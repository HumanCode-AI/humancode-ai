/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TELEGRAM_WEBAPP_LINK: `${string}://${string}`
  readonly VITE_BLOCK_EXPLORER: `${string}://${string}`
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}