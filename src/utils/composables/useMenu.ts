import router from '@/router'
import useSettingsStore from '@/store/modules/settings'
import useMenuStore from '@/store/modules/menu'
import { isExternalLink } from '@/utils'

export default function useMenu() {
  const settingsStore = useSettingsStore()
  const menuStore = useMenuStore()

  function switchTo(index: number | string) {
    // console.log(index)
    if (index === 2) {
      return false
    }
    // console.log(settingsStore.menu.switchMainMenuAndPageJump)

    if (settingsStore.menu.switchMainMenuAndPageJump) {
      if (isExternalLink(menuStore.sidebarMenusFirstDeepestPath)) {
        window.open(menuStore.sidebarMenusFirstDeepestPath, '_blank')
      }
      else {
        // console.log(menuStore.sidebarMenusFirstDeepestPath)

        router.push(menuStore.sidebarMenusFirstDeepestPath)
      }
    }
    menuStore.setActived(index)
  }

  return {
    switchTo,
  }
}
