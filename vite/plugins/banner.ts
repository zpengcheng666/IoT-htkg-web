import banner from 'vite-plugin-banner'

export default function createBanner() {
  return banner(`
/**
 * 由 Fantastic-admin 提供技术支持
 * Powered by Fantastic-admin
 * Gitee
 * Github https://github.com/hooray/fantastic-admin
 */
  `)
}
