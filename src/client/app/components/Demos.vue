<script setup lang="ts">
import { computed } from 'vue'
import demo from './Demo.vue'

const props = defineProps({
  demos: { type: Object, default: {} },
  htmlStrs: { type: String, default: '' },
  codeStrs: { type: String, default: ''  },
  template: { type: String, default: ''  },
  script: { type: String, default: ''  },
  styles: { type: String, default: ''  },
  src: { type: String },
})

const anchor = '&-&'
const comps = Object.entries(props.demos).map((demo) => demo[1].default)
const decodedHtmlStrs = computed(() => [
  ...props.htmlStrs
    .split(anchor)
])
const decodeCodeRaws = computed(() => [
  ...props.codeStrs
    .split(anchor)
])

const templates = computed(() => props.template.split(anchor))
const scripts = computed(() => props.script.split(anchor))
const styless = computed(() => props.styles.split(anchor))
</script>

<template>
  <div class="fisand-demo-container">
    <component
      v-for="(item, index) in comps"
      :demo="item"
      :key="index"
      :html-strs="decodedHtmlStrs[index]"
      :code-strs="decodeCodeRaws[index]"
      :template="templates[index]"
      :script="scripts[index]"
      :styles="styless[index]"
      :is="demo"
    />
  </div>
</template>
