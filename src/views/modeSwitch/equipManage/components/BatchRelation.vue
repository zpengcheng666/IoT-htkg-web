<!--
 * @Description: 批量关联弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-08-07 10:53:46
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 11:47:27
-->
<script  setup lang='ts'>
import api from '@/api'

const props = defineProps<{
  deviceId: string
}>()
const emits = defineEmits(['submitDialog', 'closeDialog'])
const data = reactive(
  {
    selectAttrId: '',
    selectPointId: '',
    wgList: [] as any,
    sbList: [] as any[],
    pointList: [] as any[],
    attrList: [] as any[],
    form: {
      wgId: '',
      deviceId: '',
    },
  },
)
const submitDialog = () => {
  const retData = {
    deviceAttrRelationList: data.attrList,
  }
  emits('submitDialog', retData)
}
const closeDialog = () => {
  emits('closeDialog')
}

const attrMap = new Map()
const pointMap = new Map()
const deviceMap = new Map()
let selectAttr: any = {}
// 获取网关列表
function getWgList() {
  api.get('/api/scada/getWg').then((res: any) => {
    data.wgList = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取设备列表
function getSbList() {
  if (data.form.wgId === '') {
    data.form.deviceId = ''
  }
  const postData = {
    params: {
      wgId: data.form.wgId,
    },
  }
  api.get('/api/scada/getSb', postData).then((res: any) => {
    data.sbList = res.result
    data.sbList.forEach((d) => {
      deviceMap.set(d.id, d)
    })
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取点位列表
function getPointList() {
  const postData = {
    params: {
      wgId: data.form.wgId,
      deviceId: data.form.deviceId,
    },
  }
  api.get('/api/scada/getCgq', postData).then((res: any) => {
    data.pointList = res.result
    data.pointList.forEach((a) => {
      pointMap.set(a.id, a)
    })
  }).catch((error) => {
    window.console.log(error)
  })
}
const changeSelectAttr = (a: any) => {
  selectAttr = attrMap.get(a)
  data.selectPointId = selectAttr.pointId
}
const changeSelectPoint = (a: any) => {
  const point = pointMap.get(a)
  selectAttr.gatewayId = data.form.wgId
  selectAttr.deviceId = data.form.deviceId
  selectAttr.pointId = point.id
  selectAttr.expression = ''
  selectAttr.expressionStr = `${deviceMap.get(data.form.deviceId).name}:${point.name}`
}
function getList() {
  const Url = '/scada/conSheBei/listDeviceAttrRelation'
  const postData = {
    params: {
      deviceId: props.deviceId,
    },
  }
  api.get(Url, postData).then((res: any) => {
    data.attrList = res.result
    data.attrList.forEach((a) => {
      attrMap.set(a.attrId, a)
    })
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  getList()
  getWgList ()
})
</script>

<template>
  <div>
    <el-form :model="data.form" label-width="90px" inline>
      <el-form-item label="选择网关：">
        <el-select v-model="data.form.wgId" filterable clearable placeholder="请选择" @change="getSbList">
          <el-option v-for="(v) in data.wgList" :key="v.id" :label="v.name" :value="v.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择设备：">
        <el-select v-model="data.form.deviceId" :disabled="data.form.wgId === ''" filterable clearable placeholder="请选择" @change="getPointList">
          <el-option v-for="(v) in data.sbList" :key="v.id" :label="v.name" :value="v.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="main">
      <div class="table1">
        <el-table
          ref="multipleTableRef"
          :data="data.attrList"
          style="width: 700px;"
          height="500"
          highlight-current-row
          border
        >
          <el-table-column align="center" width="55" label="选择">
            <template #default="scope">
              <el-radio v-model="data.selectAttrId" class="radio" :label="scope.row.attrId" @change="changeSelectAttr(scope.row.attrId)">
                &nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column property="attrName" label="属性名称" />
          <el-table-column property="expressionStr" label="点位" />
        </el-table>
      </div>
      <div class="table2">
        <el-table
          ref="multipleTableRef"
          :data="data.pointList"
          style="width: 300px;"
          height="500"
          highlight-current-row
          border
        >
          <el-table-column align="center" width="55" label="选择">
            <template #default="scope">
              <el-radio v-model="data.selectPointId" class="radio" :label="scope.row.id" @change="changeSelectPoint(scope.row.id)">
                &nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column property="name" label="点位" />
        </el-table>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="closeDialog">
        关闭
      </el-button>
      <el-button type="primary" @click="submitDialog()">
        确认
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  justify-content: space-between;
}

.table1 {
  width: 55%;
}

.table2 {
  width: 35%;
}

.btn-box {
  margin-top: 20px;
  text-align: right;
}
</style>
