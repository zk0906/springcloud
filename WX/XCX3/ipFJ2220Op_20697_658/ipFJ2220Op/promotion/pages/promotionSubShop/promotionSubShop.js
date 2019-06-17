// promotion/pages/promotionSubShop/promotionSubShop.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: [],
    shopListParam: {
      loading: false,
      isMore: true,
      loadingFail: false,
      page: 1
    },
    searchValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAppShopList();
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.refreshShopList(true);
  },
  // 上拉加载
  onReachBottom: function () {
    this.getAppShopList();
  },
  // 获取店铺列表
  getAppShopList: function () {
    let {
      shopList,
      shopListParam: {
        loading,
        isMore,
        page
      },
      searchValue
    } = this.data;

    if (!isMore || loading) {
      return;
    }

    this.setData({
      ['shopListParam.loading']: true
    });

    let param = {
      page,
      is_dis_sub_shop: 1,
      is_dis_sub_shop_audit: 1,
      orderby: 'weight'
    };
    let that = this;

    param.page_size = page === 1 ? 10 : 20;
    if (searchValue = searchValue.trim()) {
      param.name = searchValue;
    }

    app.sendRequest({
      url: '/index.php?r=AppShop/GetAppShopByPage',
      method: 'POST',
      data: param,
      success: function ({data, current_page, is_more}) {

        if (page === 1) {
          shopList = data;
        }else {
          shopList = shopList.concat(data);
        }

        page = current_page + 1;
        isMore = is_more == 1;

        that.setData({
          shopList,
          ['shopListParam.loading']: false,
          ['shopListParam.isMore']: isMore,
          ['shopListParam.page']: page
        });
        wx.stopPullDownRefresh();
      },
      fail: function () {
        that.setData({
          ['shopListParam.loading']: false,
          ['shopListParam.loadingFail']: true
        });
        wx.stopPullDownRefresh();
      }
    })
  },
  // 刷新店铺列表
  refreshShopList: function (withSearchValue) {
    let newdata = {
      shopListParam: {
        loading: false,
        isMore: true,
        loadingFail: false,
        page: 1,
      }
    }
    if (!withSearchValue) {
      newdata.searchValue = '';
      this.searchValue = '';
    }
    this.setData(newdata);
    this.getAppShopList();
  },
  searchValue: '',
  // 搜索输入事件
  searchInputHandle: function (e) {
    let value = e.detail.value;
    this.searchValue = value;
    this.setData({
      searchValue: value
    });
  },
  // 搜索确认事件
  searchConfirmHandle: function () {
    let {searchValue} = this.data;
    if (searchValue !== this.searchValue) {
      this.setData({
        searchValue: this.searchValue
      });
    }
    this.refreshShopList(true);
  },
  // 清除搜索输入
  clearInputHandle: function () {
    this.setData({
      searchValue: ''
    });
    this.refreshShopList(true);
  },
  // 跳转子店详情页
  turnToFranchiseeDetail: function (event) {
    let dataset = event.currentTarget.dataset;
    let appid = dataset.appid;
    let mode = dataset.mode;

    app.goToFranchisee(mode, {detail: appid});
  }
})
