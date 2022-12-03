const types = {
  SET_QQ_MAP: 'SET_QQ_MAP',
  SET_GZ_POLYGON: 'SET_GZ_POLYGON',
  SET_LK:'SET_LK',
}

const qqMap = {
  state: {
    qqMapKey: 'N6OBZ-OHMKD-LTE47-HXNJ4-6XYIK-KBFWI',
    // 地图实例
    qqMap: null,
    qqZoom: 12,
    qqCenter: [23.106364824816907, 113.32450189726342], //广州塔
    gzPolygon: [],
    lkVisable:false,
  },

  mutations: {
    [types.SET_QQ_MAP]: (state, qqMap) => {
      console.log('保存腾讯地图', qqMap)
      state.qqMap = qqMap
    },
    [types.SET_GZ_POLYGON]: (state, gzPolygon) => {
      state.gzPolygon.push(gzPolygon)
    },
    [types.SET_LK]: (state, lkVisable) => {
      state.lkVisable = lkVisable
    },

  }
}

export default qqMap