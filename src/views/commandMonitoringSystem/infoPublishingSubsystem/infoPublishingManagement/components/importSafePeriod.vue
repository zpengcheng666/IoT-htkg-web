<script setup lang='ts'>
import type {  UploadProps, UploadUserFile } from 'element-plus'
import xlsx from 'xlsx'
import { UploadFilled } from '@element-plus/icons-vue'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  // 标题
  title: {
    type: String,
    default: '导入',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },

})

const emits = defineEmits(['submitDialog', 'closeDialog'])
const data = reactive({
  keyData: {
    // 'ID': 'id',
    '开始时间': 'startTime',
    '结束时间': 'endTime',
    '安全时长': 'secure',
  } as any,

})

// 页数改变的时候触发的事件
const submitDialog = (val: any) => {
  emits('submitDialog', val)
}
// 关闭弹窗事件
const closeDialog = (val: any) => {
  emits('closeDialog', val)
}

// 处理props的数据 重新定义 dialogVisible
const dialogShow = computed({
  get() {
    // getter
    return props.dialogVisible
  },
  set(val) {
    return val
  },
})

// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)

function downTemplate() {
  const baseUrl = reactive((window as any).baseUrl || import.meta.env.VITE_APP_API_BASEURL)
  window.open(`${baseUrl}/system/filesUtil/filePreviewOrDownload/secure_template.xls`, '_self')
}
function getFile(val: any) {
  infoDataForm.filesList = val
}
const postData = reactive({
  data: [],
})
const fileList = ref<UploadUserFile[]>([])
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  window.console.log(uploadFile)
}
/**
 * 把文件按照二进制进行读取
 * @param file
 * @returns
 */
const readFile = (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = (ev) => {
      resolve(ev.target?.result)
    }
  })
}
/**
 * 根据sheet索引读取Excel文件中的数据
 /**@param file 文件
 /** @param sheetIndex excel文件中sheet表索引 默认是从0开始
 /**@returns  将表中的数据以json形式的数据返回
*/
const readExcelFile = async (file: File, sheetIndex: number) => {
  let jsonData = await readFile(file) as any
  const workbook = xlsx.read(jsonData, { type: 'binary' })
  const worksheet = workbook.Sheets[workbook.SheetNames[sheetIndex]]
  jsonData = xlsx.utils.sheet_to_json(worksheet)
  // console.log(jsonData)

  // 处理data数据
  for (let i = 0; i < jsonData.length; i++) {
    const obj = jsonData[i]
    for (const key in obj) {
      const newKey = data.keyData[key]
      if (newKey) {
        obj[newKey] = obj[key]
        delete obj[key]
      }
    }
  }
  postData.data = jsonData

  return jsonData
}
defineExpose({ postData })

const before = (file: any) => {
  readExcelFile(file, 0)
  return false
}
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
    top="3vh"
  >
    <div>
      <el-button type="primary" style="margin-bottom: 20px;" @click="downTemplate()">
        下载模板
      </el-button>

      <!-- <importExcel ref="importExcelRef" :key-data="data.keyData" /> -->
      <el-upload
        v-model:file-list="fileList"
        class="upload-demo"
        :before-upload="before"
        :on-preview="handlePreview"
        drag
        action=""
        :limit="1"
        accept="xlsx,xls"
        multiple
      >
        <el-icon class="el-icon--upload">
          <UploadFilled />
        </el-icon>
        <div class="el-upload__text">
          <em>点击或拖动文件至此区域</em>
          <div class="el-upload__tip">
            支持.xls、.xlsx格式文件
          </div>
        </div>
      </el-upload>

      <el-table :data="postData.data" border style="width: 100%;margin-top: 20px;">
        <el-table-column v-for="(value, key, index) in data.keyData" :key="index" :prop="value" :label="key.toString()" />
      </el-table>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog(postData.data)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.formInput {
  width: 100%;
}
</style>
