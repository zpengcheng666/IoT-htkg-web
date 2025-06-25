<!--
 * @Description:个人设置
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-02-01 17:05:32
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 15:44:42
-->
<script  lang="ts" setup>
import { ElMessage } from 'element-plus'
import api from '@/api'
import CommonSelect from '@/components/CommonSelect/index.vue'
const data = reactive({
  personInfo: {
    username: '',
    name: '',
    phone: '',
    organizationIdDisp: '',
    organizationId: '',
    militaryId: '',
    positionId: '',
  },
  isEdit: false,
  organOptions: [] as any,
})
const props1 = {
  children: 'childs',
  label: 'title',
  value: 'id',
}

// 获取个人信息
function getPersonInfo() {
  api.get('system/baseUser/queryPersonMes').then((res: any) => {
    data.personInfo = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 点击编辑
function editPersonInfo() {
  data.personInfo = JSON.parse(JSON.stringify(data.personInfo))
  data.isEdit = true
}
// 取消编辑
function cancelEditPersonInfo() {
  data.isEdit = false
}

// 确认编辑
function editSubmit() {
  const postData = data.personInfo
  api.post('system/baseUser/personalsetting', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      data.isEdit = false
      getPersonInfo()
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

function getOrganOptions() {
  api.get('system/baseOrgan/queryTreeList').then((res: any) => {
    data.organOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

onMounted(() => {
  getOrganOptions()
  getPersonInfo()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <!-- 个人设置 -->
      <el-row>
        <el-col :span="16" :offset="4">
          <el-form :model="data" label-position="right" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户名：">
                  <span>{{ data.personInfo.username }}</span>
                  <!-- <el-input v-show="data.isEdit" v-model="data.personInfo.username" /> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名：">
                  <span v-show="!data.isEdit">{{ data.personInfo.name }}</span>
                  <el-input v-show="data.isEdit" v-model="data.personInfo.name" class="formInput" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="组织机构：">
                  <span v-show="!data.isEdit">{{ data.personInfo.organizationIdDisp }}</span>
                  <el-tree-select
                    v-show="data.isEdit"
                    v-model="data.personInfo.organizationId"
                    :data="data.organOptions"
                    :props="props1"
                    node-key="id"
                    :default-expand-all="true"
                    :render-after-expand="false"
                    class="formInput"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="军衔：">
                  <span v-show="!data.isEdit">{{ data.personInfo.militaryId }}</span>
                  <el-input v-show="data.isEdit" v-model="data.personInfo.militaryId" class="formInput" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职称：">
                  <span v-show="!data.isEdit">{{ data.personInfo.positionId }}</span>
                  <el-input v-show="data.isEdit" v-model="data.personInfo.positionId" class="formInput" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="24">
              <el-form-item label="手机：">
                <span v-show="!data.isEdit">{{ data.personInfo.phone }}</span>
                <el-input v-show="data.isEdit" v-model="data.personInfo.phone" class="formInput" />
              </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="8" :offset="8">
            <el-button v-show="!data.isEdit" color="#2a9e88" @click="editPersonInfo">
              编辑
            </el-button>
            <el-button v-show="data.isEdit" type="info" plain @click="cancelEditPersonInfo">
              取消
            </el-button>
            <el-button v-show="data.isEdit" color="#2a9e88" @click="editSubmit">
              确认
            </el-button>
          </el-col>
        </el-col>
      </el-row>
    </page-main>
  </div>
</template>

<style scoped>
.formInput {
  width: 200px;
}
</style>
