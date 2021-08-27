<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  message: { type: String, default: ''  },
})

const showToast = ref(true)

function show() {
  showToast.value = true
}

function hide() {
  showToast.value = false
}

defineExpose({
  show,
  hide,
})

</script>

<template>
  <div class="fisand-toast" v-show="showToast">
    <div class="fisand__message">{{ message }}</div>
  </div>
</template>

<style>
.fisand-toast {
  position: fixed;
  right: 2rem;
  bottom: 1rem;
  background: var(--c-bg);
  width: 420px;
  max-width: 100%;
  max-height: 75px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.12);
  animation: slideup .24s forwards;
}

.fisand__message {
  align-items: center;
  height: 100%;
  transition: opacity 0.4s ease;
  font-size: 0.875rem;
  display: -webkit-box;
  word-break: break-all;
  overflow: hidden;
  max-height: 100%;
  text-overflow: ellipsis;
  line-height: 1.1rem;
  color: var(--c-text);
}

@keyframes slideup {
  0% {
    bottom: 1rem;
  }
  100% {
    bottom: 2rem;
  }
}
</style>
