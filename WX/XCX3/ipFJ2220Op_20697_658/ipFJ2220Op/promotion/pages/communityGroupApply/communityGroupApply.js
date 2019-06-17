// promotion/pages/communityGroupApply.js
var app = getApp();
Page({
  data: {
    notices: '团长信息用于社区商品配送，请填写真实信息。',
    btnTitle: '提交申请',
    refuse: '',
    colonelInfo: {
      region_address: '请选择所在的地区',
      logo: 'https://cdn.jisuapp.cn/static/jisuapp_editor/images/zhichi-default.png',
      nick_name: '',
      phone: '',
      region_id: '',
      address_detail: '',
      longitude: '',
      latitude: '',
      housing_estate: ''
    },
    showLeader: false,
    explain: '',
    notice: true,
    showSuccessModal: false
  },
  fromPage: '',
  user_token: '',
  onLoad: function (options) {
    if (options.colonelInfo) {
      let colonelInfo = JSON.parse(decodeURIComponent(options.colonelInfo));
      this.setData({
        colonelInfo: colonelInfo
      })
    } else {
      this.setData({
        'colonelInfo.phone': app.globalData.getDistributorInfo.user_info ? app.globalData.getDistributorInfo.user_info.phone : '',
        'colonelInfo.logo': app.getUserInfo().cover_thumb ? app.getUserInfo().cover_thumb : '',
        'colonelInfo.nick_name': app.getUserInfo().nickname ? app.getUserInfo().nickname : '',
      })
    }
    if (options.fromPage) {
      this.fromPage = options.fromPage;
    }
    this.getShopExplain();
    this.getUserToken();
  },
  // 申请团长或修改申请信息
  apply: function () {
    let _this = this;
    if (this.data.colonelInfo.nick_name == '') {
      app.showModal({
        content: '请输入团长姓名或昵称'
      });
      return;
    }
    if (this.data.colonelInfo.phone == '' || this.data.colonelInfo.phone.length !== 11) {
      app.showModal({
        content: '请输入正确的手机号'
      });
      return;
    }
    if (this.data.colonelInfo.region_address == '请选择所在的地区' || this.data.colonelInfo.housing_estate == '' || this.data.colonelInfo.latitude == '' || this.data.colonelInfo.longitude == '') {
      app.showModal({
        content: '请输入要代理的小区'
      });
      return;
    }
    if (this.data.colonelInfo.address_detail == '') {
      app.showModal({
        content: '请填写详细的提货地址'
      });
      return;
    }
    if (this.data.colonelInfo.region_id == '') {
      app.showModal({
        content: '地区异常，请重新选择地区'
      });
      return;
    }
    this._applyRequest();
  },
  _applyRequest() {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/SaveDistributorExt',
      method: 'post',
      data: this.data.colonelInfo,
      success: res => {
        if (res.status == 0) {
          _this.setData({
            showSuccessModal: true
          })
        }
      }
    })
  },
  changeTagValue(e) {
    let target = e.target.dataset.id;
    switch (target) {
      case 'nick_name':
        this.setData({
          "colonelInfo.nick_name": e.detail.value
        });
        break;
      case 'phone':
        this.setData({
          "colonelInfo.phone": e.detail.value
        });
        break;
      case 'housing_estate':
        this.setData({
          "colonelInfo.housing_estate": e.detail.value
        });
        break;
      case 'address_detail':
        this.setData({
          "colonelInfo.address_detail": e.detail.value
        });
        break;
    }
  },
  chooseLocation() {
    app.turnToPage(`/promotion/pages/communityGroupSearchAddress/communityGroupSearchAddress`)
  },
  backToStatus: function () {
    if (this.fromPage != '') {
      app.turnToPage('/promotion/pages/communityGroupApplyStatus/communityGroupApplyStatus',1)
    } else {
      app.turnBack();
    }
  },
  getShopExplain: function () {
    let shopMessage = app.getCommunityActiveMessage();
    if (shopMessage != '') {
      this.setData({
        explain: shopMessage,
        showLeader: true
      })
    }
  },
  getUserToken: function() {
    this.user_token = app.getUserInfo().user_token;
  },
  // 修改头像
  modifyLogo() {
    app.chooseImage(res => {
      this.setData({
        "colonelInfo.logo": res[0]
      })
    })
  },
  showLeader: function () {
    let show = !this.data.showLeader;
    this.setData({
      showLeader: show
    })
  },
  closeNotice: function () {
    this.setData({
      notice: false
    })
  }
})