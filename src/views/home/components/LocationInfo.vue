<template>
  <div>
    <CommonTable
      :tableAttr="tableAttr"
      :tableCol="tableCol"
      :tableData="locationData"
      :pagination="pagination"
      @handlePageChange="handlePageChange"
    >
      <template v-slot:activityTime="data">
          {{ data.row.activityTime | formatTime }}
      </template>
    </CommonTable>
  </div>
</template>
<script>
import {formatDate,formatDates} from '@/utils/formatDate'
import CommonTable from "@/components/CommonTable";
export default {
  name: "LocationInfo",
  components: { CommonTable },
  props: {
    locationData: { type: Array, default: () => [] },
    pagination: {
      type: Object,
      default: () => ({ page: 1, pageSize: 10, total: 0 }),
    },
  },
  data() {
    return {
      tableAttr: { loading: false, index: true, border: true },
      tableCol: [
        { prop: "placeName", label: "场所名称" },
        { prop: "placeType", label: "场所类型" },
        { prop: "placeArea", label: "所属区域" },
        { slot_name: "activityTime", label: "活动时间" },
        { prop: "touchNumbers", label: "密接人员数量" },
      ],
      tableData: [],
      //pagination: { page: 1, pageSize: 10, total: 5 },
    };
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
  computed: {
    // tableData() {
    //   return (
    //     this.personData
    //   );
    // },
  },
  methods: {
    handlePageChange(val) {
      this.$emit("handlePageChange", { page: val, limit: this.pagination.pageSize });
    },
  },
};
</script>
<style lang=""></style>
