<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-if="error" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">
            {{ error }}
          </div>
        </div>
      </div>
    </div>

    <BaseInput
      v-model="formData.name"
      name="name"
      label="Bill Name"
      placeholder="e.g., Rent, Utilities, etc."
      :disabled="isEditing"
      required
      helper-text="Give this bill a name to help you identify it."
    />

    <BaseInput
      v-model="formData.dueDay"
      name="dueDay"
      type="number"
      label="Due Day of Month"
      placeholder="1-31"
      required
      min="1"
      max="31"
      helper-text="Enter the day of the month when this bill is due."
    />

    <BaseInput
      v-model="formData.amount"
      name="amount"
      type="number"
      label="Amount"
      placeholder="0.00"
      required
      min="0"
      step="0.01"
      prefix="$"
    />

    <div class="flex justify-end space-x-3">
      <BaseButton type="button" variant="outline" @click="$emit('cancel')">
        Cancel
      </BaseButton>
      <BaseButton
        type="submit"
        :loading="isSubmitting"
        :disabled="isSubmitting"
        variant="primary"
      >
        {{ submitButtonText }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Bill } from "../../services/budgetService";
import BaseButton from "../atoms/BaseButton.vue";
import BaseInput from "../atoms/BaseInput.vue";

const props = defineProps<{
  initialData?: Bill;
  isEditing?: boolean;
  existingBills?: Bill[];
}>();

const emit = defineEmits<{
  (e: "submit", data: Bill): void;
  (e: "cancel"): void;
}>();

const isSubmitting = ref(false);
const error = ref<string | null>(null);

const formData = ref({
  name: props.initialData?.name || "",
  dueDay: props.initialData?.dueDay || 1,
  amount: props.initialData?.amount || 0,
});

const submitButtonText = computed(() =>
  props.isEditing ? "Save Changes" : "Add Bill"
);

const handleSubmit = async () => {
  isSubmitting.value = true;
  error.value = null;

  try {
    // Check if name already exists (only for new bills)
    if (!props.isEditing && props.existingBills) {
      if (
        props.existingBills.some((b: Bill) => b.name === formData.value.name)
      ) {
        error.value = "A bill with this name already exists.";
        return;
      }
    }

    // Validate due day
    if (formData.value.dueDay < 1 || formData.value.dueDay > 31) {
      error.value = "Due day must be between 1 and 31.";
      return;
    }

    emit("submit", { ...formData.value });
  } catch (err) {
    console.error("Error saving bill:", err);
    error.value = "Failed to save bill. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
