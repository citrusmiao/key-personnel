<template>
  <div class="monitor">
    <!-- <div class="monitor-header">
      <span>未3天2检人员数据查询</span>
      <div class="back" @click="toHome()">
        <img :src="require(`@/assets/images/home/back-space.png`)" alt="" />
        <div class="span">返回</div>
      </div>
    </div> -->
    <div class="monitor-search">
      <el-radio-group
        v-model="searchType"
        class="search-radio"
        @change="searchTypeChange"
      >
        <el-radio-button :label="1">自定义名单查询</el-radio-button>
        <el-radio-button :label="2">区域人员名单查询</el-radio-button>
        <el-radio-button :label="3">重点人员名单查询</el-radio-button>
      </el-radio-group>
      <div v-if="searchType == 1">
        <el-form :model="searchForm" :inline="true">
          <el-form-item>
            <el-upload
              ref="UploadImport"
              class="uploadFile"
              action
              :auto-upload="false"
              accept=".xls,.xlsx"
              :show-file-list="false"
              :on-change="UploadImport"
              :limit="1"
            >
              <el-button type="primary">导入名单</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="button" @click="download">模板下载</el-button>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              ref="timeBox"
              v-model="timeRange"
              type="daterange"
              range-separator="-"
              :picker-options="pickerOptions"
              start-placeholder="管控开始时间"
              end-placeholder="管控结束时间"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="clear">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="searchType == 2">
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
            <!--
            <el-input
              v-model="searchForm.streetName"
              placeholder="请输入街道名称"
              style="width: 250px"
              clearable
            ></el-input>
            -->
          </el-form-item>
          <el-form-item>
            <el-date-picker
              ref="timeBox"
              v-model="timeRange"
              type="daterange"
              range-separator="-"
              :picker-options="pickerOptions"
              start-placeholder="管控开始时间"
              end-placeholder="管控结束时间"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="clear">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
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
            <el-date-picker
              ref="timeBox"
              v-model="timeRange"
              type="daterange"
              range-separator="-"
              :picker-options="pickerOptions"
              start-placeholder="管控开始时间"
              end-placeholder="管控结束时间"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="clear">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="!showDetail" class="monitor-table">
      <div v-loading="tableAttr.loading" class="info">
        <div v-if="searchType == 1">
          共导入名单<span> {{ importCensus.total }} </span>人，未检人员<span>
            {{ importCensus.unFounds }} </span
          >人
        </div>
        <div v-else-if="searchType == 2">
          当前区域共<span> {{ censusData.total }} </span>人，未检人员<span>
            {{ pagination.total }} </span
          >人
        </div>
        <div v-else>
          重点人员共<span> {{ censusData.total }} </span>人，未检人员<span>
            {{ pagination.total }} </span
          >人
        </div>
        <el-button type="primary" size="mini" @click="exportAllExl()">
          导出
        </el-button>
      </div>
      <div v-if="unFounds != '' && searchType == 1">
        <div><span>以下号码查询不到核酸记录信息：</span></div>
        <div class="info" style="word-break: break-word">
          <span>{{ unFounds }}</span>
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
          <el-button type="text" size="mini" @click="detail(data.row)">
            检测记录
          </el-button>
        </template>
      </CommonTable>
    </div>

    <div v-if="showDetail" class="monitor-table">
      <div class="back">
        <img src="@/assets/images/back.png" @click="back" />
        <span> 返回 </span>
      </div>
      <div v-loading="detailAttr.loading" class="info">
        <div>
          共检测<span> {{ testCensus.total }} </span>次，阴性<span
            >{{ testCensus.npCount }} </span
          >次，阳性<span> {{ testCensus.pCount }} </span>次
        </div>
        <el-button
          type="primary"
          size="mini"
          class="export"
          @click="exportColExl"
        >
          导出
        </el-button>
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
    </div>
  </div>
</template>

<script>
import { formatDate, formatDates } from '@/utils/formatDate'
import CommonTable from '@/components/CommonTable'
import axios from 'axios'
import * as xlsx from 'xlsx'
import * as ops from '@/utils/options'
import { ReadFile } from '@/api/appKeyPersonnel'
import { idCardValidity } from '@/utils/validate'
import {
  pcrPageForTest,
  pcrCensusForTest,
  pcrCensusForSource,
  pcrCensusForKey,
  pcrPageForTd,
  pcrDataForIds
} from '@/api/appPcrTest'
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
    let that = this
    return {
      searchForm: { queryType: 1 },
      selectRow: {},
      searchType: '1',
      showDetail: false,
      importData: [],
      unFounds: '',
      importCensus: { total: 0, unFounds: 0 },
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
        { prop: 'residentAddress', label: '居住地址' },
        { prop: 'testNumber', label: '实检次数' },
        { prop: 'testGoals', label: '应检次数' },
        { slot_name: 'btn', label: '操作' }
      ],
      tableData: [],
      pagination: { page: 1, pageSize: 10, total: 0 },
      pagination2: { page: 1, pageSize: 10, total: 0 },

      timeRange: [],
      loading: false,
      dialog: false,
      detailCol: [
        { prop: 'areaName', label: '检测区域' },
        { prop: 'samplePoint', label: '检测场所' },
        { slot_name: 'sampleTime', label: '采样时间' },
        { slot_name: 'testTime', label: '检测时间' },
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
        }
      ],
      detailData: [],
      censusData: { total: 0 },
      testCensus: { total: 0, pCount: 0, npCount: 0 },
      pickerMinDate: '',
      pickerOptions: {
        onPick: (obj) => {
          that.$nextTick(() => {
            console.log(obj)
            // this.pickerMinDate = new Date(obj.minDate).getTime();
            const start = new Date(obj.minDate)
            const end = new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000)
            that.timeRange = []
            that.timeRange[0] = start
            that.timeRange[1] = end
          })
          that.$refs.timeBox.handleClose()
        },
        disabledDate: (time) => {
          return (
            time.getTime() > Date.now() - 2 * 24 * 3600 * 1000 ||
            time.getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000
          )
        }
      }
    }
  },
  mounted() {
    // this.getPages();
    // this.getCensus();
  },
  methods: {
    download() {
      axios
        .get('file/template_monitor.xlsx', {
          responseType: 'blob' // 重要
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          let fname = '证件号码导入模板.xlsx'
          link.href = url
          link.setAttribute('download', fname)
          document.body.appendChild(link)
          link.click()
        })
    },
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
      params.queryType = this.searchType
      if (this.searchType == 1) {
        params.idCards = this.importData.join(',')
        pcrDataForIds(params)
          .then(function (res) {
            if (res.code === 200) {
              let rows = res.datas
              let ids = [..._this.importData]
              _this.tableData = []
              if (rows) {
                rows.map((item) => {
                  item.name = _this.formatStr(item.name, 1)
                  item.identityCard = _this.formatStr(item.cardNumber, 3)
                  item.telephone = _this.formatStr(item.telephone, 2)
                  item.testGoals = 2
                  if (item.testGoals > item.testNumber) {
                    _this.tableData.push(item)
                  }
                  for (var i = 0; i < ids.length; i++) {
                    if (item.cardNumber == ids[i]) {
                      ids.splice(i, 1)
                      break
                    }
                  }
                })
              }
              _this.unFounds = ids.join(',')
              _this.importCensus.total = _this.importData.length
              _this.importCensus.unFounds = _this.tableData.length + ids.length
              // _this.tableData = [...rows];
              // _this.personData = res.datas
              // _this.pagination.total = res.total
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
      } else {
        // 获取列表信息
        pcrPageForTd(params)
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
              // _this.personData = res.datas
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
      }
    },
    getTestPages() {
      const _this = this
      const params = Object.assign(
        {},
        {
          idCard: this.selectRow.cardNumber,
          startTime: this.searchForm.startTime,
          endTime: this.searchForm.endTime
        },
        { page: 1, limit: this.pagination2.pageSize }
      )
      _this.dialog = true
      _this.detailAttr.loading = true
      // 获取核酸检测信息
      pcrPageForTest(params)
        .then(function (res) {
          if (res.code === 200) {
            /*
          let rows = res.datas;
          if (rows) {
            rows.map((item) => {
              item.name = _this.formatStr(item.name,1);
              item.identityCard = _this.formatStr(item.identityCard,3);
              item.telephone = _this.formatStr(item.telephone,2);
            });
          }
          */
            _this.detailData = res.datas // [...rows];
            _this.pagination2.total = res.total
          } else {
            console.log(res.message)
            _this.$message({
              type: 'error',
              message: '获取检测数据失败：' + res.message
            })
          }
          _this.detailAttr.loading = false
        })
        .catch(function (err) {
          console.log(err.message)
          _this.$message({
            type: 'error',
            message: '获取检测数据失败：' + err.message
          })
          _this.detailAttr.loading = false
        })
    },
    getTestCensus() {
      const _this = this
      const params = Object.assign(
        {},
        {
          idCard: this.selectRow.cardNumber,
          startTime: this.searchForm.startTime,
          endTime: this.searchForm.endTime
        },
        { page: 1, limit: this.pagination2.pageSize }
      )
      pcrCensusForTest(params)
        .then(function (res) {
          if (res.code === 200) {
            let rows = res.datas
            _this.testCensus = rows[0]
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
    getCensus() {
      const _this = this
      const params = Object.assign({}, this.searchForm)
      // 获取统计信息
      if (this.searchType == 2) {
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
      } else if (this.searchType == 3) {
        pcrCensusForKey(params)
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
      }
    },
    search() {
      if (this.searchType == 1) {
        if (this.timeRange.length == 0 || this.importData.length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择管控开始时间与结束时间与导入查询名单'
          })
          return
        }
      } else {
        if (this.timeRange.length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择管控开始时间与结束时间'
          })
          return
        }
      }
      this.pagination = { page: 1, pageSize: 10, total: 0 }
      if (this.timeRange.length > 0) {
        this.searchForm.startTime = this.timeRange[0]
        this.searchForm.endTime = this.timeRange[1]
      }
      this.getPages()
      this.getCensus()
    },
    clear() {
      this.importData = []
      this.timeRange = []
      this.searchForm = { queryType: this.searchType }
    },
    handlePageChange(val) {
      this.pagination.page = val.page
      this.pagination.pageSize = val.pageSize
      this.getPages()
    },
    handlePageChange2(val) {
      this.pagination2.page = val.page
      this.pagination2.pageSize = val.pageSize
      this.getTestPages()
    },
    exportAllExl() {
      this.$confirm('是否确认导出未3天2检数据？', '提示', {
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
    exportColExl() {
      this.$confirm('是否确认导出核酸检测数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.exportCol()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消导出'
          })
        })
    },
    exportAll() {
      if (
        !(this.pagination.total && this.pagination.total > 0) &&
        this.tableData.length == 0
      ) {
        this.$message({
          type: 'warning',
          message: '当前列表为空，不能导出。'
        })
        return
      }
      let exportInfos = {
        fileName: '未3天2检数据.xlsx',
        sheetData: []
      }
      const _this = this
      const params = Object.assign({}, this.searchForm, {
        page: 1,
        limit: this.pagination.total
      })
      _this.tableAttr.loading = true
      // 获取列表信息

      if (this.searchType == 1) {
        params.idCards = this.importData.join(',')
        params.limit = this.tableData.length
        pcrDataForIds(params)
          .then(function (res) {
            if (res.code === 200) {
              let rows = res.datas
              let sheetData = {
                sheetName: '未3天2检数据',
                xlsxData: [
                  [
                    '序号',
                    '姓名',
                    '国籍',
                    '证件类型',
                    '证件号码',
                    '手机号码',
                    '居住地址',
                    '实检次数',
                    '应检次数'
                  ]
                ]
              }
              if (rows) {
                let i = 1
                rows.map((item) => {
                  // item.name = _this.formatStr(item.name,1);
                  // item.identityCard = _this.formatStr(item.cardNumber,3);
                  // item.telephone = _this.formatStr(item.telephone,2);
                  item.testGoals = 2
                  if (item.testGoals > item.testNumber) {
                    let data = [
                      i,
                      item.name,
                      item.nationality,
                      item.cardType,
                      item.cardNumber,
                      item.telephone,
                      item.residentAddress,
                      item.testNumber,
                      item.testGoals
                    ]
                    sheetData.xlsxData.push(data)
                    i++
                  }
                })
                exportInfos.sheetData.push(sheetData)
                _this.exportData(exportInfos)
              }
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
      } else {
        pcrPageForTd(params)
          .then(function (res) {
            if (res.code === 200) {
              let rows = res.datas
              let sheetData = {
                sheetName: '未3天2检数据',
                xlsxData: [
                  [
                    '序号',
                    '姓名',
                    '国籍',
                    '证件类型',
                    '证件号码',
                    '手机号码',
                    '居住地址',
                    '实检次数',
                    '应检次数'
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
                    item.residentAddress,
                    item.testNumber,
                    item.testGoals
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
      }
    },
    searchTypeChange(val) {
      this.importData = []
      this.timeRange = []
      this.censusData = { total: 0 }
      this.tableData = []
      this.importCensus = { total: 0, unFounds: 0 }
      this.unFounds = ''
      this.pagination = { page: 1, pageSize: 10, total: 0 }
      this.searchForm = { queryType: val }
      // this.searchType = val;
    },
    handleChange(value) {
      console.log(value, 'testResult')
      this.detail()
    },
    back() {
      this.showDetail = false
    },
    detail(row) {
      if (row) {
        this.selectRow = row
        this.pagination2 = {
          page: 1,
          pageSize: 10,
          total: 0
        }
      }
      this.showDetail = true
      this.getTestPages()
      this.getTestCensus()
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
      let exportInfos = {
        fileName: '核酸检测数据.xlsx',
        sheetData: []
      }
      const params = Object.assign(
        {},
        {
          idCard: this.selectRow.cardNumber,
          startTime: this.searchForm.startTime,
          endTime: this.searchForm.endTime
        },
        { page: 1, limit: this.pagination2.total }
      )
      _this.tableAttr.loading = true
      // 获取名单数据
      pcrPageForTest(params)
        .then(function (res) {
          if (res.code === 200) {
            let rows = res.datas
            let sheetData = {
              sheetName: '核酸检测数据',
              xlsxData: [
                [
                  '序号',
                  '检测区域',
                  '检测场所',
                  '采样日期',
                  '检测日期',
                  '检测结果'
                ]
              ]
            }
            if (rows) {
              let i = 1
              rows.map((item) => {
                let data = [
                  i,
                  item.areaName,
                  item.samplePoint,
                  formatDates(new Date(item.sampleTime), 'yyyy-MM-dd hh:mm:ss'),
                  formatDates(new Date(item.testTime), 'yyyy-MM-dd hh:mm:ss'),
                  item.testResult
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
              message: '获取检测数据失败'
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

    async UploadImport(file) {
      let dataBinary = await ReadFile(file.raw) // 读取文件
      let workBook = xlsx.read(dataBinary, { type: 'binary', cellDates: true })
      let workSheet = workBook.Sheets[workBook.SheetNames[0]]
      let data = xlsx.utils.sheet_to_json(workSheet)
      if (data.length == 0) {
        this.$refs['UploadImport'].clearFiles() // 清空已上传的文件列表
        this.$message({
          type: 'warning',
          message: '导入内容为空，请下载模板填写正确的身份证号码再导入查询'
        })
        return
      }
      if (data.length > 0) {
        this.handleImport(data) // data：导入的数据，以数组的形式展示
        this.$refs['UploadImport'].clearFiles() // 清空已上传的文件列表
      }
    },
    handleImport(data) {
      // console.log(data);
      this.importData = []
      // const _this = this;
      if (data.length > 0) {
        let key = Object.keys(data[0])[0]
        let values = '' // "key";
        for (var i = 0; i < data.length; i++) {
          let obj = data[i]
          let val = Object.values(obj)[0]
          this.importData.push(val)
          /*
          if(idCardValidity(val)){
            this.importData.push(val);
          }else{
            this.importData = [];
            this.$message({
              type: 'warning',
              message: '导入文件第'+(i+1)+'行身份证号码格式不正确'
            });
            return;
          }
          */
        }
        // console.log(values);
        if (this.importData.length == 0) {
          this.$message({
            type: 'warning',
            message: '导入内容为空，请下载模板填写正确的身份证号码再导入查询'
          })
          return
        }
        // _this.searchForm.idCards = values;
      }
      // ... 处理数据
      // 注：清空已上传的文件列表，不然下次点击导入按钮不会触发事件
      this.$refs['UploadImport'].clearFiles()
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
    padding: 30px 0;
    margin: 15px auto;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    .search-radio {
      margin-bottom: 20px;
    }
    .search-form {
      display: flex;
      justify-content: center;
    }
    .multiple-search {
      position: relative;
      width: 800px;
    }
    .search-textarea {
      width: 800px;
      position: relative;
      border: none;
    }
    .template {
      width: 100px;
      position: absolute;
      top: 150px;
      right: 130px;
      background: #f4f6fb;
    }
    .excel {
      width: 100px;
      position: absolute;
      top: 150px;
      right: 20px;
      background: #f4f6fb;
    }
    .btn {
      margin-top: 20px;
      text-align: center;
    }
    .batch-search {
      width: 100%;
      height: 40px;
      margin: 0 auto;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
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
    .tips {
      height: 800px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 300px;
      img {
        margin-top: 50px;
      }
      .title {
        margin-top: 35px;
        margin-bottom: 20px;
        font-size: 18px;
        color: #333;
        font-weight: bolder;
      }
      .desc {
        font-size: 16px;
        line-height: 32px;
        color: #666;
      }
    }

    .little-title {
      height: 60px;
      margin-top: 16px;
      margin-bottom: 18px;
      font-size: 18px;
      font-weight: bold;
      color: #333;
      background-color: #f4f9ff;
      display: flex;
      align-items: center;
    }
    .kuai {
      height: 20px;
      width: 100%;
      padding-left: 16px;
      font-size: 18px;
      line-height: 20px;
      border-left: 5px solid #0072fd;
    }
    .export {
      width: 80px !important;
      position: relative;
      right: 1%;
    }
    .back {
      height: 15px;
      margin-bottom: 12px;
      font-size: 16px;
      color: #333;
      line-height: 15px;
      position: relative;
      left: -20px;
      img {
        margin-right: 13px;
        vertical-align: middle;
        cursor: pointer;
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
