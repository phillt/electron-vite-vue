<template>
  <CreateBudgetTemplate
    :is-submitting="isSubmitting"
    :error="error"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { budgetService } from "../services/budgetService";
import type { Budget } from "../services/budgetService";
import CreateBudgetTemplate from "../components/templates/CreateBudgetTemplate.vue";

const router = useRouter();
const error = ref<string | null>(null);
const isSubmitting = ref(false);

const handleSubmit = async (budget: Budget) => {
  error.value = null;
  isSubmitting.value = true;

  try {
    await budgetService.createBudget(budget);
    router.push("/budget");
  } catch (e: any) {
    if (e.message === "Save operation cancelled") {
      // User cancelled the save dialog, no need to show error
      return;
    }
    error.value = e.message || "Failed to create budget";
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push("/");
};
</script>
