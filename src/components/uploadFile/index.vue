<script lang="ts" setup name="FileUpload">
import { ElMessage, UploadUserFile } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import useUserStore from '@/store/modules/user'
const props = defineProps({
  url: {
    type: String,
    default: '/system/filesUtil/upload',
  },
  size: {
    type: Number,
    default: 10,
  },
  max: {
    type: Number,
    default: 3,
  },
  fileLists: {
    type: Array,
    default: () => [],
  },
  notip: {
    type: Boolean,
    default: false,
  },
  ext: {
    type: Array,
    default: () => ['jpeg', 'jpg', 'png', 'gif', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'mp4', 'wmv', 'avi', 'rmvb', 'rm', '3gp', 'mpg'],
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  isShowWarn: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['getFile'])

const userStore = useUserStore()
const headerObj = reactive({
  'X-Access-Token': userStore.token,
})
let fileListsData = reactive(props.fileLists) as any
if (fileListsData === null) {
  fileListsData = []
}
// console.log(fileListsData)

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  // debugger

  const fileName = file.name.split('.')
  const fileExt = fileName[fileName.length - 1]
  const isTypeOk = props.ext.includes(fileExt)
  const isSizeOk = file.size / 1024 / 1024 < props.size
  if (!isTypeOk) {
    ElMessage.error(`上传文件只支持 ${props.ext.join(' / ')} 格式！`)
  }
  if (!isSizeOk) {
    ElMessage.error(`上传文件大小不能超过 ${props.size}MB！`)
  }
  return isTypeOk && isSizeOk
}
const upload = ref<UploadInstance>()
const onExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning('文件上传超过限制')
}

const getFile = async (val: any) => {
  emits('getFile', val)
}
const fileSuccess: UploadProps['onSuccess'] = (response, file, fileList) => {
  if (response.code === 200) {
    const obj = {} as any
    obj.name = file.name
    obj.url = response.result
    fileListsData.push(obj)
    getFile(fileListsData)
    ElMessage.success('上传成功')
  }
  else {
    ElMessage.error({
      message: response.msg,
      type: 'error',
    })
  }
}

// 移除
function remove(index: number) {
  if (props.max === 1) {
    upload.value!.clearFiles()
  }
  fileListsData.splice(index, 1)
  getFile(fileListsData)
}
// 下载
function downLoad(item: any) {
  window.open(item.url, '_self')
}

// 配置action地址
function setUrl() {
  const baseUrl = reactive((window as any).baseUrl || import.meta.env.VITE_APP_API_BASEURL)
  return `${baseUrl}${props.url}`
}
</script>

<template>
  <div>
    <el-upload
      ref="upload"
      :headers="headerObj"
      :action="setUrl()"
      name="multipartFile"
      :before-upload="beforeUpload"
      :on-exceed="onExceed"
      :on-success="fileSuccess"
      :show-file-list="false"
      :limit="max"
    >
      <el-button v-if="readOnly === false" type="primary">
        上传文件
      </el-button>
      <template #tip>
        <div v-if="!notip" class="el-upload__tip">
          <div v-if="readOnly === false && isShowWarn" style="display: inline-block;">
            <el-alert :title="`上传文件支持 ${ext.join(' / ')} 格式，单个文件大小不超过 ${size}MB，且文件数量不超过 ${max} 个`" type="info" show-icon :closable="false" />
          </div>

          <div class="fileListBox">
            <div v-for="(item, index) in fileListsData" :key="index" class="fileList">
              <span style="display: inline-block;width: 100%;">{{ item.name }}</span>
              <div>
                <el-button type="primary" link @click="downLoad(item)">
                  预览
                </el-button>
                <!-- <el-button type="primary" link @click="downLoad(item)">
                  下载
                </el-button> -->
                <el-button v-if="readOnly === false" type="danger" link @click="remove(index)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-upload>
  </div>
</template>

<style lang="scss" scoped>
.el-upload__tip {
  width: 100%;
}

.fileListBox {
  width: 100%;
}

.fileList {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
