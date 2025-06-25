<route lang="yaml">
name: personalSetting
meta:
  title: 值班信息页面
  cache: personal-edit.password
            </route>

<script lang="ts" setup name="PersonalSetting">
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Delete, Edit, FolderChecked, Plus, Search } from '@element-plus/icons-vue'
import CommonTable from '@/components/ConmonTable/index.vue'

const formInline = reactive({
  deviceType: '',
  deviceName: '',
  deviceAttr: '',
  levelId: '',
  levelType: '',
  handleState: '',
  commonPeriod: '',
  date1: '',
  date2: '',
})
const data = reactive({
  tableData: [],
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'deviceName',
    label: '设备名称',
  },
  {
    prop: 'deviceAttr',
    label: '设备属性',
  },
  {
    prop: 'alarmValue', // prop
    label: '报警值',
  },
  {
    prop: 'rangeValue', // prop
    label: '标定值',
  },
  {
    prop: 'startTime', // prop
    label: '开始时间',
  },
  {
    prop: 'endTime', // prop
    label: '结束时间',
  },
  {
    prop: 'alarmType', // prop
    label: '报警类型',
  },
  {
    prop: 'levelId', // prop
    label: '报警级别',
  },
  {
    prop: 'confirmor', // prop
    label: '确认人',
  },
  {
    prop: 'confirmTime', // prop
    label: '确认时间',
  },
  {
    prop: 'handleState', // prop
    label: '处理状态',
  },
  {
    prop: 'handler', // prop
    label: '处理人',
  },
  {
    prop: 'handleTime', // prop
    label: '处理时间',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },
])

const total = ref(0) // 总条数
// 分页改变事件
const sizeChange = (val: number) => {
  data.form.pageSize = val
  window.console.log(val)
}
// 当前页改变事件
const currentChange = (val: number) => {
  data.form.pageNo = val
}
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="100px">
        <el-row>
          <el-form-item label="设备类型：">
            <el-input v-model="formInline.deviceType" placeholder="请选择设备" />
          </el-form-item>
          <el-form-item label="设备名称：">
            <el-input v-model="formInline.deviceName" placeholder="" />
          </el-form-item>
          <el-form-item label="设备属性：">
            <el-input v-model="formInline.deviceAttr" placeholder="" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="报警级别：">
            <el-input v-model="formInline.levelId" placeholder="请选择设备" />
          </el-form-item>
          <el-form-item label="报警类型：">
            <el-input v-model="formInline.levelType" placeholder="" />
          </el-form-item>
          <el-form-item label="处理状态：">
            <el-input v-model="formInline.handleState" placeholder="" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="常用时段：">
            <el-select v-model="formInline.commonPeriod" filterable clearable placeholder="自定义">
              <el-option label="自定义1" value="shanghai" />
              <el-option label="自定义2" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围：">
            <el-row :gutter="0" class="flex-nowrap">
              <el-col :span="11">
                <el-date-picker
                  v-model="formInline.date1" type="date" label="开始日期" placeholder="开始日期"
                  style="width: 100%;"
                />
              </el-col>
              <el-col class="text-center" :span="1" style="margin: 0 0.5rem;">
                -
              </el-col>
              <el-col :span="11">
                <el-date-picker
                  v-model="formInline.date2" type="date" label="结束日期" placeholder="结束日期"
                  style="width: 100%;"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary">
              查询
            </el-button>
            <el-button type="info" plain>
              重置
            </el-button>
            <el-button type="primary">
              导出
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <CommonTable
        :table-data="data.tableData"
        :table-header="tableHeader"
        :total="total"
        :size="data.form.pageSize"
        :is-select="false"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <template #operate>
        <el-button type="primary" :icon="Edit" />
        <el-button type="danger" :icon="Delete" />
        <el-button type="primary" :icon="FolderChecked" plain />
      </template>
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.el-form--inline .el-form-item {
  width: calc(100%/3 - 60px);
}

.el-select {
  width: 100%;
}

.flex-nowrap {
  flex-wrap: nowrap;
}
</style>

