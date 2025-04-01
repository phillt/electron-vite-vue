<!-- BaseList.vue -->
<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
  amount?: number | string;
  amountColor?: "success" | "warning" | "default";
  actions?: {
    label: string;
    color: "primary" | "danger" | "default";
    onClick: () => void;
  }[];
}>();
</script>

<template>
  <div class="w-full">
    <!-- Header Row -->
    <div class="px-4 py-3 sm:px-6 bg-gray-50 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex-1 min-w-0">
          <p
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Details
          </p>
        </div>
        <div class="ml-4 flex-shrink-0 flex items-center space-x-4">
          <div class="w-24"></div>
          <!-- Space for actions -->
        </div>
      </div>
    </div>

    <!-- List Item -->
    <li class="px-4 py-4 sm:px-6 border-b border-gray-200 last:border-b-0">
      <div class="flex items-center justify-between">
        <div class="flex-1 min-w-0">
          <p class="text-base font-medium text-gray-900 truncate">
            {{ title }}
            <span v-if="subtitle" class="text-brand-muted">
              &nbsp;&mdash;&nbsp;{{ subtitle }}
            </span>
          </p>
        </div>
        <div class="ml-4 flex-shrink-0 flex items-center space-x-4">
          <span
            v-if="amount !== undefined"
            class="text-sm font-medium"
            :class="{
              'text-brand-success': amountColor === 'success',
              'text-brand-warning': amountColor === 'warning',
              'text-brand-text': amountColor === 'default',
            }"
          >
            ${{ Number(amount).toFixed(2) }}
          </span>
          <div v-if="actions" class="flex space-x-2 w-24 justify-end">
            <button
              v-for="action in actions"
              :key="action.label"
              @click="action.onClick"
              class="text-sm font-medium"
              :class="{
                'text-brand-dark hover:text-brand-dark/80':
                  action.color === 'primary',
                'text-red-600 hover:text-red-900': action.color === 'danger',
                'text-brand-muted hover:text-brand-text':
                  action.color === 'default',
              }"
            >
              {{ action.label }}
            </button>
          </div>
        </div>
      </div>
    </li>
  </div>
</template>
