<!--
 * @Description: 排班弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-20 14:30:10
-->
<script lang="ts" setup name="PersonalSetting">
import { ElMessage } from 'element-plus'
import { Calendar } from '@element-plus/icons-vue'
import DutyPersonList from './dutyPersonList.vue'
import DutyPeriod from './dutyPeriod.vue'
import api from '@/api'
const props = defineProps({
  dutyId: {
    type: String,
    required: true,
  },
})

const pageData = reactive({
  tableData: [] as any,
  form: {
    terminalIds: '',
    pageNo: 1,
    pageSize: 30,
  },
  dutyList: [] as any, // 值班列表
  dutyPersonList: [] as any, // 值班人员
  dutyPersonId: '',
  date: new Date() as Date,
  dutyPeriodInfo: {} as any,
})
const dialogPersonList = ref(false) // 值班人员弹窗
const dialogDutyPeriod = ref(false)// 值班周期弹窗

const n = new Date()
const toDateStr = (date: Date) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const monthStr = month < 10 ? `0${month}` : `${month}`
  const dayStr = day < 10 ? `0${day}` : `${day}`
  return `${date.getFullYear()}-${monthStr}-${dayStr}`
}



function showPersonList(val: any, id: any) {
  pageData.dutyPersonList = val
  pageData.dutyPersonId = id
  dialogPersonList.value = true
}
function closeDutyPersonDialog() {
  dialogPersonList.value = false
}
function closeDutyPeriodDialog() {
  dialogDutyPeriod.value = false
}

function openDutyPeriodDialog() {
  dialogDutyPeriod.value = true
}
const calendar = ref()
const selectDate = (val: string, date: any) => {
  const newDateArr = `${date.replace(' 年 ', '-').replace(' 月', '-')}01`.split('-')
  let year = parseInt(newDateArr[0])
  let month = parseInt(newDateArr[1]) - 1
  if (val === 'next-month') {
    if (month === 12) {
      month = 0
      year = year + 1
    }
    else {
      month = month + 1
    }
  }
  else if (val === 'prev-month') {
    if (month === 1) {
      month = 12
      year = year - 1
    }
    else {
      month = month - 1
    }
  }
  else if (val === 'today') {
    year = n.getFullYear()
    month = n.getMonth()
  }
  calendar.value.selectDate(val)
  getDutyList(toDateStr(new Date(year, month, 1, 0, 0, 0, 0)))
}
// 点击自动排班
function autoDuty(val: any) {
  const dateStr = toDateStr(pageData.date)
  const postData = {
    days: val.days,
    dutyId: props.dutyId,
  }
  api.put('message/dutyShifts/automatic', postData).then((res: any) => {
    ElMessage({
      type: 'success',
      message: res.message,
    })
    closeDutyPeriodDialog()
    getDutyList(dateStr)
  }).catch((error) => {
    window.console.log(error)
  })
}
function getDutyList(date: string) {
  api.get(`/message/dutyShifts/listShifts?date=${date}&dutyId=${props.dutyId}`).then((res: any) => {
    pageData.dutyList = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  getDutyList(toDateStr(n))
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-row>
        <el-col :span="16">
          <el-form :inline="true" :model="pageData.form" label-width="100px" />
        </el-col>
        <el-col :span="8" class="col-right">
          <el-button v-auth="'ips:duty:auto'" type="warning" :icon="Calendar" @click="openDutyPeriodDialog()">
            自动排班
          </el-button>
        </el-col>
      </el-row>

      <el-calendar ref="calendar" v-model="pageData.date">
        <template #header="{ date }">
          <span>值班表</span>
          <span>{{ date }}</span>
          <el-button-group>
            <el-button size="small" @click="selectDate('prev-month', date)">
              上个月
            </el-button>
            <el-button size="small" @click="selectDate('today', date)">
              本月
            </el-button>
            <el-button size="small" @click="selectDate('next-month', date)">
              下个月
            </el-button>
          </el-button-group>
        </template>
        <template #date-cell="{ data }">
          <div :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(1).join('-') }}
          </div>
          <div
            v-for="(item, index) in pageData.dutyList"
            :key="index"
            style="width: 100%;"
          >
            <div v-if="item.date.slice(0, 10) === data.day.toString()">
              <div style="margin-bottom: 5px;">
                小组：{{ item.name }}
              </div>
              <el-button type="warning" size="small" @click="showPersonList(item.shifts, item.id)">
                查看人员
              </el-button>
            </div>
          </div>
        </template>
      </el-calendar>
      <DutyPersonList v-if="dialogPersonList" :duty-person-id="pageData.dutyPersonId" :dialog-visible="dialogPersonList" :duty-person-list="pageData.dutyPersonList" @close-dialog="closeDutyPersonDialog" />
      <DutyPeriod v-if="dialogDutyPeriod" :dialog-visible="dialogDutyPeriod" :info-data="pageData.dutyPeriodInfo" @close-dialog="closeDutyPeriodDialog" @submit-dialog="autoDuty" />
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

