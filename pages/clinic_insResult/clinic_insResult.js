var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchDatas:[],
    matchCount:0,
    keyword:'',
    keyPro:'',//传过来的省份
    searchPageNum:0,
    numPerpage:10,
    hasTotal:0,
    classify: '',
    province:[],
    proSel:[],
    zlSel:[],
    TreatDirectory:[],
    proSelFlag:true,
    zlSelFlag:true,
    flag:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let keyword = options.keyword;
    //let keyword = '医院';
    let classify = options.classify;
    //let classify = 'instit';
    this.setData({
     // keyword: keyword,
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
      this.contentActive(keyword, 0,"","");
      this.setData({
         keyword: keyword,
      })
    } else if (classify == "province") {
      this.contentActive("", 0, keyword, "");
      this.setData({
        keyPro: keyword,
        proSel:keyword
      })
    }
    this.selectAllPro();
    this.selecAllZL();
  },
  contentActive: function (keyword, num, province, profession_name){
    let that=this;
    let data = { keyword: keyword, num: num, classify: 'instit', province: province, profession_name:profession_name}
    util.sendAjax('https://www.yixiecha.cn/wx_catalog/selectClinical.php',data,function(res){
      for(let i = 0;i<res.data.length;i++){
        res.data[i].approval_date_original = res.data[i].approval_date_original.substring(0,10);
        if (res.data[i].hospital_grade.length > 5){
          res.data[i].hospital_grade =util.getText(res.data[i].hospital_grade,5);
        }
        if (res.data[i].province == "内蒙古自治区"){
          res.data[i].province = "内蒙古";
        } else if (res.data[i].province == "广西壮族自治区"){
          res.data[i].province = "广西";
        } else if (res.data[i].province == "宁夏回族自治区"){
          res.data[i].province = "宁夏";
        }
      }
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
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].approval_date_original = res.data[i].approval_date_original.substring(0, 10);
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
  lookMore:function(){
    this.setData({
      searchPageNum: this.data.searchPageNum + 1,
      hasTotal: parseInt(this.data.numPerpage * (this.data.searchPageNum+2)),
    });
    let proSel = this.data.proSel;
    let zlSel = this.data.zlSel;
    if (typeof proSel == 'string') {//没有进行区域选择，但是还是要带上首页进来时所选的省份
      this.setData({
        proSel: this.data.keyPro
      })
    } else {
    }
    console.log(proSel);
    console.log(zlSel);
    if (this.data.classify == "instit") {
      this.contentActive(this.data.keyword, this.data.searchPageNum, proSel, zlSel);
    } else if (this.data.classify == "province") {
     // this.contentActive(this.data.keyword, this.data.searchPageNum,);
      
      this.contentActive(this.data.keyword, this.data.searchPageNum, proSel, zlSel );
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
            for(let j = 0;j<res.data.length;j++){
              let obj = res.data[j];
              obj.isClick = false;//判断当前行是否可以点击
              if(obj.profession_name.length > 15){//专业长度
                obj.profession_name_ch = util.getText(obj.profession_name,15);
                obj.isClick = true;
              }else{
                obj.profession_name_ch = obj.profession_name;
              }
              if (obj.job_title.length > 5){//职称长度
                obj.job_title = util.getText(obj.job_title, 5);
                obj.isClick = true;
              }
              if (obj.main_researcher.length > 5){//主要研究者
                obj.main_researcher = util.getText(obj.main_researcher, 5);
                obj.isClick = true;
              }
              if(obj.num > 1){
                obj.isClick = true;
              }
            }
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
  /*查看伦理委员会信息 */
  bindClick:function(e){
    let name = e.currentTarget.dataset.name;
    util.sendAjax('https://www.yixiecha.cn/wx_catalog/selectInstitutionEthicalInfoByName.php',{name:name},function(res){
      let str = '';
      if (res.data.length > 0){
        let info = res.data[0].hospital_ethical_info;
        for (let i = 0; i < info.split("#").length; i++) {
          str += info.split("#")[i] + "\r\n"
        }
        
      }else{
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
  areaSel:function(){
    let flag = this.data.proSelFlag;
    this.setData({
      proSelFlag:!flag,
      flag:false,
    })
  },
  zlSel:function(){
    let flag = this.data.zlSelFlag;
    this.setData({
      zlSelFlag: !flag,
      flag: false
    })
  },
  selectAllPro:function(){
    let that = this;
    util.sendAjax('https://www.yixiecha.cn/wx_card/selectAreas.php', {}, function (res) {
      console.log(res);
      for(let i = 0;i<res.length;i++){
        for(let j = 0;j<res[i].content.length;j++){
          let obj = res[i].content[j];
          obj.check = false;
          if(obj.name == that.data.keyPro){
            obj.check = true;
          }
        }
      }
      that.setData({
        province:res
      })
    })
  },
  selecAllZL:function(){
    let that = this;
    util.sendAjax('https://www.yixiecha.cn/wx_catalog/queryTreatFirst.php', {id:0}, function (res) {
      that.setData({
        TreatDirectory: res.list
      })
    })
  },
  /*复选框 */
  bindchange:function(e){
    let pro = e.detail.value;
    this.setData({
      proSel:pro
    })
  },
  bindchangeZL:function(e){
    let zl = e.detail.value;
    this.setData({
      zlSel: zl
    })
  },
  save_pro:function(e){

    let proSel=this.data.proSel;
    let zlSel = this.data.zlSel;
    if (typeof proSel == 'string') {//没有进行区域选择，但是还是要带上首页进来时所选的省份
      //proSel.push(this.data.keyPro);
      this.setData({
        proSel: this.data.keyPro,
        searchPageNum:0
      })
    }else{
    }
    let flag = e.currentTarget.dataset.flag;
    if(flag == "qy"){
      this.setData({
        proSelFlag: !this.data.proSelFlag,
        flag: true
      })
    }else if(flag == "zl"){
      this.setData({
        zlSelFlag: !this.data.zlSelFlag,
        flag: true
      })
    }
    this.contentActive(this.data.keyword, 0, proSel, zlSel);
  },
  forDetail:function(e){
    let pid = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    util.sendAjax('https://www.yixiecha.cn/wx_catalog/selectClinicalInstitutionHiddenInfoByMap.php',{pid:pid,name:name},function(res){
      let str = '';
      for(let i = 0;i < res.data.length;i++){
        str += (res.data[i].main_researcher + "      " + res.data[i].job_title+"\n")
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
  keyInput:function(e){
    this.setData({
      keyword:e.detail.value
    })
  },
  searchKey:function(){
    /*wx.navigateTo({
      url: '../clinic_insResult/clinic_insResult?classify=instit&keyword=' + this.data.keyword
    })*/
    let proSel = this.data.proSel;
    let zlSel = this.data.zlSel;
    if (typeof proSel == 'string') {//没有进行区域选择，但是还是要带上首页进来时所选的省份
      this.setData({
        proSel: this.data.keyPro
      })
    } else {
    }
    this.contentActive(this.data.keyword, 0, proSel, zlSel);
  },
  onShareAppMessage: function () {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '医械查',
      path: '/pages/clinic_insResult/clinic_insResult',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
