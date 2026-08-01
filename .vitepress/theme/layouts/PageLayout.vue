<script setup lang="ts">
import { Content, useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div class="mx-auto w-full max-w-[calc(var(--measure)+3rem)] px-6 py-[1.9rem]">
    <article>
      <h1
        v-if="frontmatter.title"
        class="font-sans text-[2rem] leading-[1.15] font-bold tracking-[-0.024em] text-balance"
      >
        {{ frontmatter.title }}
      </h1>
      <div class="prose mt-8">
        <Content />
      </div>
    </article>
  </div>
</template>
