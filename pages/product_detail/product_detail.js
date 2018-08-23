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
    classify:'',
    id:'',
    keyword:'',
    searchData: '',
    sameProducts: '',
    productTenderbids: '',
    picExist:0
  },
  onReady: function () {
    handlerLogin.ifAuthen();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.classify = options.classify;
    this.data.id = options.id;
    this.data.thisIndex = util.getIndexByPicker(options.classify);
    this.setData(this.data);

    var that = this;
    wx.request({
      url: 'https://www.yixiecha.cn/wxsmallprogram/wx_search_detail.php',//这里填写后台给你的搜索接口
      method: 'post',
      data: { classtype: options.classify, id: options.id },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.datas[0]; that.data.keyword = res.data.datas[0].product_name_ch; that.setData(that.data);
        //res.data.datas[0].src_loc = util.getMain_class(data.src_loc);
        //res.data.datas[0].main_class = util.getSrc_loc(data.main_class);
        res.data.datas[0].approval_date = data.approval_date.substring(0, 10);
        res.data.datas[0].expiry_date = data.expiry_date.substring(0, 10);
        res.data.datas[0].class_code = util.getClass_code(data.class_code);
        var maker_name = res.data.datas[0].maker_name_ch;
        if (maker_name == '') {
          maker_name = res.data.datas[0].agent;
        }
        res.data.datas[0].maker_name = maker_name;
        res.data.datas[0].maker_name_ch = util.getText(maker_name, 20);

        if (res.data.datas[0].approval_complete_mark == 0){
          res.data.datas[0].approval_date = data.approval_date.substring(0, 10);
        } else if (res.data.datas[0].approval_complete_mark == 1){
          res.data.datas[0].approval_date = data.approval_date.substring(0, 4);
        }else{
          res.data.datas[0].approval_date = data.approval_date.substring(0, 7);
        }

        if (res.data.datas[0].expiry_complete_mark == 0) {
          res.data.datas[0].expiry_date = data.expiry_date.substring(0, 10);
        } else if (res.data.datas[0].expiry_complete_mark == 1){
          res.data.datas[0].expiry_date = data.expiry_date.substring(0, 4);
        }else{
          res.data.datas[0].expiry_date = data.expiry_date.substring(0, 7);
        }

        if (res.data.datas[0].vacancy_mark == 0){
        } else if (res.data.datas[0].vacancy_mark == 1){
          res.data.datas[0].approval_date = "";
        } else if (res.data.datas[0].vacancy_mark == 2){
          res.data.datas[0].expiry_date = "";
        }else{
          res.data.datas[0].approval_date = "";
          res.data.datas[0].expiry_date = "";

        }

        if (res.data.datas[0].picture_addr != undefined) {
          res.data.datas[0].picture_addr = "https://www.yixiecha.cn/yixiecha/upload/" + res.data.datas[0].picture_addr;
          that.setData({
            picExist:1
          })
        }
        that.data.searchData = res.data.datas[0];
        that.setData({
          searchData: res.data.datas[0]
        });

        var product_name = data.product_name_ch;
        wx.request({
          url: 'https://www.yixiecha.cn/wxsmallprogram/wx_same_product.php',
          method: 'post',
          data: { keyword: product_name, num: 0 },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            for (var index in res.data.datas) {
              var src_loc = res.data.datas[index].src_loc;
              if (src_loc == "1") { res.data.datas[index].maker_name_ch = res.data.datas[index].agent; }
            }
            that.data.sameProducts = res.data.datas;
            that.setData({
              sameProducts: res.data.datas
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

        wx.request({
          url: 'https://www.yixiecha.cn/wxsmallprogram/wx_product_tenderbid.php',
          method: 'post',
          data: { keyword: product_name, num: 0 },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            for (var index in res.data.datas) {
              res.data.datas[index].title = util.getText(res.data.datas[index].title,20);
            }
           // res.datas[index].maker_name_ch = util.getText(data.datas[index].maker_name_ch, 13);
            that.data.productTenderbids = res.data.datas;
            that.setData({
              productTenderbids: res.data.datas
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
      fail: function (e) {
        console.log(e);
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  inputChange: function (e) {
    //wx.setStorageSync('keyword', e.detail.value.replace(/\s+/g, ''));
    this.data.keyword = e.detail.value.replace(/\s+/g, '');
  },
  bindPickerChange: function (e) {
    //wx.setStorageSync('classify', util.getPickerNameByIndex(e.detail.value));
    this.data.classify = util.getPickerNameByIndex(e.detail.value);
    this.setData({
      thisIndex: e.detail.value
    })
  },
  search: function () {
    //let keyword = wx.getStorageSync('keyword');
    //let classify = wx.getStorageSync('classify');
    let keyword = this.data.keyword;
    let classify = this.data.classify;
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
          url: '../search_hos/search_hos?classify=' + classify + '&keyword=' + keyword
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
  bindCompany:function(e){
    let companyName = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../company_detail/company_detail?keyword=' + companyName + '&classify=com'
    })
  },
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '智械数据',
      path: '/pages/product_detail/product_detail?id=' + that.data.id +"&classify=pro",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
  
})