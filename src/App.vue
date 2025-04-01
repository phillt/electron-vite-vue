<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { budgetService } from "./services/budgetService";
import TitleBar from "./components/atoms/TitleBar.vue";

const router = useRouter();

onMounted(async () => {
  await budgetService.initialize();

  // If a budget is loaded, redirect to the budget page
  // otherwise, stay on the welcome page
  if (budgetService.getCurrentBudget()) {
    router.push("/budget");
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 w-full flex flex-col rounded-lg overflow-hidden"
  >
    <TitleBar class="titlebar" />
    <div class="flex-1">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  background: transparent !important;
  margin: 0;
  padding: 8px;
  height: 100vh;
}

#app {
  background: #f9fafb;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  height: calc(100vh - 16px);
}
</style>
