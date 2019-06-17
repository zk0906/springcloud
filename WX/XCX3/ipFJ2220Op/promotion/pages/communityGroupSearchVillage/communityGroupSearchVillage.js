var app = getApp()

Page({
  data: {
    selectAddressId: '',
    addressList: [], //  附近自提点
    localAddress: '', //  当前定位地址
    regionStr: [],
    latitude: '',
    longitude: '',
    searchAddress: [],
    user_token: '',
    nowCommunityCity: ''
  },
  page: 1,
  isMore: 1,
  onLoad: function (options) {
    if (options.token) {
      this.setData({
        user_token: options.token
      })
    }
    this.getLocation();
  },
  initData: function () {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/GetDistributorExtList',
      method: 'post',
      data: {
        latitude: _this.data.latitude,
        longitude: _this.data.longitude,
        page: _this.page,
        is_audit: 1,
        filter_deleted: 1
      },
      success: function (res) {
        if(!res.data.length) return;
        for (let item of res.data) {
          if (item.distance >= 1000.00) {
            item.distance = (item.distance / 1000).toFixed(1) + 'KM';
          } else {
            item.distance = parseInt(item.distance) + 'M';
          }
        }
        let data = [..._this.data.addressList, ...res.data];
        let index = data.findIndex((item) => {
          return item.user_token == _this.data.user_token;
        })
        if(_this.data.nowCommunityCity == '' || index >= 0) {
          let nowCommunityCity = '';
          if(index >= 0) {
            nowCommunityCity = data[index];
            data.splice(index, 1);
          }else {
            nowCommunityCity = data[0];
            data.splice(0, 1);
          }
          _this.setData({
            nowCommunityCity: nowCommunityCity
          })
        }
        _this.isMore = res.is_more;
        _this.setData({
          addressList: data
        })
      }
    })
  },
  getLocation: function () {
    let _this = this;
    let location = app.globalData.locationInfo;
    if (location.latitude) {
      _this.setGlobalLocationInfo(location.latitude, location.longitude);
    } else {
      app.getLocation({
        success: (res) => {
          if (!res.latitude) {
            _this.setData({
              localAddress: '定位失败'
            })
            return;
          }
          _this.setGlobalLocationInfo(res.latitude, res.longitude);
        }
      })
    }
  },
  changeLocation: function () {
    let _this = this;
    app.chooseLocation({
      success: function (res) {
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          searchAddress: []
        })
        _this.setGlobalLocationInfo(res.latitude, res.longitude);
      }
    })
  },
  setGlobalLocationInfo: function (latitude, longitude, callback) {
    let _this = this;
    _this.page = 1;
    app.getAddressByLatLng({
      lat: latitude,
      lng: longitude
    }, (data) => {
      let lacalAddresss = data.data.address;
      let oldRegionStr = [data.data.ad_info.province, data.data.ad_info.city, data.data.ad_info.district];
      _this.setData({
        regionStr: oldRegionStr,
        localAddress: lacalAddresss,
        latitude: latitude,
        longitude: longitude
      });
      app.setLocationInfo({
        latitude: latitude,
        longitude: longitude,
        address: data.data.formatted_addresses.recommend,
        info: data.data
      });
      if (typeof callback == 'function') {
        callback && callback();
      } else {
        _this.setData({
          addressList: []
        })
        _this.initData();
      }
    })
  },
  changeHomeCommunity: function (e) {
    let location = e.currentTarget.dataset.parm;
    if (app.getNowGommunityToken() != location.user_token) {
      app.setCommunityGroupRefresh();
    }
    this.setCommunityToken(location.user_token);
    app.turnBack();
  },
  userCenterTurnToPage: function (e) {
    app.userCenterTurnToPage(e);
  },
  setCommunityToken: function (token) {
    app.setNowGommunityToken(token);
  }
})