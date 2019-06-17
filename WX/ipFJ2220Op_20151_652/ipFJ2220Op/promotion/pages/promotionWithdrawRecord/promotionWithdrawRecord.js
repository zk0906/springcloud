
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    statusArray: [{statusName:'全部'}, {statusName:'申请中'}, {statusName:'申请通过'}, {statusName:'拒绝'}],
    showStatusList: false,
    selectStatus: -1,
    withdrawArr: [],
    hidefaildialog:true,
    failReason: '',
    singleRecord: {},
    feedbackText: ''
  },
  page: 1,
  isMore: 1,
  onLoad: function (options) {
    this.dataInitial();
  },
  dataInitial: function () {
    this.getWithdrawRecord();
  },
  toggleStatusList: function(){
    this.setData({
      showStatusList: !this.data.showStatusList
    })
  },
  previewImage: function (e) {
    let img = [];
    img.push(e.target.dataset.img)
    wx.previewImage({
      urls: img
    })
  },
  clickStatus: function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      showStatusList: false,
      selectStatus: index,
      withdrawArr: []
    })
    this.page = 1;
    this.getWithdrawRecord();
  },
  getWithdrawRecord: function(){
    var _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/getWithdrawList',
      data: {
        page: _this.page,
        status: _this.data.selectStatus
      },
      success: function (res) {
        for(let i in res.data){
          res.data[i].create_time = res.data[i].create_time.replace(/-/g, '.').slice(0,16);
        }
        _this.setData({
          withdrawArr: [..._this.data.withdrawArr,...res.data]
        })
        _this.isMore = res.is_more;
      }
    })
  },
  singleDetail:function(e){
    let info = e.currentTarget.dataset.info
    this.setData({
      singleRecord: info,
      hidefaildialog: false
    })
  },
  hideFailDialog:function(){
    this.setData({
      hidefaildialog: true
    })
  },
  stopPropagation:function(){},
  onReachBottom: function(){
    if(!this.isMore){return}
    this.page++;
    this.getWithdrawRecord();
  },
  withdrawScreenshot: function(event){
    let info = event.currentTarget.dataset.info
    app.turnToPage('/promotion/pages/promotionWithdrawScreenshot/promotionWithdrawScreenshot?images=' + info.transfered_img + '&feedbackId=' + info.id);
  },
  hideOrderBox: function(){
    this.setData({
      showStatusList: false
    })
  }
})
