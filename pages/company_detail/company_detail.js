// pages/company_detail/company_detail.js
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
    currentSC:'xk',//默认当前选中为生产许可
    currentJY: 'xk',//默认当前选中为经营许可
    currentFW: 'xx',//默认当前选中为信息服务
    qxsc:[{sign:'xk',title:'生产许可证',cls:'left',selected:true},
          {sign:'ba',title:'生产备案凭证',cls:'right',selected:false}],
    qxjy: [{ sign: 'xk', title: '经营许可证', cls: 'left', selected: true },
    { sign: 'ba', title: '经营备案凭证', cls: 'right', selected: false }],
    qxfw: [{ sign: 'xx', title: '互联网信息服务资格', cls: 'left', selected: true },
    { sign: 'jy', title: '互联网交易服务资格', cls: 'right', selected: false }],
    companyName: '',
    xukeSC:'',
    beianSC:'',
    xukeJY: '',
    beianJY: '',
    xinxiFW: '',
    jiaoyiFW: '',
    productData:[],
    ZBGGData:[],
    keyword:'',
    classify:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.keyword = options.keyword; console.log(options.keyword);
    this.data.classify = options.classify;
    this.data.thisIndex = util.getIndexByPicker(options.classify)
    this.setData(this.data);

    var that = this;
    wx.request({
      url: 'https://www.yixiecha.cn/wxsmallprogram/wx_search_detail.php',//这里填写后台给你的搜索接口
      method: 'post',
      data: { classtype: this.data.classify, keyword: this.data.keyword },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //console.log(res);
        var produce_xuke = [];
        var produce_beian = [];
        var salary_xuke = [];
        var salary_beian = [];
        var service_jiaoyi = [];
        var service_xinxi = [];
        let data = res.data.datas;
        that.data.companyName = data[0].company_name;
        for(let i = 0;i < data.length;i++){
          let obj = data[i];
          if (obj.regulation_type == "生产") {
            if (obj.regulation_way == "许可") {
              produce_xuke.push(obj);
            } else if (obj.regulation_way == "备案") {
              produce_beian.push(obj);
            }
          } else if (obj.regulation_type == "经营") {
            if (obj.regulation_way == "许可") {
              salary_xuke.push(obj);
            } else if (obj.regulation_way == "备案") {
              salary_beian.push(obj);
            }
          } else if (obj.regulation_type == "交易服务") {
            service_jiaoyi.push(obj);
          } else if (obj.regulation_type == "信息服务") {
            service_xinxi.push(obj);
          }
        }
        //生产许可
        if (produce_xuke.length > 0) {
          var index = util.getMaxIndex(produce_xuke);
          var obj = util.transferDate(produce_xuke[index]);
          that.data.xukeSC = obj;
        }else{
          that.data.xukeSC = '';
        }
        //生产备案
        if (produce_beian.length > 0){
          var index = util.getMaxIndex(produce_beian);
          var obj = util.transferDate(produce_beian[index]);
          that.data.beianSC = obj;
        }else{
          that.data.beianSC = "";
        }
        //先把有的内容先显示
        if(that.data.xukeSc == '' && that.data.beianSC != ''){
          let sign = 'ba';
          for (let i = 0; i < that.data.qxsc.length; i++) {
            if (sign == that.data.qxsc[i].sign) {
              that.data.qxsc[i].selected = true;
            } else {
              that.data.qxsc[i].selected = false;
            }
          }
          that.data.currentSC = sign;
        }
        //经营许可
        if (salary_xuke.length > 0){
          var index = util.getMaxIndex(salary_xuke);
          var obj = util.transferDate(salary_xuke[index]); 
          that.data.xukeJY = obj;
        }else{
          that.data.xukeJY = '';
        }
        //经营备案
        if (salary_beian.length > 0){
          var index = util.getMaxIndex(salary_beian);
          var obj = util.transferDate(salary_beian[index]);
          that.data.beianJY = obj;
        }else{
          that.data.beianJY = '';
        }
        //先把有的内容先显示
        if (that.data.xukeJY == '' && that.data.beianJY != '') {
          let sign = 'ba';
          for (let i = 0; i < that.data.qxjy.length; i++) {
            if (sign == that.data.qxjy[i].sign) {
              that.data.qxjy[i].selected = true;
            } else {
              that.data.qxjy[i].selected = false;
            }
          }
          that.data.currentJY = sign;
        }
        //交易服务
        if (service_jiaoyi.length > 0) {
          var index = util.getMaxIndex(service_jiaoyi);
          var obj = util.transferDate(service_jiaoyi[index]);
          that.data.jiaoyiFW = obj;
        } else {
          that.data.jiaoyiFW = '';
        }
        //信息服务
        if (service_xinxi.length > 0) {
          var index = util.getMaxIndex(service_xinxi);
          var obj = util.transferDate(service_xinxi[index]);
          that.data.xinxiFW = obj;
        } else {
          that.data.xinxiFW = '';
        }
        //先把有的内容先显示
        if (that.data.xinxiFW == '' && that.data.jiaoyiFW != '') {
          let sign = 'jy';
          for (let i = 0; i < that.data.qxfw.length; i++) {
            if (sign == that.data.qxfw[i].sign) {
              that.data.qxfw[i].selected = true;
            } else {
              that.data.qxfw[i].selected = false;
            }
          }
          that.data.currentFW = sign;
        }
        that.setData(that.data);
      }
       
    });
    util.getProByCom(options.keyword,0,3,function(data){
        for (var index in data.datas) {
          data.datas[index].main_class = util.getMain_class(data.datas[index].main_class);
          data.datas[index].src_loc = util.getSrc_loc(data.datas[index].src_loc);
          data.datas[index].product_mode = util.getText(data.datas[index].product_mode,15);
          data.datas[index].product_name_ch = util.getText(data.datas[index].product_name_ch, 10);
          var maker_name = data.datas[index].maker_name_ch;
          if (maker_name == '') {
            maker_name = data.datas[index].agent;;
          }
          data.datas[index].maker_name_ch = util.getText(maker_name, 15);
          if (data.datas[index].picture_addr != undefined) {
            data.datas[index].picture_addr = "https://www.yixiecha.cn/yixiecha/upload/" + data.datas[index].picture_addr;
          } else {
            data.datas[index].picture_addr = "../image/product.png";
          }
        }
        that.setData({
          matchCount:data.matchCount,
          productData:data.datas
        });
    })
    util.getZBGGByCom(options.keyword, 0, 3, function (data) {
      for(let i = 0;i < data.datas.length;i++){
        data.datas[i].date = util.parseDate(data.datas[i].date);
      }
      that.setData({
        matchCountZB: data.matchCount,
        ZBGGData: data.datas
      });
    })


  },
  onReady: function () {
    handlerLogin.ifAuthen();
  },
  //器械生产切换
  SCChange:function(e){
    let sign = e.target.dataset.sign;
    for (let i = 0; i < this.data.qxsc.length; i++){
      if(sign == this.data.qxsc[i].sign){
        this.data.qxsc[i].selected = true;
      }else{
        this.data.qxsc[i].selected = false;
      }
    }
    this.data.currentSC = sign;
    this.setData(this.data);
  },
  //器械经营切换
  JYChange: function (e) {
    let sign = e.target.dataset.sign;
    for (let i = 0; i < this.data.qxjy.length; i++) {
      if (sign == this.data.qxjy[i].sign) {
        this.data.qxjy[i].selected = true;
      } else {
        this.data.qxjy[i].selected = false;
      }
    }
    this.data.currentJY = sign;
    this.setData(this.data);
  },
  FWChange:function(e){
    let sign = e.target.dataset.sign;
    for (let i = 0; i < this.data.qxfw.length; i++) {
      if (sign == this.data.qxfw[i].sign) {
        this.data.qxfw[i].selected = true;
      } else {
        this.data.qxfw[i].selected = false;
      }
    }
    this.data.currentFW = sign;
    this.setData(this.data);
  },
  //查看更多（公司的产品）
  lookMore:function(event){
    let keyword = event.currentTarget.dataset.keyword;
    wx.navigateTo({
      url: '../product_list/product_list?keyword='+keyword
    })
  },
  bindSearchTap:function(e){
   // wx.setStorageSync("classify", "pro");
    const dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../product_detail/product_detail?id=' + dataset.id+"&classify=pro"
    })
  },
  //查看更多（公司的中标公告）
  lookMoreZB: function (event){
    let keyword = event.currentTarget.dataset.keyword;
    wx.navigateTo({
      url: '../tenderbid_list/tenderbid_list?keyword=' + keyword
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
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
      path: '/pages/company_detail/company_detail?keyword=' + that.data.keyword + "&classify=com",
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