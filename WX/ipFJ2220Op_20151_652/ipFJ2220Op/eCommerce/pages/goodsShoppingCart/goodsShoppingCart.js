
var app = getApp()

Page({
  data: {
    currentLocationData: '',
    deliveryMethod: -1,
    editing: false,
    priceToPay: 0.00,
    goodsList: [],
    unableData: [],
    selectAll: false,
    timeout: null,
    isFromBack: false,
    notBussinessTimeGoodId: [],
    showDeleteWindow: false,
    goodsShoppingCartId: '',
    showFastGoods: true,
    showSettlementMask: false
  },
  franchiseeId: '',
  isFromUserCenterEle: '',
  onLoad: function(options){
    this.franchiseeId = options.franchisee || '';
    this.isFromUserCenterEle = options.from || '';
    this.goodsScanCode = options.goodsScanCode;
    this.dataInitial();
  },
  onShow: function(){
    if(this.data.isFromBack){
      this.dataInitial();
      this.setData({
        selectAll: false
      });
    } else {
      this.setData({
        isFromBack: true
      });
    }
  },
  onReady: function(){
    if (this.goodsScanCode) {
      this.scanShopping();
    }
  },
  dataInitial: function(){
    this.getShoppingCartData();
    this.getAppECStoreConfig();
    this.getCurrentLocation();
  },
  getAppECStoreConfig: function () {
    app.getAppECStoreConfig((res) => {
      this.setData({
        cartConfig: res.cart_config,
        storeStyle: res.color_config,
        tabExpress: res.express,
        tabIntraCity: res.intra_city,
        tabDelivery: res.is_self_delivery
      })
    }, this.franchiseeId);
  },
  getShoppingCartData: function(){
    var that = this,
        franchiseeId = this.franchiseeId,
        fromUserCenterEle = this.data.isFromUserCenterEle;

    // 获取购物车列表时 传sub_shop_app_id获取
    app.sendRequest({
      url: '/index.php?r=AppShop/cartList',
      data: {
        page: 1,
        page_size: 1000,
        sub_shop_app_id: fromUserCenterEle ? '' : franchiseeId,
        parent_shop_app_id: franchiseeId ? app.getAppId() : ''
      },
      success: function(res){
        let data = res.data;
        let goodsList = [];
        data && data.map((item) => {
          if (item.goods_type == 0){
            goodsList.push(item);
          } 
        })
        for (let i = 0; i < goodsList.length;i++) {
          var modelArr = goodsList[i].model_value;
 
          if(modelArr && modelArr.join){
            goodsList[i].model_value_str = modelArr.join('；');
          }
        }
        that.copyGoodsList = goodsList;
        that.setData({
          goodsList: goodsList,
          unableData: res.unable_data
        });
        that.clickSelectAll();
        that.getTostoreNotBusinessTime();
        that.recalculateCountPrice();
      }
    })
  },
  switchToEdit: function(){
    this.setData({
      editing: true
    })
  },
  editComplete: function(){
    this.setData({
      editing: false
    })
  },
  clickSelectAll: function(){
    let alreadySelect = this.data.selectAll;
    let list = this.data.goodsList;

    if(alreadySelect){
      for (var i = list.length - 1; i >= 0; i--) {
        list[i].selected = false;
      }
    } else {
      for (var i = list.length - 1; i >= 0; i--) {
        list[i].selected = true;
      }
    }
    this.setData({
      selectAll: !alreadySelect,
      goodsList: list
    })
    this.recalculateCountPrice();
  },
  getTostoreNotBusinessTime: function (payIdArr , sucfn){
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/precheckShoppingCart',
      method: 'post',
      data: {
        sub_shop_app_id: that.franchiseeId,
        cart_arr: payIdArr || '',
        parent_shop_app_id: that.franchiseeId ? app.getAppId() : ''
      },
      success: function (res) {
        sucfn && sucfn();
      },
      successStatusAbnormal: function(res){
        if(res.status == 1){
          var goodsId = res.expired_goods_arr || [],
              list = that.data.goodsList;
          if (goodsId && goodsId.length){
            for (var i = 0; i < goodsId.length; i++) {
              var id = goodsId[i].goods_id;
              for (var j = list.length - 1; j >= 0; j--) {
                if (id == list[j].goods_id) {
                  list[j].selected = false;
                }
              };
            }
            that.setData({
              selectAll: false,
              goodsList: list,
              notBussinessTimeGoodId: goodsId
            })
            that.recalculateCountPrice();   
          }
        }
      }
    })
  },
  clickSelectGoods: function(e){
    var index = e.currentTarget.dataset.index,
        list = this.data.goodsList,
        selectAll = true;

    list[index].selected = !list[index].selected;
    for (var i = list.length - 1; i >= 0; i--) {
      if(!list[i].selected){
        selectAll = false;
        break;
      }
    }
    this.setData({
      goodsList: list,
      selectAll: selectAll
    })
    this.recalculateCountPrice();
  },
  recalculateCountPrice: function(){
    var list = this.data.goodsList,
        totalCount = 0,
        price = 0;

    for (var i = list.length - 1; i >= 0; i--) {
      var goods = list[i];
      if(goods.selected){
        totalCount += +goods.num;
        price += +goods.price * +goods.num;
      }
    }

    this.setData({
      priceToPay: price.toFixed(2)
    })
  },
  goToPay: function(e){
    var franchiseeId = this.franchiseeId,
        cartIdArray = [],
        type = e.currentTarget.dataset.type,
        cartId = e.currentTarget.dataset.cartId,
        addressId = this.data.selectSameJourneyId;

    cartIdArray = cartId;
   
    var pagePath = '/eCommerce/pages/previewGoodsOrder/previewGoodsOrder?type=' + type +'&cart_arr=' + encodeURIComponent(cartIdArray);
    franchiseeId && (pagePath += '&franchisee=' + franchiseeId);
    type != 3 && addressId && (pagePath += '&addressId=' + addressId);

    this.closeSettlement();
    app.turnToPage(pagePath);
  },
  clickMinusButton: function(e){
    var index = e.currentTarget.dataset.index;
    this.changeGoodsNum(index, 'minus');
  },
  clickPlusButton: function(e){
    var index = e.currentTarget.dataset.index;
    this.changeGoodsNum(index, 'plus');
  },
  inputGoodsCount: function (e) {
    let index = e.target.dataset.index;
    let count = e.detail.value;

    if (count == '') {
      return;
    }

    if (count == 0) {
      app.showModal({
        content: '请输入大于0的数字',
      })
      return;
    }

    this.changeGoodsNum(index, 'number', count);
  },
  changeGoodsNum: function (index, type, numberCount){
    let goodsList = this.data.goodsList;
    let goods = goodsList[index],
        currentNum = +goods.num,
        targetNum,
        that = this,
        data = {},
        param;

    if (type == 'plus') {
      targetNum = currentNum + 1;
    } else if (type == 'minus') {
      targetNum = currentNum - 1;
      if (targetNum <= 0) {
        this.setData({
          singelDeleteId: goods.id
        })
        this.showDeleteWindow('singel');
        return;
      }
    } else {
      targetNum = numberCount
    }


    if (+targetNum > +goods.stock ){
      app.showModal({
        content: '库存不足'
      });
      return;
    }

    if (goods.form_data && goods.form_data.seckill_activity_id) {
      param = {
        goods_id: goods.goods_id,
        model_id: goods.model_id || '',
        num: targetNum,
        sub_shop_app_id: this.franchiseeId,
        is_seckill: goods.is_seckill == 1 ? 1 : '',
        message_notice_type: 1,
        form_data: goods.form_data
      };
    } else {
      param = {
        goods_id: goods.goods_id,
        model_id: goods.model_id || '',
        num: targetNum,
        sub_shop_app_id: this.franchiseeId,
        is_seckill: goods.is_seckill == 1 ? 1 : '',
        message_notice_type: 1
      };
    }

    app.sendRequest({
      url: '/index.php?r=AppShop/addCart',
      data: param,
      method: 'post',
      success: function (res) {
        goods.num = targetNum;
        that.setData({
          goodsList: goodsList
        });
        that.recalculateCountPrice();
      },
      successStatusAbnormal: function(res){
        app.showModal({
          content: res.data
        })
      }
    })
  },
  goToHomepage: function () {
    let router = app.getHomepageRouter();
    app.turnToPage('/pages/' + router + '/' + router, true);
  },
  scanShopping: function(){
    let _this = this;
    wx.scanCode({
      success: function(res){
        app.sendRequest({
          url: '/index.php?r=AppShop/addCartByGoodsCode',
          data: {
            code: res.result,
            sub_shop_app_id: _this.franchiseeId
          },
          success: function (res) {
            _this.afterSelectedGoods();
          }
        })
      },
      fail: function(res){
        app.showModal({
          content: '未检索到商品'
        })
      }
    })
  },
  scanMove: function(event){
    let y = event.changedTouches[0].clientY;
    let width = wx.getSystemInfoSync().windowWidth;
    let maxHeight = wx.getSystemInfoSync().windowHeight - 208 / 750 * width
    y = y < 0 ? 0 : (y > maxHeight ? maxHeight : y);
    this.setData({
      widowTop: y
    })
  },
  showDeleteWindow: function(type){
    this.setData({
      deleteType: type,
      showDeleteWindow: true
    })
  },
  cancelDelete: function (){
    this.setData({
      showDeleteWindow: false
    })
  },
  deleteGoods: function (e) {
    let that = this;
    let deleteIdArr = [],
        list = that.data.goodsList,
        listExcludeDelete = [],
        copyGoodsList = this.copyGoodsList,
        remainCopyGoodsList = [],
        franchiseeId = that.franchiseeId,
        fromUserCenterEle = that.data.isFromUserCenterEle,
        type = e.currentTarget.dataset.type,
        unableData = this.data.unableData;

    if (type == 'unable'){
      deleteIdArr.push(this.data.singelDeleteId);
      unableData.map((item) => {
        if (item.id != this.data.singelDeleteId) {
          listExcludeDelete.push(item);
        }
      })
    }else if(type == 'singel'){
      deleteIdArr.push(this.data.singelDeleteId);
      list.map((item) => {
        if (item.id != this.data.singelDeleteId){
          listExcludeDelete.push(item);
        }  
      })
      copyGoodsList.map((item) => {
        if (item.id != this.data.singelDeleteId) {
          remainCopyGoodsList.push(item);
        }
      })
    }else{
      list.map((item) => {
        if (item.selected) {
          deleteIdArr.push(+item.id);
        } else {
          listExcludeDelete.push(item);
        }
      })
      copyGoodsList.map((item) => {
        if (deleteIdArr.indexOf(+item.id) < 0) {
          remainCopyGoodsList.push(item);
        }
      })
    }

    if (!deleteIdArr.length) { return; }

    app.sendRequest({
      url: '/index.php?r=AppShop/deleteCart',
      method: 'post',
      data: {
        cart_id_arr: deleteIdArr,
        sub_shop_app_id: fromUserCenterEle ? '' : franchiseeId
      },
      success: function (res) {
        let newData = {};
        if (type == 'unable'){
          newData['unableData'] = listExcludeDelete;
        }else {
          that.copyGoodsList = remainCopyGoodsList;
          newData['goodsList'] = listExcludeDelete;
        }
        newData['showDeleteWindow'] = false;
        that.setData(newData);
        that.recalculateCountPrice();
      }
    });
  },
  deleteUnableGoods: function (event) {
    let index = event.currentTarget.dataset.index;
    let deleteId = this.data.unableData[index].id;
    this.showDeleteWindow('unable');
    this.setData({
      singelDeleteId: deleteId
    })
  },
  selectGoodsDetail: function(event){
    let newData = {
      goodsId: event.currentTarget.dataset.goodsId,
      franchisee: this.franchiseeId
    }
    this.selectComponent('#component-goodsShoppingCart').showDialog(newData);
  },
  afterSelectedGoods: function(){
    this.setData({
      selectAll: false
    })
    this.getShoppingCartData();
  },
  showFastGoods: function(){
    let _this = this;
    this.setData({
      showFastGoods: !_this.data.showFastGoods
    })
  },
  goCommodityDetail: function(event){
    app.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + event.currentTarget.dataset.id);
  },
  closeSettlement: function(){
    this.setData({
      showSettlementMask: false
    })
  },
  showSettlement: function(){
    let _this = this;
    let goodsList = this.data.goodsList;
    let goodsIds = [];
    let expressData = {
      goodsIds: [],
      totalPrice: 0
    };
    let sameCityData = {
      goodsIds: [],
      totalPrice: 0
    };
    let selfLiftData = {
      goodsIds: [],
      totalPrice: 0
    };
    let currentLocationData = this.data.currentLocationData;
    let selectSameJourney = this.data.selectSameJourney;
    let lat = selectSameJourney ? selectSameJourney.latitude : currentLocationData.location.lat;
    let lng = selectSameJourney ? selectSameJourney.longitude : currentLocationData.location.lng;
    let regionId = selectSameJourney ? selectSameJourney.address_info.district.id : currentLocationData.region_id;
    goodsList.map((item) => {
      if (item.selected) {
        if (item.pick_up_type.indexOf('1') >= 0){
          expressData.goodsIds.push(item.id);
          expressData.totalPrice += +item.price
        }
        if (item.pick_up_type.indexOf('2') >= 0) {
          sameCityData.goodsIds.push(item.id);
          sameCityData.totalPrice += +item.price
        }
        if (item.pick_up_type.indexOf('3') >= 0) {
          selfLiftData.goodsIds.push(item.id);
          selfLiftData.totalPrice += +item.price
        }
        goodsIds.push(+item.id);
      }
    })
    if (!goodsIds.length){
      app.showModal({
        content: '请选择商品'
      })
      return;
    }
    app.sendRequest({
      url: '/index.php?r=AppEcommerce/getCanUsePickUpTypeAtCart',
      method: 'post',
      data: {
        latitude: lat,
        longitude: lng,
        region_id: regionId,
        cart_id_arr: goodsIds,
      },
      success: function (res) {
        _this.setData({
          canUsePickUpType: res.data,
          intraCityData: res.data[2] && res.data[2].intra_city_data || '',
          showSettlementMask: true,
        })
      }
    });
  },
  stopPropagation: function(){
    
  },
  getCurrentLocation: function(){
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
            _this.setData({
              currentLocationData: res.data
            })
          }
        });
      },
      fail: function (res) {
        if (!_this.data.selectSameJourneyId){
          app.showModal({
            content: '无法获取当前位置，请选择地址',
            confirm: function () {
              _this.selectGoodsSameJourney();
            }
          })
        }
      }
    })
  },
  selectGoodsSameJourney: function(){
    let selectSameJourney = this.data.selectSameJourney;
    this.closeSettlement();
    app.turnToPage('/eCommerce/pages/goodsSameJourney/goodsSameJourney?sameJourneyId=' + (selectSameJourney ? selectSameJourney.id : '') + '&franchiseeId=' + this.franchiseeId);
  },
  addFavoriteGoods: function(e){
    let goodsList = this.data.goodsList;
    let goodsIds = [];
    let _this = this;
    goodsList.map((item) => {
      if (item.selected) {
        goodsIds.push(+item.goods_id);
      }
    })
    app.sendRequest({
      url: '/index.php?r=AppShop/addFavoriteGoods',
      method: 'post',
      data: {
        form_id: e.detail.formId,
        goods_ids: goodsIds,
        sub_shop_app_id: _this.franchiseeId
      },
      success: function (res) {
        app.showModal({
          content: '成功加入收藏夹'
        });
      }
    })
  },
  filterDeliveryMethod: function(e){
    let copyGoodsList = this.copyGoodsList;
    let type = e.currentTarget.dataset.type;
    let filterGoodsList = [];
    if(!copyGoodsList){return};
    if(type == -1){
      filterGoodsList = copyGoodsList;
    }else{
      copyGoodsList.map((item) => {
        if(item.pick_up_type.indexOf(type) >= 0){
          filterGoodsList.push(item);
        }
      })
    }
    this.setData({
      goodsList: filterGoodsList,
      deliveryMethod: type
    })
    this.recalculateCountPrice();
  },
  shoppingCartSwitch: function(){
    let _this = this;
    app.showModal({
      content: '将切换至基础版本购物车,可对到店、外卖商品进行结算',
      showCancel: true,
      confirm: function(){
        app.turnToPage('/eCommerce/pages/shoppingCart/shoppingCart?franchisee=' + _this.franchiseeId);
      }
    })
  }
})
