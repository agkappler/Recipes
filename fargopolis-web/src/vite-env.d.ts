/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    /** Base URL of the API Gateway HTTP API. */
    readonly VITE_API_GATEWAY_URL?: string;
    /** API Key. */
    readonly VITE_API_KEY_SECRET?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
