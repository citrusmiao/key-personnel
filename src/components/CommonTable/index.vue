<template>
  <div class="common-table">
    <el-table
      ref="multipleTable"
      :border="tableAttr.border"
      :fit="tableAttr.fit"
      :stripe="tableAttr.stripe"
      :height="tableAttr.height"
      :show-header="tableAttr.header === undefined || tableAttr.header"
      :data="tableData"
      :row-class-name="tableAttr.rowClass"
      :cell-class-name="tableAttr.cellClass"
      :row-style="{ height: '40px' }"
      v-loading="tableAttr.loading"
      size="mini"
      style="width: 100%"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
    >
      <!-- 多选框 -->
      <el-table-column
        v-if="tableAttr.selection"
        fixed
        type="selection"
        width="45"
        align="center"
      />

      <!-- 索引号 -->
      <el-table-column
        v-if="tableAttr.index"
        fixed
        type="index"
        label="序号"
        width="50"
        align="center"
      />

      <!--数据列表-->
      <el-table-column
        v-for="(col, index) in tableCol"
        :key="col.prop + 'col' + index"
        :show-overflow-tooltip="!col.overflow"
        :prop="col.prop"
        :label="col.label"
        :min-width="col.minWidth"
        :width="col.width"
        :sortable="col.sortable"
        :fixed="col.fixed"
        v-if="!col.hide"
        align="center"
      >
        <template v-if="col.slot_name" v-slot="scope">
          <slot :name="col.slot_name" :row="scope.row" />
        </template>
        <template v-else slot-scope="scope">
          <span>{{ scope.row[col.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <div v-show="pagination.total > 1" class="pagination-container">
      <el-pagination
        background
        :page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pagination.page"
        :total="pagination.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "CommonTable",
  props: {
    tableAttr: {
      type: Object,
      default: () => ({ header: true, loading: false, loadingText: "" }),
    },
    tableCol: { required: true, type: Array, default: () => [] },
    tableData: { type: Array, default: () => [] },
    pagination: {
      type: Object,
      default: () => ({ page: 1, pageSize: 10, total: 0 }),
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    handlePageChange() {
      this.$emit("handlePageChange", this.pagination);
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.handlePageChange();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.handlePageChange();
    },
  },
};
</script>
<style lang="scss">
  .warn-row{
    color:red;
  }
</style>
<style lang="scss" scoped>
.common-table {
  .pagination-container {
    padding: 10px;
    text-align: left;
  }
  .pagination-container.hidden {
    display: none;
  }

  .el-table th {
    // background-color: #d9edf7;
  }
}
</style>
<style scoped>
.common-table >>> .el-button--text {
  color: #2e5bfe;
}
</style>
