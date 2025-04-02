<!-- CreateBudgetTemplate.vue -->
<script setup lang="ts">
import { ref } from "vue";
import type { Budget } from "../../services/budgetService";
import BaseCard from "../atoms/BaseCard.vue";
import BaseForm from "./BaseForm.vue";
import BaseInput from "../atoms/BaseInput.vue";

const props = defineProps<{
  isSubmitting?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  (e: "submit", budget: Budget): void;
  (e: "cancel"): void;
}>();

const budget = ref({
  name: "",
  description: "",
});

const handleSubmit = () => {
  emit("submit", budget.value as Budget);
};
</script>

<template>
  <div class="min-h-full flex items-center justify-center bg-gray-200">
    <BaseCard class="space-y-8 p-8">
      <template #header>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 text-center">
            Create New Budget
          </h1>
        </div>
      </template>

      <BaseForm
        :is-submitting="isSubmitting"
        :error="error"
        submit-button-text="Create Budget"
        @submit="handleSubmit"
        @cancel="$emit('cancel')"
      >
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">
            Budget Name
          </label>
          <div class="mt-1">
            <BaseInput
              id="name"
              v-model="budget.name"
              type="text"
              name="budget-name"
              required
              placeholder="e.g., Personal Budget 2024"
            />
          </div>
        </div>

        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <div class="mt-1">
            <BaseInput
              id="description"
              v-model="budget.description"
              type="text"
              name="budget-description"
              placeholder="A brief description of your budget"
            />
          </div>
        </div>
      </BaseForm>
    </BaseCard>
  </div>
</template>
