<template>
  <div class="monitor">
    <!-- <div class="monitor-header">
      <span>当日未检人员数据查询</span>
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
            placeholder="选择区划"
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
            @change="areaChange"
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
          <el-select
            v-model="searchForm.streetName"
            style="width: 100%"
            placeholder="选择街道"
          >
            <el-option
              v-for="item in streetOptions"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
          当前区域应检人数
          <span> {{ censusData.total == 0 ? '-' : censusData.total }} </span
          >，未检人数
          <span> {{ censusData.total == 0 ? '-' : pagination.total }} </span>
        </div>

        <div>
          <span style="color: #000; margin-right: 30px"
            >查询时间 {{ searchTime }}
          </span>
          <el-button type="primary" size="mini" @click="exportAllExl()">
            导出
          </el-button>
        </div>
      </div>
      <CommonTable
        :table-attr="tableAttr"
        :table-col="tableCol"
        :table-data="tableData"
        :pagination="pagination"
        @handlePageChange="handlePageChange"
      >
        <template v-slot:testTime="data">
          {{ data.row.testTime | formatTime }}
        </template>
        <template v-slot:sampleTime="data">
          {{ data.row.sampleTime | formatTime }}
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
  </div>
</template>

<script>
import { formatDate, formatDates } from '@/utils/formatDate'
import CommonTable from '@/components/CommonTable'
import * as xlsx from 'xlsx'
import * as ops from '@/utils/options'
import { pcrPageForSd, pcrCensusForSource, userList } from '@/api/appPcrTest'
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
    }
  },
  data() {
    return {
      searchForm: {},
      searchTime: '2022-11-14 11:11:11',
      selectRow: {},
      streetOptions: [{ label: '全部', value: '' }],
      areaOptions: ops.default.areaOptions,
      /*
      [
        { label: "全部", value: "" },
        {
          label: "广州市",
          value: "440100",
          children: [
            { label: "荔湾区", value: "440103" },
            { label: "越秀区", value: "440104" },
            { label: "海珠区", value: "440105" },
            { label: "天河区", value: "440106" },
            { label: "白云区", value: "440111" },
            { label: "黄埔区", value: "440112" },
            { label: "番禺区", value: "440113" },
            { label: "花都区", value: "440114" },
            { label: "南沙区", value: "440115" },
            { label: "从化区", value: "440117" },
            { label: "增城区", value: "440118" },
          ],
        },
      ],
      */
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
        }
      },
      tableCol: [
        { prop: 'name', label: '姓名' },
        { prop: 'nationality', label: '国籍' },
        { prop: 'cardType', label: '证件类型' },
        { prop: 'identityCard', label: '证件号码' },
        { prop: 'telephone', label: '手机号码' },
        { prop: 'residentAddress', label: '居住地址' }
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
        { prop: 'identityCard', label: '身份证号码' },
        { prop: 'telephone', label: '手机电话' },
        { prop: 'residentAddress', label: '居住地址' },
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
      detailData: [],
      censusData: { total: 0 },
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  mounted() {
    this.getPages()
    this.getCensus()
  },
  methods: {
    areaChange(val) {
      console.log(val)
      let opsArr = ops.default.streetOptions.filter(
        (item) => item.parentId == val
      )
      this.streetOptions = [{ label: '全部', value: '' }]
      for (let i = 0; i < opsArr.length; i++) {
        let obj = {}
        obj.label = opsArr[i].name
        obj.value = opsArr[i].name
        this.streetOptions.push(obj)
      }
    },
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
      let data = new Date()
      this.searchTime = formatDates(data, 'yyyy-MM-dd hh:mm:ss')
      // 获取列表信息
      pcrPageForSd(params)
        .then(function (res) {
          if (res.code === 200) {
            let rows = res.datas
            if (rows) {
              rows.map((item) => {
                item.name = _this.formatStr(item.name, 1)
                item.identityCard = _this.formatStr(item.cardNumber, 3)
                item.telephone = _this.formatStr(item.telephone, 2)
              })
            }
            _this.tableData = [...rows]
            // _this.tableData = res.datas;
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
      if (!this.searchForm.areaCode || this.searchForm.areaCode == '') {
        return
      }
      const _this = this
      const params = Object.assign({}, this.searchForm)
      // 获取统计信息
      pcrCensusForSource(params)
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
      this.censusData = { total: 0 }
      this.timeRange = []
      this.searchForm = {}
      this.getPages()
      this.getCensus()
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
      this.$confirm('是否确认导出当天未检数据？', '提示', {
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
      if (!(this.pagination.total && this.pagination.total > 0)) {
        this.$message({
          type: 'warning',
          message: '当前列表为空，不能导出。'
        })
        return
      }
      let exportInfos = {
        fileName: '当天未检数据.xlsx',
        sheetData: []
      }
      const _this = this
      const params = Object.assign({}, this.searchForm, {
        page: 1,
        limit: this.pagination.total
      })
      _this.tableAttr.loading = true
      // 获取列表信息
      pcrPageForSd(params)
        .then(function (res) {
          if (res.code === 200) {
            let rows = res.datas
            let sheetData = {
              sheetName: '当天未检数据',
              xlsxData: [
                [
                  '序号',
                  '姓名',
                  '国籍',
                  '证件类型',
                  '证件号码',
                  '手机号码',
                  '居住地址'
                ]
              ]
            }
            if (rows) {
              let i = 1
              rows.map((item) => {
                let data = [
                  i,
                  item.name,
                  item.nationality,
                  item.cardType,
                  item.cardNumber,
                  item.telephone,
                  item.residentAddress
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
                message: '获取导出数据失败'
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
      if (!(this.pagination2.total && this.pagination2.total > 0)) {
        this.$message({
          type: 'warning',
          message: '当前列表为空，不能导出。'
        })
        return
      }
      const _this = this
      const params = Object.assign({}, { testId: row.id })
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
                  _this.formatStr(item.name, 1),
                  _this.formatStr(item.identityCard, 3),
                  _this.formatStr(item.telephone, 2),
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
    width: 90%;
    height: 110px;
    margin: 15px auto;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-table {
    width: 90%;
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
