<script lang="ts" setup>
// 表头数据  辅助tableData的数据 tableData是自己定义
import { reactive } from 'vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const tableHeader1 = reactive([
  {
    prop: 'index',
    label: '属性',
  },
  {
    prop: 'name',
    label: '值',
  },
])
const tableHeader2 = reactive([
  {
    prop: 'index',
    label: '属性',
  },
  {
    prop: 'name',
    label: '内存',
  },
  {
    prop: 'name',
    label: 'JVM',
  },
])
const data = reactive({
  cpuData: [] as any,
  memData: [] as any,
  sysData: [] as any,
  sysFilesData: [] as any,
  jvmData: [] as any,
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
const total = ref(0) // 总条数
// 分页改变事件
const sizeChange = (val: number) => {
  data.form.pageSize = val
  getList()
}
// 当前页改变事件
const currentChange = (val: number) => {
  data.form.pageNo = val
  getList()
}
// 点击tab
function clickTab() {
  getList()
}
// 获取列表
function getList() {
  api.get('/monitor/server').then((res: any) => {
    data.cpuData = res.data.cpu
    data.memData = res.data.mem
    data.sysData = res.data.sys
    data.sysFilesData = res.data.sysFiles
    data.jvmData = res.data.jvm
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  getList()
})
</script>

<template>
  <PageMain class="pageBox">
    <el-row style="min-height: 250px;margin-top: 30px;" :gutter="20">
      <el-col :span="12">
        <div>
          <h3>CPU利用情况</h3>
        </div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="属性" align="center" min-width="200px">
            值
          </el-descriptions-item>
          <el-descriptions-item label="核心数" align="center" min-width="200px">
            {{ data.cpuData.cpuNum }}
          </el-descriptions-item>
          <el-descriptions-item label="用户使用率" align="center" min-width="200px">
            {{ data.cpuData.used }}
          </el-descriptions-item>

          <el-descriptions-item label="系统使用率" align="center" min-width="200px">
            {{ data.cpuData.sys }}
          </el-descriptions-item>
          <el-descriptions-item label="当前空闲率" align="center" min-width="200px">
            {{ data.cpuData.free }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="12">
        <div>
          <h3>内存使用情况</h3>
        </div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="属性" align="center" min-width="200px">
            内存
          </el-descriptions-item>
          <el-descriptions-item label="总内存" align="center" min-width="200px">
            {{ data.memData.total }}
          </el-descriptions-item>
          <el-descriptions-item label="已用内存" align="center" min-width="200px">
            {{ data.memData.used }}
          </el-descriptions-item>

          <el-descriptions-item label="剩余内存" align="center" min-width="200px">
            {{ data.memData.free }}
          </el-descriptions-item>
          <el-descriptions-item label="使用率" align="center" min-width="200px">
            {{ data.memData.usage }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="12">
        <div>
          <h3>服务器信息</h3>
        </div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="属性" align="center" min-width="200px">
            值
          </el-descriptions-item>
          <el-descriptions-item label="当前服务器名称" align="center" min-width="200px">
            {{ data.sysData.computerName }}
          </el-descriptions-item>
          <el-descriptions-item label="服务器IP" align="center" min-width="200px">
            {{ data.sysData.computerIp }}
          </el-descriptions-item>

          <el-descriptions-item label="操作系统" align="center" min-width="200px">
            {{ data.sysData.osName }}
          </el-descriptions-item>
          <el-descriptions-item label="系统架构" align="center" min-width="200px">
            {{ data.sysData.osArch }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="12">
        <div>
          <h3>JVM信息</h3>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Java名称" align="center" min-width="200px">
            {{ data.jvmData.name }}
          </el-descriptions-item>
          <el-descriptions-item label="Java版本" align="center" min-width="200px">
            {{ data.jvmData.version }}
          </el-descriptions-item>
          <el-descriptions-item label="安装路径" align="center" min-width="200px">
            {{ data.jvmData.home }}
          </el-descriptions-item>
          <el-descriptions-item label="启动时间" align="center" min-width="200px">
            {{ data.jvmData.startTime }}
          </el-descriptions-item>
          <el-descriptions-item label="运行时长" align="center" min-width="200px">
            {{ data.jvmData.runTime }}
          </el-descriptions-item>
          <el-descriptions-item label="空闲数量" align="center" min-width="200px">
            {{ data.jvmData.free }}
          </el-descriptions-item>
          <el-descriptions-item label="已使用数量" align="center" min-width="200px">
            {{ data.jvmData.used }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col v-for="(item, index) in data.sysFilesData " :key="index" :span="12">
        <div>
          <h3>{{ item.typeName }}</h3>
        </div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="属性" align="center" min-width="200px">
            值
          </el-descriptions-item>
          <el-descriptions-item label="盘符路径" align="center" min-width="200px">
            {{ item.dirName }}
          </el-descriptions-item>
          <el-descriptions-item label="文件系统" align="center" min-width="200px">
            {{ item.sysTypeName }}
          </el-descriptions-item>
          <el-descriptions-item label="总大小" align="center" min-width="200px">
            {{ item.total }}
          </el-descriptions-item>
          <el-descriptions-item label="可用大小" align="center" min-width="200px">
            {{ item.free }}
          </el-descriptions-item>
          <el-descriptions-item label="已用大小" align="center" min-width="200px">
            {{ item.used }}
          </el-descriptions-item>
          <el-descriptions-item label="已用百分比" align="center" min-width="200px">
            {{ item.usage }}
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
