<script setup lang="ts">
import { SITE } from '../../site'
</script>

<template>
  <footer class="mt-auto border-t border-[var(--c-border)]">
    <div
      class="mx-auto flex max-w-[calc(var(--measure)+3rem)] flex-col gap-2 px-6 pt-[1.1rem] pb-[1.3rem] text-[0.8125rem] leading-[1.7] text-[var(--c-muted)]"
    >
      <p class="flex flex-wrap gap-x-3 gap-y-1">
        <a
          v-for="link in SITE.links"
          :key="link.url"
          :href="link.url"
          rel="me noopener"
          class="text-[var(--c-accent)] underline underline-offset-2"
        >
          {{ link.label }}
        </a>
        <a href="/rss.xml" class="text-[var(--c-accent)] underline underline-offset-2">RSS</a>
      </p>
      <p>
        Content licensed
        <a
          :href="SITE.license.content.url"
          rel="license noopener"
          class="text-[var(--c-accent)] underline underline-offset-2"
        >
          {{ SITE.license.content.name }}
        </a>
        · Code licensed
        <a
          :href="SITE.license.code.url"
          class="text-[var(--c-accent)] underline underline-offset-2"
        >
          {{ SITE.license.code.name }}
        </a>
        ·
        <a :href="SITE.repo" class="text-[var(--c-accent)] underline underline-offset-2">
          Source on GitHub
        </a>
      </p>
      <p>Third-party images are credited individually and are not covered by that license.</p>
    </div>
  </footer>
</template>
