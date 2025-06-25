<script setup lang='ts'>
import { defineEmits, defineProps, onMounted, reactive, ref } from 'vue'
import { ElTable } from 'element-plus'

const props = defineProps({
  // 表格显示的数据
  tableData: {
    type: Array<any>,
    default() {
      return []
    },
  },
  // 表头数据
  tableHeader: {
    type: Array<any>,
    default() {
      return []
    },
  },
  // 总页数
  total: {
    type: Number,
    // 类型
    default: 0,
  },
  // 每页条目数
  size: {
    type: Number,
    // 类型
    default: 30,
  },
  // 当前页数
  current: {
    type: Number,
    // 类型
    default: 1,
  },
  // 分页的页容量数组
  pageSizesArr: {
    type: Array<any>,
    default() {
      return [10, 20, 30,50,100]
    },
  },
  // 是否显示多选
  isSelect: {
    type: Boolean,
    default: true,
  },
  // 是否显示分页
  isPage: {
    type: Boolean,
    default: true,
  },
  // 是否显示序号
  isIndex: {
    type: Boolean,
    default: false,
  },
  // 是否合并
  isSpan: {
    type: Boolean,
    default: false,
  },
    // 是否点击高亮
  isHighlight: {
    type: Boolean,
    default: false,
  },
  maxHeight: {
    type: [String, Number],
    default: '100%',
  },

  // 分页的布局
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
})

const emits = defineEmits(['selectionChange', 'sizeChange', 'currentChange', 'spanMethod', 'rowClick'])
// 抛出方法，让组件调用
defineExpose({
  toggleSelection,
})
// 多选事件
const selectionChange = (val: any) => {
  emits('selectionChange', val)
}

// 点击行事件
const rowClick = (val: any) => {
  emits('rowClick', val)
}
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

// 显示选中
function toggleSelection(rows?: any[]) {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(row, true)
    })
  }
  else {
    multipleTableRef.value!.clearSelection()
  }
}
// 合并事件
const spanMethod = (val: any) => {
  if (props.tableData.length > 1 && props.isSpan) {
    if (val.columnIndex === 0 || val.columnIndex === 3 || val.columnIndex === 4) {
      if (val.row.mergeCount !== 0) {
        return {
          rowspan: val.row.mergeCount,
          colspan: 1,
        }
      }
      else if (val.row.mergeCount === 0) {
        return {
          rowspan: 0,
          colspan: 0,
        }
      }
    }
  }
}
// 页数改变的时候触发的事件
const sizeChange = (val: any) => {
  emits('sizeChange', val)
}
// 当前页改变的时候触发的事件
const currentChange = (val: any) => {
  emits('currentChange', val)
}
</script>

<template>
  <div class="table">
    <!-- v-loading="loading" -->
    <!-- max-height="300" -->

    <ElTable
      ref="multipleTableRef"
      class="table_box"
      :data="tableData"
      border
      row-key="id"
      :highlight-current-row="isHighlight"
      :max-height="maxHeight ? maxHeight : '100%'"
      :span-method="spanMethod"
      @selection-change="selectionChange"
      @row-click="rowClick"
    >
      <el-table-column v-if="isSelect" type="selection" width="50" />
      <el-table-column v-if="isIndex" type="index" width="80" label="序号" align="center" />
      <template v-for="(item, index) in tableHeader">
        <!-- 多级表头 -->
        <el-table-column
          v-if="item.child"
          :key="`t${index}`"
          :label="item.label"
          :fixed="item.fixed"
          :align="item.align || 'center'"
          :show-overflow-tooltip="item.overHidden || false"
          :min-width="item.minWidth || '100px'"
          :sortable="item.sortable || false"
          :type="item.type"
          :width="item.width"
        >
          <el-table-column
            v-for="v in item.child"
            :key="v"
            :prop="v.prop"
            :label="v.label"
            :fixed="v.fixed"
            :align="v.align || 'center'"
            :show-overflow-tooltip="v.overHidden || false"
            :min-width="v.minWidth || '100px'"
            :sortable="v.sortable || false"
            :type="v.type"
          >
            <template #default="scope">
              <!-- 插槽：标题文字要特殊显示 | 操作 -->
              <slot v-if="item.slot" :name="item.slot" :item="scope" />
              <span v-else>{{ scope.row[v.prop] ? scope.row[v.prop] : "" }}</span>
            </template>
          </el-table-column>
        </el-table-column>

        <!-- 常规表头 -->
        <el-table-column
          v-else
          :key="`t${index + 1}`"
          :prop="item.prop"
          :label="item.label"
          :fixed="item.fixed"
          :align="item.align || 'center'"
          :show-overflow-tooltip="item.overHidden || false"
          :min-width="item.minWidth || '100px'"
          :sortable="item.sortable || false"
          :type="item.type"
          :width="item.width"
        >
          <template #default="scope">
            <!-- 插槽：标题文字要特殊显示 | 操作 -->
            <slot v-if="item.slot" :name="item.slot" :item="scope" />
            <span v-else>{{ scope.row[item.prop] ? scope.row[item.prop] : "" }}</span>
          </template>
        </el-table-column>
      </template>
    </ElTable>
    <!-- 分页 -->
    <!-- :current-page="current" -->

    <el-pagination
      v-if="isPage"
      :background="true"
      class="pagination"
      small
      :page-sizes="pageSizesArr"
      :page-size="size"
      :total="total"
      :layout="layout"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.table {
  margin-top: 1rem;
  overflow: hidden;
}

.pagination {
  float: right;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
}

.table_box {
  overflow-y: auto;
}
</style>
