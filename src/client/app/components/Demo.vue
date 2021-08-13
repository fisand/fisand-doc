<script setup lang="ts">
import {} from 'vue'
// import { useClipboard } from '@vueuse/core'
// import { useData } from 'vitepress'

const props = defineProps({
  demo: { type: Object, default: {} },
  htmlStrs: { type: String },
  codeStrs: { type: String },
  src: { type: String },
})

const anchor = '&-&'
</script>

<template>
  <ClientOnly>
    <div class="flex flex-col mb-16 rounded-lg border-1 border-gray-200 border-solid last:mb-0 divide-y">
      <!-- title -->
      <div
        class="text-sm py-2 px-2 <sm:text-md border-bottom border-gray-200"
        v-text="demo.title || '基础'"
      ></div>
      <div
        v-if="demo.describe"
        class="text-xs my-1 <sm:text-xs <sm:my-1"
        v-text="demo.describe"
      ></div>
      <!-- demo -->
      <div class="demo-component p-4px">
        <component :is="demo"></component>
      </div>
      <!-- operation -->
      <div
        class="relative py-2 px-2 text-center border-gray-200 border-top-dotted"
      >
        <fluent:clipboard-code-24-regular
          class="text-md cursor-pointer <sm:text-sm"
        />
        <ant-design:code-outlined
          class="text-md cursor-pointer ml-12 <sm:text-sm"
          :class="[
            demo.showCodeExample ? 'active-code' : '',
          ]"
          @click="
            demo.showCodeExample = !demo.showCodeExample
          "
        />

        <transition name="fade">
          <span
            v-show="demo.copied"
            class="block absolute left-1/2 top-0 text-xs text-blue-500 bg-blue-gray-50 rounded-md shadow-sm"
            style="
              padding: 4px 10px;
              z-index: 999;
              transform: translate(-96%, -80%);
            "
            >复制成功!</span
          >
        </transition>
      </div>
    </div>
  </ClientOnly>
</template>

<style>
.border-bottom {
  border-bottom: 1px solid rgba(229, 231, 235, 1);
}

.border-top-dotted {
  border-top-style: dotted;
}

.active-code {
  color: var(--c-brand);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0.01;
}
.fade-enter-active {
  transition: opacity 300ms cubic-bezier(0.215, 0.61, 0.355, 1);
}
.fade-leave-active {
  transition: opacity 250ms linear;
}
</style>
