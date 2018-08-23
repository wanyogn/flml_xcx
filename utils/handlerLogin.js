const app = getApp();
function ifAuthen(){
  if (app.globalData.userInfo == null){
    this.login();
  }else{
    
  }
}

/*登陆 */
function login() {
  wx.showLoading();
  var that = this;
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
          success: function (rs) {
            app.globalData.openid = rs.data.openid;
            wx.setStorageSync("openid", rs.data.openid);
            that.getUserInfo();
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
}
// 获取用户信息
function getUserInfo() {
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo;
            console.log(app.globalData.userInfo);
            
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
            wx.hideLoading();
            
          }
        })
      }else{
        wx.navigateTo({
          url: '../login/login'
        })
        wx.hideLoading();
      }
      
    }
  })
}
module.exports = {
  login:login,
  ifAuthen: ifAuthen,
  getUserInfo: getUserInfo
}
