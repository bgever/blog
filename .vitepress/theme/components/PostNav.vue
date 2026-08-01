<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../../posts.data'

const props = defineProps<{ url: string }>()

// Posts arrive newest-first, so the *next* index is the older post.
const index = computed(() => posts.findIndex((p) => p.url === props.url))
const older = computed(() => (index.value >= 0 ? posts[index.value + 1] : undefined))
const newer = computed(() => (index.value > 0 ? posts[index.value - 1] : undefined))
</script>

<template>
  <!--
    No rule along the top: PostEnd already draws the line between the post and
    what follows it, and its bottom margin supplies the gap this used to.
  -->
  <nav v-if="older || newer" class="grid gap-3 sm:grid-cols-2" aria-label="More posts">
    <a
      v-if="older"
      :href="older.url"
      class="rounded-[0.6rem] border border-[var(--c-border)] bg-[var(--c-surface)] px-4 py-3 no-underline hover:border-[var(--c-accent)]"
    >
      <span class="text-[0.6875rem] font-semibold tracking-[0.1em] text-[var(--c-muted)] uppercase">
        ← Older
      </span>
      <span class="mt-1 block text-[0.95rem] font-semibold text-[var(--c-ink)]">
        {{ older.title }}
      </span>
    </a>
    <a
      v-if="newer"
      :href="newer.url"
      class="rounded-[0.6rem] border border-[var(--c-border)] bg-[var(--c-surface)] px-4 py-3 no-underline hover:border-[var(--c-accent)] sm:col-start-2 sm:text-right"
    >
      <span class="text-[0.6875rem] font-semibold tracking-[0.1em] text-[var(--c-muted)] uppercase">
        Newer →
      </span>
      <span class="mt-1 block text-[0.95rem] font-semibold text-[var(--c-ink)]">
        {{ newer.title }}
      </span>
    </a>
  </nav>
</template>
