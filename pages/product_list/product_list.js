// pages/product_list/product_list.js
var util = require('../../utils/util.js')
var handlerLogin = require('../../utils/handlerLogin.js') 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    productData:[],
    currentPage:0,
    keyword:''
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
  fetchProduct:function(){
    let that = this;
    util.getProByCom(that.data.keyword, that.data.currentPage , 10, function (data) {
      for (var index in data.datas) {
        data.datas[index].main_class = util.getMain_class(data.datas[index].main_class);
        data.datas[index].src_loc = util.getSrc_loc(data.datas[index].src_loc);
        data.datas[index].product_mode = util.getText(data.datas[index].product_mode, 15);
        data.datas[index].product_name_ch = util.getText(data.datas[index].product_name_ch, 10);
        var maker_name = data.datas[index].maker_name_ch;
        if (maker_name == '') {
          maker_name = data.datas[index].agent;;
        }
        data.datas[index].maker_name_ch = util.getText(maker_name, 20);
        if (data.datas[index].picture_addr != undefined) {
          data.datas[index].picture_addr = "https://www.yixiecha.cn/yixiecha/upload/" + data.datas[index].picture_addr;
        } else {
          data.datas[index].picture_addr = "../image/product.png";
        }
      }
      let searchList = [];
      searchList = that.data.productData.concat(data.datas);
      that.setData({
        matchCount: data.matchCount,
        productData: searchList
      });
    })
  },
  bindSearchTap: function (e) {
    
    const dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../product_detail/product_detail?id=' + dataset.id+"&classify=pro"
    })
  },
//上拉刷新
  onReachBottom:function(){
    this.data.currentPage = this.data.currentPage + 1;
    this.fetchProduct();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})