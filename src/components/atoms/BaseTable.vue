<!-- BaseTable.vue -->
<script setup lang="ts">
defineProps<{
  headers: {
    label: string;
    key: string;
    class?: string;
  }[];
  rows: any[];
  status?: {
    class: string;
    badge: string;
  };
}>();
</script>

<template>
  <div class="overflow-hidden rounded-lg border" :class="status?.class">
    <table class="min-w-full divide-y divide-brand-surface">
      <thead class="bg-opacity-50" :class="status?.class">
        <tr class="divide-x divide-brand-surface">
          <th
            v-for="header in headers"
            :key="header.key"
            :class="[
              'px-6 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider whitespace-nowrap',
              header.class || 'text-left',
            ]"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-brand-surface">
        <slot></slot>
      </tbody>
    </table>
  </div>
</template>
