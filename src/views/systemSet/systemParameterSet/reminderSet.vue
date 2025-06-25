<script lang="ts" setup>
import type { ElTable, UploadProps } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { ref } from 'vue'
import api from '@/api'

const activeNames = ref([] as any)

const formInline = reactive({
  user: '',
  region: '',
  date1: '',
  time1: '',
})
const data = reactive({

  infoData: [
    {
      typeTypeName: '',
      childs: [{
        valuetype: '',
        value: '',
        itemname: '',
        id: '',
      }],
    },
  ],

})
// 展开全部
const openAll = () => {
  for (let i = 0; i < data.infoData.length; i++) {
    activeNames.value.push(i)
  }
}
// 合并全部
const closeAll = () => {
  activeNames.value = []
}
// 获取
function getList() {
  api.get('system/baseRemind/listRemind').then((res: any) => {
    data.infoData = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 修改
function submit(val: any) {
  ElMessageBox.confirm(
    '确认修改该数据?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      const postData: any = {
        id: val.id,
        value: val.value,
      }
      api.post('system/baseRemind/edit', postData).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
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
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消修改',
      })
    })
}
onMounted(() => {
  getList()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-button type="info" :icon="ArrowDown" plain @click="openAll">
        展开
      </el-button>
      <el-button type="info" :icon="ArrowUp" plain @click="closeAll">
        合并
      </el-button>
    </el-row>
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(item, index) in data.infoData" :key="index" :name="index">
        <template #title>
          <span class="collapse-title">{{ item.typeTypeName }}</span>
        </template>
        <el-row>
          <el-form :inline="true" :model="formInline" label-width="240px">
            <el-form-item v-for="(v) in item.childs" :key="v.id" :label="v.itemname">
              <el-select v-if="v.valuetype === 'select'" v-model="v.value" filterable clearable placeholder="请选择" @blur="submit(v)">
                <el-option label="是" value="shanghai" />
                <el-option label="否" value="beijing" />
              </el-select>

              <el-input v-if="v.valuetype === 'input'" v-model="v.value" placeholder="请填写" @blur="submit(v)" />
              <el-date-picker
                v-if="v.valuetype === 'date'"
                v-model="v.value"
                type="date"
                format="YYYY/MM/DD "
                value-format="YYYY-MM-DD "
                @blur="submit(v)"
              />
              <el-time-picker v-if="v.valuetype === 'time'" v-model="v.value" placeholder="请选择" @blur="submit(v)" />
              <el-select v-if="v.valuetype === 'week'" v-model="v.value" filterable clearable placeholder="请选择" @change="submit(v)">
                <el-option label="星期一" value="1" />
                <el-option label="星期二" value="2" />
                <el-option label="星期三" value="3" />
                <el-option label="星期四" value="4" />
                <el-option label="星期五" value="5" />
                <el-option label="星期六" value="6" />
                <el-option label="星期日" value="7" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </page-main>
</template>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 1rem;
}

:deep(.el-collapse-item__header) {
  background-color: #f7f7f7 !important;
  border-radius: 4px 4px 0 0;
  border: 1px solid #e3e3e3 !important;
  padding-left: 1rem;
}

:deep(.el-collapse-item__content) {
  border: 1px solid #e3e3e3;
  border-top: none;
  margin-bottom: 0.5rem;
  padding: 0;

  .el-row {
    padding-top: 1rem;
    margin-bottom: 0 !important;
  }
}

.el-form {
  width: 100%;
}

.el-form--inline .el-form-item {
  width: calc(100% / 3 - 32px);
}

.collapse-title {
  flex: 1 0 90%;
  order: 1;
}
</style>
