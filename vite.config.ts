/**
 * Resources
 */
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

/**
 * Configuration
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BASE_API_URL,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
