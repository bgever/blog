<script setup lang="ts">
import { tagSlug } from '../../lib/posts'

defineProps<{ tags: readonly string[] }>()
</script>

<template>
  <p class="flex flex-wrap gap-[0.4rem]">
    <a
      v-for="tag in tags"
      :key="tag"
      :href="`/tags/${tagSlug(tag)}`"
      class="rounded-[0.3rem] border border-[var(--c-border)] px-[0.5rem] py-[0.18rem] text-[0.6875rem] font-semibold tracking-[0.07em] text-[var(--c-accent)] uppercase no-underline hover:border-[var(--c-accent)]"
    >
      {{ tag }}
    </a>
  </p>
</template>
