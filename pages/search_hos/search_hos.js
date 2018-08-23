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
    level: '',//当前所选的医院评级
    grade:'',//当前所选的医院评等

    yypj: [{ id: 0, title: '全部', selected: true },
    { id: 1, title: '二级', selected: false },
    { id: 2, title: '三级', selected: false },
    { id: 3, title: '其他', selected: false }],
    yypd: [{ id: 0, title: '全部', selected: true },
    { id: 1, title: '甲等', selected: false },
    { id: 2, title: '乙等', selected: false },
    { id: 3, title: '丙等', selected: false },
    { id: 4, title: '其他', selected: false }],
    jjlx: [{ id: 0, title: '全部', selected: true },
    { id: 1, title: '公立', selected: false },
    { id: 2, title: '民营', selected: false },
    { id: 3, title: '其他', selected: false }],
    openPicker: false,
    needAnimation: false,
    contentHeight: 0,

    keyword: '',
    classify:'',
    matchCount: '0',
    searchDatas: [],
    searchPageNum: 0,
    thisIndex: 0,
    isSearch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.keyword = options.keyword;
    this.data.classify = options.classify;
    this.data.thisIndex = util.getIndexByPicker(options.classify)
    this.setData(this.data);

    this.data.isSearch = false;//筛选按钮显示
    this.data.ifWrite = true;//需要添加记录
    this.contentHosActive();
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
  contentHosActive: function () {
    let level = this.data.level;
    let grade = this.data.grade;
    let that = this;
    util.getSearch_Hos(this.data.classify, this.data.keyword, level, grade, 0, 10, function (data) {
      
      for (var index in data.datas) {
        let text = data.datas[index].hospital_grade;
        if (text.length > 0 && text != '') {
          var level_t = '';
          var grade_t = '';
          if ((grade_t = text.indexOf("等")) > 0) {
            data.datas[index].grade = text.substring(grade_t - 1);
          }
          if ((level_t = text.indexOf("级")) > 0) {
            data.datas[index].level = text.substring(level_t - 1, 2);
          }
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
  /*筛选的医院评级点击 */
  menuClickPJ: function (event) {
    let id = event.currentTarget.id;
    for (var i = 0; i < this.data.yypj.length; i++) {
      if (id == i) { this.data.yypj[i].selected = true; this.data.level = this.data.yypj[i].title;}
      else { this.data.yypj[i].selected = false; }
    }
    this.setData(this.data);
  },
  /* 筛选的医院评等点击*/
  menuClickPD: function (event) {
    let id = event.currentTarget.id;
    this.data.grade = id;
    for (var i = 0; i < this.data.yypd.length; i++) {
      if (id == i) { this.data.yypd[i].selected = true; this.data.grade = this.data.yypd[i].title;}
      else { this.data.yypd[i].selected = false; }
    }
    this.setData(this.data);
  },
  /* 筛选的经济类型点击*/
  menuClickJJ: function (event) {
    let id = event.currentTarget.id;
    for (var i = 0; i < this.data.jjlx.length; i++) {
      if (id == i) { this.data.jjlx[i].selected = true; }
      else { this.data.jjlx[i].selected = false; }
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
  screenSearch: function () {
    this.data.ifWrite = false;//不需要添加记录
    this.data.isSearch = !this.data.isSearch; //按钮图标
    this.contentHosActive();
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
  bindSearchTap: function (event) {
    let id = event.currentTarget.id;
    wx.navigateTo({
      url: '../hospital_detail/hospital_detail?id=' + id+'&classify=hos'
    });
  },
  /*上拉刷新 */
  fetchSearchList: function () {
    let level = this.data.level;
    let grade = this.data.grade;
    let searchPageNum = this.data.searchPageNum;
    let that = this;
    util.getSearch_Hos(that.data.classify, that.data.keyword, level, grade, searchPageNum, 10, function (data) {

      for (var index in data.datas) {
        let text = data.datas[index].hospital_grade;
        if (text.length > 0 && text != '') {
          var level_t = '';
          var grade_t = '';
          if ((grade_t = text.indexOf("等")) > 0) {
            data.datas[index].grade = text.substring(grade_t - 1);
          }
          if ((level_t = text.indexOf("级")) > 0) {
            data.datas[index].level = text.substring(level_t - 1, 2);
          }
        }
      }
      var searchList = [];
      searchList = that.data.searchDatas.concat(data.datas);
      that.setData({
        searchDatas: searchList,
      })
    });
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
      path: '/pages/search_hos/search_hos?keyword=' + that.data.keyword + '&classify=hos',
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
})