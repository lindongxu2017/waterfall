// index/template/list.js
const app = getApp() // 获取app信息
Component({
  // 组件的属性列表
  properties: {
    listData: {
      type: Object,
      value: null,
      observer: function (newVal, oldVal, changedPath) {
        // console.log(newVal)
        this.setData({
          images: newVal
        })
      }
    },
    dValue: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal, changedPath) {
        // console.log(newVal)
        if (this.data.HValue !=0) return // 避免重新赋值导致布局变化
        this.setData({
          HValue: newVal
        })
      }
    }
  },

  // 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
  ready () {
    this.setData({ windowWidth: app.systemInfo.windowWidth }) // 设置屏幕宽度
  },

  // 组件的初始数据
  data: {
    windowWidth: 0, // 屏幕宽度
    HValue: 0, // 上一个列表高度差
    gap: 15, // 元素之间间隔
    images: [], // 获取元素信息
    initlist: [], // 判断长度作用，避免获取所有数据没有完成之前开始渲染
    list: [], // 真正渲染的处理过的数据
    wrapperHeight: 0 // 需要更新的最外层盒子高度
  },

  // 组件的方法列表
  methods: {
    imgOnload (e) {
      let options = e
      let imgItem = {}
      let index = options.target.dataset.index // 保证传递过来的数据索引正确
      imgItem = this.data.images[index] // 获取item信息
      imgItem.width = options.detail.width // 获取图片宽度
      imgItem.height = options.detail.height // 获取图片高度
      let item = 'initlist[' + index + ']'
      this.setData({
        [item]: imgItem
      })
      // 判断长度相等再赋值给真正渲染的数据，避免数据不全就开始渲染
      let nums = 0
      for (var i = 0; i < this.data.initlist.length; i++) {
        if (this.data.initlist[i] == undefined) {
          nums++
        }
      }
      if (this.data.initlist.length == this.data.images.length && nums == 0 && this.data.initlist.length > 0) {
        this.setData({ list: this.data.initlist })
        this.calcOffset()
      }
    },
    calcOffset () {
      let list = JSON.parse(JSON.stringify(this.data.list))
      let dValue = this.data.HValue // 上个列表产生的高度差
      let arr = [0, 0] // 列高度数组, 此案列采用2列
      let gap = this.data.gap // item间隙
      let otherH = 20 // 其他内容高度 描述信息等等
      let itemWidth = (this.data.windowWidth - 3 * gap) / 2 // 元素实际展示宽度
      if (dValue > 0) {
        arr[1] = -dValue
      } else {
        arr[0] = dValue
      }
      for (var i = 0; i < list.length; i++) {
        list[i].showHeight = itemWidth * list[i].height / list[i].width // 元素实际展示高度
        let minHeight = arr[0] // 找到最小高度
        let index = 0
        for (var j = 0; j < arr.length; j++) {
          if (minHeight > arr[j]) {
            minHeight = arr[j]
            index = j
          }
        }
        list[i].top = arr[index] // 设置元素top值
        list[i].left = index * (itemWidth + gap) + gap // 设置元素left值
        list[i].offsetHeight = itemWidth * list[i].height / list[i].width + gap + otherH // 元素总高度
        if (list[i].desc == '') {
          list[i].offsetHeight -= otherH // 当没有简介内容时去掉高度
        }
        arr[index] = arr[index] + list[i].offsetHeight // 更新列高度数组
      }
      let iMax = Math.max(...arr) // 计算列最大值 ，更新最外层盒子高度
      this.setData({
        list: list,
        wrapperHeight: iMax
      })
      let newDvalue = parseInt(arr[0] - arr[1]) // 产生的新的列表高度差
      this.triggerEvent('heightlog', newDvalue) // 子组件通信，告知新的列表高度差，用于新数据计算高度差
    }
  }
})
