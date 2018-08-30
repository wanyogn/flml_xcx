var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchDatas:[],
    matchCount:0,
    keyword:'',
    searchPageNum:0,
    numPerpage:10,
    hasTotal:0,
    classify: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let keyword = options.keyword;
    //let keyword = '上海';
    let classify = options.classify;
    //let keyword = '微生物';
    this.setData({
      keyword: keyword,
      classify: classify
    })
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          showHeight: res.screenHeight - 160
        })
      }
    })
    if (classify == "instit") {
      this.contentActive(keyword, 0);
    } else if (classify == "province") {
      this.contentProvince(keyword, 0);
    }
  },
  contentActive:function(keyword,num){
    let that=this;
    let data = { keyword: keyword, num: num, classify:'instit'}
    util.sendAjax('https://www.yixiecha.cn/wx_catalog/selectClinical.php',data,function(res){
      if(num == 0){
        if(that.data.numPerpage > res.data){
          that.setData({
            hasTotal:res.data
          })
        }else{
          that.setData({
            hasTotal: that.data.numPerpage
          })
        }
        that.setData({
          searchDatas: res.data,
          matchCount: res.count
        })
      }else{
        var searchList = [];
        searchList = that.data.searchDatas.concat(res.data);
        that.setData({
          searchDatas: searchList
        });
      }
    })
  },
  contentProvince: function (keyword, num) {
    let that = this;
    let data = { keyword: keyword, num: num, classify: 'province' }
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
  lookMore:function(){
    this.setData({
      searchPageNum: this.data.searchPageNum + 1,
      hasTotal: parseInt(this.data.numPerpage * (this.data.searchPageNum+2)),
    });
    if (this.data.classify == "instit") {
      this.contentActive(this.data.keyword, this.data.searchPageNum);
    } else if (this.data.classify == "province") {
      this.contentProvince(this.data.keyword, this.data.searchPageNum);
    }
  },
  /*查看专业 */
  lookProfess:function(e){
    let that = this;
    let id = e.target.id;
    let searchData = this.data.searchDatas;
    for (let i = 0; i < searchData.length; i++) {
      if (searchData[i].id == id) {
        if (searchData[i].profess == undefined){//首次点击需要请求服务器
          util.sendAjax('https://www.yixiecha.cn/wx_catalog/selectClinicalById.php', { id: id }, function (res) {
            searchData[i].profess = res.data;
            searchData[i].show = true;
            that.setData({
              searchDatas: searchData
            })
          })
        }else{//
          searchData[i].show = true;
          that.setData({
            searchDatas: searchData
          })
        }
        
      }
    }
  },
  /*收起专业信息*/
  disProfess:function(e){
    let that = this;
    let id = e.target.id;
    let searchData = this.data.searchDatas;
    for (let i = 0; i < searchData.length; i++) {
      if (searchData[i].id == id) {
        searchData[i].show = false;
        that.setData({
          searchDatas: searchData
        })
      }
    }
  },
  keyInput:function(e){
    this.setData({
      keyword:e.detail.value
    })
  },
  searchKey:function(){
    wx.navigateTo({
      url: '../clinic_insResult/clinic_insResult?keyword=' + this.data.keyword
    })
  }
})
