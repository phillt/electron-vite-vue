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
</script>

<template>
  <BasePage
    title="Settings"
    description="Manage your budget settings and preferences"
  >
    <BaseCard>
      <div class="px-4 py-5 sm:p-6">
        <div class="space-y-6">
          <!-- Budget Information -->
          <BaseSection title="Budget Information">
            <div class="mt-2 max-w-xl text-sm text-brand-muted">
              <p>Current budget details and file location.</p>
            </div>
            <BaseInfoList :items="budgetInfo" />
          </BaseSection>

          <div class="pt-6">
            <div class="flex justify-end">
              <BaseButton variant="outline" @click="$router.push('/')">
                Open or Create Budget
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </BasePage>
</template>
