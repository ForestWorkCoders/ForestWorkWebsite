// server/discord/commands/leaderboard.ts
import type { H3Event } from 'h3'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

/**
 * 構造單一複合下拉選單 ActionRow (好品味：狀態自包含，當前選中項自動高亮 default: true)
 */
export function buildCurseLeaderboardComponents(currentYear: number, currentMode: 'count' | 'ratio') {
  const currentKey = `${currentYear}:${currentMode}`

  const options = [
    {
      label: '2026 年度 · 口吐芬芳次數榜',
      value: '2026:count',
      description: '查看 2026 年度累計口吐芬芳總次數排行',
      emoji: { name: '🔢' },
      default: currentKey === '2026:count'
    },
    {
      label: '2026 年度 · 芬芳濃度百分比榜',
      value: '2026:ratio',
      description: '查看 2026 年度口吐芬芳/發言比率排行 (低門檻防噪)',
      emoji: { name: '📊' },
      default: currentKey === '2026:ratio'
    },
    {
      label: '2025 歷史 · 次數排行榜',
      value: '2025:count',
      description: '查看 2025 歷史全年度口吐芬芳總量榮譽榜',
      emoji: { name: '🏛️' },
      default: currentKey === '2025:count'
    },
    {
      label: '2025 歷史 · 百分比排行榜',
      value: '2025:ratio',
      description: '查看 2025 歷史全年度芬芳濃度排行',
      emoji: { name: '📜' },
      default: currentKey === '2025:ratio'
    },
    {
      label: '2024 歷史 · 次數排行榜',
      value: '2024:count',
      description: '查看 2024 歷史全年度口吐芬芳總量榮譽榜',
      emoji: { name: '🏛️' },
      default: currentKey === '2024:count'
    },
    {
      label: '2024 歷史 · 百分比排行榜',
      value: '2024:ratio',
      description: '查看 2024 歷史全年度芬芳濃度排行',
      emoji: { name: '📜' },
      default: currentKey === '2024:ratio'
    },
    {
      label: '2023 歷史 · 次數排行榜',
      value: '2023:count',
      description: '查看 2023 歷史全年度口吐芬芳總量榮譽榜',
      emoji: { name: '🏛️' },
      default: currentKey === '2023:count'
    },
    {
      label: '2023 歷史 · 百分比排行榜',
      value: '2023:ratio',
      description: '查看 2023 歷史全年度芬芳濃度排行',
      emoji: { name: '📜' },
      default: currentKey === '2023:ratio'
    },
    {
      label: '2022 歷史 · 次數排行榜',
      value: '2022:count',
      description: '查看 2022 歷史全年度口吐芬芳總量榮譽榜',
      emoji: { name: '🏛️' },
      default: currentKey === '2022:count'
    },
    {
      label: '2022 歷史 · 百分比排行榜',
      value: '2022:ratio',
      description: '查看 2022 歷史全年度芬芳濃度排行',
      emoji: { name: '📜' },
      default: currentKey === '2022:ratio'
    },
    {
      label: '2021 歷史 · 次數排行榜',
      value: '2021:count',
      description: '查看 2021 歷史全年度口吐芬芳總量榮譽榜',
      emoji: { name: '🏛️' },
      default: currentKey === '2021:count'
    },
    {
      label: '2021 歷史 · 百分比排行榜',
      value: '2021:ratio',
      description: '查看 2021 歷史全年度芬芳濃度排行',
      emoji: { name: '📜' },
      default: currentKey === '2021:ratio'
    },
    {
      label: '2020 歷史 · 次數排行榜',
      value: '2020:count',
      description: '查看 2020 歷史全年度口吐芬芳總量榮譽榜',
      emoji: { name: '🏛️' },
      default: currentKey === '2020:count'
    },
    {
      label: '2020 歷史 · 百分比排行榜',
      value: '2020:ratio',
      description: '查看 2020 歷史全年度芬芳濃度排行',
      emoji: { name: '📜' },
      default: currentKey === '2020:ratio'
    }
  ]

  return [
    {
      type: 1, // ACTION_ROW
      components: [
        {
          type: 3, // STRING_SELECT
          custom_id: 'leaderboard_curse_switch',
          placeholder: '⚡ 點擊切換年份或排行榜模式...',
          options
        }
      ]
    }
  ]
}

/**
 * 核心渲染純函數：傳入 (年份, 模式, 觀察者ID)，產出 (Embed + Components)
 */
export async function renderCurseLeaderboardPayload(
  queryYear: number,
  mode: 'count' | 'ratio',
  viewerId: string
) {
  const supabase = getSupabase()
  const isRatio = mode === 'ratio'

  // 1. 精準拉取前 10 名
  let topQuery = supabase
    .schema('trpg')
    .from('curse_stats')
    .select('user_id, username, count, total_messages')
    .eq('year', queryYear)

  let top10: any[] = []

  if (isRatio) {
    const { data: ratioData } = await topQuery
      .gte('total_messages', 5)
      .order('count', { ascending: false })
      .limit(50)

    if (ratioData) {
      top10 = [...ratioData]
        .sort((a, b) => {
          const rA = a.total_messages > 0 ? a.count / a.total_messages : 0
          const rB = b.total_messages > 0 ? b.count / b.total_messages : 0
          return rB - rA
        })
        .slice(0, 10)
    }
  } else {
    const { data: countData } = await topQuery
      .order('count', { ascending: false })
      .limit(10)
    top10 = countData || []
  }

  // 構造前 10 名文本
  let rankContent = ''
  if (top10.length === 0) {
    rankContent = `📊 **${queryYear} 年度口吐芬芳排行榜** 尚無統計數據！`
  } else {
    rankContent = top10.map((item, idx) => {
      const name = item.username || `用戶_${String(item.user_id).slice(-4)}`
      if (isRatio) {
        const pct = item.total_messages > 0 ? ((item.count / item.total_messages) * 100).toFixed(2) : '0.00'
        return `#${idx + 1} **${name}**\n口吐芬芳百分比: \`${pct}%\` (${item.count}/${item.total_messages})`
      } else {
        return `#${idx + 1} **${name}**\n口吐芬芳次數: \`${item.count}\` 次`
      }
    }).join('\n\n')
  }

  // 2. 獨立查詢當前操作者的個人戰績
  let personalRankBlock = ''
  const { data: myData } = await supabase
    .schema('trpg')
    .from('curse_stats')
    .select('user_id, username, count, total_messages')
    .eq('year', queryYear)
    .eq('user_id', viewerId)
    .maybeSingle()

  if (myData && myData.count > 0) {
    let myRank = 1
    if (!isRatio) {
      const { count: higherCount } = await supabase
        .schema('trpg')
        .from('curse_stats')
        .select('*', { count: 'exact', head: true })
        .eq('year', queryYear)
        .gt('count', myData.count)

      myRank = (higherCount || 0) + 1
      personalRankBlock = `\n\n--- **你的排名** ---\n第 **${myRank}** 名\n次數: \`${myData.count}\`  總訊息: \`${myData.total_messages}\``
    } else {
      const myRate = myData.total_messages > 0 ? myData.count / myData.total_messages : 0
      const myPct = (myRate * 100).toFixed(2)

      const { data: allRatio } = await supabase
        .schema('trpg')
        .from('curse_stats')
        .select('count, total_messages')
        .eq('year', queryYear)
        .gte('total_messages', 5)

      if (allRatio) {
        const higher = allRatio.filter(r => (r.count / r.total_messages) > myRate).length
        myRank = higher + 1
      }
      personalRankBlock = `\n\n--- **你的排名** ---\n第 **${myRank}** 名\n百分比: \`${myPct}%\`  次數: \`${myData.count}/${myData.total_messages}\``
    }
  } else {
    personalRankBlock = `\n\n--- **你的排名** ---\n未入榜 (閣下在 ${queryYear} 年尚未在監控頻道發表帶有口吐芬芳的訊息)`
  } const title = isRatio ? `📊 口吐芬芳 百分比排行榜 (${queryYear})`
    : `📊 口吐芬芳 次數排行榜 (${queryYear})`
  return {
    embeds: [{
      title, description: rankContent + personalRankBlock, color: isRatio ? 0x3498DB : 0x2ECC71, footer: {
        text: `更新時間: ${new Date().toISOString().replace('T', ' ').slice(0, 19)} · 每年 1 月 1 日重置`
      }
    }],
    components: buildCurseLeaderboardComponents(queryYear, mode)
  }
}

// -------------------------------------------------------------
// 3. 斜槓指令入口 (/leaderboard)
// -------------------------------------------------------------
export async function handleLeaderboardCommand(interaction: any, event: H3Event) {
  const callerId = String(interaction.member?.user?.id || interaction.user?.id || '')
  const subCommand = interaction.data?.options?.[0]?.name
  const subOptions = interaction.data?.options?.[0]?.options || []

  if (subCommand === 'curse') {
    const inputYear = subOptions.find((o: any) => o.name === 'year')?.value
    const inputMode = subOptions.find((o: any) => o.name === 'mode')?.value

    const queryYear = inputYear ? Number(inputYear) : new Date().getFullYear()
    const mode = inputMode === 'ratio' ? 'ratio' : 'count'

    const payload = await renderCurseLeaderboardPayload(queryYear, mode, callerId)

    return {
      type: 4, // 初始回應用戶：發送帶組件的新訊息
      data: payload
    }
  }

  return {
    type: 4,
    data: { content: `⚠️ 未知的排行榜類型：\`${subCommand}\``, flags: 64 }
  }
}