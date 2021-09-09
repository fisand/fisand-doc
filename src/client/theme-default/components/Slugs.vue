<script setup lang="ts">
import { computed, onMounted, onUpdated, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { useClipboard } from '@vueuse/core'
import { Toast } from '../composables/useToast'

const route = useRoute()
const headers = computed(() => {
  const headers = route.data.headers || []
  return headers.filter(i => i.level <= 3)
})

let page = document.querySelector('.page')
let h2 = page!.querySelectorAll('h2')
let h3 = page!.querySelectorAll('h3')
let hs = Array.from(h2)
  .concat(Array.from(h3))
  .map(head => ({
    y: head.getBoundingClientRect().y,
    ele: head,
  })).sort((a, b) => a.y - b.y)

function onScroll() {
  function findIndex(y: number[]) {
    if (!y.some(idx => idx > 0)) {
      return y.length - 1
    }

    if (!y.some(idx => idx < 0)) {
      return 0
    }

    return y.findIndex((idx) => idx > 0 && Math.abs(idx) < 100)
  }

  const idx = findIndex(hs.map((head) => head.y - window.scrollY - 60))

  idx !== -1 && (
    document.querySelectorAll('.right-slug .slug-item').forEach(item => item.classList.remove('active')),
    document.querySelectorAll('.right-slug .slug-item')[idx].classList.add('active'),
    document.querySelector('.outline-marker')?.setAttribute('style', `transform: translateY(${idx * 30}px)`)
  )
}

  const set = throttleAndDebounce(onScroll, 50)

onMounted(() => {
  window.addEventListener('scroll', set)
})

onUnmounted(() => {
  window.removeEventListener('scroll', set)
})

onUpdated(() => {
  window.removeEventListener('scroll', set)
  document.querySelectorAll('.right-slug .slug-item').forEach(item => item.classList.remove('active'))
  document.querySelector('.outline-marker')?.setAttribute('style', `transform: translateY(0)`)

  page = document.querySelector('.page')
  h2 = page!.querySelectorAll('h2')
  h3 = page!.querySelectorAll('h3')
  hs = Array.from(h2)
    .concat(Array.from(h3))
    .map(head => ({
      y: head.getBoundingClientRect().y,
      ele: head,
    })).sort((a, b) => a.y - b.y)

  window.addEventListener('scroll', set)
})

const copyLink = () => {
  const { copy, isSupported } = useClipboard({
    source: decodeURIComponent(window?.location.href),
  })

  isSupported && copy()
  Toast.create({
    message: 'Link Copied',
  })

  setTimeout(() => {
    Toast.hide()
  }, 1500)
}

function throttleAndDebounce(fn: () => void, delay: number): () => void {
  let timeout: number
  let called = false

  return () => {
    if (timeout) {
      clearTimeout(timeout)
    }

    if (!called) {
      fn()
      called = true
      setTimeout(() => {
        called = false
      }, delay)
    } else {
      timeout = setTimeout(fn, delay)
    }
  }
}
</script>

<template>
  <teleport to="body">
    <ul class="right-slug">
      <p class="operation">
        <bi:link-45deg class="share inline-block relative cursor-pointer" @click="copyLink" />
      </p>
      <div class="item-wrapper">
        <div class="outline-marker"></div>
        <li
          v-for="{ level, title, slug } of headers"
          :class="`slug-item level-${level}`"
          :key="title"
        >
          <a :href="'#' + slug" class="link">
            {{ title }}
          </a>
        </li>
      </div>
    </ul>
  </teleport>
</template>

<style scoped>
.slug-item {
  list-style: none;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 4px 0 4px 16px;
  margin: 0;
  height: 30px;
  /* border-left: 2px solid #ebedf1; */
}

.slug-item.active .link{
  color: var(--c-brand);
}

.outline-marker {
  position: absolute;
  top: 6px;
  transition: all .24s;
}

.level-2 {
  padding-left: 28px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0,0,0,.65);
}

.level-3 {
  font-size: 13px;
  padding-left: 28px;
  color: rgba(0,0,0,.65);
}
.link {
  color: var(--c-text);
}
.right-slug {
  position: fixed;
  display: flex;
  flex-direction: column;
  top: var(--header-height);
  right: 0;
  max-height: calc(100% - var(--header-height) - 10rem);
  width: var(--slug-width);
  padding: 50px 24px 0 0;
  border-right: 1px solid var(--c-divider);
  background: var(--c-bg);
  z-index: 3;
  overflow-y: auto;
  transform: translateX(0);
  transition: transform 0.25s ease;
}

@media (max-width: 1280px) {
  .right-slug {
    transform: translateX(100%);
  }
}

.item-wrapper {
  position: relative;
  flex: 1;
  overflow: auto;
}

.outline-marker {
  background-color: var(--c-brand);
  border-radius: 4px;
  width: 4px;
  height: 20px;
}

.operation {
  padding-left: 0px;
  /* border-left: 2px solid #ebedf1; */
}
.share {
  width: 24px;
  height: 24px;
  padding: 4px;
  color: rgba(60, 60, 67, .5);
  background: #ebedf1;
  border-radius: 50%;
}
</style>
