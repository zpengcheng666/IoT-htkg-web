<script lang="ts" setup name="ImagesUpload">
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
const props = defineProps({
  action: {
    type: String,
    required: true,
  },
  headers: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Object,
    default: () => {},
  },
  name: {
    type: String,
    default: 'file',
  },
  url: {
    type: Array,
    default: () => [],
  },
  max: {
    type: Number,
    default: 3,
  },
  size: {
    type: Number,
    default: 2,
  },
  width: {
    type: Number,
    default: 150,
  },
  height: {
    type: Number,
    default: 150,
  },
  placeholder: {
    type: String,
    default: '',
  },
  notip: {
    type: Boolean,
    default: false,
  },
  imgUrls: {
    type: String,
    default: '',
  },
  ext: {
    type: Array,
    default: () => ['jpg', 'png', 'gif', 'bmp'],
  },
})
const emits = defineEmits(['getImg'])
const baseUrl = reactive((window as any).baseUrl || import.meta.env.VITE_APP_API_BASEURL)
const fileList = ref<UploadUserFile[]>([

])
const userStore = useUserStore()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const data = reactive({
  coversList: [] as any,
  baseUrl,
  limitCountImg: 9,
  showBtnDealImg: true,
  noneBtnImg: false,
})

const headerObj = reactive({
  'X-Access-Token': userStore.token,
})
const getImg = async (val: any) => {
  emits('getImg', val)
}
const handleImgChange: UploadProps['onChange'] = (file, fileList) => {
  data.noneBtnImg = fileList.length >= data.limitCountImg
}
const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('单张图片大小不能超过10MB!')
    return false
  }
  return true
}
const coverFileSuccess: UploadProps['onSuccess'] = (response, file, fileList) => {
  if (response.code === 200) {
    const obj = {} as any
    obj.name = file.name
    obj.url = response.result
    data.coversList.push(obj)
    // console.log(data.coversList)

    getImg(data.coversList)
  }
  else {
    ElMessage.error({
      message: response.msg,
      type: 'error',
    })
  }
}
const coverFileRemove: UploadProps['onRemove'] = (file, fileList) => {
  // console.log(file)
  // console.log(fileList)
  data.coversList.forEach((item: any, index: any) => {
    if (file.name === item.name) {
      data.coversList.splice(index, 1)
    }
  })
  getImg(data.coversList)
  data.noneBtnImg = fileList.length >= data.limitCountImg
}
const handleExceedCover: UploadProps['onExceed'] = (files, fileList) => {
  ElMessage.error({
    message: '上传图片数量超出限制！',
    type: 'error',
  })
}
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

onMounted(() => {
  // console.log(props.imgUrls)
  // if(props.fileList.length!==0){
  //   data.coversList = props.fileList
  // }
})
</script>

<template>
  <el-upload
    class="dl-avatar-uploader-min square"
    :class="{ uoloadBtn: data.showBtnDealImg, disUoloadBtn: data.noneBtnImg }"
    :action="`${data.baseUrl}/system/filesUtil/upload`"
    :headers="headerObj"
    :limit="data.limitCountImg"
    name="multipartFile"
    :on-success="coverFileSuccess"
    :on-remove="coverFileRemove"
    :on-exceed="handleExceedCover"
    :before-upload="beforeImageUpload"
    :on-change="handleImgChange"
    :on-preview="handlePictureCardPreview"
    :file-list="fileList"
    list-type="picture-card"
    accept="image/*"
    multiple
  >
    <el-button type="text">
      上传图片
    </el-button>
    <template #tip>
      <div class="el-upload__tip">
        最多上传9张图片,且单张图片大小不能超过10MB
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" class="preImg">
  </el-dialog>
</template>

<style lang="scss" scoped>
.upload-container {
  line-height: initial;
}

.el-image {
  display: block;
}
.preImg{
  width: 100%;
}
.images {
  position: relative;
  display: inline-block;
  margin-right: 10px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  overflow: hidden;

  .mask {
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: var(--el-overlay-color-lighter);
    transition: opacity 0.3s;

    .actions {
      width: 100px;
      height: 100px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;

      @include position-center(xy);

      span {
        width: 50%;
        text-align: center;
        cursor: pointer;
        color: var(--el-color-white);
        transition: color 0.1s, transform 0.1s;

        &.disabled {
          color: var(--el-text-color-disabled);
          cursor: not-allowed;
        }

        &:hover:not(.disabled) {
          transform: scale(1.5);
        }

        .el-icon {
          font-size: 24px;
        }
      }
    }
  }

  &:hover .mask {
    opacity: 1;
  }
}

.images-upload {
  display: inline-block;
  vertical-align: top;
}

:deep(.el-upload) {
  .el-upload-dragger {
    display: inline-block;
    padding: 0;

    &.is-dragover {
      border-width: 1px;
    }

    .image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      color: var(--el-text-color-placeholder);
      background-color: transparent;

      i {
        font-size: 30px;
      }
    }

    .progress {
      position: absolute;
      top: 0;

      &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: var(--el-overlay-color-lighter);
      }

      .el-progress {
        z-index: 1;

        @include position-center(xy);

        .el-progress__text {
          color: var(--el-text-color-placeholder);
        }
      }
    }
  }
}
</style>
