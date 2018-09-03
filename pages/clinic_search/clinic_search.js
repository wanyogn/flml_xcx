var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classify: 'instit',//instit表示搜机构,profess表示搜专业
    keyword:'',
    huabei:[],
    dongbei:[],
    huadong:[],
    huazhong:[],
    huanan:[],
    xinan:[],
    xibei:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryProvince();
  },
  /*机构与专业的单选 */
  bindChoose:function(e){
    let classify = e.currentTarget.dataset.classify;
    this.setData({
      classify:classify
    })
  },
  /*找出省份 */
  queryProvince: function () {
    let that = this;
    util.sendAjax('https://www.yixiecha.cn/wx_catalog/queryAllRegions.php',{},function(res){
      let huabei = [], dongbei = [], huadong = [], huazhong = [], huanan = [], xinan = [], xibei = [];
      for(let i=0;i<res.data.length;i++){
        if (res.data[i].province == "内蒙古自治区"){
          res.data[i].abbre = res.data[i].province.substring(0, 3);
        } else if (res.data[i].province == "黑龙江省"){
          res.data[i].abbre = res.data[i].province.substring(0, 3);
        }else{
          res.data[i].abbre = res.data[i].province.substring(0, 2);
        }
        let province = res.data[i].abbre;
        if (province == "北京" || province == "天津" || province == "河北" || province == "山西" || province == "内蒙古") {
          that.data.huabei.push(res.data[i]);//华北
        } else if (province == "辽宁" || province == "吉林" || province == "黑龙江") {
          that.data.dongbei.push(res.data[i]);//东北
        } else if (province == "上海" || province == "江苏" || province == "浙江" || province == "安徽" || province == "福建" || province == "江西" || province == "山东") {
          that.data.huadong.push(res.data[i]);//华东
        } else if (province == "河南" || province == "湖北" || province == "湖南") {
          that.data.huazhong.push(res.data[i]);//华中
        } else if (province == "广东" || province == "广西" || province == "海南") {
          that.data.huanan.push(res.data[i]);//华南
        } else if (province == "重庆" || province == "四川" || province == "贵州" || province == "云南" || province == "西藏") {
          that.data.xinan.push(res.data[i]);//西南
        } else if (province == "陕西" || province == "甘肃" || province == "青海" || province == "宁夏" || province == "新疆") {
          that.data.xibei.push(res.data[i]);//西北
        }
      }
      that.setData({
        huabei: that.data.huabei,
        dongbei: that.data.dongbei,
        huadong: that.data.huadong,
        huazhong: that.data.huazhong,
        huanan: that.data.huanan,
        xinan: that.data.xinan,
        xibei: that.data.xibei
      })
    })
  },
  searchByProvince:function(e){
    let province = e.currentTarget.dataset.province;
    wx.navigateTo({
      url: '../clinic_insResult/clinic_insResult?classify=province&keyword=' + province
    })
  },
  keyInput:function(e){
    this.setData({
      keyword: e.detail.value
    })
  },
  searchKey:function(){
    let classify = this.data.classify;
    let keyword = this.data.keyword;
    if(keyword.trim() == ""){
      wx.showToast({
        title: '请输入关键词。。',
        icon: 'none',
        mask: true,
        duration: 2000
      })
    }else{
      if (classify == "instit"){
        wx.navigateTo({
          url: '../clinic_insResult/clinic_insResult?classify=instit&keyword='+keyword
        })
      } else if (classify == "profess"){
        wx.navigateTo({
          url: '../clinic_proResult/clinic_proResult?keyword=' + keyword
        })
      }
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '医械查',
      path: '/pages/clinic_search/clinic_search',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
