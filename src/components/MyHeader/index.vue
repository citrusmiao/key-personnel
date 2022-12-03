<template>
  <div class="header">
    <div class="logo">
      <img src="@/assets/images/home/logo.png" alt="" @click="toHome" />
      <span>重点人员排查管控数据服务系统</span>
    </div>

    <div class="right-menu">
      <div class="user-pic">
        <img src="@/assets/images/home/user.png" />
      </div>
      <el-dropdown
        class="avatar-container"
        trigger="click"
        placement="bottom"
        size="small"
      >
        <div class="user-info">
          <span v-if="name">{{ name }}</span>
          <span v-else @click="toLogin">未登录</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu v-if="name" slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MyHeader',
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    toHome() {
      this.$router.push('/')
    },
    toLogin() {
      if (this.name) return
      this.$router.push('/login')
    },
    logout() {
      this.$confirm('是否退出系统?', '确认退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/logout').then(() => {
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  min-width: 1200px;
  height: 80px;
  color: #fff;
  padding: 0 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: url('../../assets/images/home/head-bg.png') no-repeat center;
  background-size: 100% 100%;
  .logo {
    height: 100%;
    line-height: 80px;
    display: flex;
    align-items: center;
    img {
      width: 48px;
      height: 43px;
      margin-left: 27px;
      margin-right: 18px;
    }
    span {
      color: #fff;
      font-size: 22px;
      font-weight: bold;
    }
  }
  .right-menu {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .user-pic {
      display: flex;
      align-items: center;
      margin-right: 18px;
      cursor: pointer;
      img {
        width: 52px;
        height: 52px;
        margin-left: 32px;
      }
    }
    .avatar-container {
      font-size: 16px;
      color: #fefefe;
      cursor: pointer;
      .user-info {
        i {
          margin-left: 5px;
        }
      }
      .user-dropdown {
        width: 240px;
        top: 80px !important;
        right: 0 !important;
      }
    }
  }
}
</style>
