// pages/search_com/search_com.js
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
    ifWrite: false,//是否后台添加记录
    //筛选的选项
   production_type : 0,//当前所选的生产资质
   manage_type : 0,//当前所选的经营资质
   web_type : 0,//当前所选的服务资质

    scxk: [{ id: 0, title: '全部', selected: true },
      { id: 1, title: 'I类生产备案', selected: false },
      { id: 2, title: 'II类生产许可	', selected: false },
      { id: 3, title: 'III类生产许可', selected: false }],
    jyxk: [{ id: 0, title: '全部', selected: true },
      { id: 1, title: 'I类经营列名', selected: false },
      { id: 2, title: 'II类经营备案', selected: false },
      { id: 3, title: 'III类经营许可', selected: false }],
    xxfw: [{ id: 0, title: '全部', selected: true },
      { id: 1, title: '信息服务', selected: false },
      { id: 2, title: '交易服务', selected: false }],
    //列表页的选项
    sczz:[{title:"I类备案",cls:''},
      { title: "II类许可",cls:''},
      { title: "III类许可",cls:''}],
    jyzz: [{ title: "I类列明", cls: '' },
    { title: "II类备案", cls: '' },
    { title: "III类许可", cls: '' }],
    fwzz: [{ title: "互联网信息服务", cls: '' },
      { title: "互联网交易服务", cls: '' }],
    openPicker: false,
    needAnimation: false,
    contentHeight: 0,

    keyword: '',
    matchCount: '0',
    searchDatas: [],
    searchPageNum: 0,
    thisIndex: 0,
    isSearch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.data.keyword = e.keyword;
    this.data.classify = e.classify;
    this.data.thisIndex = util.getIndexByPicker(e.classify)
    this.setData(this.data);
    
    this.data.isSearch = false;//筛选按钮显示
    this.data.ifWrite = true;//需要添加记录
    this.contentCompanyActive();
  },
  onShow: function () {
    handlerLogin.ifAuthen();
  },
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          //动态根据手机分辨率来计算内容的高度（屏幕总高度-顶部筛选栏的高度）
          contentHeight: (res.windowHeight - 72 * res.screenWidth / 750)
        });
      }
    })
  },
  /*查询结果展示 */
  contentCompanyActive:function(){
    let production = this.data.production_type;
    let manage = this.data.manage_type;
    let web = this.data.web_type;
    let that = this;
    util.getSearchCom(this.data.classify, this.data.keyword, production,manage,web, 0, 10, function (data) {
      for (var index in data.datas) {
        let production_type = data.datas[index].production_type.split(",");
        let manager_type = data.datas[index].manage_type.split(",");
        let web_type = data.datas[index].web_type.split(",");
        for (var i = 0; i < production_type.length; i++) {
          if (production_type[i] != '') {
            that.data.sczz[production_type[i] - 1].cls = 'active';
          }
        }
        for (var i = 0; i < manager_type.length; i++) {
          if (manager_type[i] != '') {
            that.data.jyzz[manager_type[i] - 1].cls = 'active';
          }
        }
        for (var i = 0; i < web_type.length; i++) {
          if (web_type[i] != '') {
            that.data.fwzz[web_type[i] - 1].cls = 'active';
          }
        }
        data.datas[index].production_type = that.data.sczz;
        data.datas[index].manager_type = that.data.jyzz;
        data.datas[index].web_type = that.data.fwzz;
        that.setData(that.data);
        for (let j = 0; j < that.data.sczz.length; j++) {
          that.data.sczz[j].cls = '';
        }
        for (let j = 0; j < that.data.jyzz.length; j++) {
          that.data.jyzz[j].cls = '';
        }
        for (let j = 0; j < that.data.fwzz.length; j++) {
          that.data.fwzz[j].cls = '';
        }
      }
      that.setData({
        matchCount: data.matchCount,
        searchDatas: data.datas,
      })
      if (that.data.ifWrite) {
        util.insertSearchInfo(that.data.classify, that.data.keyword, data.matchCount, wx.getStorageSync('openid'));
      }
    });
  },
  /*筛选的生产资质点击 */
  menuClickSC: function (event){
    let id = event.currentTarget.id;
    this.data.production_type = id;
    for (var i = 0; i < this.data.scxk.length; i++) {
      if (id == i) { this.data.scxk[i].selected = true; }
      else { this.data.scxk[i].selected = false; }
    }
    this.setData(this.data);
  },
  /* 筛选的经营资质点击*/
  menuClickJY: function (event){
    let id = event.currentTarget.id;
    this.data.manage_type = id;
    for (var i = 0; i < this.data.jyxk.length; i++) {
      if (id == i) { this.data.jyxk[i].selected = true; }
      else { this.data.jyxk[i].selected = false; }
    }
    this.setData(this.data);
  },
  /* 筛选的服务资质点击*/
  menuClickXX: function (event) {
    let id = event.currentTarget.id;
    this.data.web_type = id;
    for (var i = 0; i < this.data.xxfw.length; i++) {
      if (id == i) { this.data.xxfw[i].selected = true; }
      else { this.data.xxfw[i].selected = false; }
    }
    this.setData(this.data);
  },
  /*筛选图标点击事件 */
  onPickHeaderClick: function () {
    this.data.isSearch = !this.data.isSearch;
    this.setData({
      isSearch: this.data.isSearch,
      openPicker: !this.data.openPicker,
      needAnimation: true
    })
  },
  /*筛选的确定键事件 */
  screenSearch:function(){
    this.data.ifWrite = false;//不需要添加记录
    this.data.isSearch = !this.data.isSearch; //按钮图标
    this.contentCompanyActive();
    this.setData({
      isSearch: this.data.isSearch,
      openPicker: !this.data.openPicker,
      needAnimation: true
    })
  },
  /*筛选的取消键事件 */
  closeMe: function () {
    this.data.isSearch = !this.data.isSearch; //按钮图标
    this.setData({
      isSearch: this.data.isSearch,
      openPicker: !this.data.openPicker,
      needAnimation: true
    })
  },
  //点击进入详情页
  bindSearchTap:function(event){
    let dataset = event.target.dataset;
    wx.navigateTo({
      url: '../company_detail/company_detail?keyword=' + dataset.text+'&classify=com'
    });
  },
  /*上拉刷新 */
  fetchSearchList:function(){
    let production = this.data.production_type;
    let manage = this.data.manage_type;
    let web = this.data.web_type;
    let that = this;
    let searchPageNum = that.data.searchPageNum;
    util.getSearchCom(this.data.classify, this.data.keyword, production,manage,web,searchPageNum, 10, function (data) {
      for (var index in data.datas) {
        let production_type = data.datas[index].production_type.split(",");
        let manager_type = data.datas[index].manage_type.split(",");
        let web_type = data.datas[index].web_type.split(",");
        for (var i = 0; i < production_type.length; i++) {
          if (production_type[i] != '') {
            that.data.sczz[production_type[i] - 1].cls = 'active';
          }
        }
        for (var i = 0; i < manager_type.length; i++) {
          if (manager_type[i] != '') {
            that.data.jyzz[manager_type[i] - 1].cls = 'active';
          }
        }
        for (var i = 0; i < web_type.length; i++) {
          if (web_type[i] != '') {
            that.data.fwzz[web_type[i] - 1].cls = 'active';
          }
        }
        data.datas[index].production_type = that.data.sczz;
        data.datas[index].manager_type = that.data.jyzz;
        data.datas[index].web_type = that.data.fwzz;
        that.setData(that.data);
        for (let j = 0; j < that.data.sczz.length; j++) {
          that.data.sczz[j].cls = '';
        }
        for (let j = 0; j < that.data.jyzz.length; j++) {
          that.data.jyzz[j].cls = '';
        }
        for (let j = 0; j < that.data.fwzz.length; j++) {
          that.data.fwzz[j].cls = '';
        }
      }
      var searchList = [];
      searchList = that.data.searchDatas.concat(data.datas);
      that.setData({
        searchDatas: searchList
      });
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      searchPageNum: that.data.searchPageNum + 1
    });
    that.fetchSearchList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '智械数据',
      path: '/pages/search_com/search_com?keyword=' + that.data.keyword + '&classify=com',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  bindPickerChange: function (e) {
    //wx.setStorageSync('classify', util.getPickerNameByIndex(e.detail.value));
    this.data.classify = util.getPickerNameByIndex(e.detail.value);
    this.setData({
      thisIndex: e.detail.value
    })
  },
  inputChange: function (e) {
    //wx.setStorageSync('keyword', e.detail.value.replace(/\s+/g, ''));
    this.data.keyword = e.detail.value.replace(/\s+/g, '');
  },
  search: function () {
    let keyword = this.data.keyword;
    let classify = this.data.classify;
    if (keyword != "") {
      if (classify == "pro") {
        wx.navigateTo({
          url: '../search_pro/search_pro?keyword=' + keyword + '&classify=' + classify
        });
      } else if (classify == "com") {
        wx.navigateTo({
          url: '../search_com/search_com?classify='+classify+'&keyword='+keyword
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
})