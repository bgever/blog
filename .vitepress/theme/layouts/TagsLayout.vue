<script setup lang="ts">
import { computed } from 'vue'
import { Content, useData } from 'vitepress'
import { data as posts } from '../../posts.data'
import { tagSlug } from '../../lib/posts'

const { frontmatter } = useData()

/** Most-used first, then alphabetical, so the list has a stable order. */
const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count, slug: tagSlug(name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
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

    <p v-if="!tags.length" class="mt-8 text-[var(--c-muted)]">No tags yet.</p>

    <ul v-else class="mt-8 flex flex-wrap gap-2">
      <li v-for="tag in tags" :key="tag.slug">
        <a
          :href="`/tags/${tag.slug}`"
          class="flex items-baseline gap-2 rounded-[0.4rem] border border-[var(--c-border)] bg-[var(--c-surface)] px-3 py-2 no-underline hover:border-[var(--c-accent)]"
        >
          <span class="text-[0.9375rem] font-semibold text-[var(--c-accent)]">{{ tag.name }}</span>
          <span class="text-[0.75rem] text-[var(--c-muted)] tabular-nums">{{ tag.count }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>
