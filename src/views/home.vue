<!--
 * @Description:首页
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-11-14 10:49:00
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-05-16 15:03:37
-->
<script lang="ts" setup>
import Header from '../layouts/components/Header/index.vue'
import useSettingsStore from '@/store/modules/settings'
import pageBg from '@/assets/images/page-bg.jpg'
import bannerUrl1 from '@/assets/images/home-banner-1.png'
import bannerUrl2 from '@/assets/images/home-banner-2.png'
import bannerUrl3 from '@/assets/images/home-banner-3.png'
import bannerUrl4 from '@/assets/images/home-banner-4.png'
import homeTitleIcon1 from '@/assets/images/home-title-1.png'
import homeTitleIcon2 from '@/assets/images/home-title-2.png'
import homeTitleIcon3 from '@/assets/images/home-title-3.png'
import homeTitleIcon4 from '@/assets/images/home-title-4.png'
import useMenuStore from '@/store/modules/menu'
import useRouteStore from '@/store/modules/route'
const menuStore = useMenuStore()
const routeStore = useRouteStore()
const router = useRouter()
const bgStyle = reactive({
  backgroundImage: `url(${pageBg})`,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center bottom',
})
// 跳转页面
function toPage(path: string | undefined, active: any) {
  router.push({
    name: path,
  })
  // setTimeout(() => {
    menuStore.setTabActive(active)
    sessionStorage.setItem('tabActive', active)
  // }, 50)
}
const homeList = reactive([{
  name: '安全防范分系统',
  bannerUrl: bannerUrl1,
  homeTitleIcon: homeTitleIcon1,
  list: [
    {
      icon: 'aq-icon1',
      title: '门禁安检子系统',
    }, {
      icon: 'aq-icon2',
      title: '音视频监控子系统',
    }, {
      icon: 'aq-icon3',
      title: '火灾报警子系统',
    }, {
      icon: 'aq-icon4',
      title: '周边警戒子系统',
    }, {
      icon: 'aq-icon5',
      title: '核化安全子系统',
    }, {
      icon: 'aq-icon6',
      title: '综合防护子系统',
    }, {
      icon: 'aq-icon7',
      title: '信息技术安全监测子系统',
    }, {
      icon: 'aq-icon8',
      title: '安全保密子系统',
    },
  ],
}, {
  name: '阵地管理分系统',
  bannerUrl: bannerUrl2,
  homeTitleIcon: homeTitleIcon2,
  list: [{
    icon: 'zd-icon1',
    title: '环境监控子系统',
  }, {
    icon: 'zd-icon2',
    title: '电力监控子系统',
  }, {
    icon: 'zd-icon3',
    title: '给排水监控子系统',
  }, {
    icon: 'zd-icon4',
    title: '设施设备管理子系统',
  }, {
    icon: 'zd-icon5',
    title: '生活保障子系统',
  }, {
    icon: 'zb-icon7',
    title: '备品备件管理子系统',
  }],
}, {
  name: '装备管理分系统',
  bannerUrl: bannerUrl3,
  homeTitleIcon: homeTitleIcon3,
  list: [{
    icon: 'zb-icon1',
    title: '装备数质量管理子系统',
  }, {
    icon: 'zb-icon2',
    title: '装备日常管理子系统',
  }, {
    icon: 'zb-icon3',
    title: '导弹测试管理子系统',
  }, {
    icon: 'zb-icon4',
    title: '液体推进剂管理子系统',
  }, {
    icon: 'zb-icon5',
    title: '计量管理子系统',
  }, {
    icon: 'zb-icon6',
    title: '维修管理子系统',
  }, {
    icon: 'zb-icon7',
    title: '物资备件管理子系统',
  }, {
    icon: 'zb-icon8',
    title: '技术安全管理子系统',
  }, {
    icon: 'zb-icon9',
    title: '特装监控子系统',
  }, {
    icon: 'zb-icon10',
    title: '技术支持与辅助决策子系统',
  }, {
    icon: 'zb-icon11',
    title: '文档资料管理子系统',
  }, {
    icon: 'zb-icon12',
    title: '生活保障装备子系统',
  }],
}, {
  name: '指挥监控分系统',
  bannerUrl: bannerUrl4,
  homeTitleIcon: homeTitleIcon4,
  list: [{
    icon: 'zh-icon1',
    title: '音视频调度子系统',
  }, {
    icon: 'zh-icon2',
    title: '作战指挥子系统',
  }, {
    icon: 'zh-icon3',
    title: '武器动态信息监控子系统',
  }, {
    icon: 'zh-icon4',
    title: '发射监控子系统',
  }, {
    icon: 'zh-icon5',
    title: '智能广播子系统',

  }, {
    icon: 'zh-icon6',
    title: '信息发布子系统',
  }] as any,
}])
onMounted(() => {
  const routesList = routeStore.routesList as any
  for (const i in homeList) {
    for (const j in routesList) {
      if (routesList[j].title === homeList[i].name) {
        for (const k in homeList[i].list) {
          for (const l in routesList[j].children) {
            if (homeList[i].list[k].title === routesList[j].children[l].title) {
              homeList[i].list[k].path = routesList[j].children[l].children[0].children[0].name
              homeList[i].list[k].active = parseInt(l)
            }
          }
        }
      }
    }
  }


})
</script>

<template>
  <Header />
  <div class="home-box">
    <div class="home-con-box" :style="bgStyle">
      <div class="home-con">
        <div v-for="(v, i) in homeList" :key="i" class="home-list-box" :class="`home-box${i}`">
          <div class="home-list-title" :class="`home-list-title${i}`">
            {{ v.name }}
          </div>
          <div class="home-list-banner-box">
            <img :src="v.bannerUrl" class="home-list-banner">
          </div>
          <img :src="v.homeTitleIcon" class="home-title-icon" alt="">
          <div
            v-for="(item, index) in v.list" :key="`c${index}`" class="home-list-con-box"
            :class="item.path ? `home-list-con-box${i}` : ''"
            @click="toPage(item.path, item.active)"
          >
            <div class="home-list-con">
              <el-icon>
                <svg-icon :name="item.icon" />
              </el-icon>
              <div class="home-list-text">
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-box {
  width: 100%;
  height: 100%;
  padding-top: 120px;
  background-color: #f2f3f5;

  .home-con-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    .home-con {
      width: 1196px;
      margin: 0 auto;
      display: flex;

      .home-list-box {
        width: 290px;
        height: 630px;
        margin-right: 12px;
        background: #fff;
        position: relative;

        .home-title-icon {
          position: absolute;
          top: -24px;
          left: 20px;
        }

        .home-list-title {
          width: 100%;
          height: 49px;
          line-height: 44px;
          text-align: center;
          font-weight: bold;
        }

        .home-list-title0 {
          border-top: 5px solid #258d63;
          background-color: #d0f1db;
          color: #258d63;
        }

        .home-list-title1 {
          border-top: 5px solid #d96557;
          background-color: #fbe6dd;
          color: #d96557;
        }

        .home-list-title2 {
          border-top: 5px solid #5b85a3;
          background-color: #c4e3f8;
          color: #5b85a3;
        }

        .home-list-title3 {
          border-top: 5px solid #e56f00;
          background-color: #fbe0c6;
          color: #e56f00;
        }

        .home-list-banner-box {
          width: 100%;
          padding: 10px;

          .home-list-banner {
            width: 100%;
          }
        }

        .home-list-con-box {
          padding: 0 10px;
          color: #999;
          font-size: 16px;
          padding-bottom: 0;

          .home-list-con {
            width: 100%;
            height: 35px;
            line-height: 35px;
            vertical-align: middle;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-bottom: dashed 1px #666;
            padding-left: 10px;

            .home-list-text {
              margin-left: 8px;
            }
          }
        }

        .home-list-con-box0 {
          color: #258d63;
          cursor: pointer;

          .home-list-con {
            border-bottom: dashed 1px #258d63;
          }
        }

        .home-list-con-box1 {
          color: #d96557;
          cursor: pointer;

          .home-list-con {
            border-bottom: dashed 1px #d96557;
          }
        }

        .home-list-con-box2 {
          color: #5b85a3;
          cursor: pointer;

          .home-list-con {
            border-bottom: dashed 1px #5b85a3;
          }
        }

        .home-list-con-box3 {
          color: #e56f00;
          cursor: pointer;

          .home-list-con {
            border-bottom: dashed 1px #e56f00;
          }
        }
      }

      .home-box0 {
        border: 1px solid #258d63;
      }

      .home-box1 {
        border: 1px solid #d96557;
      }

      .home-box2 {
        border: 1px solid #5b85a3;
      }

      .home-box3 {
        border: 1px solid #e56f00;
      }

      .home-list-box:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
