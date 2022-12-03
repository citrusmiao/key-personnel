import store from '../store'
const qqMap = store.state.qqMap

let multiPolygon = null;//自定义边线样式

let clusterBubbleList = [];//聚合数据
let marker_jh = null;//聚合点

const qqMapUtils = {
  /**
   * 初始化地图
   * @param {*} id DOM容器id
   * @param {*} centerPoint 地图中心点
   * @param {*} mapConfig 地图配置
   */
  initQQMap(id = 'container', centerPoint = [23.16, 120.23], mapConfig) {
    let mapCenter = new TMap.LatLng(centerPoint[0], centerPoint[1]);// 地图的中心地理坐标
    //创建地图
    let config = {
      center: mapCenter,// 地图中心坐标
      baseMap:[{type:'satellite'},{type:'vector'},{ type: 'traffic' }],
      ...mapConfig
    }
    let mapObj = new TMap.Map(document.getElementById(id), config);
    return new Promise((resolve, reject) => {
      console.log('地图初始化完毕');
      resolve(mapObj)
    })
  },

  /**
* 实时路况
* @param {*} type 加载/消除实时路况
* @param {*} map 需要设置实时路况的地图实例
*/
  drawLiveTraffic(type, map) {
    let live
    if (type === 'set') {
        live = map.setBaseMap(
          [
            { type: 'vector' }, //设置矢量底图
            { type: 'traffic' }, //设置路况底图
          ]
        )
     
    } else if (type === 'remove') {
      live = map.setBaseMap({ type: 'vector' }); //设置矢量底图
    }
    return live
  },

  /**
 * 绘制折线
 * @param {*} id 图层唯一标识
 * @param {*} map 地图实例
 * @param {*} styles 折线样式定义
 * @param {*} geometries 折线数据定义
 */
  multiPolyline(id,map, styles = {}, geometries = []) {
    let config = {
      id: id, //图层唯一标识
      map: map,//绘制到目标地图
      styles,
      geometries
    }

    return new TMap.MultiPolyline(config);
  },


  /**
   * 自定义边线样式
   * @param {*} map 地图实例
   * @param {*} styles 样式定义
   * @param {*} geometries 数据定义
   */
  multiPolygon(map, styles = {}, geometries = []) {
    let config = {
      map, // 显示多边形图层的底图
      styles: styles, // 多边形的相关样式
      geometries: geometries
    }
    multiPolygon = new TMap.MultiPolygon(config);
    return multiPolygon
  },

  /**
* 清空边线样式
* @param {*}  multiPolygon 折线实例
*/
  clearMultiPolygon() {
    if (multiPolygon) {
      multiPolygon.setMap(null);
    }
  },

  /**
 * 标志点
 *  @param {*} id 图层id
 * @param {*} map 地图实例
  * @param {*} styles 样式定义
  * @param {*} geometries 数据定义
  */
  multiMarker(id, map, styles={}, geometries=[]) {
    let config = {
      id,
      map,
      styles,
      geometries
    }

    return new TMap.MultiMarker(config);
  },

    /**
   * 编辑几何图层
   * @param {*} id
   * @param {*} map 地图实例
   */
  geometryEditor(id='circle',map){
    console.log(map)
    let config = {
      map,
      overlayList: [ // 可编辑图层
        {
          overlay: new TMap.MultiCircle({
            map,
            styles: {
              'drawingId': new TMap.CircleStyle({
                borderColor: "#3EEAFF",
                borderWidth: 2,
                showBorder: true,
                // color: 'rgba(255, 255, 0, 0.4)',
              }),

              'heightId': new TMap.CircleStyle({
                borderColor: "#F8DA2E",
                borderWidth: 2,
                showBorder: true,
                color: 'rgba(255, 255, 0, 0.2)',
              })
            },
          }),
          id:id,
          drawingStyleId: 'drawingId',
          selectedStyleId: 'heightId'
        }
      ],
      actionMode: TMap.tools.constants.EDITOR_ACTION.DRAW, // 编辑器的工作模式
      activeOverlayId:id, // 激活图层
      selectable: true, // 开启点选功能
      snappable: true // 开启吸附
    }
    return new TMap.tools.GeometryEditor(config)
  },

   /**
 * 缩放到范围无倾斜视角
 */
  zoomLayer(){
    if(qqMap.qqMap){
      qqMap.qqMap.easeTo(
        {
          zoom: qqMap.qqZoom,
          center: [23.106364824816907, 113.32450189726342],
          rotation:0,
          pitch:0,
        },
        // { duration: 2000 }
      )
    }
  },

  /**
   * 画线
   * @param {*} map
   * @param {*} data 后端获取的数据
   * @param {*} typeColor 类型
   * @param {*} dashArray 默认是实线,虚线[10,10]
   */
  addPolyline(map,data,typeColor='gsl',dashArray=[]){
    let geometries = [];
    data.map(item=>{
      let paths = item.gcj02.map(v=>{
        return new TMap.LatLng(Number(v[1]),Number(v[0]))
      })
      geometries.push({styleId:typeColor,paths,properties:item})
    })
    let color = null;
    let width = null;
    switch (typeColor) {
      case 'gsl':
        color = '#00e9ea'
        width = 8
        break
      case 'ks':
        color = '#e5d31b'
        width = 8
        break
      case 'gd':
        color = '#006ed4'
        width = 8
        break
      case 'sd':
        color = '#eb8732'
        width = 8
        break
      case 'xd':
        color = '#ce0045'
        width = 8
        break
      case 'ghzdgc':
        color = '#71fdfd'
        width = 5
        break
      case 'zjzdgc':
        color = '#71fdfd'
        width = 5
        break
      case 'lw':
        width = 4
        break
    }

    let getStyles = {
      'color': color, // 线填充色
      'width': width, // 折线宽度
      // 'borderColor': '#fff', //边线颜色
      // 'borderWidth':width, //边线宽度
      'lineCap': 'round', // 线端头方式
      'dashArray':dashArray//设置虚线
    }
    let styles ={};
    styles[typeColor]=new TMap.PolylineStyle(getStyles);
    let config = {
      map,
      styles,
      geometries
    }
    return new TMap.MultiPolyline(config)
  },
  
  /**
   * 自定义DOM覆盖物 - 继承DOMOverlay
   * @param {*} map 地图实例
   * @param {*} center 中心点
   * @param {*} styles 样式
   * @param {*} properties 点击获取参数
   * @param {*} type  动画类型
   */
  dOMOverlay(map,center=[],styles={},properties={},type=''){
    let config = {
      map,
      position:new TMap.LatLng(center[0],center[1]),
      type
    }
    let mydom;
    function myMarker(options) {
      TMap.DOMOverlay.call(this, options);
    }

    myMarker.prototype = new TMap.DOMOverlay();

    //初始化
		myMarker.prototype.onInit = function (options) {
			this.position = options.position;
			this.type = options.type; // 当前marker的类型，是跳动或飞入
    }
    myMarker.prototype.createDOM = function () {
			mydom = document.createElement('img');  // 新建一个img的dom
      mydom.src = styles.img;

      // click事件监听
      this.onClick = () => {
				// DOMOverlay继承自EventEmitter，可以使用emit触发事件
				this.emit('click',properties);
      };
      
      mydom.addEventListener('click', this.onClick);

      // 当鼠标指针移动到元素上时触发。
      this.onmouseenter= () => {
        // DOMOverlay继承自EventEmitter，可以使用emit触发事件
        this.dom.style.cursor = 'pointer';
				this.emit('mouseenter',properties);
      };
      mydom.addEventListener('mouseenter', this.onmouseenter);
      
      // 当鼠标指针移出元素时触发。
      this.onmouseleave= () => {
        // DOMOverlay继承自EventEmitter，可以使用emit触发事件
        this.dom.style.cursor = 'default';
				this.emit('mouseleave',properties);
      };
      mydom.addEventListener('mouseleave', this.onmouseleave);

      return mydom;
    }

    // 销毁时需解绑事件监听
    myMarker.prototype.onDestroy = function() {
			if (this.onClick) {
				this.dom.removeEventListener(this.onClick);
			}
		};

    // 更新DOM元素，在地图移动/缩放后执行
		myMarker.prototype.updateDOM = function () {
			if (!this.map) {
				return;
      }
      this.dom.style.width = styles.width;
      this.dom.style.height = styles.height;
      
      let pixel = this.map.projectToContainer(this.position); // 经纬度坐标转容器像素坐标
			let left = pixel.getX() - this.dom.clientWidth / 2 + 'px';
      let top = pixel.getY() + 'px';
			// 使用top/left将DOM元素定位到指定位置
			this.dom.style.top = top;
      this.dom.style.left = left;
      this.dom.style.zIndex = styles.zIndex;
      this.dom.style.position = styles.absolute;
    }

    return new myMarker(config);
  },

    /**
   * 点聚合
   * @param {*} map 地图实例
   */
  createMarkerCluster(id,map,data,styles){
    let config = {
      id,
      map,
      enableDefaultStyle: false, // 关闭默认样式
      minimumClusterSize: 2,
      zoomOnClick: true,
      gridSize: 200,
      averageCenter: false,
      geometries: [],
      maxZoom:19
    };
    config.geometries = data.map(item=>{
      
      if(item.type=='point'){
        return {
          position: new TMap.LatLng(Number(item.detail.gcj02Lat),Number(item.detail.gcj02Lon)),
          properties:item
        }
      }
    })

    let markerCluster = new TMap.MarkerCluster(config);

    //监听聚合簇变化
    this.onWatchChange(markerCluster,map,styles);

    return markerCluster
  },

  //清空聚合
  clearDom(){
    if(clusterBubbleList.length){
      clusterBubbleList.forEach(function (item) {
        item.destroy();
      })
      clusterBubbleList = [];
    }

    if(marker_jh){
      marker_jh.setMap(null);
      marker_jh = null;
    }
  },

  //获取聚合-点
  getClusterPoint(){
    if(marker_jh){
      return marker_jh
    }
  },

  //监听聚合簇变化
  onWatchChange(markerCluster,map,styles){
    return new Promise((resolve,reject)=>{
    clusterBubbleList = [];
    let markerGeometries = [];
    let geometriesPoint = [];
    markerCluster.on('cluster_changed',e=>{
      if(clusterBubbleList.length){
        clusterBubbleList.forEach(function (item) {
          item.destroy();
        })
        clusterBubbleList = [];
      }
      markerGeometries = [];

      geometriesPoint= [];

      // 根据新的聚合簇数组生成新的覆盖物和点标记图层
      let clusters = markerCluster.getClusters();
      clusters.forEach((item)=> {
        if (item.geometries.length > 1) {
          let clusterBubble = new ClusterBubble({
            map,
            position: item.center,
            content: item.geometries.length,
          });
          clusterBubble.on('click', () => {
            map.fitBounds(item.bounds);
          });
          clusterBubbleList.push(clusterBubble);
        } else {
          markerGeometries.push({
            properties:item.geometries[0].properties
          });
          
          
        }
      })
      

      if (marker_jh) {
        // 已创建过点标记图层，直接更新数据
        // marker_jh.setGeometries(geometriesPoint);
        marker_jh.setMap(null)
      }
      let stylesPoint = {};
      markerGeometries.map(item=>{
        let { detail, type } = item.properties
        styles.rotate = detail.dir, //初始小车朝向（正北0度，顺时针一周为360度，180为正南）
        stylesPoint[detail.plate] = new TMap.MarkerStyle(styles)

        geometriesPoint.push(
          this.geometriesPointFun('carTip',detail.plate, detail)
        )
      })
      // 创建点标记图层
      marker_jh = this.multiMarker(
        '',
        map,
        stylesPoint,
        geometriesPoint
      )
      
        resolve(marker_jh)
      })

      this.createClusterBubble();
    })
  },

  geometriesPointFun(id,styleId, detail) {
    return {
      id,
      styleId,
      position: new TMap.LatLng(detail.gcj02Lat, detail.gcj02Lon),
      properties: { ...detail }
    }
  },

  createClusterBubble(){
    // 以下代码为基于DOMOverlay实现聚合点气泡
    function ClusterBubble(options) {
      TMap.DOMOverlay.call(this, options);
    }

    ClusterBubble.prototype = new TMap.DOMOverlay();

    ClusterBubble.prototype.onInit = function (options) {
      this.content = options.content;
      this.position = options.position;
    };
  
    // 销毁时需要删除监听器
    ClusterBubble.prototype.onDestroy = function() {
      this.dom.removeEventListener('click', this.onClick);
      this.removeAllListeners();
    };

    ClusterBubble.prototype.onClick = function() {
      this.emit('click');
    };

    // 创建气泡DOM元素
    ClusterBubble.prototype.createDOM = function () {
      var dom = document.createElement('div');
      dom.classList.add('clusterBubble');
      dom.innerText = this.content;
      if(parseInt(this.content)<40){
        dom.style.cssText = [
          'width: ' + (40 + parseInt(this.content)) + 'px;',
          'height: ' + (40 + parseInt(this.content)) + 'px;',
          'line-height: ' + (40 + parseInt(this.content)) + 'px;',
          'background:' + './icon/gj-map.png', 
        ].join(' ');
      }else{
        dom.style.cssText = [
          'width: ' +100 + 'px;',
          'height: ' + 100 + 'px;',
          'line-height: ' + 100 + 'px;',
        ].join(' ');
      }
        
      // 监听点击事件，实现zoomOnClick
      this.onClick = this.onClick.bind(this);
      dom.addEventListener('click', this.onClick);
      return dom;
    };

    ClusterBubble.prototype.updateDOM = function () {
      if (!this.map) {
        return;
      }
      // 经纬度坐标转容器像素坐标
      let pixel = this.map.projectToContainer(this.position);

      // 使文本框中心点对齐经纬度坐标点
      let left = pixel.getX() - this.dom.clientWidth / 2 + 'px';
      let top = pixel.getY() - this.dom.clientHeight / 2 + 'px';
      this.dom.style.transform = `translate(${left}, ${top})`;

      this.emit('dom_updated');
    };

    window.ClusterBubble = ClusterBubble;
  }
}

export default qqMapUtils;