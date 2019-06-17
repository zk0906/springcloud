
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    widthdrawData: '',
    hideOtherDialog: true,
    hideWithdrawSuccess: true,
    promotionInfo: '',
    withdrawWay: 'wechat'
    },
  
  onLoad: function (options) {
  },
  onShow:function(){
    this.dataInitial()
  },
  dataInitial: function () {
    this.getCommissionInfo();
    this.getPromotionInfo();
  },
  inputWithdrawCount: function(e){
    let value = e.detail.value;
    this.setData({
      withdrawCount: value
    });
  },
  withdrawToWechat: function(){
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/addWithdrawInfo',
      data: {
        withdraw: _this.data.withdrawCount,
        withdraw_type: 0
      },
      method: 'post',
      success: function (res) {
        _this.setData({
          withdrawCount: '',
          hideWithdrawSuccess: false
        })
        _this.getCommissionInfo();
      }
    })
  },
  stopPropagation: function () {
  },
  hideWithdrawSuccess: function () {
    this.setData({
      withdrawCount: '',
      hideWithdrawSuccess: true
    });
  },
  getCommissionInfo:function(){
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/getCommissionInfo',
      success: function (res) {
        that.setData({
          widthdrawData: res.data,
          nowCommission: parseFloat( (+res.data.unsure_commission + +res.data.can_withdraw_commission).toFixed(3) ),
          ToHitCommission: parseFloat( (+res.data.total_commission - +res.data.unsure_commission - +res.data.can_withdraw_commission - +res.data.withdrew_commission).toFixed(3) )
        })
      }
    })
  },
  getPromotionInfo:function(callback){
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/getDistributionInfo',
      success: function (res) {
        let transfer_type_value;
        if(res.data.transfer_type){
          if (res.data.transfer_type.length == 2){
            transfer_type_value = 'all'
          }else if (res.data.transfer_type[0] == '0'){
            transfer_type_value = 'wechat'
          } else {
            transfer_type_value = 'offline'
          }
        }else{
          transfer_type_value = 'wechat'
        }
        that.setData({
          promotionInfo: res.data,
          transfer_type_value: transfer_type_value
        })
        callback && callback(res)
      }
    })
  },
  withdraw:function(){
    let _this = this;
    let withdrawCount = +this.data.withdrawCount;
    if (this.data.widthdrawData.withdrew_times >= this.data.promotionInfo.withdraw_times_limit){
      app.showModal({
        content: '当月提现次数已超过限制',
        confirmColor: '#ff7100'
      })
      return;
    }
    if (!withdrawCount || isNaN(withdrawCount)){
      app.showModal({
        content: '请填写正确的提现金额',
        confirmColor: '#ff7100'
      })
      return;
    }
    if (!/(^[0-9]+\.[0-9]{1,2}$)|(^[1-9]$)|^[1-9][0-9]+$/.test(withdrawCount)) {
      app.showModal({
        content: '提现金额最多可保留小数点后两位',
        confirmColor: '#ff7100'
      })
      return;
    }
    if (withdrawCount > this.data.widthdrawData.can_withdraw_commission){
      app.showModal({
        content: '提现金额不足',
        confirmColor: '#ff7100'
      })
      return;
    }
    if (withdrawCount < this.data.promotionInfo.withdraw_requirement) {
      app.showModal({
        content: '提现金额需大于最小可提现金额',
        confirmColor: '#ff7100'
      })
      return;
    }
    if(this.data.withdrawWay === 'wechat'){
      this.withdrawToWechat();
    }else{
      app.turnToPage('/promotion/pages/promotionWithdrawOffline/promotionWithdrawOffline?withdrawCount=' + _this.data.withdrawCount);
    }
  },
  selectWithdrawWay: function(event){
    this.setData({
      withdrawWay: event.currentTarget.dataset.type
    })
  }
})
