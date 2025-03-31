<!-- BudgetForm.vue -->
<script setup lang="ts">
import { ref } from "vue";
import type { Budget } from "../../services/budgetService";
import BaseInput from "../atoms/BaseInput.vue";
import BaseButton from "../atoms/BaseButton.vue";

const props = defineProps<{
  initialBudget?: Partial<Budget>;
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
  lastPayday: new Date().toISOString().split("T")[0],
  ...props.initialBudget,
});

const handleSubmit = () => {
  emit("submit", budget.value as Budget);
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
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
      <label for="description" class="block text-sm font-medium text-gray-700">
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

    <div>
      <label for="lastPayday" class="block text-sm font-medium text-gray-700">
        Last Payday
      </label>
      <div class="mt-1">
        <BaseInput
          id="lastPayday"
          v-model="budget.lastPayday"
          type="date"
          name="budget-last-payday"
          required
        />
      </div>
      <p class="mt-1 text-sm text-gray-500">
        Select the date of your most recent payday. This will be used to
        calculate future pay periods.
      </p>
    </div>

    <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

    <div class="flex items-center justify-between">
      <BaseButton variant="outline" @click="emit('cancel')">
        Back to Welcome
      </BaseButton>
      <BaseButton type="submit" variant="primary" :disabled="isSubmitting">
        {{ isSubmitting ? "Creating..." : "Create Budget" }}
      </BaseButton>
    </div>
  </form>
</template>
