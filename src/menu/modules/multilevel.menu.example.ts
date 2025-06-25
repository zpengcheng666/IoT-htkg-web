import type { Menu } from '@/global'

const menus: Menu.recordRaw = {
  title: '多级导航',
  meta: {
    title: '多级导航',
    icon: 'heroicons-solid:menu-alt-3',
  },
  children: [
    {
      path: '/multilevel_menu_example/page',
      meta: {
        title: '导航1',
      },
      title: '导航1',
    },
    {
      title: '导航2',
      meta: {
        title: '导航2',
      },
      children: [
        {
          path: '/multilevel_menu_example/level2/page',
          meta: {
            title: '导航2-1',
          },
          title: '导航2-1',
        },
      ],
    },
  ],
}

export default menus
