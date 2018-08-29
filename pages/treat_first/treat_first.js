var util = require('../../utils/util.js')
var handlerLogin = require('../../utils/handlerLogin.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  onReady: function () {
    handlerLogin.ifAuthen();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /*点击首页的目录事件*/
  clickDir: function (e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '../treat_second/treat_second?id=' + id
    })
  }

})
