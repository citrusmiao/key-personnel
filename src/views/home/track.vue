<template>
  <div class="track">
    <div class="btn">
      <el-button type="primary" @click="addPoint">撒点</el-button>
      <el-button type="primary" @click="addLine">画线</el-button>
      <el-button type="primary" @click="addLines">描边</el-button>
      <el-button type="primary" @click="addTrack">轨迹</el-button>
      <el-button type="primary" @click="clear">清除</el-button>
    </div>
    <div id="mapBox" class="mapBox" />
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import qqMapUtils from '@/utils/qqMapUtils'
import mapData from '@/utils/mapData'
export default {
  name: 'Track',
  data() {
    return {
      points: [],
      bmap: null
    }
  },
  computed: {
    ...mapState(['qqMap']),
    getQqMap() {
      return this.$store.state.qqMap.qqMap
    }
  },
  mounted() {
    // this.initQqMap();
    this.initBMap()
    console.log(mapData)
  },
  methods: {
    ...mapMutations(['SET_QQ_MAP', 'SET_QQMAP_LR']),
    // 初始化腾讯地图
    initQqMap() {
      qqMapUtils
        .initQQMap(
          'mapBox', // 地图容器
          // this.qqMap.qqCenter, // 地图中心点
          [23.112309, 113.329722],
          {
            zoom: this.qqMap.qqZoom,
            minZoom: 10
            // maxZoom: 15,
            // mapStyleId: "style1", // 设置地图样式，参考个性化地图配置 style2 为地图  style1 为星空地图
          }
        )
        .then((mapQqObj) => {
          this.SET_QQ_MAP(mapQqObj)
          const _this = this
          mapQqObj.on('click', function (e) {
            console.log('点击坐标：', e.latLng.lat, e.latLng.lng)
            // this.points.push([e.latLng.lat, e.latLng.lng]);
            _this.qqMap.Marker({
              position: e.latLng,
              map: _this.qqMap
            })
          })
          this.qqMapLoading = true
        })
    },
    initBMap() {
      const _this = this
      this.bmap = new BMapGL.Map('mapBox') // 创建地图实例
      this.bmap.centerAndZoom(
        new BMapGL.Point(113.27348138238956, 23.1349572022483),
        12.5
      ) // 初始化地图
      this.bmap.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
      this.bmap.addEventListener('click', function (e) {
        console.log(e.latlng)
        _this.points.push(e.latlng)
        console.log(JSON.stringify(_this.points))
        _this.addPoint(e.latlng.lng, e.latlng.lat)
      }) // 添加地图事件
    },
    addPoint(lng, lat) {
      // 创建小车图标
      var myIcon = new BMapGL.Icon('/icon/low.png', new BMapGL.Size(13, 17))
      // 创建Marker标注，使用自定义图标
      const point = new BMapGL.Point(lng, lat) // 点数据
      const marker = new BMapGL.Marker(point, {
        icon: myIcon
      }) // 创建标注
      this.bmap.addOverlay(marker) // 将标注添加到地图中
    },
    addLine() {},
    addLines() {
      const path = mapData.haizhu
      let point = []
      for (let i = 0; i < path.length; i++) {
        point.push(new BMapGL.Point(path[i].lng, path[i].lat))
      }
      // 创建多边形
      let polygon = new BMapGL.Polygon(point, {
        strokeColor: 'blue',
        strokeWeight: 2,
        strokeStyle: 'dashed',
        strokeOpacity: 0.5
      })
      this.bmap.addOverlay(polygon)
    },
    addTrack() {
      const path = mapData.path1
      let point = []
      for (let i = 0; i < path.length; i++) {
        point.push(new BMapGL.Point(path[i].lng, path[i].lat))
      }
      const pl = new BMapGL.Polyline(point)
      let trackAni = new BMapGLLib.TrackAnimation(this.bmap, pl, {
        overallView: true, // 动画完成后自动调整视野到总览
        tilt: 30, // 轨迹播放的角度，默认为55
        duration: 20000, // 动画持续时长，默认为10000，单位ms
        delay: 1000 // 动画开始的延迟，默认0，单位ms
      })
      trackAni.start()
    },
    clear() {
      this.bmap.clearOverlays()
    }
  }
}
</script>
<style lang="scss" scoped>
.track {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  .btn {
    width: 100%;
    height: 60px;
    padding-top: 10px;
    padding-left: 10px;
  }
  .mapBox {
    width: 1200px;
    height: 900px;
    margin: 0 auto;
  }
}
</style>
