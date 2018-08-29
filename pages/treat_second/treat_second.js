var util = require('../../utils/util.js')
var handlerLogin = require('../../utils/handlerLogin.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',//目录编号
    num: 0,
    clickCode: '',//当前点击的二级目录编号
    iszk: false,//是否展开
    name: '',//目录名称
    firstDatas: [],
    secondData: []
  },
  onReady: function () {
    handlerLogin.ifAuthen();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let that = this;
    util.sendAjax("https://www.yixiecha.cn/wx_catalog/queryTreatFirst.php", { id: id }, function (data) {
      console.log(data)
      that.setData({
        code: data.parent.code,
        name: data.parent.name,
        num: data.parent.num,
        firstDatas: data.list
      })
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /*点击展开三级目录*/
  showSecond: function (e) {
    let id = e.currentTarget.id;
    if (this.data.clickCode != '' && id != this.data.clickCode) {
      this.data.iszk = true;
    } else {
      this.data.iszk = !this.data.iszk;
    }
    this.setData(this.data);
    this.setData({
      clickCode: id
    })
    let that = this;
    if (this.data.iszk) {
      util.sendAjax("https://www.yixiecha.cn/wx_catalog/queryTreatFirst.php", { id: id}, function (data) {
        that.setData({
          secondData: data.list
        })
      });
    }
  }
})
