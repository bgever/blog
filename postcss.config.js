/**
 * Tailwind is wired through PostCSS rather than @tailwindcss/vite on purpose:
 * VitePress v1 bundles Vite 5, while the current Tailwind Vite plugin types
 * against Vite 7, and the two Plugin types are structurally incompatible.
 * PostCSS sidesteps the mismatch entirely and costs nothing at build time.
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
