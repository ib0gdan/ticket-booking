import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [vue(), tailwindcss()],
    server: {
      proxy: {
        // '/views': {
        //   target: env.VITE_API_BASE_URL,
        //   changeOrigin: true,
        // },
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
