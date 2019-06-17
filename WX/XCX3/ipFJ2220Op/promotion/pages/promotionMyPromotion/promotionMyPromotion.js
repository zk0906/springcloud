 
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    customer: ''
  },
  onLoad: function (options) {
    this.dataInitial()

  },
  dataInitial: function () {
    this.getMyPromotionInfo()
  },
  previewImage: function(e){
    app.previewImage({
      current: e.currentTarget.dataset.src
    })
  },
  getMyPromotionInfo:function(){
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/getMyPromotionInfo',
      success: function (res) {
        that.setData({
          customer: res.data
        })
      }
    })
  }
})
