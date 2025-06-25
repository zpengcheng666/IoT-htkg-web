import { ElMessage } from 'element-plus'
import api from '@/api'

// 获取当前属性
const getAttrList = (classId: any, callback: any) => {
  api.get(`facility/deviceAttr/listByClassId?classId=${classId}`).then((res: any) => {
    if (res.code === 200) {
      callback(res.result)
    }
    else {
      ElMessage({
        type: 'error',
        message: res.message,
      })
    }
  }).catch((error: any) => {
    window.console.log(error)
  })
}

// 获取树状列表
const getTree = (callback: any) => {
  const param = {}
  api.get('facility/deviceType/queryTreeList', param).then((res: any) => {
    callback(res.result)
  }).catch((error) => {
    window.console.log(error)
  })
}

// 添加属性
const addAttrAndClass = (postData: any, callback: any) => {
  api.post('facility/r_DeviceClassAttr/addAttrAndClass', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      callback(res.result)
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

// 编辑属性
const editAttr = (postData: any, callback: any) => {
  api.post('facility/deviceAttr/edit', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      callback(res.result)
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

const addAttr = (postData: any, callback: any) => {
  api.post('/facility/deviceAttr/add', postData)
    .then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        callback(res.result)
      }
      else {
        ElMessage({
          type: 'error',
          message: res.message,
        })
      }
    })
    .catch((error) => {
      window.console.log(error)
    })
}

export {
  addAttr,
  addAttrAndClass,
  getAttrList,
  getTree,
  editAttr,
}
