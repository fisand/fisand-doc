<script setup lang="ts">
import { shallowReactive } from 'vue'
import demo from './Demo.vue'

const props = defineProps({
  demos: { type: Object, default: [] },
  htmlStrs: { type: String, default: '' },
  codeStrs: { type: String, default: ''  },
  src: { type: String },
})

const anchor = '&-&'

const comps = props.demos

const decodedHtmlStrs = computed(() => [
  ...props.htmlStrs
    .split(anchor)
    .map((html) =>
      decodeURIComponent(html.replace(/\&/g, "'"))
    ),
])

const decodeCodeRaws = computed(() => [
  ...props.codeStrs
    .split(anchor)
    .map((html) =>
      decodeURIComponent(html.replace(/\&/g, "'"))
    ),
])
</script>

<template>
  <demo />
</template>
