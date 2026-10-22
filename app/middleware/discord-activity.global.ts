// middleware/discord-activity.global.ts

export default defineNuxtRouteMiddleware((to) => {
  // 1. 守卫：仅在根路由 '/' 时进行环境判定与分流，不干扰其他子页面
  if (to.path !== '/') return

  // 2. ★ 核心好品味：使用 Nuxt 官方同构 API，服务端/客户端通用，彻底告别 h3 导入陷阱
  const url = useRequestURL()

  // 3. 判定是否处于 Discord 活动沙盒中：
  // - 域名命中 Discord 官方代理域 (discordsays.com)
  // - 或 URL 参数中携带 Discord 客户端注入的 frame_id 通信凭据
  const isDiscordSays = url.hostname.includes('discordsays.com')
  const hasFrameId = Boolean(to.query.frame_id)

  // 4. 命中间隙：在组件渲染的第 0 毫秒执行 SPA 级无感跳转，彻底消灭 index.vue 露脸闪烁！
  if (isDiscordSays || hasFrameId) {
    return navigateTo(
      {
        path: '/activities/skill-test',
        query: to.query // 原样透传所有通信参数 (frame_id, platform 等)
      },
      { replace: true }
    )
  }
})