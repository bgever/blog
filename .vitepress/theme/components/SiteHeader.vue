<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { SITE } from '../../site'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
const { site } = useData()

const current = computed(() => route.path.replace(/index\.html$/, '').replace(/\.html$/, ''))

function isActive(url: string): boolean {
  const path = current.value
  if (url === '/') return path === '/' || path === ''
  return path === url || path.startsWith(url + '/')
}
</script>

<template>
  <header class="border-b border-[var(--c-border)]">
    <div
      class="mx-auto flex max-w-[calc(var(--measure)+3rem)] flex-wrap items-center justify-between gap-4 px-6 py-4"
    >
      <a
        href="/"
        class="text-[1.0625rem] font-bold tracking-tight text-[var(--c-ink)] no-underline"
      >
        {{ site.title }}
      </a>
      <nav class="flex items-center gap-[1.1rem] text-[0.875rem]" aria-label="Main">
        <a
          v-for="item in SITE.nav"
          :key="item.url"
          :href="item.url"
          class="no-underline transition-colors"
          :class="
            isActive(item.url)
              ? 'font-semibold text-[var(--c-accent)]'
              : 'text-[var(--c-muted)] hover:text-[var(--c-ink)]'
          "
          :aria-current="isActive(item.url) ? 'page' : undefined"
        >
          {{ item.label }}
        </a>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>
