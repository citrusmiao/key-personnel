<template>
  <div>
    <CommonTable
      :tableAttr="tableAttr"
      :tableCol="tableCol"
      :tableData="touchData"
      :pagination="pagination"
      @handlePageChange="handlePageChange"
    >
    
      <template v-slot:testTime="data">
          {{ data.row.testTime | formatTime }}
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
  name: "ConnectedInfo",
  components: { CommonTable },
  props: {
    touchData: { type: Array, default: () => [] },
    pagination: { 
      type: Object,
      default: () => ({ page: 1, pageSize: 10, total: 0 }),
    },
    tableAttr: { 
      type: Object,
      default: () => ({ loading: false, index: true, border: true }),
    },
  },
  data() {
    return {
      tableCol: [
        { prop: "name", label: "姓名" },
        { prop: "identityCard", label: "身份证号码" },
        { prop: "telephone", label: "联系电话" },
        { prop: "residentAddress", label: "居住地址" },
        { prop: "testNumber", label: "核酸次数" },
        { prop: "testResult", label: "核酸情况" },
        { slot_name: "testTime", label: "检测时间" },
        { prop: "places", label: "密接场所" },
        //{ prop: "touchType", label: "密接关系" },
        //{ slot_name: "personnelType", label: "人员类型" },
      ],
      personTypes: {0:"密接", 1:"次密接", 2:"无症状", 3:"确诊", 4:"其他"},
      tableData: [
        {
          name: "X*X",
          nation: "中国",
          idCard: "X****************X",
          phone: "XXX****XXXX",
          address: "XXXXXXXXXXXXX",
          testCount: 5,
          testResult: "阴性",
          testTime: "2022-05-09",
          location: "XXXXXXXXX",
          personType: 2,
        },
        {
          name: "X*X",
          nation: "中国",
          idCard: "X****************X",
          phone: "XXX****XXXX",
          address: "XXXXXXXXXXXXX",
          testCount: 5,
          testResult: "阴性",
          testTime: "2022-05-09",
          location: "XXXXXXXXX",
          personType: 2,
        },
        {
          name: "X*X",
          nation: "中国",
          idCard: "X****************X",
          phone: "XXX****XXXX",
          address: "XXXXXXXXXXXXX",
          testCount: 5,
          testResult: "阴性",
          testTime: "2022-05-09",
          location: "XXXXXXXXX",
          personType: 2,
        },
        {
          name: "X*X",
          nation: "中国",
          idCard: "X****************X",
          phone: "XXX****XXXX",
          address: "XXXXXXXXXXXXX",
          testCount: 5,
          testResult: "阴性",
          testTime: "2022-05-09",
          location: "XXXXXXXXX",
          personType: 2,
        },
        {
          name: "X*X",
          nation: "中国",
          idCard: "X****************X",
          phone: "XXX****XXXX",
          address: "XXXXXXXXXXXXX",
          testCount: 5,
          testResult: "阴性",
          testTime: "2022-05-09",
          location: "XXXXXXXXX",
          personType: 2,
        },
      ],
    };
  },
  computed: {
    // tableData() {
    //   return (
    //     this.personData
    //   );
    // },
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
      this.$emit("handlePageChange", { page: val, limit: this.pagination.pageSize });
    },
  },
};
</script>
<style lang=""></style>
