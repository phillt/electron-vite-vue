<!-- Settings.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { budgetService } from "../services/budgetService";
import { useRouter } from "vue-router";
import BaseButton from "../components/atoms/BaseButton.vue";
import BaseCard from "../components/atoms/BaseCard.vue";
import BaseSection from "../components/atoms/BaseSection.vue";

const router = useRouter();
const currentBudget = computed(() => budgetService.getCurrentBudget());
</script>

<template>
  <div class="p-6">
    <header class="mb-8">
      <h1 class="text-2xl font-bold text-brand-text">Settings</h1>
      <p class="mt-2 text-sm text-brand-muted">
        Manage your budget settings and preferences
      </p>
    </header>

    <BaseCard>
      <div class="px-4 py-5 sm:p-6">
        <div class="space-y-6">
          <!-- Budget Information -->
          <BaseSection title="Budget Information">
            <div class="mt-2 max-w-xl text-sm text-brand-muted">
              <p>Current budget details and file location.</p>
            </div>
            <div class="mt-5 space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-brand-muted">Budget Name:</span>
                <span class="text-brand-text">{{
                  currentBudget?.name || "No budget loaded"
                }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-brand-muted">File Location:</span>
                <span class="text-brand-text">{{
                  currentBudget?.filePath || "N/A"
                }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-brand-muted">Created:</span>
                <span class="text-brand-text">{{
                  currentBudget?.createdAt
                    ? new Date(currentBudget.createdAt).toLocaleDateString()
                    : "N/A"
                }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-brand-muted">Last Modified:</span>
                <span class="text-brand-text">{{
                  currentBudget?.updatedAt
                    ? new Date(currentBudget.updatedAt).toLocaleDateString()
                    : "N/A"
                }}</span>
              </div>
            </div>
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
  </div>
</template>
