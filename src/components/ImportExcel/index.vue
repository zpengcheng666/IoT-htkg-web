<script lang="ts" setup name="importExcel">
import xlsx from 'xlsx'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
const props = defineProps({
  // key值
  keyData: {
    type: Object,
    default() {
      return {}
    },
  },

})

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
  // 处理data数据
  for (let i = 0; i < jsonData.length; i++) {
    const obj = jsonData[i]
    for (const key in obj) {
      const newKey = props.keyData[key]
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
  <div>
    <!-- <el-upload
      v-model:file-list="fileList" class="upload-demo" :before-upload="before"
      action="" multiple :on-preview="handlePreview"
      :limit="1" accept="xlsx,xls"
    >
      <el-button type="primary">
        上传文件
      </el-button>
    </el-upload> -->
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
      <el-table-column v-for="(value, key, index) in props.keyData" :key="index" :prop="value" :label="key" />
    </el-table>
  </div>
</template>

<style scoped>
.upload-demo {
  width: 400px;
}
</style>
