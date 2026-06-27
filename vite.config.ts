import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Allow connections from outside the container (bind to 0.0.0.0)
    host: true,
    watch: {
      // Polling is needed when the source is a bind mount from the host,
      // because inotify inside the container can't always see host edits.
      usePolling: process.env.VITE_HMR_POLLING === 'true',
    },
    hmr: {
      // The browser loads the page from the host port (e.g. 8081), so the
      // HMR websocket client must connect there, not the in-container 5173.
      clientPort: Number(process.env.VITE_CLIENT_PORT || '5173'),
    },
  },
})
