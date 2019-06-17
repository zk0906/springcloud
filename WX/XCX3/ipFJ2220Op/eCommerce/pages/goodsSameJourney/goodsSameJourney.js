var app = getApp();

Page({
  data: {
    centerLat: '',
    centerLng: '',
    addressListMakers: [],
    circles: [{
      latitude: '',
      longitude: '',
      fillColor: '#ff710033',
      radius: 2000
    }],
    sameJourneyId: '',
    notInRange: false
  },
  callout: {
    content: '门店地址',
    fontSize: 14,
    color: '#333333',
    borderRadius: 4,
    bgColor: '#ffffff',
    padding: 10,
    display: 'ALWAYS',
    textAlign: 'center'
  },
  franchiseeId: '',
  onLoad: function (options) {
    this.franchiseeId = options.franchiseeId || '';
    this.setData({
      from: options.from || '',
      sameJourneyId: options.sameJourneyId || ''
    })
    this.dataInitial();
  },
  onShow: function () {
    if(this.isBack){
      this.getAddressList();
    }
  },
  dataInitial: function () {
    this.getAppECStoreConfig();
    this.getAddressList();
    this.getCurrentLocation();
    this.getPickUpGoodsType();
  },
  getPickUpGoodsType: function () {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppEcommerce/getPickUpGoodsTypeSetting',
      data: {
        pick_up_type: 2,
        sub_shop_app_id: _this.franchiseeId
      },
      success: function (res) {
        if (!res.data.app_store_data){return};
        let centerLng = res.data.app_store_data.longitude;
        let centerLat = res.data.app_store_data.latitude;
        let addressListMakers = _this.data.addressListMakers;
        addressListMakers.push({
          latitude: centerLat,
          longitude: centerLng,
          iconPath: '/images/delivery.png',
          width: 20,
          height: 20
        })
        _this.setData({
          centerLng: centerLng,
          centerLat: centerLat,
          "circles[0].longitude": centerLng,
          "circles[0].latitude": centerLat,
          "circles[0].radius": +res.data.config_data.deliver_distance,
          addressListMakers: addressListMakers,
          showMap: true
        })
      }
    })
  },
  getAddressList: function () {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/addressList',
      data: {
        sub_shop_app_id: _this.franchiseeId
      },
      success: function (res) {
        let addressList = res.data;
        let addressListMakers = _this.data.addressListMakers;
        let notInRange = false;
        addressList.map((item) => {
          let iconPath;
          if (item.address_info.label == 0) {
            iconPath = 'http://cdn.jisuapp.cn/static/webapp/images/xcx-goods/same-city-home.png';
          } else if (item.address_info.label == 1) {
            iconPath = 'http://cdn.jisuapp.cn/static/webapp/images/xcx-goods/same-city-school.png';
          } else if (item.address_info.label == 2) {
            iconPath = 'http://cdn.jisuapp.cn/static/webapp/images/xcx-goods/same-city-company.png';
          } else {
            iconPath = 'http://cdn.jisuapp.cn/static/webapp/images/xcx-goods/same-city-other.png';
          }
          addressListMakers.push({
            latitude: item.latitude,
            longitude: item.longitude,
            iconPath: iconPath,
            width: 24,
            height: 28
          })
          if (item.config && item.config.intra_city != 1){
            notInRange = true;
          }
        })
        let sameJourneyId = _this.data.sameJourneyId ? _this.data.sameJourneyId : (addressList.length && addressList[0].id);
        _this.setData({
          notInRange: notInRange,
          addressList: addressList,
          sameJourneyId: sameJourneyId,
          addressListMakers: addressListMakers
        })
      }
    })
  },
  selectDelivery: function (event) {
    let index = event.currentTarget.dataset.index;
    let addressList = this.data.addressList;
    this.setData({
      sameJourneyId: addressList[index].id
    })
  },
  sureDelivery: function () {
    let _this = this;
    let sameJourneyId = this.data.sameJourneyId;
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    let addressList = this.data.addressList;

    if (!sameJourneyId){
      app.showModal({
        content: '请选择配送点'
      });
      return;
    }
    
    for (let i = 0; i < addressList.length; i++) {
      if (addressList[i].id == sameJourneyId) {
        prePage.setData({
          selectSameJourneyId: sameJourneyId,
          selectSameJourney: addressList[i],
          sameJourneyTimeType: '',
          sameJourneyDateTime: ''
        });
      }
    };
    app.turnBack();
  },
  getAppECStoreConfig: function () {
    app.getAppECStoreConfig((res) => {
      this.setData({
        storeStyle: res.color_config
      })
    }, this.franchiseeId);
  },
  getCurrentLocation: function () {
    let _this = this;
    wx.getLocation({
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        app.sendRequest({
          url: '/index.php?r=Map/getAreaInfoByLatAndLng',
          method: 'post',
          data: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            let addressListMakers = _this.data.addressListMakers;
            addressListMakers.push({
              latitude: latitude,
              longitude: longitude,
              iconPath: 'http://cdn.jisuapp.cn/static/webapp/images/xcx-goods/same-city-me.png',
              width: 20,
              height: 20
            })
            _this.setData({
              currentLocationData: res.data,
              addressListMakers: addressListMakers
            })
          }
        });
      }
    })
  },
  opratAddress: function () {
    this.isBack = true;
    app.turnToPage('/eCommerce/pages/myAddress/myAddress?from=form');
  }

})