//类别    关键词    第几页   每次条数  回调函数
function getSearchPro(classify, keyword, src_loc, product_state, main_class, pageindex, callbackcount, callback) {
  if(src_loc < 0){src_loc = ''}
  if(product_state =='全部'){product_state = ''}
  if (main_class < 0){main_class = ''}
  wx.request({
    url: 'https://www.yixiecha.cn/wxsmallprogram/wx_search_list.php',//这里填写后台给你的搜索接口
    method: 'post',
    data: { classtype: classify, 
            keyword: keyword,
            src_loc:src_loc,
            product_state:product_state,
            main_class:main_class, 
            num: pageindex },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.statusCode == 200) { 
        callback(res.data);
      }
    }
  })    
}
/*添加搜索记录 */
function insertSearchInfo(classtype, keyword, resultcount, openid){
  wx.request({
    url: 'https://www.yixiecha.cn/wxsmallprogram/insert_search_info.php',//这里填写后台给你的搜索接口
    method: 'post',
    data: { classtype: classtype, keyword: keyword, resultcount: resultcount, openid:openid},
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(res);
    },
    fail: function (e) {
      console.log(e);
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    },
  });
}
/*企业搜索 */
function getSearchCom(classify, keyword, production_type, manage_type, web_type,pageindex, callbackcount, callback) {
  if (production_type == 0) { production_type = ''}
  if(manage_type == 0){manage_type = ''}
  if(web_type == 0){web_type = ''}
  wx.request({
    url: 'https://www.yixiecha.cn/wxsmallprogram/wx_search_list.php',//这里填写后台给你的搜索接口
    method: 'post',
    data: {
      classtype: classify,
      keyword: keyword,
      production_type:production_type,
      manage_type: manage_type,
      web_type: web_type,
      num: pageindex
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })    
}
/*医院搜索url*/
function getSearch_Hos(classify, keyword,level,grade, pageindex, callbackcount, callback){
  if(level == '全部'){level = ''}
  if (grade == '全部') { grade = '' }
  wx.request({
    url: 'https://www.yixiecha.cn/wxsmallprogram/wx_search_list.php',//这里填写后台给你的搜索接口
    method: 'post',
    data: {
      classtype: classify,
      keyword: keyword,
      level:level,
      grade:grade,
      num: pageindex
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })    
}
 //通过公司名称找产品
function getProByCom(keyword, num, size, callback){
  wx.request({
    url: 'https://www.yixiecha.cn/wxsmallprogram/wx_company_detail.php',
    method: 'post',
    data: {
      dotype: 'product',
      keyword: keyword,
      num: num,
      size:size
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })    
}
//通过公司名称找中标公告
function getZBGGByCom(keyword, num, size, callback) {
  wx.request({
    url: 'https://www.yixiecha.cn/wxsmallprogram/wx_company_detail.php',
    method: 'post',
    data: {
      dotype: 'tenderbid',
      keyword: keyword,
      num: num,
      size: size
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}
/*获的时间最大值的下标  企业详情用到*/
function getMaxIndex(arr) {
  var max = arr[0].approval_date;
  var index = 0;
  for (var j = 0; j < arr.length; j++) {
    if (ToDate(arr[j].approval_date) >= ToDate(max)) {
      max = arr[j].approval_date;
      index = j;
    }
  }
  return index;
}
function ToDate(date1) {
  var time = new Date(Date.parse(date1));
  return time;
}
//企业详情中对批准和到期日期进行处理
function transferDate(obj){
  if (obj.approval_complete_mark == 0) {
    obj.approval_date = obj.approval_date.substring(0, 10);
  } else if (obj.approval_complete_mark == 1) {
    obj.approval_date = obj.approval_date.substring(0, 4);
  } else {
    obj.approval_date = obj.approval_date.substring(0, 7);
  }
  if (obj.expiry_complete_mark == 0) {
    obj.expiry_date = obj.expiry_date.substring(0, 10);
  } else if (obj.expiry_complete_mark == 1) {
    obj.expiry_date = obj.expiry_date.substring(0, 4);
  } else {
    obj.expiry_date = obj.expiry_date.substring(0, 7);
  }
  if (obj.vacancy_mark == 0) {
  } else if (obj.vacancy_mark == 1) {
    obj.approval_date = "";
  } else if (obj.vacancy_mark == 2) {
    obj.expiry_date = "";
  } else {
    obj.approval_date = "";
    obj.expiry_date = "";
  }
  return obj;
}
/*截取字符串*/
function getText(text, size) {
  if(text != undefined){
    if (text.length > size) {
      text = text.substring(0, size) + "...";
    }
  }
  
  return text;
}
/*时间戳转换为正常时间 */
function parseDate(timestamp) {
  var d = new Date(timestamp);
  var year = d.getFullYear();
  var month = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
  var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
  var hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
  var minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
  var second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}
/*picker中数组元素与下标的转换 */
function getIndexByPicker(str){
  let sign = 0;
  if(str == "pro"){sign = 0;}
  else if(str == "com"){sign = 1;}
  else if(str == "hos"){sign = 2;}
  return sign;
}
function getPickerNameByIndex(index){
  let name = '';
  if(index == "0"){name = "pro";}
  else if(index == "1"){name = "com";}
  else if(index == "2"){name = "hos";}
  return name;
}
function getMain_class(main_class){
  let result = '';
  if (main_class == "1") { result = "I类"; }
  else if (main_class == "2") { result = "II类"; }
  else if (main_class == "3") { result = "III类"; }
  return result;
}
function getSrc_loc(src_loc){
  let result = '';
  if (src_loc == "0") { result = "国产"; }
  else if (src_loc == "1") { result = "进口"; }
  else if (src_loc == "2") { result = "港澳台"; }
  return result;
}
function getClass_code(class_code){
  let result = '';
  if (class_code == "01") { result = "基础外科手术器械"; }
  else if (class_code == "02") { result = "显微外科手术器械"; }
  else if (class_code == "03") { result = "神经外科手术器械"; }
  else if (class_code == "04") { result = "眼科手术器械"; }
  else if (class_code == "05") { result = "耳鼻喉科手术器械"; }
  else if (class_code == "06") { result = "口腔科手术器械"; }
  else if (class_code == "07") { result = "胸腔心血管外科手术器械"; }
  else if (class_code == "08") { result = "腹部外科手术器械"; }
  else if (class_code == "09") { result = "泌尿肛肠外科手术器械"; }
  else if (class_code == "10") { result = "矫形外科（骨科）手术器械"; }
  else if (class_code == "12") { result = "妇产科用手术器械"; }
  else if (class_code == "13") { result = "计划生育手术器械"; }
  else if (class_code == "15") { result = "注射穿刺器械"; }
  else if (class_code == "16") { result = "烧伤（整形）科手术器械"; }
  else if (class_code == "20") { result = "普通诊察器械"; }
  else if (class_code == "21") { result = "医用电子仪器设备"; }
  else if (class_code == "22") { result = "医用光学器具、仪器及内窥镜设备"; }
  else if (class_code == "23") { result = "医用超声仪器及有关设备"; }
  else if (class_code == "24") { result = "医用激光仪器设备"; }
  else if (class_code == "25") { result = "医用高频仪器设备"; }
  else if (class_code == "26") { result = "物理治疗及康复设备"; }
  else if (class_code == "27") { result = "中医器械"; }
  else if (class_code == "28") { result = "医用磁共振设备"; }
  else if (class_code == "30") { result = "医用X射线设备"; }
  else if (class_code == "31") { result = "医用X射线附属设备及部件"; }
  else if (class_code == "32") { result = "医用高能射线设备"; }
  else if (class_code == "33") { result = "医用核素设备"; }
  else if (class_code == "34") { result = "医用射线防护用品、装置"; }
  else if (class_code == "40") { result = "临床检验分析仪器"; }
  else if (class_code == "41") { result = "医用化验和基础设备器具"; }
  else if (class_code == "45") { result = "体外循环及血液处理设备"; }
  else if (class_code == "46") { result = "植入材料和人工器官"; }
  else if (class_code == "54") { result = "手术室、急救室、诊疗室设备及器具"; }
  else if (class_code == "55") { result = "口腔科设备及器具"; }
  else if (class_code == "56") { result = "病房护理设备及器具"; }
  else if (class_code == "57") { result = "消毒和灭菌设备及器具"; }
  else if (class_code == "58") { result = "医用冷疗、低温、冷藏设备及器具"; }
  else if (class_code == "63") { result = "口腔科材料"; }
  else if (class_code == "64") { result = "医用卫生材料及敷料"; }
  else if (class_code == "65") { result = "医用缝合材料及粘合剂"; }
  else if (class_code == "66") { result = "医用高分子材料及制品"; }
  else if (class_code == "70") { result = "医用软件"; }
  else if (class_code == "77") { result = "介入器材"; }
  else { result = "未知" }
  return result;
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*ajax发送 */
function sendAjax(url, data, callback){
  wx.request({
    url: url,
    data: data,
    method:'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    },
    error:function(res){
      console.log(res);
    }
  })
}
/*关键词变色 */
function changeColor(str,key){
  let patt = /[a-zA-Z]/;
  let name_highlighted_html = '';
  let keyArr = key.split(" ");
  if(keyArr.length > 1){
    name_highlighted_html = str;
    for (var i = 0; i < keyArr.length; i++) {
      if (keyArr[i] != "") {
        var reg = new RegExp(keyArr[i], "g");
        name_highlighted_html = name_highlighted_html.replace(reg, "<em style='color:#f39800;font-style: normal;'>" + keyArr[i] + "</em>");
      }
    }
  }else{
    if (patt.test(key)) {
      var reg = new RegExp(key, "g");
      name_highlighted_html = str.replace(reg, "<em style='color:#f39800;font-style: normal;'>" + key + "</em>");
    } else {
      for (var j = 0; j < str.length; j++) {
        var val = str.substring(j, j + 1);
        if (key.indexOf(val) >= 0) {
          name_highlighted_html = name_highlighted_html + "<em style='color:#f39800;font-style: normal;'>" + val + "</em>";
        } else {
          name_highlighted_html = name_highlighted_html + val;
        }
      }
    }
  }
  return name_highlighted_html;
}
function sendAjaxForCount(url, data) {
  var count = 0;
  wx.request({
    url: url,
    data: data,
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        //callback(res.data);
        let data = res.data;
        count = data.matchCount;
      }
    },
    error: function (res) {
      console.log(res);
    }
  })
  return count;
}
module.exports = {
  formatTime: formatTime,
  getSearchPro: getSearchPro,
  getSearchCom: getSearchCom,
  insertSearchInfo: insertSearchInfo,
  getMain_class: getMain_class,
  getSrc_loc: getSrc_loc,
  getClass_code: getClass_code,
  getIndexByPicker: getIndexByPicker,
  getPickerNameByIndex: getPickerNameByIndex,
  getText: getText,
  getMaxIndex: getMaxIndex,
  transferDate: transferDate,
  getProByCom: getProByCom,
  getZBGGByCom: getZBGGByCom,
  getSearch_Hos: getSearch_Hos,
  parseDate:parseDate,
  sendAjax:sendAjax,
  changeColor: changeColor,
  sendAjaxForCount: sendAjaxForCount
}