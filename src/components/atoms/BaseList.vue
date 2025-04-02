<!-- BaseList.vue -->
<script setup lang="ts">
import BaseButton from "./BaseButton.vue";

defineProps<{
  title?: string;
  subtitle?: string;
  amount?: number | string;
  actions?: {
    label: string;
    color: "primary" | "outline" | "ghost";
    onClick: () => void;
  }[];
}>();
</script>

<template>
  <div class="w-full">
    <!-- List -->
    <ul class="divide-y divide-gray-200">
      <!-- List Item -->
      <li class="px-3 py-2 sm:px-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-base font-medium text-gray-900 truncate">
              {{ title }}
            </p>
          </div>
          <div
            class="ml-4 flex-shrink-0 flex items-center justify-between w-[400px]"
          >
            <span v-if="subtitle" class="text-xs text-gray-400">
              {{ subtitle }}
            </span>
            <span
              v-if="amount !== undefined"
              class="text-sm font-medium text-gray-900"
            >
              ${{ Number(amount).toFixed(2) }}
            </span>
            <div v-if="actions" class="flex space-x-2">
              <BaseButton
                v-for="action in actions"
                :key="action.label"
                :variant="action.color"
                @click="action.onClick"
                size="xs"
              >
                {{ action.label }}
              </BaseButton>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
