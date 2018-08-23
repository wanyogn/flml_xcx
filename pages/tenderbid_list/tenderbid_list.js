// pages/tenderbid_list/tenderbid_list.js
var util = require('../../utils/util.js')
var handlerLogin = require('../../utils/handlerLogin.js') 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ZBGGData: [],
    currentPage: 0,
    keyword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.keyword = options.keyword;
    this.fetchProduct();
  },
  onReady: function () {
    handlerLogin.ifAuthen();
  },
  //填充页面
  fetchProduct: function () {
    let that = this;
    util.getZBGGByCom(that.data.keyword, that.data.currentPage, 10, function (data) {
      let searchList = [];
      searchList = that.data.ZBGGData.concat(data.datas);
      that.setData({
        matchCount: data.matchCount,
        ZBGGData: searchList
      });
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.currentPage = this.data.currentPage + 1;
    this.fetchProduct();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})