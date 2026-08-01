<script setup lang="ts">
import { computed } from 'vue'
import { Content, useData } from 'vitepress'
import { formatDate, normalizeDate } from '../../lib/posts'
import TagChips from '../components/TagChips.vue'
import TableOfContents from '../components/TableOfContents.vue'
import PostEnd from '../components/PostEnd.vue'
import PostNav from '../components/PostNav.vue'

const { page, frontmatter } = useData()

const date = computed(() => normalizeDate(frontmatter.value.date))
const updated = computed(() => normalizeDate(frontmatter.value.updated))
const tags = computed<string[]>(() =>
  Array.isArray(frontmatter.value.tags) ? frontmatter.value.tags : [],
)
const url = computed(
  () => '/' + page.value.relativePath.replace(/^posts\//, '').replace(/\.md$/, ''),
)
</script>

<template>
  <!--
    Three tracks: an empty spacer, the prose column, then the table of contents.
    The spacer is what keeps the prose centered once the TOC appears.
  -->
  <div class="post-grid mx-auto grid w-full justify-center gap-8 px-6 py-[1.9rem]">
    <div class="post-grid__spacer" aria-hidden="true"></div>

    <article class="min-w-0">
      <header>
        <h1 class="font-sans text-[2rem] leading-[1.15] font-bold tracking-[-0.024em] text-balance">
          {{ frontmatter.title }}
        </h1>
        <div
          class="mt-[0.7rem] flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.8125rem] text-[var(--c-muted)] tabular-nums"
        >
          <time v-if="date" :datetime="date">{{ formatDate(date) }}</time>
          <span v-if="updated">Updated {{ formatDate(updated) }}</span>
          <TagChips v-if="tags.length" :tags="tags" />
        </div>

        <figure v-if="frontmatter.cover" class="mt-[1.5rem]">
          <img
            :src="frontmatter.cover"
            :alt="frontmatter.coverAlt"
            width="1600"
            height="900"
            class="block aspect-video w-full rounded-[0.5rem] object-cover"
          />
          <figcaption
            v-if="frontmatter.coverSource"
            class="mt-2 text-[0.75rem] text-[var(--c-muted)]"
          >
            Photo via
            <a
              :href="frontmatter.coverSource"
              rel="noopener"
              class="text-[var(--c-accent)] underline underline-offset-2"
            >
              Unsplash
            </a>
          </figcaption>
        </figure>
      </header>

      <div class="prose mt-8">
        <Content />
      </div>

      <PostEnd />

      <PostNav :url="url" />
    </article>

    <TableOfContents />
  </div>
</template>

<style scoped>
.post-grid {
  grid-template-columns: minmax(0, var(--measure));
}

.post-grid__spacer {
  display: none;
}

/*
 * Above the breakpoint the layout becomes spacer | prose | toc, with both side
 * tracks the same width, so the prose column never shifts off centre.
 */
@media (min-width: 1200px) {
  .post-grid {
    grid-template-columns: var(--toc-width) minmax(0, var(--measure)) var(--toc-width);
  }

  .post-grid__spacer {
    display: block;
  }
}
</style>
