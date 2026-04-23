<script setup>
const props = defineProps({
  columns: { 
    type: Array, 
    required: true // 例如: [{ accessorKey: 'rank', header: 'RANK' }, { accessorKey: 'game_1', header: '先鋒' }]
  },
  data: { 
    type: Array, 
    required: true // 排行榜数据
  },
  promotedRanks: { 
    type: Array, 
    default: () => [] // 晋级名次：[1, 2, 3]
  },
  disqualifiedRanks: { 
    type: Array, 
    default: () => [] // 淘汰名次：[4, 5]
  },
  isFinal: {
    type: Boolean,
    default: false
  }
})

// 极其纯粹的高亮逻辑，没有任何关于"接力"还是"邀请赛"的废话
const getRankColor = (rank) => {
  if (props.isFinal) {
    if (rank === 1) return 'text-yellow-400 bg-yellow-400/10'
    if (rank === 2) return 'text-slate-300 bg-slate-300/10'
    if (rank === 3) return 'text-amber-600 bg-amber-600/10'
    return 'text-gray-500'
  }
  
  if (props.promotedRanks.includes(rank)) {
    return 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]'
  }
  
  if (props.disqualifiedRanks.includes(rank)) {
    return 'text-red-400 bg-red-400/10 border border-red-400/20 opacity-75'
  }
  
  return 'text-gray-500'
}
</script>

<template>
  <div class="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
    <UTable 
      :columns="columns" 
      :data="data"
      :ui="{ td: { padding: 'py-4 px-4' }, th: { padding: 'py-3 px-4', color: 'text-gray-500 dark:text-gray-400' } }"
    >
      <template #rank-cell="{ row }">
        <div class="text-center font-black text-xl italic px-2 py-1 rounded transition-colors"
             :class="getRankColor(row.original.rank)">
          #{{ row.original.rank }}
        </div>
      </template>

      <template #player-cell="{ row }">
        <div class="flex items-center gap-3">
          <UAvatar :src="row.original.avatar" :alt="row.original.name" size="sm" />
          <span class="font-bold">{{ row.original.name }}</span>
        </div>
      </template>

      <template v-for="col in columns.filter(c => c.accessorKey !== 'rank' && c.accessorKey !== 'player')" :key="col.accessorKey" #[`${col.accessorKey}-cell`]="{ row }">
        <div class="text-center font-mono text-sm font-medium">
          {{ row.original[col.accessorKey] ?? '-' }}
        </div>
      </template>
    </UTable>
  </div>
</template>