const app = getApp();
Page({
  data: {
    eye: true,//是否显示授权页面
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var that = this;
  },
  onShow: function (options) {
    
    //this.getUserInfoFun()
  },
  login:function(){
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: 'https://www.yixiecha.cn/wxsmallprogram/gain_openid.php',//根据code获得openid
            method: 'post',
            data: { code: res.code },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              app.globalData.openid = res.data.openid;
              wx.setStorageSync("openid", res.data.openid);
              console.log(res);
            },
            fail: function (e) {
              console.log(e);
              wx.showToast({
                title: '网络异常！',
                duration: 2000
              });
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }

      }
    })
    // 获取用户信息
  },  
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {//用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo;
      var S = this;
      wx.request({
        url: 'https://www.yixiecha.cn/wxsmallprogram/insert_user_info.php',//用户信息存入数据库中
        method: 'post',
        data: { openid: app.globalData.openid, nickName: e.detail.userInfo.nickName, sex: e.detail.userInfo.gender },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var pages = getCurrentPages();
          var beforePage = pages[pages.length - 1]
          wx.navigateBack({
            success: function () {
              beforePage.onLoad(); // 执行前一个页面的onLoad方法
            }
          });
          wx.setStorageSync("openid", app.globalData.openid);
        },
        fail: function (e) {
          console.log(e);
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        }
      });
    }else{
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })

    }
  },
  showPrePage: function () {
    this.setData({
      eye: false
    })
  }
})