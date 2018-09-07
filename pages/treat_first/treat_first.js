var util = require('../../utils/util.js')
var handlerLogin = require('../../utils/handlerLogin.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    resultDatas:[],
  },
 /* onReady: function () {
    handlerLogin.ifAuthen();
  },*/
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    util.sendAjax('https://www.yixiecha.cn/wx_catalog/queryTreatFirst.php', { id: 0 }, function (res) {
      that.setData({
        resultDatas: res.list
      })
      wx.hideLoading()
    })
   
  },

  /**
   * 用户点击右上角分享
   */
 /* onShareAppMessage: function () {

  },*/
/*点击展开二级目录 */
  openSecond:function(e){
    let id = e.target.id;
    let resultDatas = this.data.resultDatas;
    let that = this;
    for(let i = 0;i<resultDatas.length;i++){
      if(id == resultDatas[i].id){
        if(resultDatas[i].secondList == undefined){//是否首次点击展开
          wx.showLoading({
            title: '加载中...',
          })
          util.sendAjax('https://www.yixiecha.cn/wx_catalog/queryTreatFirst.php', { id: id }, function (res) {
            resultDatas[i].secondList = res.list;
            resultDatas[i].isshow = true;
            that.setData({
              resultDatas: resultDatas
            })
            wx.hideLoading();
          })
        }else{
          resultDatas[i].isshow = true;
          that.setData({
            resultDatas: resultDatas
          })
        }
      }else{
        resultDatas[i].isshow = false;
        that.setData({
          resultDatas: resultDatas
        })
      }
    }
  },
  closeSecond: function (e) {
    let id = e.target.id;
    let resultDatas = this.data.resultDatas;
    for (let i = 0; i < resultDatas.length; i++) {
      if (resultDatas[i].id == id) {
        resultDatas[i].isshow = false;
        this.setData({
          resultDatas: resultDatas
        })
      }
    }
  },
  seeDetail:function(e){
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../clinic_proResult/clinic_proResult?keyword='+name,
    })
  }

})
