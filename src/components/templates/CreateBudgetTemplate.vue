<!-- CreateBudgetTemplate.vue -->
<script setup lang="ts">
import BudgetForm from "../molecules/BudgetForm.vue";
import type { Budget } from "../../services/budgetService";

defineProps<{
  isSubmitting?: boolean;
  error?: string | null;
}>();

defineEmits<{
  (e: "submit", budget: Budget): void;
  (e: "cancel"): void;
}>();
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 text-center">
          Create New Budget
        </h1>
      </div>

      <BudgetForm
        :is-submitting="isSubmitting"
        :error="error"
        @submit="$emit('submit', $event)"
        @cancel="$emit('cancel')"
      />
    </div>
  </div>
</template>
