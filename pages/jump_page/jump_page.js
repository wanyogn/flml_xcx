Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShareAppMessage:function(){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '医械查',
      path: '/pages/jump_page/jump_page',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  bindFLML:function(){
    wx.navigateTo({
      url: '../ml_search/search'
    });
  },
  bindLCSY:function(){
    wx.navigateTo({
      url: '../clinic_search/clinic_search'
    });
  }
})
