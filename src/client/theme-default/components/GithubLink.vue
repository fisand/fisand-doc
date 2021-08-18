<script setup lang="ts">
import { computed, toRefs } from 'vue'
import type { DefaultTheme } from '../config'
import { useNavLink } from '../composables/navLink'

const props = defineProps<{
  item: DefaultTheme.NavItemWithLink,
}>()

const propsRefs = toRefs(props)

const { props: linkProps } = useNavLink(propsRefs.item)
const isGithub = computed(() => props.item.text.toLowerCase() === 'github')
</script>

<template>
  <a class="github-link flex items-center" v-bind="linkProps">
    <uil:github v-if="isGithub"/>
    <uil:gitlab v-else/>
  </a>
</template>

<style scoped>
.github-link {
  color: var(--c-text);
  font-size: 1.05rem;
}
</style>
