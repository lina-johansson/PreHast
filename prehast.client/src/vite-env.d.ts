/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string; // Custom app title
    readonly VITE_API_KEY: string; // API key
    readonly VITE_DEBUG_MODE: boolean; // Debug mode (true/false)
    readonly VITE_FEATURE_FLAG: 'enabled' | 'disabled'; // Feature flag (enum)
    readonly VITE_SERVER_URL: URL; // Server URL (parsed as URL)
    readonly VITE_DEFAULT_TIMEOUT: number; // Default timeout (milliseconds)
    readonly VITE_COLORS: Record<string, string>; // Color mapping (key-value pairs)
    readonly VITE_VERSION: `${number}.${number}.${number}`; // Semantic version (template literal)
}