/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    /** Base URL of the API Gateway HTTP API. */
    readonly VITE_API_GATEWAY_URL?: string;
    /** Clerk publishable key (same application as Lambda `CLERK_PUBLISHABLE_KEY`). */
    readonly VITE_CLERK_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
