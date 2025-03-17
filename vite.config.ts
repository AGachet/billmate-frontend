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
        [`${env.VITE_API_URL}`]: {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
