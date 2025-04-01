<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <slot></slot>

    <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-4">
      <slot name="actions">
        <BaseButton
          v-if="showCancel"
          variant="outline"
          @click="$router.push(cancelRoute)"
        >
          Cancel
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          :disabled="isSubmitting || !isFormValid"
        >
          {{ submitButtonText }}
        </BaseButton>
      </slot>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "../atoms/BaseButton.vue";

interface Props {
  isSubmitting?: boolean;
  isFormValid?: boolean;
  error?: string | null;
  showCancel?: boolean;
  cancelRoute?: string;
  submitButtonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  isFormValid: true,
  error: null,
  showCancel: true,
  cancelRoute: "/",
  submitButtonText: "Submit",
});

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const handleSubmit = () => {
  if (props.isFormValid) {
    emit("submit");
  }
};
</script>
