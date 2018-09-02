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
      for(let i = 0;i < res.data.length;i++){
        for(let j = 0;j < res.data[i].secondList.length;j++){
          let obj = res.data[i].secondList[j];
          obj.isClick = false;
          if (obj.profession_name.length > 15) {//专业长度
            obj.profession_name_ch = util.getText(obj.profession_name, 15);
            obj.isClick = true;
          } else {
            obj.profession_name_ch = obj.profession_name;
          }
          if (obj.job_title.length > 4) {//职称长度
            obj.job_title = util.getText(obj.job_title,4);
            obj.isClick = true;
          }
          if (obj.main_researcher.length > 5) {//主要研究者
            obj.main_researcher = util.getText(obj.main_researcher, 5);
            obj.isClick = true;
          }
          if (obj.num > 1) {
            obj.isClick = true;
          }
        }
      }
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
    this.contentActive(this.data.keyword, this.data.searchPageNum, this.data.proSel);
    
  },
  /*查找所有的省份，用于筛选 */
  selectAllPro: function () {
    let that = this;
    util.sendAjax('https://www.yixiecha.cn/wx_card/selectAreas.php', {}, function (res) {
      that.setData({
        province: res
      })
    })
  },
  /*获的所选的省份 */
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
    /*wx.navigateTo({
      url: '../clinic_proResult/clinic_proResult?keyword=' + this.data.keyword
    })*/
    this.contentActive(this.data.keyword, 0, "");
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
      searchPageNum: 0
    })
    this.contentActive(this.data.keyword, 0, proSel);
  },
  /*伦理委员会信息 */
  bindClick:function(e){
    let name = e.currentTarget.dataset.name;
    util.sendAjax('https://www.yixiecha.cn/wx_catalog/selectInstitutionEthicalInfoByName.php', { name: name }, function (res) {
      let str = '';
      if (res.data.length > 0) {
        let info = res.data[0].hospital_ethical_info;
        for (let i = 0; i < info.split("#").length; i++) {
          str += info.split("#")[i] + "\r\n"
        }

      } else {
        str = "没有相关内容";
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
  searchByName:function(e){
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../clinic_insResult/clinic_insResult?classify=instit&keyword=' + name
    })
  },
  onShareAppMessage: function () {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '医械查',
      path: '/pages/clinic_proResult/clinic_proResult',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
