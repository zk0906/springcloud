
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    goodsArr: [],
    isHaveSecondCommission: false,
    currentType: 0,
    goodsName: '',
    tabIndex: 0,
    communityArr: [],
    is_audit: 0,
    status: ['未开始','进行中','已结束']
  },
  page: 1,
  isMore: 1,
  user_token: '',
  onLoad: function (options) {
    this.setData({
      is_audit: options.is_audit ? options.is_audit : 0
    })
    this.dataInitial()
  },
  onShow: function () {
    if (this.data.tabIndex == 1) {
      this.page = 1;
      this.setData({
        communityArr: [],
      })
      this.getCommunityList();
    }
  },
  dataInitial: function () {
    this.getCommissionGoodsList();
    this.getUserToken();
  },
  getCommissionGoodsList: function () {
    var _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/getCommissionGoodsList',
      method: 'post',
      data: {
        page: _this.page,
        goods_type: _this.data.currentType,
        idx_arr: {
          idx: 'title',
          idx_value: _this.data.goodsName
        }
      },
      success: function (res) {
        for (let i in res.data) {
          res.data[i].first_commission = (+res.data[i].first_commission).toFixed(3);
          res.data[i].second_commission ? res.data[i].second_commission = (+res.data[i].second_commission).toFixed(3) : '';
        }
        _this.isMore = res.is_more;
        _this.setData({
          goodsArr: [..._this.data.goodsArr, ...res.data],
          isHaveSecondCommission: res.data[0] && res.data[0].second_commission ? true : false
        })
      }
    })
  },
  changeMenu: function (e) {
    let currentType = e.currentTarget.dataset.type
    this.page = 1;
    this.setData({
      goodsArr: [],
      goodsName: '',
      currentType: currentType
    })
    this.getCommissionGoodsList()
  },
  onReachBottom: function () {
    if (!this.isMore) { return };
    this.page++;
    if (this.data.tabIndex == 0) {
      this.getCommissionGoodsList();
    } else {
      this.getCommunityList();
    }
  },
  searchGoods: function (event) {
    this.page = 1;
    this.setData({
      goodsArr: [],
      goodsName: event.detail.value
    })
    this.getCommissionGoodsList();
  },
  changeTab: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index,
    })
    if (index == 1) {
      this.page = 1;
      this.setData({
        communityArr: [],
      })
      this.getCommunityList();
    }
  },
  getCommunityList: function () {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/GetAppDistributionGroupList',
      method: "post",
      data: {
        page: _this.page,
        page_size: 20,
        status: 1
      },
      success: function (res) {
        if (res.status == 0) {
          let data = res.data;
          for (let item of data) {
            item.start_date = item.start_date.replace(/\-/g, '.');
            item.end_date = item.end_date.replace(/\-/g, '.');
          }
          data = [..._this.data.communityArr, ...res.data];
          _this.isMore = res.is_more;
          _this.setData({
            communityArr: data
          })
        }
      }
    })
  },
  addCommunityGoods: function (e) {
    let dataset = e.currentTarget.dataset;
    let openStatus = dataset.openStatus;
    let param = {
      group_id: dataset.id,
      agent_goods_ids: dataset.agentGoodsIds,
      title: dataset.title,
      start_date: dataset.startDate,
      end_date: dataset.endDate,
      illustration: dataset.illustration,
      card_info: dataset.cardInfo,
      banner: dataset.banner
    }
    param = encodeURIComponent(JSON.stringify(param));
    if (openStatus) {
      wx.navigateTo({
        url: `/promotion/pages/communityGroupAddGoods/communityGroupAddGoods?param=${param}&user_token=${this.user_token}`
      })
    }
  },
  getUserToken: function () {
    this.user_token = app.getUserInfo().user_token;
  }
})
