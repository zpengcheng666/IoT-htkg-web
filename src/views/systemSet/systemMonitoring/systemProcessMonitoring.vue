<script lang="ts" setup>
// 表头数据  辅助tableData的数据 tableData是自己定义
import { reactive } from 'vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  jvmData1: [] as any,
  jvmData2: [] as any,
  jvmData3: [] as any,
  jvmData4: [] as any,
  precessData1: [] as any,
  precessData2: [] as any,
  precessData3: [] as any,
  precessData4: [] as any,
  precessData5: [] as any,
  tableData2: [],
  tableData3: [],
  form: {
    pageNo: 1,
    pageSize: 30,
  },
  tabActive: '1', // tab栏索引
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增',
  tabList: [] as any,
})
// const total = ref(0) // 总条数

// 获取列表
function getList(params: any) {
  api.get(`/actuator/metrics/${params}`).then((res: any) => {
    if (params === 'jvm.threads.daemon') {
      data.jvmData1 = res.measurements[0]
    }
    else if (params === 'jvm.threads.live') {
      data.jvmData2 = res.measurements[0]
    }
    else if (params === 'jvm.threads.peak') {
      data.jvmData3 = res.measurements[0]
    }
    else if (params === 'jvm.gc.pause') {
      data.jvmData4 = res.measurements[0]
    }
    else if (params === 'process.cpu.usage') {
      data.precessData1 = res.measurements[0]
    }
    else if (params === 'process.uptime') {
      data.precessData2 = res.measurements[0]
    }
    else if (params === 'process.start.time') {
      data.precessData4 = res.measurements[0]
    }
    console.log(data)
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  getList('jvm.threads.daemon')
  getList('jvm.threads.live')
  getList('jvm.threads.peak')
  getList('jvm.gc.pause')
  getList('process.cpu.usage')
  getList('process.uptime')
  getList('process.start.time')
})
</script>

<template>
  <PageMain class="pageBox">
    <el-row style="min-height: 250px;margin-top: 30px;" :gutter="20">
      <el-col :span="12">
        <div>
          <h3>JVM线程相关</h3>
        </div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="属性" align="center" min-width="200px">
            值
          </el-descriptions-item>
          <el-descriptions-item label="JVM守护线程数" align="center" min-width="200px">
            {{ data.jvmData1.value }}
          </el-descriptions-item>
          <el-descriptions-item label="JVM当前活跃线程数" align="center" min-width="200px">
            {{ data.jvmData2.value }}
          </el-descriptions-item>
          <el-descriptions-item label="JVM峰值线程数" align="center" min-width="200px">
            {{ data.jvmData3.value }}
          </el-descriptions-item>
          <el-descriptions-item label="GC 耗时(秒)" align="center" min-width="200px">
            {{ data.jvmData4.value }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="12">
        <div>
          <h3>系统进程相关</h3>
        </div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="属性" align="center" min-width="200px">
            内存
          </el-descriptions-item>
          <el-descriptions-item label="当前进程 CPU 使用率" align="center" min-width="200px">
            {{ data.precessData1.value }}
          </el-descriptions-item>
          <el-descriptions-item label="进程已运行时间" align="center" min-width="200px">
            {{ data.precessData2.value }}
          </el-descriptions-item>
          <el-descriptions-item label="进程启动时间点" align="center" min-width="200px">
            {{ data.precessData4.value }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
  </PageMain>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
