<!-- TitleBar.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import BaseButton from "./BaseButton.vue";

const isMaximized = ref(false);

onMounted(async () => {
  isMaximized.value = await window.electron.window.isMaximized();
});

const handleMinimize = () => {
  window.electron.window.minimize();
};

const handleMaximize = async () => {
  window.electron.window.maximize();
  isMaximized.value = await window.electron.window.isMaximized();
};

const handleClose = () => {
  window.electron.window.close();
};
</script>

<template>
  <div
    class="h-8 bg-gray-800 flex items-center justify-between px-4 select-none"
  >
    <div class="flex items-center text-white text-sm">Astreos</div>
    <div class="flex items-center space-x-2">
      <BaseButton
        variant="ghost"
        size="sm"
        class="text-white hover:bg-gray-700"
        @click="handleMinimize"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </BaseButton>
      <BaseButton
        variant="ghost"
        size="sm"
        class="text-white hover:bg-gray-700"
        @click="handleMaximize"
      >
        <svg
          v-if="!isMaximized"
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5 15V5h10v10H5zm-2-2h14V3H3v10z"
            clip-rule="evenodd"
          />
        </svg>
      </BaseButton>
      <BaseButton
        variant="ghost"
        size="sm"
        class="text-white hover:bg-red-600"
        @click="handleClose"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.titlebar {
  -webkit-app-region: drag;
}

.titlebar button {
  -webkit-app-region: no-drag;
}
</style>
