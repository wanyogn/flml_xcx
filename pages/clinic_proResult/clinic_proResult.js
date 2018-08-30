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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let keyword = options.keyword;
    //let keyword = '微生物';
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
    this.contentActive(keyword, 0);
    
  },
  contentActive: function (keyword, num) {
    let that = this;
    let data = { keyword: keyword, num: num, classify: 'profess' }
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
  keyInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  searchKey: function () {
    wx.navigateTo({
      url: '../clinic_proResult/clinic_proResult?keyword=' + this.data.keyword
    })
  }
})
