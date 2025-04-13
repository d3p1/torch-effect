import tailwindcss from '@tailwindcss/vite'

export default {
  root: 'src/',
  base: '/torch-effect/',
  server: {
    host: true,
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [
    tailwindcss(),
  ]
}
