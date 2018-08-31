// pages/modal/modal.js
Page({

  data: {
    'modal_visiable': false,
    'text': '',
    'delete_button_visiable': false,//modal中的删除按钮是否可见
  },
  blank_modal: function () {
    this.setData({
      'modal_visiable': true,
      'text': '',
      'delete_button_visiable': true
    })
  },
  cancle: function () {
    this.setData({
      'modal_visiable': false
    })
  },
  input: function (e) {
    this.setData({
      'text': e.detail['value']
    })
    console.log(this.data.text)
  },

})