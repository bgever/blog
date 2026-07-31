<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../../posts.data'
import { tagSlug } from '../../lib/posts'
import PostCard from '../components/PostCard.vue'

const { params } = useData()

const slug = computed(() => String(params.value?.tag ?? ''))
const label = computed(() => String(params.value?.label ?? slug.value))
const matches = computed(() => posts.filter((p) => p.tags.some((t) => tagSlug(t) === slug.value)))
</script>

<template>
  <div
    class="mx-auto flex max-w-[calc(var(--measure)+3rem)] flex-col gap-[1.4rem] px-6 py-[1.9rem]"
  >
    <div>
      <p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--c-muted)] uppercase">
        Tag
      </p>
      <h1 class="mt-1 font-sans text-[2rem] leading-[1.15] font-bold tracking-[-0.024em]">
        {{ label }}
      </h1>
      <p class="mt-2 text-[0.9375rem] text-[var(--c-muted)]">
        {{ matches.length }} {{ matches.length === 1 ? 'post' : 'posts' }} ·
        <a href="/tags" class="text-[var(--c-accent)] no-underline">all tags</a>
      </p>
    </div>

    <PostCard v-for="post in matches" :key="post.url" :post="post" />
  </div>
</template>
