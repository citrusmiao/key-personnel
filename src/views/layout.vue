<template>
  <div class="app-wrapper">
    <MyHeader />
    <div class="main-container">
      <router-view :key="key" />
    </div>
  </div>
</template>

<script>
import MyHeader from "@/components/MyHeader";
export default {
  name: "Layout",
  components: {
    MyHeader,
  },
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
// @import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  min-width:1200px;
  box-sizing: border-box;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
</style>
