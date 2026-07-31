<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../../posts.data'
import { SITE } from '../../site'
import PostCard from '../components/PostCard.vue'

const visible = computed(() => posts.slice(0, SITE.homePostCount))
const hasMore = computed(() => posts.length > SITE.homePostCount)
</script>

<template>
  <div
    class="mx-auto flex max-w-[calc(var(--measure)+3rem)] flex-col gap-[1.4rem] px-6 py-[1.9rem]"
  >
    <div class="flex items-center gap-[1.05rem]">
      <img
        :src="SITE.avatar"
        :alt="SITE.name"
        width="160"
        height="160"
        class="h-[4.2rem] w-[4.2rem] flex-none rounded-full border border-[var(--c-border)] object-cover"
      />
      <div>
        <h1 class="text-[1.35rem] leading-[1.2] font-bold tracking-tight">{{ SITE.name }}</h1>
        <p class="mt-[0.25rem] text-[0.9375rem] leading-[1.5] text-[var(--c-muted)]">
          {{ SITE.intro }}
        </p>
      </div>
    </div>

    <PostCard v-for="post in visible" :key="post.url" :post="post" />

    <p v-if="!posts.length" class="text-[var(--c-muted)]">Nothing published yet.</p>

    <p v-if="hasMore">
      <a href="/archive" class="text-[0.9375rem] font-semibold text-[var(--c-accent)] no-underline">
        View all posts →
      </a>
    </p>
  </div>
</template>
