// Configuration des tests (Vitest).
// On ne teste que nos fonctions pures : design/ et scripts/.
// Le dossier .claude/ (copié de Lelon, des milliers de fichiers) est exclu.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['design/**/*.test.mjs', 'scripts/**/*.test.mjs'],
    exclude: ['**/node_modules/**', '.claude/**'],
    environment: 'node',
  },
})
