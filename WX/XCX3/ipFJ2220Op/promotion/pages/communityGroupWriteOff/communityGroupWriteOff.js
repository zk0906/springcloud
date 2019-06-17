var app = getApp();
Page({
  data: {
    codeArr: [],
    code: ''
  },
  onLoad: function(options) {},
  searchWrite: function(e) {
    let _this = this;
    let value = typeof e == 'object' ? e.detail.value : e;
    if (value != '') {
      app.sendRequest({
        url: '/index.php?r=AppDistributionExt/GetOrderInfoByVerifyCode',
        method: 'post',
        data: {
          code: value
        },
        success: function(res) {
          _this.setData({
            codeArr: res.data,
            code: value
          })
        }
      })
    }
  },
  cancellation: function() {
    this.finishCode(this.data.code);
  },
  goToOrderDetail: function(e) {
    let orderId = e.currentTarget.dataset.id;
    let groupPath = '/promotion/pages/communityGroupOrderDetail/communityGroupOrderDetail?formGroup=group&detail=' + orderId;
    app.turnToPage(groupPath);
  },
  scan: function () {
    let _this = this;
    app.scanCode({
      success: function (res) {
        let data = JSON.parse(res.result);
        _this.searchWrite(data.code);
      }
    })
  },
  finishCode: function(code) {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/VerifyGroupOrder',
      method: 'post',
      data: {
        code: code
      },
      success: function(res) {
        app.showModal({
          content: '核销成功~',
          confirm: function() {
            _this.setData({
              code: '',
              codeArr: []
            })
          }
        })
      }
    })
  }
})