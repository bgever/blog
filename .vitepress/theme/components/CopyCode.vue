<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'

/**
 * Adds a copy button to every fenced code block. Renderless — it only mutates
 * the DOM VitePress produced, so nothing about the Markdown pipeline changes.
 */
const { page } = useData()

const COPY_LABEL = 'Copy code'
let cleanups: Array<() => void> = []

function decorate() {
  teardown()
  document.querySelectorAll<HTMLElement>('.prose div[class*="language-"]').forEach((block) => {
    if (block.querySelector('button.copy')) return
    const code = block.querySelector('code')
    if (!code) return

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'copy'
    button.setAttribute('aria-label', COPY_LABEL)
    button.setAttribute('title', COPY_LABEL)
    button.innerHTML = ICON_COPY

    let timer: ReturnType<typeof setTimeout> | undefined
    const onClick = async () => {
      try {
        await navigator.clipboard.writeText(code.textContent ?? '')
        button.dataset.copied = 'true'
        button.innerHTML = ICON_DONE
        button.setAttribute('aria-label', 'Copied')
        clearTimeout(timer)
        timer = setTimeout(() => {
          delete button.dataset.copied
          button.innerHTML = ICON_COPY
          button.setAttribute('aria-label', COPY_LABEL)
        }, 2000)
      } catch {
        button.setAttribute('aria-label', 'Copy failed')
      }
    }

    button.addEventListener('click', onClick)
    block.appendChild(button)
    cleanups.push(() => {
      clearTimeout(timer)
      button.removeEventListener('click', onClick)
      button.remove()
    })
  })
}

function teardown() {
  cleanups.forEach((fn) => fn())
  cleanups = []
}

const ICON_COPY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>`
const ICON_DONE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" aria-hidden="true"><path d="m5 13 4 4L19 7"/></svg>`

onMounted(decorate)
onUnmounted(teardown)
watch(
  () => page.value.relativePath,
  () => requestAnimationFrame(decorate),
)
</script>

<template><span class="hidden" /></template>
