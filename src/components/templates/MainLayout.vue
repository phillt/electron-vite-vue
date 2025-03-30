<!-- MainLayout.vue -->
<script setup lang="ts">
import Sidebar from "../organisms/Sidebar.vue";
</script>

<template>
  <div class="flex h-screen bg-gray-200">
    <div class="p-4">
      <Sidebar />
    </div>

    <div class="flex-1 overflow-auto p-4">
      <router-view></router-view>
    </div>
  </div>
</template>
