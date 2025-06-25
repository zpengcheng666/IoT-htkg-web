<!--
 * @Description:质量统计
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-01-06 17:37:19
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-20 11:08:31
-->

<script lang="ts" setup>
import { reactive } from 'vue'
import * as echarts from 'echarts'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'

interface Tree {
  id: string
  title: string
  childs?: Tree[]
}

const data = reactive({
  treeData: [],
  tableData: [],
  currentNode: {
    id: '',
  },
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '质量状况',
    sortable: true,
  },
  {
    prop: 'count',
    label: '设备数量',
    sortable: true,
  },
])

// 获取用户列表
const getTree = () => {
  const param = {}
  api.get('facility/deviceType/queryTreeList', param).then((res: any) => {
    data.treeData = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 折线图1
const createChart = (echarts: any, tableData: any) => {
  const mychart = echarts.init(document.getElementById('echart'))

  const seriesData = tableData.map((currentValue: any) => {
    return {
      name: currentValue.name,
      value: currentValue.count,
    }
  })

  // 设置配置项
  const option = {
    title: {
      text: '质量统计',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        // stillShowZeroSum: false,
        data: seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  option && mychart.setOption(option)
  window.addEventListener('resize', () => {
    mychart.resize()
  })
}
// 树的点击事件
const handleNodeClick = (treeNode: Tree) => {
  data.currentNode = treeNode
  const postData = {
    params: {
      classId: data.currentNode.id,
    },
  }
  api.get('facility/deviceBI/statQualityCondition', postData).then((res: any) => {
    data.tableData = res.result
    createChart(echarts, data.tableData)
  }).catch((error) => {
    window.console.log(error)
  })
}

const defaultProps = {
  children: 'children',
  label: 'title',
  id: 'id',
}

onMounted(() => {
  getTree()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col :span="4">
        <el-tree
          :data="data.treeData" :props="defaultProps" :check-on-click-node="true" :default-expand-all="true"
          :highlight-current="true" node-key="id" @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="20" class="el-col-cont">
        <CommonTable
          :table-data="data.tableData"
          :table-header="tableHeader"
          :is-page="false"
          :is-select="false"
        />
        <div class="chart_box" style="height: 80%; margin: 0;">
          <div id="echart" style="height: 100%; margin: 0;" />
        </div>
      </el-col>
    </el-row>
  </page-main>
</template>

<style lang="scss" scoped>
.page-main {
  padding: 0;
}

.el-row {
  height: calc(100vh - 294px);
}

.el-row .el-row {
  height: auto;
  padding-top: 16px;
}

.el-row .el-col {
  height: 100%;
}

.el-col-cont {
  padding: 0 16px;
}

.el-row .el-col:first-child {
  background: #e3e5e3;
}

.el-row .el-row .el-col {
  background: none;
  height: auto;
}

.el-tree {
  background: none;

  .is-current * {
    background: #fff;
  }
}

.form-pa {
  padding: 1rem 400px 0 0;
}

.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

