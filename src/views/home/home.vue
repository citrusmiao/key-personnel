<template>
  <div class="monitor">
    <!-- <div class="monitor-header"><span>大规模核酸检测数据查询服务</span></div> -->
    <div class="monitor-content">
      <div class="service-boxes">
        <div class="box data" @click="toClick('monitor')">
          <div class="box-img-pcr pcr" />
          <div class="box-name">核酸检测数据查询</div>
        </div>
        <div class="box data" @click="toClick('monitorSD')">
          <div class="box-img-pcr pcrsd" />
          <div class="box-name">当天未检查询</div>
        </div>
        <div class="box data" @click="toClick('monitorOD')">
          <div class="box-img-pcr pcrod" />
          <div class="box-name">未1天1检查询</div>
        </div>
      </div>
      <div class="service-boxes">
        <div class="box data" @click="toClick('monitorTD')">
          <div class="box-img-pcr pcrtd" />
          <div class="box-name">未3天2检查询</div>
        </div>
        <div class="box data" @click="toClick('monitorSVD')">
          <div class="box-img-pcr pcrsvd" />
          <div class="box-name">未7天3检查询</div>
        </div>
        <div class="box2" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {}
  },
  mounted() {},
  methods: {
    toClick(path) {
      console.log(path)
      this.$router.push({
        path: path
      })
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
  }
  &-content {
    width: 100%;
    margin: 15px auto;
    background-color: #fff;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .service-boxes {
      margin: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      .box {
        width: 483px;
        height: 333px;
        display: flex;
        padding: 0 0.4rem;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        background-color: #fff;
        cursor: pointer;
        .box-img-pcr {
          margin-top: 110px;
          width: 60px;
          height: 60px;
        }
        .pcr {
          background: url('../../assets/images/home/pcr.png') no-repeat center;
          background-size: 100% 100%;
        }
        .pcrod {
          background: url('../../assets/images/home/pcrod.png') no-repeat center;
          background-size: 100% 100%;
        }
        .pcrsd {
          background: url('../../assets/images/home/pcrsd.png') no-repeat center;
          background-size: 100% 100%;
        }
        .pcrtd {
          background: url('../../assets/images/home/pcrtd.png') no-repeat center;
          background-size: 100% 100%;
        }
        .pcrsvd {
          background: url('../../assets/images/home/pcrsvd.png') no-repeat
            center;
          background-size: 100% 100%;
        }
        .box-name {
          font-size: 30px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #000000;
          line-height: 9px;
          margin-top: 30px;
        }
        .box-desc {
          margin-top: 20px;
          font-size: 16px;
          line-height: 30px;
          color: #121c27;
        }
      }
      .box1 {
        width: 483px;
        height: 333px;
        display: flex;
        padding: 0 0.4rem;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        background-color: #fff;
        color: #fff;
        transition: all 0.5s;
        cursor: pointer;
        .box-img-pcr {
          margin-top: 110px;
          width: 60px;
          height: 60px;
        }
        .pcr {
          background: url('../../assets/images/home/pcr-active.png') no-repeat
            center;
          background-size: 100% 100%;
        }
        .pcrod {
          background: url('../../assets/images/home/pcrod-active.png') no-repeat
            center;
          background-size: 100% 100%;
        }
        .pcrsd {
          background: url('../../assets/images/home/pcrsd-active.png') no-repeat
            center;
          background-size: 100% 100%;
        }
        .pcrtd {
          background: url('../../assets/images/home/pcrtd-active.png') no-repeat
            center;
          background-size: 100% 100%;
        }
        .pcrsvd {
          background: url('../../assets/images/home/pcrsvd-active.png')
            no-repeat center;
          background-size: 100% 100%;
        }
        .box-name {
          margin-top: 30px;
          font-size: 30px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #ffffff;
          line-height: 9px;
        }
        .box-desc {
          margin-top: 0.2rem;
          padding: 0 0.4rem;
          font-size: 0.16rem;
          line-height: 0.3rem;
          color: #fff;
        }
      }
      .box2 {
        width: 483px;
        height: 333px;
        padding: 0 0.4rem;
      }
      .data {
        background: url('../../assets/images/home/card-bg.png') no-repeat center;
        background-size: 100% 100%;
      }
      .data:hover {
        background: url('../../assets/images/home/card-bg-active.png') no-repeat
          center;
        background-size: 100% 100%;
        @extend .box1;
      }
    }
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
  .service-card {
    margin: 0 auto;
    text-align: center;
    margin-top: 0.2rem;
    .tabs {
      height: 0.5rem;
      display: flex;
      justify-content: center;
      .tab {
        width: 1rem;
        height: 0.5rem;
        margin: 0 0.5rem;
        font-size: 0.24rem;
        font-weight: 400;
        color: #24374e;
        line-height: 0.4rem;
        cursor: pointer;
      }
      .active {
        width: 1rem;
        height: 0.5rem;
        margin: 0 0.5rem;
        font-size: 0.24rem;
        font-weight: bold;
        color: #1359e8;
        line-height: 0.4rem;
        cursor: pointer;
        border-bottom: 5px solid #1359e8;
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
