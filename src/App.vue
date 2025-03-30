<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { budgetService } from "./services/budgetService";

const router = useRouter();

onMounted(async () => {
  await budgetService.initialize();

  // If a budget is loaded, redirect to the income-expenses page
  // otherwise, stay on the welcome page
  if (budgetService.getCurrentBudget()) {
    router.push("/income-expenses");
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <router-view></router-view>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
