<template>
  <div class="timeline">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in timeLineData"
        :key="index"
        :timestamp="activity.evenTime"
        :color="activity.color"
        :size="activity.size"
        placement="top"
      >
        {{ activity.eventContent }}
        <template slot="dot">
          <i v-if="index === 0" class="el-icon-star-on first" />
        </template>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
export default {
  name: "TimeLine",
  props: {
    timeLineData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
    };
  },
  mounted() {
    //确诊病例 周某某 密接者 2021年1月5日，陕西省公布一例外省输入本土确诊病例周某某，X*X系周某某的密切接触者
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.timeline {
  margin-top: 20px;
  .first {
    border: 1px solid #e4e7ed;
    border-radius: 50%;
    color: #ffc600;
    font-size: 24px;
    position: relative;
    top: -8px;
    left: -8px;
  }
}
</style>
