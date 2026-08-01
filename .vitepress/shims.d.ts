/**
 * The theme entry does `import './styles/main.css'` purely for its side effect.
 * TypeScript 6 reports TS2882 for side-effect imports with no declaration, so
 * declare the module shape explicitly rather than widening `types`.
 */
declare module '*.css' {}
