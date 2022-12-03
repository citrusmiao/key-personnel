<template>
  <div class="control">
    <!-- <div class="control-header"><span>重点人员排查管控数据服务查询</span></div> -->
    <div class="control-search">
      <el-radio-group
        v-model="searchType"
        class="search-radio"
        @change="searchTypeChange"
      >
        <el-radio-button label="单人查询" />
        <el-radio-button label="多人查询" />
        <el-radio-button label="批量查询" />
      </el-radio-group>
      <div v-if="searchType === '单人查询'">
        <el-form :model="searchForm" :inline="true">
          <el-form-item>
            <el-select
              v-model="searchForm.searchType"
              placeholder="选择查询方式"
              style="width: 150px"
            >
              <el-option
                v-for="item in searchTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input
              v-if="searchForm.searchType == 1"
              v-model="searchForm.idCard"
              maxlength="255"
              placeholder="请输入身份证号码"
              clearable
              class="search-input"
            >
              <el-button slot="append" @click="search">搜索</el-button>
            </el-input>
            <el-input
              v-if="searchForm.searchType == 2"
              v-model="searchForm.telephone"
              maxlength="255"
              placeholder="请输入手机号码"
              clearable
              class="search-input"
            >
              <el-button slot="append" @click="search">搜索</el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="searchType === '多人查询'" class="multiple-search">
        <el-select
          v-model="searchForm.searchType"
          placeholder="选择查询方式"
          class="type-select"
        >
          <el-option
            v-for="item in searchTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="searchForm.idCards"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 6 }"
          placeholder="每行输入一个身份证号码，多个号码输入以回车键换行"
          class="search-textarea"
        />
        <el-button type="text" size="mini" class="template" @click="download"
          >模板下载</el-button
        >
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
          <el-button type="text" size="mini" class="excel">Excel导入</el-button>
        </el-upload>
        <div class="btn">
          <el-button type="primary" @click="search2">搜索</el-button>
          <el-button @click="clear">清空</el-button>
        </div>
      </div>
      <div v-else>
        <el-form :model="searchForm" :inline="true">
          <el-form-item>
            <el-select
              v-model="searchForm.queryType"
              placeholder="选择查询方式"
              class="type-select"
              style="width: 200px"
              @change="queryChange"
            >
              <el-option
                v-for="item in queryTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-cascader
              v-if="searchForm.queryType == 1"
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
              style="width: 350px"
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
            <el-input
              v-if="searchForm.queryType == 2"
              v-model="searchForm.place"
              placeholder="场所"
              style="width: 350px"
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
            <el-date-picker
              v-if="searchForm.queryType == 3"
              v-model="timeRange"
              type="daterange"
              range-separator="-"
              :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
            <el-select
              v-if="searchForm.queryType == 4"
              v-model="searchForm.dataSource"
              placeholder="选择数据来源类型"
              class="type-select"
              style="width: 350px"
            >
              <el-option
                v-for="item in sourceTypes"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="input_btn" type="primary" @click="search3"
              >搜索</el-button
            >
            <el-button class="input_btn" @click="clear2">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-loading="loading" class="control-table">
      <template v-if="showTip">
        <div class="tips">
          <img src="@/assets/images/search-tips.png" alt="" />
          <div class="title">查询提示</div>
          <div class="desc">
            单人查询功能可以查询出单个重点人员的密接数据，包括人员基本信息、时空轨迹、密接场所、密接人员等；多人查询可以批量查询多个重点人员的密接数据，包括员基本信息、时空轨迹、密接场所、密接人员等；批量查询可以通过区域、场所、时间区间等维度批量查询出重点人员数据，以及重点人员的密接数据。
          </div>
        </div>
      </template>
      <template v-if="!showTip">
        <template>
          <div v-show="showTable">
            <div class="little-title">
              <div class="kuai">重点人员信息</div>
              <el-button
                type="primary"
                size="mini"
                class="export"
                @click="exportListXls"
              >
                导出
              </el-button>
            </div>
            <PersonInfo
              :search-type="searchType"
              :person-data="personData"
              :pagination="pagination"
              :table-col="tableCol"
              @pageChange="pageChange"
              @showTables="showTables"
            />
          </div>
        </template>
        <template v-if="showTab">
          <div v-if="!showTable && searchType !== '单人查询'" class="back">
            <img src="@/assets/images/back.png" @click="back" />
            <span> 返回 </span>
          </div>
          <div class="little-title">
            <div class="kuai">
              密接信息 <span>({{ item.name }} {{ item.identityCard_s }})</span>
            </div>
            <el-button
              type="primary"
              size="mini"
              class="export"
              @click="exportDetailXls"
            >
              导出
            </el-button>
          </div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="时空轨迹" name="first">
              <TimeLine :time-line-data="timeLineData" />
            </el-tab-pane>
            <el-tab-pane label="涉及场所" name="second">
              <LocationInfo
                :location-data="placeData"
                :pagination="pagination3"
                @handlePageChange="handlePageChange2"
              />
            </el-tab-pane>
            <el-tab-pane label="密接人员" name="third">
              <ConnectedInfo
                :touch-data="touchData"
                :pagination="pagination2"
                @handlePageChange="handlePageChange"
              />
            </el-tab-pane>
          </el-tabs>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { formatDate, formatDates } from '@/utils/formatDate'
import CommonTable from '@/components/CommonTable'
import TimeLine from '@/components/TimeLine'
import PersonInfo from './components/PersonInfo'
import LocationInfo from './components/LocationInfo'
import ConnectedInfo from './components/ConnectedInfo'
import axios from 'axios'
import * as xlsx from 'xlsx'
import { keyPage, touch, track, place, ReadFile } from '@/api/appKeyPersonnel'
import { idCardValidity } from '@/utils/validate'
export default {
  name: 'Control',
  components: {
    CommonTable,
    TimeLine,
    PersonInfo,
    LocationInfo,
    ConnectedInfo
  },
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
      searchType: '单人查询',
      pager: {
        total: 0,
        page: 1,
        pageSize: 10
      },
      item: {},
      pagination: { page: 1, pageSize: 10, total: 0 },
      pagination2: { page: 1, pageSize: 10, total: 0 },
      pagination3: { page: 1, pageSize: 10, total: 0 },
      idCard: '',
      idCards: '',
      activeName: 'first',
      searchForm: {
        idCards: '',
        searchType: '1',
        queryType: '1'
      },
      tableCol: [
        { slot_name: 'name', label: '姓名' },
        { prop: 'identityCard_s', label: '身份证号码' },
        { prop: 'telephone_s', label: '联系电话' },
        { prop: 'placeName', label: '场所', hide: true },
        { prop: 'residentAddress', label: '居住地址' },
        { prop: 'testNumber', label: '核酸次数' },
        { prop: 'testResult', label: '核酸情况' },
        { slot_name: 'testTime', label: '检测时间' },
        { slot_name: 'dataSource', label: '数据来源类型' }
        // { slot_name: "personnelType", label: "人员类型" },
      ],
      timeRange: [],
      searchTypes: [
        { label: '身份证号码查询', value: '1' },
        { label: '手机号码查询', value: '2' }
      ],
      queryTypes: [
        { label: '按人员所属区域', value: '1' },
        { label: '按人员涉及场所', value: '2' },
        { label: '按核酸检测时间', value: '3' },
        { label: '按数据来源类型', value: '4' }
      ],
      sourceTypes: [
        { label: '全部', value: '' },
        { label: '密切接触者', value: '1' },
        { label: '境外入境人员', value: '2' },
        { label: '发热门诊患者', value: '3' },
        { label: '新住院患者及陪护人员', value: '4' },
        { label: '医疗机构工作人员', value: '5' },
        { label: '口岸检疫和边防检查人员', value: '6' },
        { label: '监所工作人员', value: '7' },
        { label: '社会福利养老机构工作人员', value: '8' }
      ],
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
      searchParams: {},
      queryType: {},
      loading: false,
      showTip: true,
      showTab: true,
      showTable: true,
      timeLineData: [],
      details: { place: [], touch: [] },
      placeData: [],
      touchData: [],
      personData: [],
      pickerOptions: {
        disabledDate: (time) => {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000
          )
        }
      },
      /*
      sourceTypes: {
        0:"入境人员",
        1:"发热门诊",
        2:"公安部重点人员",
        3:"跨境快递人员",
      },
      */
      personTypes: { 0: '密接', 1: '次密接', 2: '无症状', 3: '确诊', 4: '其他' }
    }
  },
  methods: {
    idCartValid(code) {
      return idCardValidity(code)
    },
    queryChange(val) {
      this.searchForm = {
        queryType: this.searchForm.queryType,
        searchType: '1'
      }
      this.timeRange = []
    },
    getKeyData(type) {
      if (!type) {
        return
      }
      this.loading = true
      const _this = this
      this.tableCol[3].hide = true
      _this.searchParams = {}
      _this.queryType = type
      if (type == 1) {
        if (_this.searchForm.searchType == 1) {
          _this.searchParams.idCards = _this.searchForm.idCard
        } else {
          _this.searchParams.telephones = _this.searchForm.telephone
        }
      } else if (type == 2) {
        let tmp = _this.searchForm.idCards.replace(/\n/g, ',').split(',')
        let ids = []
        for (var i = 0; i < tmp.length; i++) {
          if (tmp[i].length > 0) {
            if (this.searchForm.searchType == 1) {
              if (!idCardValidity(tmp[i])) {
                this.$message({
                  type: 'warning',
                  message: '输入的身份证号码有误'
                })
                return
              }
            } else {
              if (!/^1[3456789]\d{9}$/.test(tmp[i])) {
                this.$message({
                  type: 'warning',
                  message: '输入的手机号码有误'
                })
                return
              }
            }
            ids.push(tmp[i])
            /*
            this.$message({
              type: 'warning',
              message: '存在空行数据，请输入正确的身份证号码'
            });
            return;
            */
          }
        }
        if (_this.searchForm.searchType == 1) {
          _this.searchParams.idCards = ids.join(',')
        } else {
          _this.searchParams.telephones = ids.join(',')
        }
      } else {
        if (_this.searchForm.place && _this.searchForm.place.length > 0) {
          this.tableCol[3].hide = false
        }
        _this.searchParams.areaCode = _this.searchForm.areaCode
        _this.searchParams.place = _this.searchForm.place
        _this.searchParams.startTime = _this.searchForm.startTime
        _this.searchParams.endTime = _this.searchForm.endTime
        _this.searchParams.dataSource = _this.searchForm.dataSource
      }
      const params = Object.assign({}, _this.searchParams, {
        page: this.pagination.page,
        limit: this.pagination.pageSize
      })
      keyPage(params)
        .then(function (res) {
          if (res.code === 200) {
            let rows = res.datas
            if (rows) {
              rows.map((item) => {
                item.name_s = item.name
                item.name = _this.formatStr(item.name, 1)
                item.identityCard_s = _this.formatStr(item.identityCard, 3)
                item.telephone_s = _this.formatStr(item.telephone, 2)
              })
            }
            _this.personData = [...rows]
            // _this.personData = res.datas
            _this.pagination.total = res.total
            if (type && type == 1) {
              if (_this.personData.length > 0) {
                _this.item = _this.personData[0]
                _this.pagination2 = { page: 1, pageSize: 10, total: 0 }
                _this.pagination3 = { page: 1, pageSize: 10, total: 0 }
                _this.getTrack()
                _this.getPlace()
                _this.getTouch()
              }
            }
          } else {
            console.log(res.message)
            _this.$message({
              type: 'error',
              message: '获取数据表失败'
            })
          }
          _this.loading = false
        })
        .catch(function (err) {
          console.log(err.message)
          _this.$message({
            type: 'error',
            message: '获取数据失败'
          })
          _this.loading = false
        })
    },
    getTrack() {
      const _this = this
      const params = { keyId: _this.item.id } // Object.assign({}, this.searchForm, {page: this.pager.page, limit: this.pager.pagesize});
      // 轨迹
      track(params)
        .then(function (res) {
          if (res.code === 200) {
            _this.timeLineData = res.datas
          } else {
            console.log(res.message)
            _this.$message({
              type: 'error',
              message: '获取轨迹数据失败'
            })
          }
          _this.loading = false
        })
        .catch(function (err) {
          console.log(err.message)
          _this.$message({
            type: 'error',
            message: '获取轨迹数据失败'
          })
        })
    },
    getPlace() {
      const _this = this
      const params = { keyId: _this.item.id } // Object.assign({}, this.searchForm, {page: this.pager.page, limit: this.pager.pagesize});
      // 场所
      const params2 = Object.assign({}, params, {
        page: this.pagination3.page,
        limit: this.pagination3.pageSize
      })
      place(params2)
        .then(function (res) {
          if (res.code === 200) {
            _this.placeData = res.datas
            _this.pagination3.total = res.total
          } else {
            console.log(res.message)
            _this.$message({
              type: 'error',
              message: '获取场所数据失败'
            })
          }
        })
        .catch(function (err) {
          console.log(err.message)
          _this.$message({
            type: 'error',
            message: '获取场所数据失败'
          })
        })
    },
    getTouch() {
      const _this = this
      const params = { keyId: _this.item.id } // Object.assign({}, this.searchForm, {page: this.pager.page, limit: this.pager.pagesize});
      // 密接人员
      const params2 = Object.assign({}, params, {
        page: this.pagination2.page,
        limit: this.pagination2.pageSize
      })
      touch(params2)
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
            _this.touchData = [...rows]
            // _this.touchData = res.datas;
            _this.pagination2.total = res.total
          } else {
            console.log(res.message)
            _this.$message({
              type: 'error',
              message: '获取密接人员失败'
            })
          }
        })
        .catch(function (err) {
          console.log(err.message)
          _this.$message({
            type: 'error',
            message: '获取密接人员失败'
          })
        })
    },
    search() {
      if (this.searchForm.searchType == 1) {
        if (!idCardValidity(this.searchForm.idCard)) {
          this.$message({
            type: 'warning',
            message: '请输入正确的身份证号码'
          })
          return
        }
      } else {
        if (!/^1[3456789]\d{9}$/.test(this.searchForm.telephone)) {
          this.$message({
            type: 'warning',
            message: '请输入正确的手机号码'
          })
          return
        }
      }
      this.getKeyData(1)
      this.showTip = false
      this.showTab = true
      this.showTable = true
      this.activeName = 'first'
    },
    search2() {
      // console.log("多人查询");
      // console.log(this.searchForm.idCards);
      if (
        typeof this.searchForm.idCards === 'undefined' ||
        this.searchForm.idCards.length < 1
      ) {
        let msg =
          this.searchForm.searchType == 1
            ? '身份证号码不能为空'
            : '手机号码不能为空'
        this.$message({
          type: 'warning',
          message: msg
        })
        return
      }
      this.getKeyData(2)
      this.activeName = 'first'
      this.showTip = false

      this.showTab = false
      this.showTable = true
    },
    search3() {
      if (this.timeRange.length > 0) {
        this.searchForm.startTime = this.timeRange[0]
        this.searchForm.endTime = this.timeRange[1]
      }
      this.getKeyData(3)
      this.activeName = 'first'
      this.showTip = false

      this.showTab = false
      this.showTable = true
    },
    pageChange(val) {
      // console.log(val);
      this.pager.page = val.page
      this.pager.pageSize = val.limit
      if (this.searchType == '多人查询') {
        this.getKeyData(2)
      } else {
        this.getKeyData(3)
      }
    },
    handlePageChange(val) {
      this.pagination2.page = val.page.page
      this.pagination2.pageSize = val.limit
      this.getTouch()
    },
    handlePageChange2(val) {
      this.pagination3.page = val.page.page
      this.pagination3.pageSize = val.limit
      this.getPlace()
    },
    importExcel() {},
    clear() {
      this.searchForm.idCards = ''
    },
    clear2() {
      this.searchForm = {
        queryType: this.searchForm.queryType,
        searchType: '1'
      }
      this.timeRange = []
      this.search3()
    },
    exportListXls() {
      this.$confirm('是否确认导出重点人员信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.exportList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消导出'
          })
        })
    },
    exportDetailXls() {
      this.$confirm('是否确认导出密接信息信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.getAllDetails()
          this.exportDetail()
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err
          })
        })
    },
    async getAllDetails() {
      const _this = this
      const params = { keyId: _this.item.id } // Object.assign({}, this.searchForm, {page: this.pager.page, limit: this.pager.pagesize});
      // 密接人员
      const params2 = Object.assign({}, params, {
        page: 1,
        limit: this.pagination2.total
      })
      let res = await touch(params2)
      if (res.code === 200) {
        _this.details.touch = res.datas
      } else {
        console.log(res.message)
        _this.$message({
          type: 'error',
          message: '获取密接人员失败'
        })
      }
      // 涉及场所
      const params3 = Object.assign({}, params, {
        page: 1,
        limit: this.pagination3.total
      })
      let res2 = await place(params3)
      if (res2.code === 200) {
        _this.details.place = res2.datas
      } else {
        console.log(res.message)
        _this.$message({
          type: 'error',
          message: '获取密接人员失败'
        })
      }
    },
    exportList() {
      let exportInfos = {
        fileName: '重点人员信息.xlsx',
        sheetData: []
      }
      const _this = this
      const params = Object.assign({}, _this.searchParams, {
        page: 1,
        limit: this.pagination.total
      })
      keyPage(params)
        .then(function (res) {
          if (res.code === 200) {
            let rows = res.datas
            let sheetData = {
              sheetName: '重点人员信息',
              xlsxData: [
                [
                  '序号',
                  '姓名',
                  '国籍',
                  '身份证号码',
                  '联系电话',
                  '居住地址',
                  '核酸次数',
                  '核算情况',
                  '检测时间',
                  '数据来源类型'
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
                  item.identityCard,
                  item.telephone,
                  item.residentAddress,
                  item.testNumber,
                  item.testResult,
                  formatDates(new Date(item.testTime), 'yyyy-MM-dd hh:mm:ss'),
                  _this.sourceTypes[item.dataSource]
                    ? _this.sourceTypes[item.dataSource].label
                    : ''
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
            }
          } else {
            console.log(res.message)
            _this.$message({
              type: 'error',
              message: '获取数据表失败'
            })
          }
          _this.loading = false
        })
        .catch(function (err) {
          console.log(err.message)
          _this.$message({
            type: 'error',
            message: '获取数据失败'
          })
          _this.loading = false
        })
    },
    exportDetail() {
      const _this = this
      let exportInfos = {
        fileName: '重点人员密接信息-' + this.item.name_s + '.xlsx',
        sheetData: []
      }
      // 时空轨迹
      let trackInfo = {
        sheetName: '时空轨迹',
        xlsxData: [['时空轨迹']]
      }
      for (var i = 0; i < _this.timeLineData.length; i++) {
        trackInfo.xlsxData.push([_this.timeLineData[i].eventContent])
      }
      exportInfos.sheetData.push(trackInfo)

      // 涉及场所
      let placeInfo = {
        sheetName: '涉及场所',
        xlsxData: [
          [
            '序号',
            '场所名称',
            '场所类型',
            '所属区域',
            '活动时间',
            '密接人员数量'
          ]
        ]
      }
      let placeData = this.details.place
      for (var i = 0; i < placeData.length; i++) {
        placeInfo.xlsxData.push([
          i + 1,
          placeData[i].placeName,
          placeData[i].placeType,
          placeData[i].placeArea,
          formatDates(
            new Date(placeData[i].activityTime),
            'yyyy-MM-dd hh:mm:ss'
          ),
          placeData[i].touchNumbers
        ])
      }
      exportInfos.sheetData.push(placeInfo)
      // 密接人员
      let touchInfo = {
        sheetName: '密接人员',
        xlsxData: [
          [
            '序号',
            '姓名',
            '国籍',
            '身份证号码',
            '联系电话',
            '居住地址',
            '核酸次数',
            '核算情况',
            '检测时间',
            '密接场所'
          ]
        ]
      }
      let touchData = this.details.touch
      for (var i = 0; i < touchData.length; i++) {
        let item = touchData[i]
        touchInfo.xlsxData.push([
          i + 1,
          item.name,
          item.nationality,
          item.identityCard,
          item.telephone,
          item.residentAddress,
          item.testNumber,
          item.testResult,
          formatDates(new Date(item.testTime), 'yyyy-MM-dd hh:mm:ss'),
          item.places
        ])
      }
      exportInfos.sheetData.push(touchInfo)
      _this.exportData(exportInfos)
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
    searchTypeChange(val) {
      this.showTip = true
      this.searchForm.searchType = '1'
      this.searchForm.queryType = '1'
      // this.searchType = val;
    },
    handleClick(val) {
      // console.log(val);
    },
    showTables(item) {
      this.item = item
      this.pagination2 = { page: 1, pageSize: 10, total: 0 }
      this.pagination3 = { page: 1, pageSize: 10, total: 0 }
      this.getTrack()
      this.getPlace()
      this.getTouch()

      if (item) {
        this.showTable = false
        this.showTab = true
      }
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
      const _this = this
      if (data.length > 0) {
        let key = Object.keys(data[0])[0]
        let values = '' // "key";
        for (var i = 0; i < data.length; i++) {
          let obj = data[i]
          let val = Object.values(obj)[0]
          if (this.searchForm.searchType == 1) {
            if (idCardValidity(val)) {
              values = values + val + '\n'
            } else {
              this.$message({
                type: 'warning',
                message: '导入文件第' + (i + 1) + '行身份证号码格式不正确'
              })
              return
            }
          } else {
            if (/^1[3456789]\d{9}$/.test(val)) {
              values = values + val + '\n'
            } else {
              this.$message({
                type: 'warning',
                message: '导入文件第' + (i + 1) + '行手机号码格式不正确'
              })
              return
            }
          }
        }
        // console.log(values);
        if (values.length == 0) {
          this.$message({
            type: 'warning',
            message: '导入内容为空，请下载模板填写正确的身份证号码再导入查询'
          })
          return
        }
        _this.searchForm.idCards = values
      }
      // ... 处理数据
      // 注：清空已上传的文件列表，不然下次点击导入按钮不会触发事件
      this.$refs['UploadImport'].clearFiles()
    },
    download() {
      if (this.searchForm.searchType == 1) {
        axios
          .get('file/template.xlsx', {
            responseType: 'blob' // 重要
          })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            let fname = '身份证号码导入模板.xlsx'
            link.href = url
            link.setAttribute('download', fname)
            document.body.appendChild(link)
            link.click()
          })
      } else {
        axios
          .get('file/template_phone.xlsx', {
            responseType: 'blob' // 重要
          })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            let fname = '手机号码导入模板.xlsx'
            link.href = url
            link.setAttribute('download', fname)
            document.body.appendChild(link)
            link.click()
          })
      }
    },
    exportXls() {
      // 导出 事件
      // example: xlsxData = [[], []...]
      let xlsxData = [['序号', '名称', '时间']]
      let worksheet = xlsx.utils.aoa_to_sheet(xlsxData)
      let workBook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workBook, worksheet, '全部') // 第三个参数可选，是工作表名称
      xlsx.writeFile(workBook, '表格.xlsx') // 第二个参数的后缀名有其他格式可供选择（xls, csv）
      /*
      // 注：如需要多个工作表，则新增 worksheet，如下
      let xlsxData_1 = [["序号", "名称", "时间"]];
      let worksheet_1 = xlsx.utils.aoa_to_sheet(xlsxData_1);
      let workBook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workBook, worksheet_1, "第一页");    // 第三个参数可选，是工作表名称
      let xlsxData_2 = [["序号", "名称", "时间"]];
      let worksheet_2 = xlsx.utils.aoa_to_sheet(xlsxData_2);
      xlsx.utils.book_append_sheet(workBook, worksheet_2, "第二页");    // 第三个参数可选，是工作表名称
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
    },
    back() {
      this.showTable = true
      this.showTab = false
    }
  }
}
</script>

<style lang="scss" scoped>
.control {
  width: 100%;
  margin: 0 auto;
  padding-bottom: 10px;
  background-color: #f7f7f7;
  box-sizing: border-box;
  &-header {
    width: 100%;
    height: 250px;
    background: url('../../assets/images/header-bg-2.png') center;
    background-size: 100% 100%;
    span {
      font-size: 48px;
      color: #fff;
      position: relative;
      left: 270px;
      top: 100px;
    }
  }
  &-search {
    width: 100%;
    padding: 30px 0;
    margin: 15px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    position: relative;
    .search-radio {
      margin-bottom: 20px;
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
    .input_btn {
      height: 50px;
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
    width: 100%;
    text-align: left;
    padding: 20px 120px;
    margin: 0 auto;
    margin-bottom: 20px;
    background-color: #fff;

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
.control >>> .el-button {
  width: 100px;
  border-radius: 0;
}
.control >>> .el-input-group {
  width: 700px;
  height: 50px;
  border-radius: 0;
}
.control-search >>> .el-input__inner {
  border-radius: 0;
  height: 50px;
}
.control >>> .el-input-group__append {
  height: 50px;
  width: 150px;
  font-size: 18px;
  text-align: center;
  border-radius: 0;
  border: 1px solid #2e5bfe;
  border-left-width: 0;
  color: #fff;
  background: #2e5bfe;
}
.control >>> .el-input-group--append .el-input__inner,
.el-input-group__prepend {
  height: 50px;
}
.el-form-item {
  margin: 0 20px;
  margin-bottom: 0;
}
</style>
