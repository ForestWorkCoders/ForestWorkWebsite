<script setup lang="ts">
import { toComponentEmbedJson } from 'discord-component-embed';
import { SpeedInsights } from '@vercel/speed-insights/vue';
import { Analytics } from '@vercel/analytics/vue';

// 1. 常规 SEO / 社交平台兜底 (当平台不支持 component-embed 时降级显示)
useSeoMeta({
  title: '林間小鎮 · ForestWork',
  ogTitle: '林間小鎮 · ForestWork',
  description: '林間小鎮賽事網頁',
  ogDescription: '林間小鎮賽事網頁',
  ogImage: 'https://i.imgur.com/cu2YAkn.png',
  ogUrl: 'https://forestwork.vercel.app',
  twitterCard: 'summary_large_image',
  themeColor: '#4C7766'
})

// 2. Discord 官方爬虫专属组件树 (静态嵌入式)
const discordEmbedPayload = {
  component: {
    type: 17, // 主容器 Container
    accent_color: 5011302, // #4C7766 林间墨绿
    spoiler: false,
    components: [
      {
        type: 9, // Section 块 (带右侧小图)
        components: [
          {
            type: 10, // Text
            content: '# 林間小鎮 · ForestWork\n林間小鎮賽事歷史與社群活動中心。\n即時牌譜查閱、賽事積分追蹤與趣味同樂。'
          }
        ],
        accessory: {
          type: 11, // Thumbnail 媒体缩略图
          media: {
            url: 'https://i.imgur.com/cu2YAkn.png'
          }
        }
      },
      {
        type: 14, // Divider 分割线
        spacing: 1,
        divider: true
      },
      {
        type: 1, // Action Row 按钮容器
        components: [
          {
            type: 2, // Button
            style: 5, // Link Button
            label: '進入首頁',
            emoji: { name: '🌲' },
            url: 'https://forestwork.vercel.app/'
          },
          {
            type: 2,
            style: 5,
            label: '日麻賽事',
            emoji: { name: '🀄' },
            url: 'https://forestwork.vercel.app/games/mahjongsoul'
          },
          {
            type: 2,
            style: 5,
            label: '加入 Discord',
            emoji: { name: '📌' },
            url: 'https://discord.gg/lin-jian-xiao-zhen-510192195509157909'
          }
        ]
      }
    ]
  }
}

useHead({
  script: [
    {
      id: 'discord:component-embed',
      type: 'application/json',
      innerHTML: JSON.stringify(discordEmbedPayload)
    }
  ]
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <SpeedInsights />
    <Analytics />
  </div>
</template>