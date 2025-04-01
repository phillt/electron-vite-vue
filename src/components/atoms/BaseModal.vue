<!-- BaseModal.vue -->
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    emit("update:modelValue", false);
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="emit('update:modelValue', false)"
      ></div>

      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all"
        >
          <!-- Header -->
          <div v-if="title" class="mb-4">
            <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
          </div>

          <!-- Content -->
          <div>
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
