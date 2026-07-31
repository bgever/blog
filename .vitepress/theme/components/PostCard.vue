<script setup lang="ts">
import type { Post } from '../../lib/posts'
import { formatDate } from '../../lib/posts'
import TagChips from './TagChips.vue'

defineProps<{ post: Post }>()
</script>

<template>
  <article
    class="overflow-hidden rounded-[0.7rem] border border-[var(--c-border)] bg-[var(--c-surface)]"
  >
    <a v-if="post.cover" :href="post.url" tabindex="-1" aria-hidden="true" class="block">
      <img
        :src="post.cover"
        :alt="post.coverAlt ?? ''"
        width="1600"
        height="900"
        loading="lazy"
        decoding="async"
        class="block aspect-video w-full object-cover"
      />
    </a>
    <div class="px-[1.2rem] pt-[1.1rem] pb-[1.2rem]">
      <h2 class="text-[1.375rem] leading-[1.25] font-bold tracking-tight text-balance">
        <a :href="post.url" class="text-[var(--c-ink)] no-underline hover:text-[var(--c-accent)]">
          {{ post.title }}
        </a>
      </h2>
      <p class="mt-[0.4rem] text-[0.8125rem] text-[var(--c-muted)] tabular-nums">
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        <span v-if="post.draft" class="ml-2 font-semibold text-[var(--c-accent)]">Draft</span>
      </p>
      <p
        class="mt-[0.7rem] line-clamp-3 font-serif text-[1.0625rem] leading-[1.6] text-[var(--c-ink)]"
      >
        {{ post.excerpt }}
      </p>
      <TagChips v-if="post.tags.length" :tags="post.tags" class="mt-[0.9rem]" />
    </div>
  </article>
</template>
