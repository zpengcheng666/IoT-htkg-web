<!--
 * @Description:设备排序
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 11:43:28
-->
<script lang="ts" setup>
import {ElMessage} from "element-plus";
import { reactive } from 'vue'
import Sortable from 'sortablejs'
import api from '@/api'

const formInline = reactive({
  user: '',
  region: '',
})

const data = reactive({
  sceneOptions: [] as any,
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  col: [
    {
      label: 'Idx',
      prop: 'index_',
      width: 60,
    },
    {
      label: '设备名称',
      prop: 'name',
      width: 540,
    },
  ],
  tableData: [],
})

const dragTable = ref()
const rowDrop = () => {
  const tbody = dragTable.value.$el.querySelector('.el-table__body tbody')
  Sortable.create(tbody, {
    onEnd(evt: any) {
      const { newIndex, oldIndex } = evt
      const currRow = data.tableData.splice(oldIndex, 1)[0]
      data.tableData.splice(newIndex, 0, currRow)
    },
  })
}

const preLoadSceneOptions = () => {
  const param = {}
  api.get('api/scada/options', param).then((res: any) => {
    data.sceneOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

const changeScene = (key: any) => {
  const postData = {
    params: {
      sceneId: key,
      pageNo: 1,
      pageSize: 10000,
    },
  }
  api.get('/api/scada/listDevice', postData).then((res: any) => {
    data.tableData = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
const save = () => {
  api.put('/api/scada/saveDeviceSort', data.tableData).then((res: any) => {
    ElMessage({
      type: 'success',
      message: res.message,
    })
  }).catch((error) => {
    window.console.log(error)
  })
}

onMounted(() => {
  rowDrop()
  preLoadSceneOptions()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="场景：">
            <el-select v-model="formInline.region" placeholder="请选择场景..." style="width: 200px;" filterable clearable @change="changeScene">
              <el-option
                v-for="item in data.sceneOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table ref="dragTable" :data="data.tableData" border row-key="id" align="left" style="width: 600px;">
      <el-table-column label="序号" width="60">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="设备名称" width="540" />
    </el-table>
    <el-button type="primary" @click="save">
      保存
    </el-button>
  </page-main>
</template>

<style lang="scss" scoped>
.el-form-item__content {
  position: relative;

  .form-ms {
    position: absolute;
    top: 90%;
    color: #999;
  }
}
</style>
