<template>
  <div>
    <CommonTable
      :tableAttr="tableAttr"
      :tableCol="tableCol"
      :tableData="personData"
      :pagination="pagination"
      @handlePageChange="handlePageChange"
    >
      <template v-slot:name="data">
        <span v-if="searchType === '单人查询'">{{ data.row.name }}</span>
        <el-button v-else type="text" size="mini" @click="toDetail(data.row)">
          {{ data.row.name }}
        </el-button>
      </template>
      <template v-slot:testResult="data">
        {{ resultTypes[data.row.testResult] }}
      </template>
      <template v-slot:testTime="data">
          {{ data.row.testTime | formatTime }}
      </template>
      <template v-slot:dataSource="data">
        {{ sourceTypes[data.row.dataSource] }}
      </template>
      <template v-slot:personnelType="data">
        {{ personTypes[data.row.personnelType] }}
      </template>
    </CommonTable>
  </div>
</template>
<script>
import {formatDate,formatDates} from '@/utils/formatDate'
import CommonTable from "@/components/CommonTable";
export default {
  name: "PersonInfo",
  components: { CommonTable },
  props: {
    searchType: { type: String, required: true },
    personData: { type: Array, default: () => [] },
    pagination: {
      type: Object,
      default: () => ({ page: 1, pageSize: 10, total: 0 }),
    },
    tableCol:{type: Array, default: () => []}
  },
  data() {
    return {
      tableAttr: { loading: false, index: true, border: true },
      /*
      tableCol: [
        { slot_name: "name", label: "姓名" },
        { prop: "identityCard", label: "身份证号码" },
        { prop: "telephone", label: "联系电话" },
        { prop: "places", label: "场所" },
        { prop: "residentAddress", label: "居住地址" },
        { prop: "testNumber", label: "核酸次数" },
        { prop: "testResult", label: "核酸情况" },
        { slot_name: "testTime", label: "检测时间" },
        { slot_name: "dataSource", label: "数据来源类型" },
        { slot_name: "personnelType", label: "人员类型" },
      ],
      */
      //pagination: { page: 1, pageSize: 10, total: 0 },

      resultTypes: {'P':"阳性", 'N':"阴性"},
      sourceTypes: {
        1:"密切接触者",
        2:"境外入境人员",
        3:"发热门诊患者",
        4:"新住院患者及陪护人员",
        5:"医疗机构工作人员",
        6:"口岸检疫和边防检查人员",
        7:"监所工作人员",
        8:"社会福利养老机构工作人员",
        /*
        0:"入境人员",
        1:"发热门诊",
        2:"公安部重点人员",
        3:"跨境快递人员",
        */
      },
      personTypes: {0:"密接", 1:"次密接", 2:"无症状", 3:"确诊", 4:"其他"},
    };
  },
  mounted() {
    //console.log(this.tableCol);
    this.pagination.total = this.personData.length;
  },
  filters: {
      //方法一
    fmtime(val) {
      return fmdata(val);
    },
    //使用封装中的方法二
    formatTime(val){
      let data=new Date(val)
      return  formatDates(data,'yyyy-MM-dd hh:mm:ss');
    }
  },
  methods: {
    handlePageChange(val) {
      this.$emit("pageChange", { page: val, limit: this.pagination.pageSize });
    },
    toDetail(row) {
      this.$emit("showTables", row);
    },
  },
};
</script>
<style lang=""></style>
