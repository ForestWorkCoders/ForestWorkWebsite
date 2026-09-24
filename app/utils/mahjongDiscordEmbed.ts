// app/utils/mahjongDiscordEmbed.ts

interface PlayerResult {
  rank: number
  name: string
  score: number
  pts: number
}

interface MatchEmbedInput {
  title: string
  description?: string
  matchUrl: string
  bannerUrl?: string
  players?: PlayerResult[]
}

export function buildMatchDiscordEmbed(input: MatchEmbedInput) {
  const medals = ['🥇', '🥈', '🥉', '4位']

  // 1. 如果有选手结算数据，生成顺位列表；否则展示描述
  let bodyContent = input.description || '林間小鎮賽事即時戰況與積分榜查閱。'

  if (input.players && input.players.length > 0) {
    const scoreboardText = [...input.players]
      .sort((a, b) => a.rank - b.rank)
      .map((p, idx) => {
        const medal = medals[idx] || `${p.rank}位`
        const ptsSign = p.pts > 0 ? `+${p.pts}` : `${p.pts}`
        return `${medal} **${p.name}** ⎯ \`${p.score}點\` (${ptsSign})`
      })
      .join('\n')

    bodyContent = `**【對局最終結算】**\n${scoreboardText}`
  }

  const contentMarkdown = `# ${input.title}\n\n${bodyContent}`

  // 2. 组装规范组件树
  return {
    component: {
      type: 17,
      accent_color: 5011302, // #4C7766 林间墨绿
      spoiler: false,
      components: [
        {
          type: 10,
          content: contentMarkdown
        },
        ...(input.bannerUrl
          ? [
              {
                type: 12,
                items: [
                  {
                    media: { url: input.bannerUrl },
                    description: 'Banner',
                    spoiler: false
                  }
                ]
              }
            ]
          : []),
        {
          type: 14,
          spacing: 1,
          divider: true
        },
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5,
              label: '查看完整數據',
              emoji: { name: '🀄' },
              url: input.matchUrl
            },
            {
              type: 2,
              style: 5,
              label: '賽事總覽',
              emoji: { name: '🌲' },
              url: 'https://forestwork.vercel.app'
            }
          ]
        }
      ]
    }
  }
}