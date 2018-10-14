App({
  onLaunch: function () {
    const self = this
    wx.getSystemInfo({
      success (res) {
        console.log(res.windowWidth)
        self.systemInfo = res
        console.log(self.systemInfo)
      }
    })
  },
  systemInfo: null
})
