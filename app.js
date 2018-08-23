
/*App({
  onLaunch: function () {
    console.log("app.js执行");
  },

  globalData: {
    openid:'',
    userInfo: null,
    classifyPro:'pro',
    classifyCom:'com',
    classifyHos:'hos'
  }
})*/
//app.js
App({
  onLaunch: function () {
   /* wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    }),*/
   /*   wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          var that = this;
          if (res.code) {
            console.log(res);
            wx.request({
              url: 'https://www.yixiecha.cn/wxsmallprogram/gain_openid.php',//根据code获得openid
              method: 'post',
              data: { code: res.code },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                that.globalData.openid = res.data.openid;
                wx.setStorageSync("openid", res.data.openid);
                console.log(res);
                that.gainInfo();
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
    
  },
    gainInfo: function() {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                this.globalData.userInfo = res.userInfo;
                console.log(this.globalData.userInfo);
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })*/
    },
  
  globalData: {
    openid: '',
    userInfo: null,
    classifyPro: 'pro',
    classifyCom: 'com',
    classifyHos: 'hos'
  }
})
