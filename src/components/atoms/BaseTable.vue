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
  <div class="overflow-hidden">
    <table class="min-w-full">
      <thead
        class="bg-opacity-50 border-b-2 border-brand-surface"
        :class="status?.class"
      >
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            :class="[
              'px-4 py-2 text-xs font-medium text-brand-muted uppercase tracking-wider whitespace-nowrap',
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
