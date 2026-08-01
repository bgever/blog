import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import './styles/main.css'

/**
 * A theme written from scratch — it deliberately does not extend
 * vitepress/theme, so none of the default docs chrome (sidebar, nav, edit
 * links) is pulled in and there are no default styles to override.
 */
export default {
  Layout,
  NotFound,
} satisfies Theme
