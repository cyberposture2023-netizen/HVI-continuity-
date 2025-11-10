// Vite environment configuration
export default {
    NODE_ENV: import.meta.env.MODE,
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE || 'HVI Continuity Platform'
}
