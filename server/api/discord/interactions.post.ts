import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
  // 1. 提取头部凭证
  const signature = getHeader(event, 'x-signature-ed25519')
  const timestamp = getHeader(event, 'x-signature-timestamp')
  const rawBody = await readRawBody(event)
  const publicKeyHex = process.env.DISCORD_PUBLIC_KEY

  if (!signature || !timestamp || !rawBody || !publicKeyHex) {
    throw createError({ statusCode: 401, statusMessage: 'Bad request signature' })
  }

  // 2. 原生 Ed25519 验签
  const publicKey = crypto.createPublicKey({
    key: Buffer.concat([
      Buffer.from('302a300506032b6570032100', 'hex'),
      Buffer.from(publicKeyHex, 'hex')
    ]),
    format: 'der',
    type: 'spki'
  })

  const isValid = crypto.verify(
    null,
    Buffer.from(timestamp + rawBody, 'utf-8'),
    publicKey,
    Buffer.from(signature, 'hex')
  )

  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid request signature' })
  }

  const message = JSON.parse(rawBody)

  // 3. 处理 Discord PING 握手
  if (message.type === 1) {
    setHeader(event, 'content-type', 'application/json')
    return { type: 1 }
  }

  // 4. 业务响应：装配精炼的 Embed + 按钮操作栏 (Components)
  setHeader(event, 'content-type', 'application/json')
  return {
    type: 4, // 立即通道响应 (ChannelMessageWithSource)
    data: {
      embeds: [
        {
          title: '林間小鎮 · ForestWork',
          description: '林間小鎮賽事歷史與社群活動中心。\n即時牌譜查閱、賽事積分追蹤與趣味同樂。',
          url: 'https://forestwork.vercel.app',
          color: 0x4C7766, // 品牌林间墨绿 (HEX: #4C7766 转为十进制整数)
          thumbnail: {
            url: 'https://i.imgur.com/cu2YAkn.png'
          }
        }
      ],
      components: [
        {
          type: 1, // Action Row (按钮容器)
          components: [
            {
              type: 2, // Button
              style: 5, // Link Button (外部链接样式，带右上角箭头图标)
              label: '進入首頁',
              url: 'https://forestwork.vercel.app'
            },
            {
              type: 2,
              style: 5,
              label: '日麻賽事',
              url: 'https://forestwork.vercel.app/games/mahjongsoul'
            },
            {
              type: 2,
              style: 5,
              label: '加入 Discord',
              url: 'https://discord.gg/lin-jian-xiao-zhen-510192195509157909'
            }
          ]
        }
      ]
    }
  }
})