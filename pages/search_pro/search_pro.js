var util = require('../../utils/util.js')
var handlerLogin = require('../../utils/handlerLogin.js') 
const app = getApp();
Page({
  data: {
    item:{
      array: ['产品', '企业', '医院'],
    },
    src_loc:-1,
    product_state:'全部',
    main_class:-1,
    ifWrite:false,//是否后台添加记录
    cpgs:[{id:-1,title:'全部',selected:true},
          { id: 0, title: '国产',selected: false},
          { id: 1, title: '进口',selected: false},
          {id: 2,title: '港澳台',selected: false}],
    zczt: [{id:-1,title: '全部', selected: true },
            {id:0,title: '有效', selected: false },
            {id:1,title: '无效', selected: false },
            {id:2,title: '注销', selected: false }],
    gllb: [{ id: -1, title: '全部', selected: true },
            { id: 1, title: 'I类', selected: false },
            { id: 2, title: 'II类', selected: false },
            { id: 3, title: 'III类', selected: false }],
    openPicker: false,
    needAnimation: false,
    contentHeight: 0,

    keyword: '',
    classify:'',
    matchCount: '0',
    searchDatas: [],
    searchPageNum:0,
    thisIndex:0,
    isSearch:false
  },

  onLoad: function (e) {

    this.data.keyword = e.keyword;
    this.data.classify = e.classify;
    this.data.thisIndex = util.getIndexByPicker(e.classify)
    this.setData(this.data);

    this.data.isSearch = false;//筛选按钮显示
    this.data.ifWrite = true;//需要添加记录
    this.contentProductActive();
  },
  onReady: function () {
    handlerLogin.ifAuthen();
  },
  contentProductActive:function(){
    let src_loc = this.data.src_loc;
    let product_state = this.data.product_state;
    let main_class = this.data.main_class;
    let that = this;
    util.getSearchPro(this.data.classify, this.data.keyword, src_loc, product_state, main_class, 0, 10, function (data) {console.log(data);
      for (var index in data.datas) {
        data.datas[index].main_class = util.getMain_class(data.datas[index].main_class);
        data.datas[index].src_loc = util.getSrc_loc(data.datas[index].src_loc);
        data.datas[index].product_mode = util.getText(data.datas[index].product_mode, 20);
        var maker_name = data.datas[index].maker_name_ch;
        if (maker_name == '') {
          maker_name = data.datas[index].agent;;
        }
        data.datas[index].maker_name = maker_name;
        data.datas[index].maker_name_ch = util.getText(maker_name, 20);
        data.datas[index].product_name_ch = util.getText(data.datas[index].product_name_ch, 10);    
        if (data.datas[index].picture_addr != undefined) {
          data.datas[index].picture_addr = "https://www.yixiecha.cn/yixiecha/upload/" + data.datas[index].picture_addr;
        } else {
          data.datas[index].picture_addr = "../image/product.png";
        }

      }
      that.data.searchDatas = data.datas;
      that.setData({
        matchCount: data.matchCount,
        searchDatas: data.datas
      });
      if (that.data.ifWrite){
        util.insertSearchInfo(that.data.classify, that.data.keyword, data.matchCount, wx.getStorageSync('openid'));
      }
    });

  },
  /*上拉刷新 */
  fetchSearchList:function(){
    let that = this;
    let src_loc = this.data.src_loc;
    let product_state = this.data.product_state;
    let main_class = this.data.main_class;
    let searchPageNum = that.data.searchPageNum;
    util.getSearchPro(this.data.classify, this.data.keyword, src_loc, product_state, main_class, searchPageNum, 10, function (data) {
      for (var index in data.datas) {
        /*data.datas[index].main_class = util.getMain_class(data.datas[index].main_class);
        data.datas[index].src_loc = util.getSrc_loc(data.datas[index].src_loc);
        data.datas[index].class_code = util.getClass_code(data.datas[index].class_code);
        data.datas[index].product_name_ch = util.getText(data.datas[index].product_name_ch, 13);
        data.datas[index].maker_name = data.datas[index].maker_name_ch;
        data.datas[index].maker_name_ch = util.getText(data.datas[index].maker_name_ch, 13);*/
        data.datas[index].main_class = util.getMain_class(data.datas[index].main_class);
        data.datas[index].src_loc = util.getSrc_loc(data.datas[index].src_loc);
        data.datas[index].product_mode = util.getText(data.datas[index].product_mode, 20);
        var maker_name = data.datas[index].maker_name_ch;
        if (maker_name == '') {
          maker_name = data.datas[index].agent;;
        }
        data.datas[index].maker_name = maker_name;
        data.datas[index].maker_name_ch = util.getText(maker_name, 20);
        data.datas[index].product_name_ch = util.getText(data.datas[index].product_name_ch, 10);
        if (data.datas[index].picture_addr != undefined) {
          data.datas[index].picture_addr = "https://www.yixiecha.cn/yixiecha/upload/" + data.datas[index].picture_addr;
        } else {
          data.datas[index].picture_addr = "../image/product.png";
        }
      }
      var searchList = [];
      searchList = that.data.searchDatas.concat(data.datas);
      that.setData({
        searchDatas: searchList
      });
    });
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
  //产品归属的单选
  menuClickCP:function(event){
    let id = event.currentTarget.id;
    //wx.setStorageSync('src_loc', id);
    this.data.src_loc = id;
    for (var i = -1; i < this.data.cpgs.length-1; i++){
      if(id == i){this.data.cpgs[i+1].selected = true;}
      else{this.data.cpgs[i+1].selected = false;}
    }
    this.setData(this.data);
  },
  //注册状态的单选
  menuClickZC:function(event){
    let id = event.currentTarget.id; 
    for (var i = -1; i < this.data.zczt.length - 1; i++) {
      if (id == i) { this.data.zczt[i + 1].selected = true; this.data.product_state = this.data.zczt[i + 1].title;} 
      else {this.data.zczt[i+1].selected = false;}
    }

    this.setData(this.data);
  },
  //管理类别的单选
  menuClickGL:function(event){
    let id = event.currentTarget.id;
    //wx.setStorageSync('main_class', id);
    this.data.main_class = id;
    if (id < 0) { id = 0; }
    for(var i = 0;i < this.data.gllb.length;i++){
      if(id == i){this.data.gllb[i].selected = true;}
      else { this.data.gllb[i].selected = false;}
    }
    this.setData(this.data);
  },
  //筛选
  screenSearch:function(){
    this.data.ifWrite = false;//不需要添加记录
    this.data.isSearch = !this.data.isSearch; //按钮图标
    this.contentProductActive();
    this.setData({
      isSearch: this.data.isSearch,
      openPicker: !this.data.openPicker,
      needAnimation: true
    })
  },
  closeMe:function(){
    this.data.isSearch = !this.data.isSearch; //按钮图标
    this.setData({
      isSearch: this.data.isSearch,
      openPicker: !this.data.openPicker,
      needAnimation: true
    })
  },
  //picker选择器
  bindPickerChange: function (e) {
    //wx.setStorageSync('classify',util.getPickerNameByIndex(e.detail.value));
    this.data.classify = util.getPickerNameByIndex(e.detail.value);
    this.setData({
        thisIndex: e.detail.value
    })
  },
  onReachBottom:function(){
    let that = this;
    that.setData({
      searchPageNum: that.data.searchPageNum + 1
    });
    that.fetchSearchList();
  },
  onPickHeaderClick: function () {
    this.data.isSearch = !this.data.isSearch ;
    this.setData({
      isSearch:this.data.isSearch,
      openPicker: !this.data.openPicker,
      needAnimation: true
    })
  },
  inputChange:function(e){
    //wx.setStorageSync('keyword', e.detail.value.replace(/\s+/g, ''));
    this.data.keyword = e.detail.value.replace(/\s+/g, '');
  },
  search:function(){
    let keyword = this.data.keyword;
   // let classify = wx.getStorageSync('classify');
    let classify = this.data.classify;
    if(keyword != ""){
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
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入关键词...',
        success: function (res) {
        }
      });
    }
  },
  onShareAppMessage:function(res){
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '智械数据',
      path: '/pages/search_pro/search_pro?keyword=' + that.data.keyword + '&classify=pro',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /*点击标题进入详情页 */
  bindSearchTap:function(e){
    const dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../product_detail/product_detail?id=' + dataset.id+'&classify=pro'
    })
  },
  bindCompany:function(e){
    let companyName = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../company_detail/company_detail?keyword=' + companyName + '&classify=com'
    })
  }
})