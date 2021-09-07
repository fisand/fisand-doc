<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { useClipboard } from '@vueuse/core'
import { Toast } from '../composables/useToast'

const route = useRoute()
const headers = computed(() => {
  const headers = route.data.headers || []
  return headers.filter(i => i.level <= 3)
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
</script>

<template>
  <teleport to="body">
    <ul class="right-slug">
      <p class="operation">
        <bi:link-45deg class="share inline-block relative cursor-pointer" @click="copyLink" />
      </p>
      <div class="item-wrapper">
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
  border-left: 2px solid #ebedf1;
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
  flex: 1;
  overflow: auto;
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
