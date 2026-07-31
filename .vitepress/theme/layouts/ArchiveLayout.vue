<script setup lang="ts">
import { computed } from 'vue'
import { Content, useData } from 'vitepress'
import { data as posts } from '../../posts.data'
import { formatDate } from '../../lib/posts'

const { frontmatter } = useData()

/** Newest year first; posts inside a year keep the global newest-first order. */
const years = computed(() => {
  const grouped = new Map<string, typeof posts>()
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    const bucket = grouped.get(year)
    if (bucket) bucket.push(post)
    else grouped.set(year, [post])
  }
  return [...grouped.entries()].sort((a, b) => b[0].localeCompare(a[0]))
})
</script>

<template>
  <div class="mx-auto w-full max-w-[calc(var(--measure)+3rem)] px-6 py-[1.9rem]">
    <h1 class="font-sans text-[2rem] leading-[1.15] font-bold tracking-[-0.024em]">
      {{ frontmatter.title }}
    </h1>
    <div class="prose mt-6">
      <Content />
    </div>

    <p v-if="!posts.length" class="mt-8 text-[var(--c-muted)]">Nothing published yet.</p>

    <section v-for="[year, items] in years" :key="year" class="mt-10">
      <h2
        class="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--c-muted)] uppercase tabular-nums"
      >
        {{ year }}
      </h2>
      <ul class="mt-3 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
        <li v-for="post in items" :key="post.url">
          <a
            :href="post.url"
            class="flex flex-col gap-1 py-3 no-underline sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <span class="text-[1.0625rem] font-semibold text-[var(--c-ink)]">{{ post.title }}</span>
            <time
              :datetime="post.date"
              class="flex-none text-[0.8125rem] text-[var(--c-muted)] tabular-nums"
            >
              {{ formatDate(post.date) }}
            </time>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
