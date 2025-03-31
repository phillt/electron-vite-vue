<!-- CreateBudgetTemplate.vue -->
<script setup lang="ts">
import BudgetForm from "../molecules/BudgetForm.vue";
import type { Budget } from "../../services/budgetService";
import BaseCard from "../atoms/BaseCard.vue";

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
    <BaseCard class="space-y-8 p-8">
      <template #header>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 text-center">
            Create New Budget
          </h1>
        </div>
      </template>

      <BudgetForm
        :is-submitting="isSubmitting"
        :error="error"
        @submit="$emit('submit', $event)"
        @cancel="$emit('cancel')"
      />
    </BaseCard>
  </div>
</template>
