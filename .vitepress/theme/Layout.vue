<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import CopyCode from './components/CopyCode.vue'
import NotFound from './NotFound.vue'
import HomeLayout from './layouts/HomeLayout.vue'
import PostLayout from './layouts/PostLayout.vue'
import PageLayout from './layouts/PageLayout.vue'
import ArchiveLayout from './layouts/ArchiveLayout.vue'
import TagsLayout from './layouts/TagsLayout.vue'
import TagLayout from './layouts/TagLayout.vue'

const { frontmatter, page } = useData()

// `layout: post` is injected by transformPageData for anything under posts/,
// so posts never have to declare it themselves.
const layouts = {
  home: HomeLayout,
  post: PostLayout,
  archive: ArchiveLayout,
  tags: TagsLayout,
  tag: TagLayout,
  page: PageLayout,
} as const

const current = computed(() => {
  const name = frontmatter.value.layout as keyof typeof layouts | undefined
  return (name && layouts[name]) || PageLayout
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <SiteHeader />
    <main class="flex-1">
      <!--
        Missed routes carry frontmatter.layout 'page', so without this branch
        the 404 content would render through PageLayout's <Content/> and nest
        inside the prose column. Mount it directly instead.
      -->
      <NotFound v-if="page.isNotFound" />
      <component :is="current" v-else />
    </main>
    <SiteFooter />
    <CopyCode />
  </div>
</template>
