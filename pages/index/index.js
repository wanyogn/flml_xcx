var handlerLogin = require('../../utils/handlerLogin.js')  
const app = getApp();

Page({
  data: {
    searchValue: '',
    items: [
      { name: 'pro', value: '产品', checked: 'true' },
      { name: 'com', value: '企业' },
      { name: 'hos', value: '医院' },
    ]
  },
  onLoad: function () {
    wx.setStorageSync('classify', 'pro');
    
  },
  onReady:function(){
    handlerLogin.ifAuthen();
  },
  inputChange: function (e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    });
  },
  radioChange: function (e) {
    wx.setStorageSync('classify', e.detail.value);
  },
  search: function (e) {
    if (app.globalData.userInfo == null){
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
        success: function (res) {
          if (res.confirm) {
            if (wx.openSetting) {
              wx.openSetting({
                success: function (res) {
                  //尝试再次登录
                  app.gainUserInfo();
                }
              })
            }
          } else {
            //that.gainTip();
          }
        }
      });
    }else{
      if (this.data.searchValue != ""){
        wx.setStorageSync('keyword', this.data.searchValue);
        var classify = wx.getStorageSync('classify');
        if(classify == "pro"){
          wx.navigateTo({
            url: '../search_pro/search_pro?classify=' + classify + '&keyword=' + this.data.searchValue
          });
        }else if(classify == "com"){
          wx.navigateTo({
            url: '../search_com/search_com?classify=' + classify + '&keyword=' + this.data.searchValue
          });
        }else if(classify == "hos"){
          wx.navigateTo({
             url: '../search_hos/search_hos?classify='+ classify + '&keyword=' + this.data.searchValue
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
    }
  },
  keyInput: function (e) {
    wx.navigateTo({
      url: '../jump_page/jump_page'
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '智械数据',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
});  
