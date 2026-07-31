<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { SITE } from '../../site'

/**
 * Sticky table of contents shown in the right-hand track on wide viewports.
 *
 * The parent grid keeps a matching empty track on the left, so the prose column
 * stays centred whether or not this renders. Below the breakpoint the whole
 * thing is display:none — there is no inline fallback by design.
 */
const { page } = useData()

interface Entry {
  link: string
  title: string
  level: number
}

const entries = computed<Entry[]>(() =>
  (page.value.headers ?? [])
    .flatMap((h) => [h, ...(h.children ?? [])])
    .map((h) => ({ link: h.link, title: h.title, level: h.level })),
)

const enoughHeadings = computed(() => entries.value.length >= SITE.tocMinHeadings)
const activeId = ref('')
let observer: IntersectionObserver | undefined

function observe() {
  observer?.disconnect()
  if (!enoughHeadings.value || typeof IntersectionObserver === 'undefined') return

  const targets = entries.value
    .map((e) => document.querySelector(e.link))
    .filter((el): el is Element => el !== null)
  if (!targets.length) return

  // Bias the viewport to its upper third so the highlighted entry matches the
  // heading a reader is actually looking at, not one scrolling off the bottom.
  observer = new IntersectionObserver(
    (records) => {
      const visible = records
        .filter((r) => r.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]?.target.id) activeId.value = visible[0].target.id
    },
    { rootMargin: '-80px 0px -66% 0px', threshold: 0 },
  )
  targets.forEach((t) => observer?.observe(t))
}

onMounted(observe)
onUnmounted(() => observer?.disconnect())
watch(
  () => page.value.relativePath,
  () => requestAnimationFrame(observe),
)
</script>

<template>
  <aside
    v-if="enoughHeadings"
    class="toc sticky top-8 hidden self-start"
    aria-labelledby="toc-heading"
  >
    <p
      id="toc-heading"
      class="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--c-muted)] uppercase"
    >
      On this page
    </p>
    <ul class="mt-3 space-y-[0.3rem] text-[0.8125rem] leading-[1.45]">
      <li v-for="entry in entries" :key="entry.link" :class="entry.level > 2 ? 'pl-3' : ''">
        <a
          :href="entry.link"
          class="block no-underline transition-colors"
          :class="
            activeId && entry.link === `#${activeId}`
              ? 'font-semibold text-[var(--c-accent)]'
              : 'text-[var(--c-muted)] hover:text-[var(--c-ink)]'
          "
          :aria-current="activeId && entry.link === `#${activeId}` ? 'location' : undefined"
        >
          {{ entry.title }}
        </a>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
@media (min-width: 1200px) {
  .toc {
    display: block;
  }
}
</style>
