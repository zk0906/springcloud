
var app = getApp()

Page({
  data: {
    nationListMap: [], // 国家列表字典
    nationSelectedIndex: 0, // 当前展示的国家索引下标
    nationList: [], // 国家名称列表
    nationId: 1, // 国家海外地图id (oversea_region_id)
    nationname: '', // 当前展示的国家名称
    regionInfoText: '', // 显示地区字符
    addressId: '',
    orderId: '',
    detail: '',
    isDefault: 0,
    selectAddressId: '',
    addressList: [],
    isFromBack: false,
    from: '',
    showNewAddressDialog: true,
    address_id: '',
    localAddress: '',
    address_info: {
      name: '',
      contact: '',
      country: {
        text: '',
        id: ''
      },
      province: {
        text: '',
        id: ''
      },
      city: {
        text: '',
        id: ''
      },
      district: {
        text: '',
        id: ''
      },
      detailAddress: '',
      sex: 1,
      label: 3,
    },
    selectRegion: [0, 0, 0],
    selectRegionId: [0, 0, 0]
  },
  selectAddressBack: false,
  onLoad: function(options){
    var newData = {};
    var id = options.id || '';
    newData.addressId = id;
    // 编辑地址信息时传入地址id
    var orderId = options.oid || '';
    newData.orderId = orderId;
    // 编辑地址
    var countryId = options.countryId || false;
    if (countryId !== false) { newData.nationId = countryId; };
    // 在商品订单详情页添加地址时 传入orderId
    if (id) { app.setPageTitle('编辑收货地址')};
    this.setData(newData);
    this.dataInitial();
  },
  onShow: function(){
    if (this.selectAddressBack){
      this.getAllPickUpConfig();
    }
  },
  dataInitial: function(){
    this.getAppECStoreConfig();
    let id = this.data.addressId;
    if(id){
      this.getAddressDetail(id);
    }
    this.getNationList();
  },
  getNationList: function () {
    var _this = this;
    app.sendRequest({
      url: '/index.php?r=Region/getNationList',
      data: {
        page: 1,
        page_size: 10
      },
      success: res => {
        let nationListMap = res.data.reverse();
        let nationList = nationListMap.map(it => it.nation_name);
        let nationSelectedIndex = nationListMap.findIndex(it => it.oversea_region_id == _this.data.nationId);
        let defaultNation = nationListMap[(~nationSelectedIndex ? nationSelectedIndex : 0)];
        _this.setData({
          nationListMap,
          nationList,
          nationSelectedIndex,
          nationId: defaultNation.oversea_region_id,
          nationname: defaultNation.nation_name
        });
      }
    })
  },
  getAllPickUpConfig: function(){
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppEcommerce/GetAllPickUpConfig',
      data: { 
        latitude: _this.location.lat,
        longitude: _this.location.lng
       },
      success: function (res) {
        _this.setData({
          suportExpress: res.data.config_data.express,
          suportSameCity: res.data.config_data.intra_city,
          suportSelfDelivery: res.data.config_data.is_self_delivery
        })
      }
    });
  },
  getAddressDetail: function(id){
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/GetAddressById',
      data: { address_id: id },
      success: function(res){
        var data = res.data;
        var addressInfo = data.address_info;
        var regionAry = [
            addressInfo.province && addressInfo.province.text || '',
            addressInfo.city && addressInfo.city.text || '',
            addressInfo.district && addressInfo.district.text || ''
          ],
          joinStr = '';

        if (regionAry[1] === regionAry[2] || regionAry[2] === '') {
          regionAry.pop();
        }
        if (data.address_info.country && data.address_info.country.id != 1) {
          joinStr = ' ';
        }
        that.setData({
          'address_info.name': addressInfo.name,
          'address_info.contact': addressInfo.contact || data.telphone,
          'address_info.country': addressInfo.country || {'text': '','id': ''},
          'nationId': addressInfo.country ? addressInfo.country.id || 1 : 1,
          'address_info.province': addressInfo.province || { 'text': '', 'id': '' },
          'address_info.city': addressInfo.city || {'text':'','id':''},
          'address_info.district': addressInfo.district || { 'text': '', 'id': '' },
          'address_info.detailAddress': addressInfo.detailAddress || data.detail_address,
          'address_info.sex': addressInfo.sex || 2,
          'address_info.label': addressInfo.label || 3,
          'address_info.regionInfoText': regionAry.join(joinStr)
        })
        that.location = {
          lat: data.latitude,
          lng: data.longitude
        }
        that.getAllPickUpConfig();
      }
    });
  },
  nameInput: function(e){
    this.setData({
      name: e.detail.value
    })
  },
  contactInput: function(e){
    this.setData({
      contact: e.detail.value
    })
  },
  detailInput: function(e){
    this.setData({
      detail: e.detail.value
    })
  },
  setAddress: function(addressId){
    var orderId = this.data.orderId;

    app.sendRequest({
      url: '/index.php?r=AppShop/setAddress',
      data: {
        order_id: orderId,
        address_id: addressId
      },
      success: function(res){
        app.turnBack();
      }
    });
  },
  setDefaultAddress: function(e){
    var checked = e.detail.value;
    if(checked){
      this.setData({
        isDefault: 1
      })
    } else {
      this.setData({
        isDefault: 0
      })
    }
  },
  sureAddAddress: function () {
    let _this = this;
    let addressInfo = _this.data.address_info;
    let addressId = _this.data.addressId;
    let nationIsChina = +_this.data.nationId === 1;
    if (!addressInfo.name) {
      app.showModal({
        content: '联系人不能为空',
      })
      return;
    }
    if (!addressInfo.contact) {
      app.showModal({
        content: '电话不能为空',
      })
      return;
    }
    if (nationIsChina && (!/^1[0-9]{10}$/.test(addressInfo.contact))) {
      app.showModal({
        content: '请填写正确的手机号',
      })
      return;
    }
    if (!(addressInfo.province && addressInfo.province.text)) {
      app.showModal({
        content: '请选择收货地址',
      })
      return;
    }
    if (!addressInfo.detailAddress) {
      app.showModal({
        content: '补充信息不能为空',
      })
      return;
    }
    let addressInfoCopy = JSON.parse(JSON.stringify(addressInfo));
    if (addressInfoCopy.detailAddress) {
      addressInfoCopy.detailAddress = addressInfoCopy.address + addressInfoCopy.detailAddress;
      let index = addressInfoCopy.detailAddress.indexOf("区");
      addressInfoCopy.detailAddress = addressInfoCopy.detailAddress.substring(index + 1, addressInfoCopy.detailAddress.length);
    }
    if (addressInfoCopy.address) { delete addressInfoCopy.address;}
    app.sendRequest({
      url: '/index.php?r=AppShop/addAddress',
      method: 'post',
      data: {
        address_info: addressInfo,
        address_id: addressId,
        is_default: 0
      },
      success: function (res) {
        app.showToast({
          title: '保存成功'
        })
        app.turnBack();
      },
      successStatusAbnormal: function(res){
        console.log(res);
        if (res.data == '获取经纬度失败'){
          app.showModal({
            content: '该地址定位不到，请检查地址是否正确'
          })
          return false;
        }
      }
    });
  },
  deleteAddress: function (e) {
    var _this = this;
    app.showModal({
      content: '确定要删除地址？',
      showCancel: true,
      confirmText: '确定',
      cancelText: '取消',
      confirm: function () {
        app.sendRequest({
          url: '/index.php?r=AppShop/delAddress',
          data: {
            address_id: _this.data.addressId
          },
          success: function (res) {
            app.turnBack();
          }
        })
      }
    })
  },

  addAdressName: function (e) {
    this.setData({
      'address_info.name': e.detail.value
    })
  },
  addAdressContact: function (e) {
    this.setData({
      'address_info.contact': e.detail.value
    })
  },
  addAdressDetailAddress: function (e) {
    this.setData({
      'address_info.detailAddress': e.detail.value
    })
  },
  selectAddressLabel: function (e) {
    this.setData({
      'address_info.label': e.currentTarget.dataset.label
    })
  },
  selectAddressSex: function (e) {
    this.setData({
      'address_info.sex': e.currentTarget.dataset.sex
    })
  },
  addSelectAddress: function () {
    app.turnToPage('/eCommerce/pages/searchAddress/searchAddress?from=addAddress&nationId=' + this.data.nationId + '&nationname=' + this.data.nationname);
  },
  getAppECStoreConfig: function () {
    app.getAppECStoreConfig((res) => {
      this.setData({
        storeStyle: res.color_config
      })
    });
  },
  getAppECStoreConfig: function () {
    app.getAppECStoreConfig((res) => {
      this.setData({
        storeStyle: res.color_config
      })
    });
  },
  selectNation: function (e) {
    var _this = this,
      index = e.detail.value,
      data = this.data.nationListMap[index];
    _this.setData({
      nationSelectedIndex: index,
      nationId: data.oversea_region_id,
      nationname: data.nation_name
    });
  }
})
