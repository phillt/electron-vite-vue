<!-- TitleBar.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import BaseButton from "./BaseButton.vue";
import AstreosLogo from "../../icons/AstreosLogo.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faSquare,
  faSquareFull,
  faWindowMinimize,
} from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { budgetService } from "../../services/budgetService";

const isMaximized = ref(false);
const currentBudgetName = computed(
  () => budgetService.getCurrentBudget()?.name || ""
);

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
    <div class="flex items-center text-gray-900 text-sm">
      <AstreosLogo class="w-4 h-4 mr-2" />
      Astreos
      <span class="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded"
        >BETA</span
      >
      <span v-if="currentBudgetName" class="ml-2 text-gray-500">
        - {{ currentBudgetName }}</span
      >
    </div>
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
