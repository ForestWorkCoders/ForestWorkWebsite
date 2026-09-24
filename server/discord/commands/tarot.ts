// server/discord/commands/tarot.ts
import crypto from 'node:crypto'
import type { H3Event } from 'h3'
import { getInteractionOption } from '../utils'
import { TAROT_DECK, type TarotCard } from '../assets/tarot-deck'

// 專案的 CDN 基礎位址
const ASSET_BASE_URL = 'https://forestwork.vercel.app/tarot'

// 預定義 10 個牌位的象徵名義 (涵蓋單牌、三牌陣至凱爾特十字)
const POSITION_NAMES = [
  '第一位 · 現狀 / 核心',
  '第二位 · 阻礙 / 助力',
  '第三位 · 根基 / 過去',
  '第四位 · 近況 / 過往',
  '第五位 · 希望 / 目標',
  '第六位 · 未來 / 趨勢',
  '第七位 · 自我 / 心態',
  '第八位 · 環境 / 他人',
  '第九位 · 期盼 / 恐懼',
  '第十位 · 終局 / 啟示'
] as const

/**
 * 密碼學安全無放回抽樣：精確選出 N 張不重複卡牌 (N <= 22)
 */
function drawUniqueCards(deck: readonly TarotCard[], count: number): TarotCard[] {
  const pool = [...deck]
  const drawn: TarotCard[] = []
  
  for (let i = 0; i < count; i++) {
    const pickIndex = crypto.randomInt(i, pool.length)
    const temp = pool[i]!
    pool[i] = pool[pickIndex]!
    pool[pickIndex] = temp
    drawn.push(pool[i]!)
  }
  
  return drawn
}

export async function handleTarot(interaction: any, event: H3Event) {
  const question = getInteractionOption<string>(interaction, 'question')?.trim()
  const rawCount = getInteractionOption<number>(interaction, 'count')

  // ★ 核心品味：入口歸一化！將數量收窄在嚴格的 [1, 10] 區間，預設 3 張
  const count = Math.min(10, Math.max(1, rawCount || 3))

  // 1. 無放回抽取卡牌
  const drawnCards = drawUniqueCards(TAROT_DECK, count)

  // 2. 映射為 1 ~ 10 個結構對稱的 Discord Embed (每個 Embed 自帶對應卡面的縮略圖)
  const embeds = drawnCards.map((card, idx) => {
    const isUpright = crypto.randomInt(0, 2) === 1
    const orientationText = isUpright ? '正位 (Upright)' : '逆位 (Reversed)'
    const statusBadge = isUpright ? '🟢' : '🔴'
    const interpretation = isUpright ? card.upright : card.reversed
    
    // 正位原圖，逆位切換為倒懸立繪
    const finalFile = isUpright ? card.file : card.file.replace('.png', '_rev.png')
    const imageUrl = `${ASSET_BASE_URL}/${finalFile}`
    
    const posLabel = count === 1 ? '單牌占卜' : (POSITION_NAMES[idx] || `第 ${idx + 1} 位`)

    const fields = []
    // 僅在第一個 Embed 頂部掛載提問內容
    if (idx === 0 && question) {
      fields.push({
        name: '❓ 閣下的疑問',
        value: `*「${question}」*`,
        inline: false
      })
    }

    fields.push(
      {
        name: `${statusBadge} 狀態`,
        value: `**${orientationText}**`,
        inline: true
      },
      {
        name: '📜 啟示釋義',
        value: interpretation,
        inline: false
      }
    )

    const isLast = idx === count - 1

    return {
      title: `🎴 【${posLabel}】${card.name}`,
      color: isUpright ? 0x4C7766 : 0x8B3A3A, // 正位墨綠，逆位酒紅
      fields,
      thumbnail: {
        url: imageUrl // 每張牌都擁有獨立且正確旋轉的立繪縮略圖
      },
      footer: isLast ? {
        text: `林間小鎮 · 命運塔羅 (${count} 牌陣) · 僅供心靈指引`,
        icon_url: 'https://i.imgur.com/cu2YAkn.png'
      } : undefined,
      timestamp: isLast ? new Date().toISOString() : undefined
    }
  })

  // 3. 單向回執：直接交付 1~10 個 Embeds
  return {
    type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
    data: { embeds }
  }
}