var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchDatas: [],
    matchCount: 0,
    keyword: '',
    searchPageNum: 0,
    numPerpage: 10,
    hasTotal: 0,
    showHeight:0,
    province:[],
    proSel:[],
    proSelFlag:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let keyword = options.keyword;
    //let keyword = '口腔';
    this.setData({
      keyword: keyword,
    })
    let that=this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          showHeight:res.screenHeight-160
        })
      }
    })
    this.contentActive(keyword, 0,"");
    this.selectAllPro();
  },
  contentActive: function (keyword, num, province) {
    let that = this;
    let data = { keyword: keyword, num: num, classify: 'profess', province: province }
    util.sendAjax('https://www.yixiecha.cn/wx_catalog/selectClinical.php', data, function (res) {
      if (num == 0) {
        if (that.data.numPerpage > res.data) {
          that.setData({
            hasTotal: res.data
          })
        } else {
          that.setData({
            hasTotal: that.data.numPerpage
          })
        }
        that.setData({
          searchDatas: res.data,
          matchCount: res.count
        })
      } else {
        var searchList = [];
        searchList = that.data.searchDatas.concat(res.data);
        that.setData({
          searchDatas: searchList
        });
      }
    })
  },
  /*加载更多 */
  lookMore: function () {
    this.setData({
      searchPageNum: this.data.searchPageNum + 1,
      hasTotal: parseInt(this.data.numPerpage * (this.data.searchPageNum + 2)),
    });
    this.contentActive(this.data.keyword, this.data.searchPageNum);
    
  },
  selectAllPro: function () {
    let that = this;
    util.sendAjax('https://www.yixiecha.cn/wx_card/selectAreas.php', {}, function (res) {
      that.setData({
        province: res
      })
    })
  },
  bindchange: function (e) {
    let pro = e.detail.value;
    this.setData({
      proSel: pro
    })
  },
  keyInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  searchKey: function () {
    wx.navigateTo({
      url: '../clinic_proResult/clinic_proResult?keyword=' + this.data.keyword
    })
  },
  areaSel: function () {
    let flag = this.data.proSelFlag;
    this.setData({
      proSelFlag: !flag,
    })
  },
  save_pro:function(){
    let proSel = this.data.proSel;
    this.setData({
      proSelFlag: !this.data.proSelFlag,
    })
    this.contentActive(this.data.keyword, 0, proSel);
  },
  forDetail: function (e) {
    let pid = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    util.sendAjax('https://www.yixiecha.cn/wx_catalog/selectClinicalInstitutionHiddenInfoByMap.php', { pid: pid, name: name }, function (res) {
      let str = '';
      for (let i = 0; i < res.data.length; i++) {
        str += (res.data[i].main_researcher + "      " + res.data[i].job_title + "\n")
      }
      wx.showModal({
        title: name,
        content: str,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
    })
  },
})
