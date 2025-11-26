# Template Origin

This site's design is based on the **Spotlight** template from [Tailwind Plus](https://tailwindcss.com/plus).

## Source

- **Template**: Spotlight (Personal website template)
- **Original Implementation**: Next.js / React (available on `next` branch)
- **Current Implementation**: SvelteKit 2 / Svelte 5 (`sveltekit` branch)
- **License**: See [LICENSE.md](LICENSE.md) for Tailwind Plus license terms

## Conversion Summary

The template was converted from React/Next.js to Svelte 5 with the following approach:

### Components Created (`$lib/ui/`)

| Component | Description |
|-----------|-------------|
| Container | Three-tier container system for consistent page widths |
| Button | Polymorphic button/link with primary/secondary variants |
| Card | Article card with Title, Description, Eyebrow, Cta subcomponents |
| Avatar | Profile image with hover animation |
| Prose | Typography wrapper for markdown content |
| ThemeToggle | Dark/light mode switcher |
| Layout | Root layout with fixed background panel effect |
| SimpleLayout | Standard page layout with title/intro |
| ArticleLayout | Blog post wrapper with back navigation |
| HeaderNew | Sticky header with scroll-based animations |
| FooterNew | Site footer with navigation |
| MobileNav | Mobile hamburger menu with slide-in panel |
| Social Icons | X, Instagram, GitHub, LinkedIn SVG icons |

### Pages

- **Home** (`/`) - Hero, photo carousel, articles, newsletter signup, resume
- **About** (`/about`) - Bio with portrait
- **Projects** (`/projects`) - Project showcase
- **Speaking** (`/speaking`) - Speaking engagements
- **Uses** (`/uses`) - Tools and equipment
- **Contact** (`/contact`) - Contact form (Netlify Forms)
- **Blog** (`/blog`) - Article listing
- **Blog Posts** (`/blog/[year]/[slug]`) - Individual articles

### Technical Decisions

| Aspect | Decision |
|--------|----------|
| **Framework** | SvelteKit 2 with Svelte 5 runes |
| **Styling** | Tailwind CSS v4 with `@tailwindcss/typography` plugin |
| **Dark Mode** | Class-based with Svelte store + localStorage persistence |
| **URL Structure** | Preserved existing `/blog/[year]/[slug]` format |
| **State Management** | Svelte 5 runes (`$state`, `$derived`, `$effect`) |
| **Class Utilities** | `clsx` package for conditional classes |

### React to Svelte Patterns

| React | Svelte 5 |
|-------|----------|
| `useState` | `$state()` |
| `useEffect` | `$effect()` |
| `useRef` | `bind:this` |
| `useContext` | Svelte stores |
| `usePathname()` | `$page.url.pathname` |
| Headless UI | Custom Svelte transitions |

### Assets

Images copied from the template:
- `avatar.jpg` - Profile avatar
- `portrait.jpg` - About page portrait
- `photos/image-1.jpg` through `image-5.jpg` - Photo carousel
- `logos/*.svg` - Company logos for resume section

## Dependencies Added

- `clsx` - Conditional class name utility
- `@tailwindcss/typography` - Prose styling plugin

## Post-migration Fixes

- Replaced curly apostrophes with straight quotes in `uses/+page.svelte`
- Fixed `@screen lg` syntax to `@media (min-width: 1024px)` in typography config
- Background stretch - Changed `min-h-full` to `min-h-screen` in `+layout.svelte`
- Back button - Replaced `<button onclick={goBack}>` with `<a href="/blog">` in `ArticleLayout.svelte`
- Dark mode toggle - Moved DOM update logic from `$effect` into a direct `applyTheme()` function called
  in toggle/setter in `theme.svelte.ts`
- Mobile menu click-through - Original used Headless UI `Popover` which handles
  focus trapping and click-outside. Fixed by wrapping backdrop and panel in a
  `fixed inset-0 z-50 pointer-events-auto` container in `MobileNav.svelte`
