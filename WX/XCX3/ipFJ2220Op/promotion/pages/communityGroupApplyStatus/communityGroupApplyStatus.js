// promotion/pages/communityGroupApply.js
var app = getApp();
Page({
  data: {
    colonelInfo: {},
    showLeader: false,
    explain: '',
    showBtn: false
  },
  user_token: '',
  onLoad: function(options) {
    this.getShopExplain();
    this.getUserToken();
    this.initOrder();
  },
  onShow: function() {
    this.initApplyStatus();
  },
  initApplyStatus: function() {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/GetDistributorExtList',
      method: 'post',
      data: {
        leader_token: _this.user_token
      },
      success: function(res) {
        if (res.data.length && res.data[0].is_deleted == 1) {
          res.data[0].is_audit = 0;
        }
        _this.setData({
          colonelInfo: res.data[0]
        })
      }
    })
  },
  initOrder: function() {
    let _this = this;
    let data = {
      page: 1,
      page_size: 25,
    }
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/GetDistributionGroupOrderByleader',
      method: 'post',
      data: data,
      success: function(res) {
        if (res.data.length) {
          _this.setData({
            showBtn: true
          })
        }
      }
    })
  },
  getUserToken: function() {
    this.user_token = app.getUserInfo().user_token;
  },
  applyModify: function() {
    let colonelInfo = encodeURIComponent(JSON.stringify(this.data.colonelInfo));
    wx.navigateTo({
      url: `/promotion/pages/communityGroupApply/communityGroupApply?colonelInfo=${colonelInfo}`,
    })
  },
  showLeader: function() {
    let show = !this.data.showLeader;
    this.setData({
      showLeader: show
    })
  },
  getShopExplain: function () {
    let shopMessage = app.getCommunityActiveMessage();
    if (shopMessage != '') {
      this.setData({
        explain: shopMessage
      })
    }
  },
  turnToPage: function(e) {
    let type = e.currentTarget.dataset.type;
    if(type == 'order') {
      app.turnToPage('/promotion/pages/communityGroupOrder/communityGroupOrder')
    }else {
      app.turnToPage('/promotion/pages/communityGroupWriteOff/communityGroupWriteOff')
    }
  }
})