const app = getApp()

Page({
  data: {
    wrapperHeight: 0, // 需要更新的最外层盒子高度
    list: [], // 模拟数据
    dValue: 0, // 列表高度差
    isLoading: false // 阻止无限触发加载阈值
  },
  onLoad: function () {
    this.getlist() // 初始化列表数据
  },
  onReachBottom () { // 触底函数
    console.log(11111)
    this.getlist()
  },
  heightlog (e) {
    this.setData({ dValue: e.detail})
  },
  getlist () {
    if (this.data.isLoading) return
    this.setData({ isLoading: true })
    setTimeout(() => { // 模拟ajax获取数据
      this.setData({ isLoading: false })
      let imgArr = []
      for(var i = 0; i < 10; i++) {
        imgArr.push({
          imgUrl: '/img/demo' + (Math.ceil(Math.random() * 10)) + '.jpg',
          desc: '业精于勤，荒于嬉。行成于思，毁于随。'
        })
      }
      let page = this.data.list.length
      let itemlist = 'list[' + page + ']' // 关键点，二维数组渲染组件，每个组件得到10条数据，避免setData数据量过多大问题
      this.setData({
        [itemlist]: imgArr
      })
      console.log(this.data.list)
    }, 1000)
  }
})
