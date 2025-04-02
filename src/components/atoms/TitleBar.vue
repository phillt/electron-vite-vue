<!-- TitleBar.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import BaseButton from "./BaseButton.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faSquare,
  faSquareFull,
  faWindowMinimize,
} from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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
    class="h-8 bg-gray-25 border-b border-gray-300 flex items-center justify-between px-4 select-none"
  >
    <div class="flex items-center text-gray-900 text-sm">Astreos</div>
    <div class="flex items-center space-x-1">
      <BaseButton
        variant="ghost"
        size="sm"
        class="text-gray-900 hover:bg-gray-100"
        @click="handleMinimize"
      >
        <FontAwesomeIcon :icon="faWindowMinimize" class="h-4 w-4" />
      </BaseButton>
      <BaseButton
        variant="ghost"
        size="sm"
        class="text-gray-900 hover:bg-gray-100"
        @click="handleMaximize"
      >
        <FontAwesomeIcon
          :icon="isMaximized ? faSquareFull : faSquare"
          class="h-4 w-4"
        />
      </BaseButton>
      <BaseButton
        variant="ghost"
        size="sm"
        class="text-gray-900 hover:bg-red-100"
        @click="handleClose"
      >
        <FontAwesomeIcon :icon="faXmark" class="h-4 w-4" />
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
