// pages/product_detail/product_detail.js
var util = require('../../utils/util.js')
var handlerLogin = require('../../utils/handlerLogin.js') 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {
      array: ['产品', '企业', '医院'],
    },
    searchData: '',
    id:'',
    keyword:'',
    classify:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.classify = options.classify;
    this.data.id = options.id;
    this.data.thisIndex = util.getIndexByPicker(options.classify)
    this.setData(this.data);
    
    var that = this;
    wx.request({
      url: 'https://www.yixiecha.cn/wxsmallprogram/wx_search_detail.php',//
      method: 'post',
      data: { classtype: this.data.classify, id: options.id },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.data.keyword = res.data.datas[0].hospital_name; that.setData(that.data);
        that.setData({
          searchData: res.data.datas[0]
        });
      },
      fail: function (e) {
        console.log(e);
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  onReady: function () {
    handlerLogin.ifAuthen();
  },
  inputChange: function (e) {
    //wx.setStorageSync('keyword', e.detail.value.replace(/\s+/g, ''));
    this.data.keyword = e.detail.value.replace(/\s+/g, '');
  },
  bindPickerChange: function (e) {
   // wx.setStorageSync('classify', util.getPickerNameByIndex(e.detail.value));
    this.data.classify = util.getPickerNameByIndex(e.detail.value)
    this.setData({
      thisIndex: e.detail.value
    })
  },
  search: function () {
    let keyword = this.data.keyword;
    let classify = this.data.classify;console.log(classify);
    if (keyword != "") {
      if (classify == "pro") {
        wx.navigateTo({
          url: '../search_pro/search_pro?keyword=' + keyword + '&classify=' + classify
        });
      } else if (classify == "com") {
        wx.navigateTo({
          url: '../search_com/search_com?classify=' + classify + '&keyword=' + keyword
        });
      } else if (classify == "hos") {
        wx.navigateTo({
          url: '../search_hos/search_hos?classify='+classify+'&keyword='+keyword
        });
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入关键词...',
        success: function (res) {
        }
      });
    }

  },
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '智械数据',
      path: '/pages/hospital_detail/hospital_detail?id=' + that.data.id+'&classify=hos',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})