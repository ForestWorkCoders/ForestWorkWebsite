<template>
    <!-- 核心：max-w-6xl mx-auto 死死锁住最大宽度与居中，彻底根除横向撑爆问题 -->
    <div class="max-w-6xl w-full mx-auto px-4 py-8 space-y-8">

        <!-- 1. 顶栏：选手选择与比赛周/日期筛选 -->
        <div
            class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">三麻選手數據面板</h1>
                    <p class="text-sm text-gray-500 mt-1">Sanma Player Dashboard & Career Highlights</p>
                </div>

                <!-- 选手选择：对齐 Nuxt UI v3 官方契约 (:items + value-key) -->
                <div class="w-full md:w-64">
                    <USelectMenu v-model="selectedPlayerId" :items="playerItems" value-key="id" placeholder="選擇選手..."
                        class="w-full" />
                </div>
            </div>

            <!-- 2. 时间导航：宏观年份胶囊 + 微观周三比赛日下拉 -->
            <div class="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-gray-400">
                        統計時間範圍 (Timeline Scope)
                    </span>
                    <span class="text-xs font-mono text-gray-500">
                        當前區間: {{ dateRange.start }} ~ {{ dateRange.end }}
                    </span>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-4">
                    <!-- 1. 常用巨集預設 (Presets: 一鍵覆蓋起止年月) -->
                    <div class="flex flex-wrap items-center gap-1.5 bg-gray-100 dark:bg-gray-800/80 p-1 rounded-lg">
                        <button v-for="preset in presets" :key="preset.id"
                            class="px-2.5 py-1 text-xs rounded-md font-mono transition-colors"
                            :class="activePresetId === preset.id ? 'bg-primary-500 text-white font-bold shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'"
                            @click="applyPreset(preset)">
                            {{ preset.label }}
                        </button>
                    </div>

                    <!-- 2. 精確月份選擇器：支援 2024-06 至 2025-06 等任意跨年操作 -->
                    <div class="flex items-center gap-2 text-xs font-mono">
                        <span class="text-gray-400">自訂月份:</span>
                        <input v-model="dateRange.start" type="month" :min="careerBounds.start" :max="dateRange.end"
                            class="bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500" />
                        <span class="text-gray-400">至</span>
                        <input v-model="dateRange.end" type="month" :min="dateRange.start" :max="careerBounds.end"
                            class="bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 3. 图表区 (顺位占比饼图 + 近20场折线图) -->
        <div v-if="selectedPlayerId" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {{ currentPlayer?.label }} · 生涯順位分佈 (三麻)
                </h2>
                <div class="h-72 w-full flex items-center justify-center">
                    <ClientOnly>
                        <VChart v-if="pieOption" :option="pieOption" class="w-full h-full" autoresize />
                        <template #fallback>
                            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
                        </template>
                    </ClientOnly>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    最近 20 場順位趨勢
                </h2>
                <div class="h-72 w-full flex items-center justify-center">
                    <ClientOnly>
                        <VChart v-if="lineOption" :option="lineOption" class="w-full h-full" autoresize />
                        <template #fallback>
                            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
                        </template>
                    </ClientOnly>
                </div>
            </div>
        </div>

        <!-- 中層技術指標區 (2x2 佈局下半部：四維雷達圖 + 和牌形態餅圖) -->
        <div v-if="selectedPlayerId" class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- 1. 四維選手畫像雷達圖 -->
            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-lg font-bold text-gray-900 dark:text-white">四維選手畫像 · Performance Radar</h2>
                        <p class="text-xs text-gray-500">攻 / 速 / 防 (近100局) · 運 (近20局)</p>
                    </div>
                    <UBadge color="primary" variant="subtle" size="xs">Kyoku Level</UBadge>
                </div>

                <div class="h-72 w-full flex items-center justify-center">
                    <ClientOnly>
                        <VChart v-if="radarOption" :option="radarOption" class="w-full h-full" autoresize />
                        <template #fallback>
                            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
                        </template>
                    </ClientOnly>
                </div>
            </div>

            <!-- 2. 和牌形態分佈餅圖 (Riichi vs Dama vs Fulo) -->
            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-lg font-bold text-gray-900 dark:text-white">和牌形態分佈 · Win Methods</h2>
                        <p class="text-xs text-gray-500">立直 / 默聽 / 副露 和牌傾向佔比</p>
                    </div>
                    <UBadge color="neutral" variant="subtle" size="xs">Win Hands Only</UBadge>
                </div>

                <div class="h-72 w-full flex items-center justify-center">
                    <ClientOnly>
                        <VChart v-if="winStyleOption" :option="winStyleOption" class="w-full h-full" autoresize />
                        <template #fallback>
                            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
                        </template>
                    </ClientOnly>
                </div>
            </div>

        </div>

        <!-- 4. 手动荣誉成就展区 (Placeholder) -->
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                <div>
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">榮譽與成就 · Achievements</h2>
                    <p class="text-xs text-gray-500">歷史大賽桂冠與特殊賽事頭名記錄</p>
                </div>
                <UBadge color="neutral" variant="solid" size="xs">手動維護</UBadge>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="(achieve, idx) in achievements" :key="idx"
                    class="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                    <div class="text-2xl">{{ achieve.icon || '🏆' }}</div>
                    <div>
                        <div class="font-bold text-sm text-gray-900 dark:text-white">{{ achieve.title }}</div>
                        <div class="text-xs text-emerald-500 font-mono mt-0.5">{{ achieve.event }}</div>
                        <div class="text-[11px] text-gray-400 mt-1">{{ achieve.date }}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { PieChart, LineChart, RadarChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([PieChart, LineChart, RadarChart, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer])

// 1. 选手数据契约：使用 Nuxt UI v3 原生的 SelectMenuItem 结构 (label + id)
interface PlayerItem {
    id: number
    label: string
}

interface MatchdayItem {
    id: string
    label: string
}

// 3. 选手列表：使用确定性的 PlayerItem[]
const playerItems = ref<PlayerItem[]>([
    { label: 'Klm1200', id: 9577962 },
    { label: 'starekingz', id: 15923304 },
    { label: '段爻九', id: 13739173 }
])
const selectedPlayerId = ref<number>(9577962)

const dateRange = reactive({
    start: '2024-06',
    end: '2025-06' // 👈 完美容納 2024 年 6 月到 2025 年 6 月跨年查詢！
})

const careerBounds = reactive({
    start: '2023-01',
    end: '2026-12'
})

// 3. 快捷預設定義 (本質是巨集指令)
const presets = [
    { id: 'all', label: '生涯全部', start: careerBounds.start, end: careerBounds.end },
    { id: 'recent_1y', label: '近12個月', start: '2025-07', end: '2026-06' },
    { id: '2025', label: '2025全年', start: '2025-01', end: '2025-12' },
    { id: '2024', label: '2024全年', start: '2024-01', end: '2024-12' },
    { id: '2023', label: '2023全年', start: '2023-01', end: '2023-12' }
]

const activePresetId = computed(() => {
    const hit = presets.find(p => p.start === dateRange.start && p.end === dateRange.end)
    return hit ? hit.id : 'custom'
})

const applyPreset = (preset: typeof presets[0]) => {
    dateRange.start = preset.start
    dateRange.end = preset.end
}

// 此时 p 的类型被百分之百锁定为 PlayerItem，无任何 union 杂质
// currentPlayer 的类型精准推导为 PlayerItem | undefined
const currentPlayer = computed(() => playerItems.value.find(p => p.id === selectedPlayerId.value))

// 3. 顺位饼图配置 (三麻仅 1st, 2nd, 3rd)
const rankCounts = ref({ rank1: 18, rank2: 12, rank3: 6 })
const pieOption = computed(() => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c}次 ({d}%)' },
    legend: { bottom: '0', textStyle: { color: '#9ca3af' } },
    series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: '#1f2937', borderWidth: 2 },
        label: { show: false },
        data: [
            { value: rankCounts.value.rank1, name: '1st Place', itemStyle: { color: '#10b981' } },
            { value: rankCounts.value.rank2, name: '2nd Place', itemStyle: { color: '#f59e0b' } },
            { value: rankCounts.value.rank3, name: '3rd Place', itemStyle: { color: '#ef4444' } }
        ]
    }]
}))

// 4. 最近 20 场三麻走势 (顺位 1/2/3，Y 轴倒置)
const recentRanks = ref([1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 1, 2])
const lineOption = computed(() => ({
    tooltip: { trigger: 'axis', formatter: '第 {b} 場: 第 {c} 位' },
    grid: { left: '40', right: '20', top: '20', bottom: '30' },
    xAxis: {
        type: 'category',
        data: Array.from({ length: recentRanks.value.length }, (_, i) => i + 1),
        axisLine: { lineStyle: { color: '#374151' } }
    },
    yAxis: {
        type: 'value',
        inverse: true,
        min: 1,
        max: 3,
        interval: 1,
        axisLabel: {
            formatter: (v: number) => v === 1 ? '1st' : v === 2 ? '2nd' : '3rd'
        },
        splitLine: { lineStyle: { color: '#1f2937' } }
    },
    series: [{
        data: recentRanks.value,
        type: 'line',
        smooth: true,
        symbolSize: 8,
        itemStyle: { color: '#3b82f6' },
        lineStyle: { width: 3, color: '#3b82f6' },
        areaStyle: { color: 'rgba(59, 130, 246, 0.1)' }
    }]
}))

// 1. 模拟的底层单局指标（来自 paipu_rounds 聚合）
// atk: 平均打点, spd: 和牌巡数, def: 放铳率(%), luk: 近20局役种总数
const rawRadarStats = ref({
    atk: 7850,   // 近100局平均打点 (点)
    spd: 9.4,    // 近100局平均和牌巡数 (巡，越小越牛)
    def: 12.8,   // 近100局放铳率 (%，越小越牛)
    luk: 21      // 近20局累计役种数
})

// 2. 好品味数学引擎：将不同物理量纲反转并归一化为 0~100 分数
const normalizedRadarScores = computed(() => {
    const { atk, spd, def, luk } = rawRadarStats.value

    // 攻：以 10000 点为满分标准
    const atkScore = Math.min(100, Math.max(0, (atk / 10000) * 100))
    // 速：基准 15 巡为 0 分，6 巡为 100 分 (反向倒置)
    const spdScore = Math.min(100, Math.max(0, ((15 - spd) / (15 - 6)) * 100))
    // 防：基准 25% 放铳为 0 分，0% 放铳为 100 分 (反向倒置)
    const defScore = Math.min(100, Math.max(0, ((25 - def) / 25) * 100))
    // 运：20 局内以 30 个役为满分
    const lukScore = Math.min(100, Math.max(0, (luk / 30) * 100))

    return [
        Number(atkScore.toFixed(1)),
        Number(spdScore.toFixed(1)),
        Number(defScore.toFixed(1)),
        Number(lukScore.toFixed(1))
    ]
})

// 3. ECharts 雷达图配置
const radarOption = computed(() => ({
    tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderColor: '#374151',
        textStyle: { color: '#f3f4f6', fontSize: 12 },
        formatter: () => `
      <div class="font-bold border-b border-gray-700 pb-1 mb-1 text-emerald-400">四維作風指標</div>
      <div>攻 (ATK): ${normalizedRadarScores.value[0]}分 <span class="text-xs text-gray-400">(${rawRadarStats.value.atk}点)</span></div>
      <div>速 (SPD): ${normalizedRadarScores.value[1]}分 <span class="text-xs text-gray-400">(${rawRadarStats.value.spd}巡)</span></div>
      <div>防 (DEF): ${normalizedRadarScores.value[2]}分 <span class="text-xs text-gray-400">(铳率 ${rawRadarStats.value.def}%)</span></div>
      <div>運 (LUK): ${normalizedRadarScores.value[3]}分 <span class="text-xs text-gray-400">(${rawRadarStats.value.luk}役)</span></div>
    `
    },
    radar: {
        indicator: [
            { name: '攻 ATK\n(打點)', max: 100 },
            { name: '速 SPD\n(巡數)', max: 100 },
            { name: '防 DEF\n(守備)', max: 100 },
            { name: '運 LUK\n(番運)', max: 100 }
        ],
        radius: '65%',
        splitNumber: 4,
        axisName: {
            color: '#9ca3af',
            fontSize: 11,
            fontWeight: 'bold'
        },
        splitLine: {
            lineStyle: { color: 'rgba(156, 163, 175, 0.2)' }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(255, 255, 255, 0.01)', 'rgba(255, 255, 255, 0.03)']
            }
        },
        axisLine: {
            lineStyle: { color: 'rgba(156, 163, 175, 0.2)' }
        }
    },
    series: [{
        type: 'radar',
        data: [{
            value: normalizedRadarScores.value,
            name: '選手風格',
            itemStyle: { color: '#10b981' },
            areaStyle: { color: 'rgba(16, 185, 129, 0.25)' },
            lineStyle: { width: 2, color: '#10b981' },
            symbolSize: 6
        }]
    }]
}))

// 1. 和牌形態統計數據 (來自 paipu_rounds 聚合：立直和 / 默聽和 / 副露和)
const winStyleCounts = ref({
    riichi: 24, // 立直和牌次數
    dama: 8,    // 默聽和牌次數
    fulo: 13    // 副露和牌次數
})

// 2. 計算和牌形態餅圖配置 (自動計算百分比)
const winStyleOption = computed(() => {
    const total = winStyleCounts.value.riichi + winStyleCounts.value.dama + winStyleCounts.value.fulo

    return {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}次 ({d}%)'
        },
        legend: {
            bottom: '0',
            textStyle: { color: '#9ca3af' }
        },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 6,
                borderColor: '#1f2937',
                borderWidth: 2
            },
            label: { show: false },
            data: total > 0 ? [
                { value: winStyleCounts.value.riichi, name: '立直和牌 (Riichi)', itemStyle: { color: '#ef4444' } },
                { value: winStyleCounts.value.dama, name: '默聽和牌 (Dama)', itemStyle: { color: '#3b82f6' } },
                { value: winStyleCounts.value.fulo, name: '副露和牌 (Fulo)', itemStyle: { color: '#f59e0b' } }
            ] : [
                { value: 1, name: '無和牌記錄', itemStyle: { color: '#374151' } }
            ]
        }]
    }
})

// 5. 手动成就占位数据
const achievements = ref([
    { title: '役滿盃 冠軍', event: '2023 March Mahjong Event', date: '2023-03-28', icon: '🏆' },
    { title: '年度大師賽 季軍', event: '2024 December Finals', date: '2024-12-15', icon: '🥉' },
    { title: '活動周單日四連勝', event: '2025 Event Week', date: '2025-06-12', icon: '🔥' }
])
</script>