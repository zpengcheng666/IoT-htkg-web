<!--
 * @Description:值班信息
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-20 14:30:56
-->


<script lang="ts" setup name="PersonalSetting">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Calendar,  User } from '@element-plus/icons-vue'
import dutyinfodialog from './components/dutyinfodialog.vue'
import publishDialog from './components/publishDialog.vue'
import dutyPersonList from './components/dutyPersonList.vue'
import api from '@/api'
const router = useRouter()
const pageData = reactive({
  tableData: [] as any,
  form: {
    terminalIds: '',
    pageNo: 1,
    pageSize: 30,
  },
  infoData: {},
  publishInfoData: {},
  dialogType: 'add',
  dialogTitle: '新增',
  personOptions: [],
  terminalOptions: [] as any,
  dutyList: [] as any, // 值班列表
  dutyPersonList: [] as any, // 值班人员
  dutyPersonId: '',
  nowCode: 0,
  nowDate: '',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '值班安排',
  },
  {
    label: '值班信息',
    child: [{
      prop: 'typeName',
      label: '值班岗位',
    }, {
      prop: 'watchkeepers',
      label: '值班人员',
    }],
  },
  {
    prop: 'terminalIds', // prop
    label: '已发布终端',
    slot: 'terminalIds',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '260px',
  },
])
const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗
const dialogPublish = ref(false) // 发布弹窗
const dialogPersonList = ref(false) // 值班人员弹窗

// 获取列表
function getList() {
  const postData = {
    params: JSON.parse(JSON.stringify(pageData.form)),
  }
  postData.params.terminalIds = pageData.form.terminalIds.toString()
  api.get('/message/publishDuty/list', postData).then((res: any) => {
    pageData.tableData = []
    // const parse = JSON.parse(res.result.records)

    for (const item of res.result.records) {
      let a = true
      for (const type of item.types) {
        if (a) {
          a = false
          pageData.tableData.push({
            id: item.id,
            name: item.name,
            types: item.types,
            state: item.state,
            terminalIds: item.terminalIds,
            typeId: type.id,
            typeName: type.name,
            mergeCount: item.types.length,
            watchkeepers: type.watchkeepers.map((op: any) => op.name).join(' '),
          })
        }
        else {
          pageData.tableData.push({
            id: item.id,
            name: item.name,
            state: item.state,
            types: item.types,
            terminalIds: item.terminalIds,
            typeId: type.id,
            typeName: type.name,
            mergeCount: 0,
            watchkeepers: type.watchkeepers.map((op: any) => op.name).join(' '),
          })
        }
      }
    }
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 点击跳转值班人员页面
function toDutyPerson() {
  router.push({
    name: 'dutyPerson',
  })
}


// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}


// 关闭发布弹窗
function closePublishDialog(id: any) {
  dialogPublish.value = false
}
// 提交发布
function publishSubmint(val: any) {
  const postData = val
  api.put('/message/dutyShifts/publish', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      dialogPublish.value = false
      getList()
    }
    else {
      ElMessage({
        type: 'error',
        message: res.message,
      })
    }
  }).catch((error) => {
    window.console.log(error)
  })
}

// 提交新增
function addSubmint(val: any) {
  const postData = val

  window.console.log(postData)
  // return false
  if (pageData.dialogType === 'add') {
    for (const i in postData.types) {
      for (const j in postData.types[i].watchkeepers) {
        postData.types[i].watchkeepers[j] = {
          name: postData.types[i].watchkeepers[j],
        }
      }
    }
    api.post('/message/publishDuty/add', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
        getList()
      }
      else {
        ElMessage({
          type: 'error',
          message: res.message,
        })
      }
    }).catch((error) => {
      window.console.log(error)
    })
  }
  else if (pageData.dialogType === 'edit') {
    for (const i in postData.types) {
      for (const j in postData.types[i].watchkeepers) {
        postData.types[i].watchkeepers[j] = {
          name: postData.types[i].watchkeepers[j],
        }
      }
    }
    api.post('/message/publishDuty/edit', { id: postData.id, name: postData.name, types: postData.types }).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
        getList()
      }
      else {
        ElMessage({
          type: 'error',
          message: res.message,
        })
      }
    }).catch((error) => {
      window.console.log(error)
    })
  }
}
// 获取终端下拉
function getTerminalOptions() {
  const postData = {
    params: {
      pageSize: -1,
    },
  }
  api.get('/system/baseTerminal/list', postData).then((res: any) => {
    pageData.terminalOptions = res.result.records
  }).catch((error) => {
    window.console.log(error)
  })
}
function showPersonList(val: any, id: any) {
  pageData.dutyPersonList = val
  pageData.dutyPersonId = id
  dialogPersonList.value = true
}
function closeDutyPersonDialog() {
  dialogPersonList.value = false
}

const calendar = ref()
const selectDate = (val: string, date: any) => {
  calendar.value.selectDate(val)
  const newDateArr = `${date.replace(' 年 ', '-').replace(' 月', '-')}01`.split('-')
  let postDate = ''
  let month = 0 as any
  if (val === 'next-month') {
    month = parseInt(newDateArr[1]) + parseInt('1')
    if (month < 10) {
      month = `0${month}`
    }
    postDate = `${`${newDateArr[0]}-${month}-`}01`
  }
  else if (val === 'prev-month') {
    month = parseInt(newDateArr[1]) - parseInt('1')
    if (month < 10) {
      month = `0${month}`
    }
    postDate = `${`${newDateArr[0]}-${month}-`}01`
  }
  else if (val === 'today') {
    const nowDate = new Date()
    const year = nowDate.getFullYear()
    const month = nowDate.getMonth() + 1
    const day = nowDate.getDate()
    postDate = `${`${year}-${month}-`}${day}`
  }
  if (pageData.dutyList[pageData.dutyList.length - 1].code) {
    pageData.nowCode = pageData.dutyList[pageData.dutyList.length - 1].code
  }
  pageData.nowDate = postDate
  getDutyList()
}

// 点击排班
function autoDuty() {
  const postData = {
    code: pageData.nowCode,
    date: pageData.nowDate,
  }
  api.post('/message/dutyPerson/dutyPersonList', postData).then((res: any) => {
    ElMessage({
      type: 'success',
      message: res.message,
    })
    getDutyList()
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取值班数据
function getDutyList() {
  api.get(`message/dutyPerson/dutyQueryList?date=${pageData.nowDate}`).then((res: any) => {
    pageData.dutyList = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

onMounted(() => {
  // 获取当前时间
  const nowDate = new Date()
  const year = nowDate.getFullYear()
  const month = nowDate.getMonth() + 1
  const day = nowDate.getDate()
  pageData.nowDate = `${`${year}-${month}-`}${day}`
  getTerminalOptions()
  getDutyList()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-row>
        <el-col :span="16">
          <el-form :inline="true" :model="pageData.form" label-width="100px">

          </el-form>
        </el-col>
        <el-col :span="8" class="col-right">
          <el-button v-auth="'ips:duty:auto'" type="warning" :icon="Calendar" @click="autoDuty()">
            自动排班
          </el-button>
          <el-button v-auth="'ips:duty:group'" type="warning" :icon="User" @click="toDutyPerson()">
            值班小组
          </el-button>

        </el-col>
      </el-row>

      <el-calendar ref="calendar">
        <template #header="{ date }">
          <span>值班表</span>
          <span>{{ date }}</span>
          <el-button-group>

            <el-button size="small" @click="selectDate('today', date)">
              今天
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

      <!-- 新增弹窗 -->
      <dutyinfodialog v-if="dialogAdd" :title="pageData.dialogTitle" :person-options="pageData.personOptions" :type="pageData.dialogType" :dialog-visible="dialogAdd" :info-page-data="pageData.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmint" />
      <publishDialog v-if="dialogPublish" :terminal-options="pageData.terminalOptions" :info-page-data="pageData.publishInfoData" :dialog-visible="dialogPublish" @close-dialog="closePublishDialog" @submit-dialog="publishSubmint" />

      <!-- 值班人员弹窗 -->
      <dutyPersonList v-if="dialogPersonList" :duty-person-id="pageData.dutyPersonId" :dialog-visible="dialogPersonList" :duty-person-list="pageData.dutyPersonList" @close-dialog="closeDutyPersonDialog" />
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

