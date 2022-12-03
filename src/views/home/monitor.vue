<template>
  <div class="monitor">
    <!-- <div class="monitor-header">
      <span>大规模核酸检测数据查询服务</span>
      <div class="back" @click="toHome()">
        <img :src="require(`@/assets/images/home/back-space.png`)" alt="" />
        <div class="span">返回</div>
      </div>
    </div> -->
    <div class="monitor-search">
      <el-form :model="searchForm" :inline="true">
        <el-form-item>
          <el-cascader
            v-model="searchForm.areaCode"
            placeholder="选择区域"
            :options="areaOptions"
            :props="{
              checkStrictly: true,
              value: 'value',
              label: 'label',
              emitPath: false
            }"
            :show-all-levels="true"
            clearable
            style="width: 100%"
          />
          <!--
          <el-select
            v-model="searchForm.areaCode"
            placeholder="选择区域"
            style="width: 250px"
            clearable
          >
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          -->
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.place"
            placeholder="核酸检测点"
            style="width: 250px"
            clearable
          />
          <!--
            <el-select
              v-model="searchForm.location"
              placeholder="选择场所"
              style="width: 250px"
              clearable
            >
              <el-option
                v-for="item in locationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            -->
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="-"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clear">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="monitor-table">
      <div v-loading="loading" class="info">
        <div>
          检测总人数 <span> {{ censusData.tested }} </span>阳性
          <span> {{ censusData.masculine }} </span>
        </div>
        <el-button type="primary" size="mini" @click="exportAllExl()">
          导出
        </el-button>
      </div>
      <CommonTable
        :table-attr="tableAttr"
        :table-col="tableCol"
        :table-data="tableData"
        :pagination="pagination"
        @handlePageChange="handlePageChange"
      >
        <template v-slot:testTime="data">
          {{ data.row.testTime | formatDate }}
        </template>
        <template v-slot:sampleTime="data">
          {{ data.row.sampleTime | formatDate }}
        </template>
        <template v-slot:btn="data">
          <el-button
            v-if="data.row.testNumbers && data.row.testNumbers > 0"
            type="text"
            size="mini"
            @click="detail(data.row)"
          >
            查看
          </el-button>
          <el-button
            v-if="data.row.testNumbers && data.row.testNumbers > 0"
            type="text"
            size="mini"
            @click="exportColExl(data.row)"
          >
            名单导出
          </el-button>
        </template>
      </CommonTable>
    </div>

    <el-dialog
      title="查看"
      :visible.sync="dialog"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="info" style="padding-bottom: 15px">
        <el-form :inline="true">
          <el-form-item label="检测结果">
            <el-select
              v-model="searchForm.testResult"
              placeholder="请选择检测结果"
              style="width: 150px"
              clearable
              @change="handleChange"
            >
              <el-option label="阴性" value="阴性" />
              <el-option label="阳性" value="阳性" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <CommonTable
        :table-attr="detailAttr"
        :table-col="detailCol"
        :table-data="detailData"
        :pagination="pagination2"
        @handlePageChange="handlePageChange2"
      >
        <template v-slot:testTime="data">
          {{ data.row.testTime | formatTime }}
        </template>
        <template v-slot:sampleTime="data">
          {{ data.row.sampleTime | formatTime }}
        </template>
      </CommonTable>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate, formatDates } from '@/utils/formatDate'
import CommonTable from '@/components/CommonTable'
import * as xlsx from 'xlsx'
import { pcrPage, census, userList } from '@/api/appPcrTest'
export default {
  name: 'Monitor',
  components: { CommonTable },
  filters: {
    // 方法一
    fmtime(val) {
      return fmdata(val)
    },
    // 使用封装中的方法二
    formatTime(val) {
      let data = new Date(val)
      return formatDates(data, 'yyyy-MM-dd hh:mm:ss')
    },
    // 使用封装中的方法二
    formatDate(val) {
      let data = new Date(val)
      return formatDates(data, 'yyyy-MM-dd')
    }
  },
  data() {
    return {
      searchForm: {},
      selectRow: {},
      areaOptions: [
        { label: '全部', value: '' },
        {
          label: '广州市',
          value: '440100',
          children: [
            { label: '荔湾区', value: '440103' },
            { label: '越秀区', value: '440104' },
            { label: '海珠区', value: '440105' },
            { label: '天河区', value: '440106' },
            { label: '白云区', value: '440111' },
            { label: '黄埔区', value: '440112' },
            { label: '番禺区', value: '440113' },
            { label: '花都区', value: '440114' },
            { label: '南沙区', value: '440115' },
            { label: '从化区', value: '440117' },
            { label: '增城区', value: '440118' }
          ]
        }
      ],
      locationOptions: [
        { label: '全部', value: '全部' },
        { label: '场所1', value: '场所1' },
        { label: '场所2', value: '场所2' },
        { label: '场所3', value: '场所3' },
        { label: '场所4', value: '场所4' },
        { label: '场所5', value: '场所5' },
        { label: '场所6', value: '场所6' },
        { label: '场所7', value: '场所7' }
      ],
      tableAttr: { loading: false, index: true, border: true },
      detailAttr: {
        loading: false,
        index: true,
        border: true,
        cellClass: function ({ row, column, rowIndex, columnIndex }) {
          // console.log(column,"column");
          // console.log(row,"row");
          if (row.testResult == '阳性' && columnIndex == 5) {
            return 'warn-row'
          }
          /*
          if(row.columnList!== null) {
            for (let i = 0; i < row.columnList.length; i++) {
                if (row.columnList[i] === column.property) {
                    return 'warn-row';
                }
            }
          }
          if(row.testResult=="阳性"){
            //console.log(row,"row");
            return "warn-row";
          }
          */
        }
      },
      tableCol: [
        { prop: 'areaName', label: '区域' },
        { prop: 'testRange', label: '检测范围' },
        { prop: 'testPoint', label: '核酸检测点' },
        // { prop: "testOrgan", label: "检测机构" },
        { prop: 'testNumbers', label: '检测人数' },
        { prop: 'positiveNumbers', label: '阳性人数' },
        { slot_name: 'sampleTime', label: '采样日期' },
        { slot_name: 'testTime', label: '检测日期' },
        { slot_name: 'btn', label: '操作' }
      ],
      tableData: [],
      pagination: { page: 1, pageSize: 10, total: 0 },
      pagination2: { page: 1, pageSize: 10, total: 0 },

      tested: 9999,
      masculine: 20,
      timeRange: [],
      loading: false,
      dialog: false,
      detailCol: [
        { prop: 'name', label: '姓名' },
        { prop: 'identityCard', label: '身份证号码' },
        { prop: 'telephone', label: '联系电话' },
        { prop: 'testBatch', label: '检测批号' },
        {
          prop: 'testResult',
          label: '检测结果',
          cellClassName: function ({ col }) {
            console.log(col, 'col')
            if (row.testResult == '阳性') {
              // console.log(row,"row");
              return 'warn-row'
            }
          }
        },
        { slot_name: 'sampleTime', label: '采样时间' },
        { slot_name: 'testTime', label: '检测时间' }
      ],
      pickerOptions: {
        disabledDate: (time) => {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000
          )
        }
      },
      detailData: [],
      censusData: { tested: 0, masculine: 0 }
    }
  },
  mounted() {
    this.getPages()
    this.getCensus()
  },
  methods: {
    rowClass(row, index) {
      console.log(row, 'row')
      if (row.testResult == '阳性') {
        return 'warn-row'
      }
    },
    toHome() {
      this.$router.push({
        path: 'home'
      })
    },
    getPages() {
      const _this = this
      const params = Object.assign({}, this.searchForm, {
        page: this.pagination.page,
        limit: this.pagination.pageSize
      })
      _this.tableAttr.loading = true
      // 获取列表信息
      pcrPage(params)
        .then(function (res) {
          if (res.code === 200) {
            _this.tableData = res.datas
            _this.pagination.total = res.total
          } else {
            console.log(res.message)
            _this.$message({
              type: 'error',
              message: '获取数据失败'
            })
          }
          _this.tableAttr.loading = false
        })
        .catch(function (err) {
          console.log(err.message)
          _this.$message({
            type: 'error',
            message: '获取数据失败'
          })
          _this.tableAttr.loading = false
        })
    },
    getCensus() {
      const _this = this
      const params = Object.assign({}, this.searchForm)
      // 获取统计信息
      census(params)
        .then(function (res) {
          if (res.code === 200) {
            let rows = res.datas
            _this.censusData = rows[0]
          } else {
            console.log(res.message)
            _this.$message({
              type: 'error',
              message: '获取统计数据失败'
            })
          }
        })
        .catch(function (err) {
          console.log(err.message)
          _this.$message({
            type: 'error',
            message: '获取统计数据失败'
          })
        })
    },
    search() {
      this.pagination = { page: 1, pageSize: 10, total: 0 }
      if (this.timeRange.length > 0) {
        this.searchForm.startTime = this.timeRange[0]
        this.searchForm.endTime = this.timeRange[1]
      }
      this.getPages()
      this.getCensus()
    },
    clear() {
      this.timeRange = []
      this.searchForm = {}
    },
    handlePageChange(val) {
      this.pagination.page = val.page
      this.pagination.pageSize = val.pageSize
      this.getPages()
    },
    handlePageChange2(val) {
      this.pagination2.page = val.page
      this.pagination2.pageSize = val.pageSize
      this.detail()
    },
    exportAllExl() {
      this.$confirm('是否确认导出大规模核酸检测数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.exportAll()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消导出'
          })
        })
    },
    exportColExl(row) {
      this.$confirm('是否确认导出大规模核酸检测明细数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.exportCol(row)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消导出'
          })
        })
    },
    exportAll() {
      let exportInfos = {
        fileName: '大规模核酸检测数据.xlsx',
        sheetData: []
      }
      const _this = this
      const params = Object.assign({}, this.searchForm, {
        page: 1,
        limit: this.pagination.total
      })
      _this.tableAttr.loading = true
      // 获取列表信息
      pcrPage(params)
        .then(function (res) {
          if (res.code === 200) {
            let rows = res.datas
            let sheetData = {
              sheetName: '大规模核酸检测数据',
              xlsxData: [
                [
                  '序号',
                  '区域',
                  '检测范围',
                  '核酸检测点',
                  '检测人数',
                  '未检测人数',
                  '阳性人数',
                  '采样日期',
                  '检测日期'
                ]
              ]
            }
            if (rows) {
              let i = 1
              rows.map((item) => {
                let data = [
                  i,
                  item.areaName,
                  item.testRange,
                  item.testPoint,
                  item.testNumbers,
                  item.untestNumbers,
                  item.positiveNumbers,
                  formatDates(new Date(item.sampleTime), 'yyyy-MM-dd'),
                  formatDates(new Date(item.testTime), 'yyyy-MM-dd')
                ]
                sheetData.xlsxData.push(data)
                i++
                /*
              item.name = _this.formatStr(item.name,1);
              item.identityCard = _this.formatStr(item.identityCard,1);
              item.telephone = _this.formatStr(item.telephone,2);
              item.testTime = formatDates(item.testTime,'yyyy-MM-dd hh:mm:ss');
              */
              })
              exportInfos.sheetData.push(sheetData)
              _this.exportData(exportInfos)
            } else {
              console.log(res.message)
              _this.$message({
                type: 'error',
                message: '获取数据失败'
              })
            }
          }
          _this.tableAttr.loading = false
        })
        .catch(function (err) {
          console.log(err.message)
          _this.$message({
            type: 'error',
            message: '获取数据失败'
          })
          _this.tableAttr.loading = false
        })
    },
    handleChange(value) {
      console.log(value, 'testResult')
      this.detail()
    },
    detail(row) {
      if (row) {
        this.selectRow = row
      }
      const _this = this
      const params = Object.assign(
        {},
        { testId: this.selectRow.id, testResult: this.searchForm.testResult },
        { page: this.pagination2.page, limit: this.pagination2.pageSize }
      )
      _this.dialog = true
      _this.detailAttr.loading = true
      // 获取统计信息
      userList(params)
        .then(function (res) {
          if (res.code === 200) {
            let rows = res.datas
            if (rows) {
              rows.map((item) => {
                item.name = _this.formatStr(item.name, 1)
                item.identityCard = _this.formatStr(item.identityCard, 3)
                item.telephone = _this.formatStr(item.telephone, 2)
              })
            }
            _this.detailData = [...rows]
            _this.pagination2.total = res.total
          } else {
            console.log(res.message)
            _this.$message({
              type: 'error',
              message: '获取名单数据失败'
            })
          }
          _this.detailAttr.loading = false
        })
        .catch(function (err) {
          console.log(err.message)
          _this.$message({
            type: 'error',
            message: '获取名单数据失败'
          })
          _this.detailAttr.loading = false
        })
    },
    exportCol(row) {
      const _this = this
      const params = Object.assign(
        {},
        { testId: row.id },
        { page: 1, limit: row.testNumbers }
      )
      let exportInfos = {
        fileName: '大规模核酸检测明细数据.xlsx',
        sheetData: []
      }
      _this.tableAttr.loading = true
      // 获取名单数据
      userList(params)
        .then(function (res) {
          if (res.code === 200) {
            let rows = res.datas
            let sheetData = {
              sheetName: '大规模核酸检测明细数据',
              xlsxData: [
                [
                  '序号',
                  '姓名',
                  '身份证号码',
                  '联系电话',
                  '检测批号',
                  '检测结果',
                  '采样时间',
                  '检测时间'
                ]
              ]
            }
            if (rows) {
              let i = 1
              rows.map((item) => {
                let data = [
                  i,
                  item.name,
                  item.identityCard,
                  item.telephone,
                  item.testBatch,
                  item.testResult,
                  formatDates(new Date(item.sampleTime), 'yyyy-MM-dd hh:mm:ss'),
                  formatDates(new Date(item.testTime), 'yyyy-MM-dd hh:mm:ss')
                ]
                sheetData.xlsxData.push(data)
                i++
              })
            }
            exportInfos.sheetData.push(sheetData)
            _this.exportData(exportInfos)
          } else {
            console.log(res.message)
            _this.$message({
              type: 'error',
              message: '获取名单数据失败'
            })
          }
          _this.tableAttr.loading = false
        })
        .catch(function (err) {
          console.log(err.message)
          _this.$message({
            type: 'error',
            message: '获取名单数据失败'
          })
          _this.tableAttr.loading = false
        })
    },

    exportData(exportInfos) {
      let workBook = xlsx.utils.book_new()
      for (var i = 0; i < exportInfos.sheetData.length; i++) {
        let xlsxData = exportInfos.sheetData[i].xlsxData
        let worksheet = xlsx.utils.aoa_to_sheet(xlsxData)
        xlsx.utils.book_append_sheet(
          workBook,
          worksheet,
          exportInfos.sheetData[i].sheetName
        )
      }
      xlsx.writeFile(workBook, exportInfos.fileName)

      // 导出 事件
      // example: xlsxData = [[], []...]
      /*
      let xlsxData = [["序号", "名称", "时间"]];
      let worksheet = xlsx.utils.aoa_to_sheet(xlsxData);
      let workBook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workBook, worksheet, "全部");    // 第三个参数可选，是工作表名称
      xlsx.writeFile(workBook, "表格.xlsx");    // 第二个参数的后缀名有其他格式可供选择（xls, csv）
      */
    },
    formatStr(str, type) {
      var newStr
      if (type == 1) {
        if (str.length === 2) {
          newStr = str.substr(0, 1) + '*'
        } else if (str.length > 2) {
          var char = ''
          for (var i = 0, len = str.length - 2; i < len; i++) {
            char += '*'
          }
          newStr = str.substr(0, 1) + char + str.substr(-1, 1)
        } else {
          newStr = str
        }
      } else if (type == 2) {
        if (str.length <= 7 && str.length > 2) {
          var char = ''
          for (var i = 0, len = str.length - 2; i < len; i++) {
            char += '*'
          }
          newStr = str.substr(0, 1) + char + str.substr(-1, 1)
        } else if (str.length > 7) {
          var char = ''
          for (var i = 0, len = str.length - 7; i < len; i++) {
            char += '*'
          }
          newStr = str.substr(0, 3) + char + str.substr(-4, 4)
        } else {
          newStr = str
        }
      } else {
        if (str.length <= 7 && str.length > 2) {
          var char = ''
          for (var i = 0, len = str.length - 2; i < len; i++) {
            char += '*'
          }
          newStr = str.substr(0, 1) + char + str.substr(-1, 1)
        } else if (str.length > 7) {
          var char = ''
          for (var i = 0, len = str.length - 8; i < len; i++) {
            char += '*'
          }
          newStr = str.substr(0, 4) + char + str.substr(-4, 4)
        } else {
          newStr = str
        }
      }
      return newStr
    }
  }
}
</script>

<style lang="scss" scoped>
.monitor {
  width: 100%;
  margin: 0 auto;
  background-color: #f7f7f7;
  &-header {
    width: 100%;
    height: 250px;
    background: url('../../assets/images/header-bg-1.png') center;
    background-size: 100% 100%;
    span {
      font-size: 48px;
      color: #fff;
      position: relative;
      left: 270px;
      top: 100px;
    }
    .back {
      height: 27px;
      width: 80px;
      position: absolute;
      top: 30px;
      left: 170px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .span {
        width: 36px;
        height: 18px;
        margin-left: 10px;
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fefefe;
        line-height: 20px;
      }
    }
  }
  &-search {
    width: 100%;
    height: 110px;
    margin: 15px auto;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-table {
    width: 100%;
    margin: 15px auto;
    background-color: #fff;
    padding: 10px 100px;
    .info {
      margin: 20px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        color: #ff0000;
      }
    }
  }
}
</style>
<style scoped>
.el-form-item {
  margin: 0 20px;
  margin-bottom: 0;
}
</style>
