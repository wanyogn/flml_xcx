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
