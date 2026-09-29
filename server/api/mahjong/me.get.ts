// server/api/mahjong/me.get.ts
import { serverSupabaseClient } from '#supabase/server'
import { getCookie } from 'h3'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  // 1. 讀取全站統一的會話 Cookie (依據先前 Discord Auth 的約定)
  // 如果你先前封裝了 getSessionFromCookie 工具函式，直接呼叫；此處提供防禦性讀取
  const sessionUser = event.context.user // 若有中間件解析
    || JSON.parse(getCookie(event, 'fw_session') || 'null')

  if (!sessionUser?.id) {
    return { loggedIn: false, linked: false, player: null }
  }

  const supabase = await serverSupabaseClient<Database>(event)

  // 2. 用字串化 Discord ID 查詢雀魂參賽者名冊
  const { data: participant, error } = await supabase
    .schema('mahjong')
    .from('participants')
    .select('account_id, nickname, discord_id')
    .eq('discord_id', sessionUser.id)
    .maybeSingle()

  if (error || !participant) {
    return {
      loggedIn: true,
      linked: false,
      discordUser: sessionUser,
      player: null
    }
  }

  return {
    loggedIn: true,
    linked: true,
    discordUser: sessionUser,
    player: {
      accountId: participant.account_id,
      nickname: participant.nickname
    }
  }
})