<!-- MainLayout.vue -->
<script setup lang="ts">
import Sidebar from "../organisms/Sidebar.vue";
</script>

<template>
  <div class="flex h-screen bg-brand-background">
    <Sidebar />
    <div class="flex-1 overflow-auto p-8">
      <router-view></router-view>
    </div>
  </div>
</template>
