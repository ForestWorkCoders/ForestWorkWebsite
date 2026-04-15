<template>
  <div class="relative min-h-[calc(100vh-var(--ui-header-height))] flex items-center justify-center overflow-hidden">

    <div class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
      style="background-image: url('/images/hero-bg.jpg'); filter: brightness(0.4);"></div>

    <div class="relative z-10 flex flex-col items-center px-4 text-center">
      <img src="~/assets/images/forestwork-logo-white.png" alt="林間小鎮 ForestWork"
        class="w-48 md:w-64 lg:w-80 h-auto drop-shadow-2xl">

    </div>

    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent">
    </div>
  </div>

  <UContainer class="py-20">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Circuits · 競賽清單</h2>
      <p class="text-gray-500">探索林間小鎮的多元賽事與社群活動</p>
    </div>

    <div class="max-w-2xl mx-auto mb-16 px-4 flex flex-col gap-2"">
      <UInput v-model="searchQuery" icon="i-lucide-search" size="xl" placeholder="Search..." color="neutral"
        variant="outline" class="shadow-sm transition-all focus-within:ring-2 focus-within:ring-green-500/50" :ui="{
          base: 'py-4 rounded-full'
        }" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="item in filteredCircuits" :key="item.id"
        class="group cursor-pointer transition-all duration-300 hover:-translate-y-2">
        <div
          class="bg-gray-100 dark:bg-gray-800 rounded-lg p-10 flex flex-col items-center justify-center relative overflow-hidden h-64 shadow-sm border border-transparent group-hover:border-green-500/50">

          <div
            class="w-32 h-32 bg-white dark:bg-gray-700 rounded flex items-center justify-center shadow-inner mb-6 transition-transform group-hover:scale-110">
            <UIcon :name="item.icon" class="size-16 text-gray-400 dark:text-gray-500" />
          </div>

          <h3 class="font-bold text-lg text-gray-800 dark:text-gray-200">{{ item.title }}</h3>

          <p class="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-center px-4">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="filteredCircuits.length === 0" class="text-center py-20">
      <UIcon name="i-lucide-ghost" class="size-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-400">找不到相關競賽，試試別的關鍵字？</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')

// 1. 定義資料結構
const circuits = [
  { id: 1, title: 'Plazma League', icon: 'i-lucide-crosshair', description: '經典橫向捲軸射擊賽事' },
  { id: 2, title: 'Mahjong Soul', icon: 'i-lucide-id-card-lanyard', description: '雀魂林間小鎮常規積分賽' },
  { id: 3, title: 'Minecraft UHC', icon: 'i-lucide-pickaxe', description: '超極限生存競賽' },
  { id: 4, title: 'Another Game 1', icon: 'i-lucide-gamepad', description: '準備中...' },
  { id: 5, title: 'Another Game 2', icon: 'i-lucide-gamepad', description: '準備中...' },
  { id: 6, title: 'Another Game 3', icon: 'i-lucide-gamepad', description: '準備中...' },
]

// 2. 即時搜尋過濾邏輯
const filteredCircuits = computed(() => {
  if (!searchQuery.value) return circuits
  return circuits.filter(item =>
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>