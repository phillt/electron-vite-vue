<!-- Settings.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { budgetService } from "../services/budgetService";
import { useRouter } from "vue-router";
import BaseButton from "../components/atoms/BaseButton.vue";
import BaseCard from "../components/atoms/BaseCard.vue";
import BaseSection from "../components/atoms/BaseSection.vue";
import BaseInfoList from "../components/atoms/BaseInfoList.vue";
import BasePage from "../components/atoms/BasePage.vue";

const router = useRouter();
const currentBudget = computed(() => budgetService.getCurrentBudget());

const budgetInfo = computed(() => [
  {
    label: "Budget Name",
    value: currentBudget.value?.name || "No budget loaded",
  },
  {
    label: "File Location",
    value: currentBudget.value?.filePath || "N/A",
  },
  {
    label: "Created",
    value: currentBudget.value?.createdAt
      ? new Date(currentBudget.value.createdAt).toLocaleDateString()
      : "N/A",
  },
  {
    label: "Last Modified",
    value: currentBudget.value?.updatedAt
      ? new Date(currentBudget.value.updatedAt).toLocaleDateString()
      : "N/A",
  },
]);

const handleOpenInFolder = async () => {
  if (currentBudget.value?.filePath) {
    await window.electron.shell.showItemInFolder(currentBudget.value.filePath);
  }
};
</script>

<template>
  <BasePage
    title="Settings"
    description="Manage your budget settings and preferences"
  >
    <BaseCard :title="currentBudget?.name">
      <div class="px-4 py-5 sm:p-6">
        <div class="space-y-6">
          <!-- Budget Information -->

          <div class="mt-2 max-w-xl text-sm text-brand-muted"></div>
          <BaseInfoList :items="budgetInfo" />

          <div class="pt-6">
            <div class="flex justify-end">
              <BaseButton variant="outline" @click="handleOpenInFolder"
                >Open In Folder</BaseButton
              >
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </BasePage>
</template>
