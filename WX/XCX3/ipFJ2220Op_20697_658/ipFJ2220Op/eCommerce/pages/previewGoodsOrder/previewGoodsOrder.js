var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    goodsList: [],
    selectAddress: '',
    discountList: [],
    selectDiscountInfo: {},
    orderRemark: '',
    express_fee: '',
    balance: '',
    useBalance: true,
    deduction: '',
    discount_cut_price: '',
    original_price: '',
    totalPayment: '',
    storeConfig: '',
    noAdditionalInfo: true,
    is_group:'',
    limit_buy: '',
    teamToken: '',
    exchangeCouponData: {
      dialogHidden: true,
      goodsInfo: {},
      selectModelInfo: {},
      hasSelectGoods: false,
      voucher_coupon_goods_info: {}
    },
    cashOnDelivery: false,
    selectDelivery: '',
    hasRequiredSuppInfo: false,
    additional_info: {},
    showPickMask: false,
    pickUpType: '',
    isShowSameJourneyTime: false
  },
  isFromSelectAddress: false,
  franchisee_id: '',
  cart_id_arr: [],
  cart_data_arr: [],
  requesting: false,
  is_group:'',
  inputTimer: '',
  onLoad: function (options) {
    let teamToken = options.team_token || '';
    let group_buy_people = options.group_buy_people || 0;
    let limit_buy = options.limit_buy || '';
    let pickUpType = options.type || '';
    let addressId = options.addressId || '';

    this.franchisee_id = options.franchisee || '';
    this.cart_id_arr = options.cart_arr ? decodeURIComponent(options.cart_arr).split(',') : [];
    this.is_group = options.is_group || '';

    this.selectPickMethod('first');
    if(pickUpType == 3){
      this.getSelfDeliveryList();
    }

    this.setData({ 
      pickUpType: pickUpType,
      sameJourneyTimeType: pickUpType == 2 ? 1 : '',
      selectSameJourneyId: pickUpType == 2 ? addressId : '',
      selectAddressId: pickUpType == 1 ? addressId : '', 
      limit_buy: limit_buy,
      is_group: this.is_group,
      teamToken: teamToken,
      group_buy_people: group_buy_people
    });
    this.dataInitial();
  },
  dataInitial: function () {
    this.getAppECStoreConfig();
    this.getCartList();
  },
  onShow: function(){
    if(this.isFromSelectAddress){
      this.getCalculationInfo();
      this.isFromSelectAddress = false;
    }
    if(this.onlyImme){
      this.showServiceTime('onlyImme');
      this.onlyImme = false;
    }
  },
  getCartList: function () {
    var _this = this,
        franchisee_id = this.franchisee_id;

    app.sendRequest({
      url: '/index.php?r=AppShop/cartList',
      data: {
        page: 1,
        page_size: 100,
        sub_shop_app_id: franchisee_id,
        parent_shop_app_id: franchisee_id ? app.globalData.appId : ''
      },
      success: function(res){
        var data = [];
        if(_this.cart_id_arr.length){
          for (var i = 0; i <= res.data.length - 1; i++) {
            if(_this.cart_id_arr.indexOf(res.data[i].id) >= 0){
              data.push(res.data[i]);
            }
          }
        } else {
          data = res.data;
        }

        for (var i = 0; i <= data.length - 1; i++) {
          var goods = data[i],
              modelArr = goods.model_value;
          goods.model_value_str = modelArr && modelArr.join ? modelArr.join('； ') : '';
          _this.cart_data_arr.push({
            cart_id: goods.id,
            goods_id: goods.goods_id,
            model_id: goods.model_id,
            num: goods.num
          });
        }
        _this.setData({
          goodsList: data
        });
      }
    })
  },
  getCalculationInfo: function(){
    var _this = this;

    app.sendRequest({
      url: '/index.php?r=AppShop/calculationPrice',
      method: 'post',
      data: {
        new: 1,
        sub_shop_app_id: this.franchisee_id,
        address_id: this.data.pickUpType == 1 ? this.data.selectAddressId : this.data.selectSameJourneyId,
        cart_id_arr: this.cart_id_arr,
        is_balance: this.data.useBalance ? 1 : 0,
        pick_up_type: this.data.pickUpType,
        selected_benefit: this.data.selectDiscountInfo,
        voucher_coupon_goods_info: this.data.exchangeCouponData.voucher_coupon_goods_info
      },
      success: function(res){
        let  info = res.data;
        let  benefits = info.can_use_benefit;
        let  goods_info = info.goods_info;
        let  additional_info_goods = [];
        let  selectDiscountInfo = info.selected_benefit_info;
        let  suppInfoArr = [];
        let  additional_goodsid_arr = [];

        // 不在配送范围内直接弹窗
        if (_this.data.pickUpType == 2 && info.intra_city_status_data && info.intra_city_status_data.in_distance == 0){
          app.showModal({
            content: '地址不在配送范围内',
            confirmText: '去更换',
            cancelText: '返回',
            showCancel: true,
            confirm: function () {
              _this.goSameJourneyAddress();
            },
            cancel: function () {
              app.turnBack();
            }
          });
          return;
        }

        let goodsBenefitsData = [];
        benefits.coupon_benefit && benefits.coupon_benefit.length ? goodsBenefitsData.push({ label: 'coupon', value: benefits.coupon_benefit }) : '';
        benefits.all_vip_benefit && benefits.all_vip_benefit.length ? goodsBenefitsData.push({ label: 'vip', value: benefits.all_vip_benefit }) : '';
        Array.isArray(benefits.integral_benefit) ? '' : benefits.integral_benefit && goodsBenefitsData.push({ label: 'integral', value: [benefits.integral_benefit] });

        // 优惠券：兑换券操作
        if(selectDiscountInfo.discount_type == 'coupon' && selectDiscountInfo.type == 3 && _this.data.exchangeCouponData.hasSelectGoods == false ){
          _this.exchangeCouponInit(parseInt(selectDiscountInfo.value));
        }

        for (var i = 0; i <= goods_info.length - 1; i++) {
          if(goods_info[i].delivery_id && goods_info[i].delivery_id != 0 && additional_goodsid_arr.indexOf(goods_info[i].id) == -1){
            suppInfoArr.push(goods_info[i].delivery_id);
            additional_goodsid_arr.push(goods_info[i].id);
            additional_info_goods.push(goods_info[i]);
          }
        }
        if (suppInfoArr.length && !_this.data.deliverydWrite){
          _this.getSuppInfo(suppInfoArr);
        }
        _this.setData({
          selectAddress: _this.data.pickUpType == 1 && info.address,
          selectSameJourney: _this.data.pickUpType == 2 && info.address,
          discountList: goodsBenefitsData,
          selectDiscountInfo: selectDiscountInfo,
          express_fee: info.express_fee,
          discount_cut_price: info.discount_cut_price,
          balance: info.balance,
          deduction: info.use_balance,
          original_price: info.original_price,
          totalPayment: info.price,
          canCashDelivery: info.is_pay_on_delivery,
          cashOnDelivery: info.price > 0 ? _this.data.cashOnDelivery : false,
          selfPayOnDelivery: info.self_pay_on_delivery,
          additional_goodsid_arr: additional_goodsid_arr,
          sameJourneyImmediatlyTime: info.intra_city_status_data && info.intra_city_status_data.deliver_time
        })
        app.setPreviewGoodsInfo(additional_info_goods);
      }
    });
  },
  getAppECStoreConfig: function () {
    app.getAppECStoreConfig((res) => {
      this.setData({
        storeConfig: res,
        storeStyle: res.color_config
      })
    }, this.franchisee_id);
  },
  remarkInput: function (e) {
    var value = e.detail.value;

    this.setData({
      orderRemark: value
    });
  },
  previewImage: function (e) {
    app.previewImage({
      current: e.currentTarget.dataset.src
    });
  },
  clickMinusButton: function(e){
    var index = e.currentTarget.dataset.index,
        goods = this.data.goodsList[index];
    if(+goods.num <= 0) return;
    this.changeGoodsNum(index, 'minus');
  },
  clickPlusButton: function(e){
    var index = e.currentTarget.dataset.index,
        goods = this.data.goodsList[index];
    if(this.data.limit_buy !== '' && +goods.num >= this.data.limit_buy) return;
    this.changeGoodsNum(index, 'plus');
  },
  changeGoodsNum: function(index, type){
    var goods = this.data.goodsList[index],
        currentNum = +goods.num,
        targetNum = type == 'plus' ? currentNum + 1 : (type == 'minus' ? currentNum - 1 : Number(type)),
        _this = this,
        data = {},
        param;

    if(targetNum == 0 && type == 'minus'){
      app.showModal({
        content: '确定从购物车删除该商品？',
        showCancel: true,
        confirm: function(){
          _this.cart_data_arr[index].num = targetNum;
          data['goodsList['+index+'].num'] = targetNum;
          _this.setData(data);
          _this.deleteGoods(index);
        }
      })
      return;
    }

    param = {
      goods_id: goods.goods_id,
      model_id: goods.model_id || '',
      num: targetNum,
      sub_shop_app_id: _this.franchisee_id,
      is_seckill : goods.is_seckill == 1 ? 1 : ''
    };
    if(this.data.is_group){
      param.is_group_buy = this.data.is_group ? 1 : 0;
      param.num_of_group_buy_people = this.data.group_buy_people;
      param.team_token = this.data.teamToken;
    }
    app.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/addCart',
      data: param,
      success: function(res){
        _this.cart_data_arr[index].num = targetNum;
        data['goodsList['+index+'].num'] = targetNum;
        data.selectDiscountInfo = '';
        data.exchangeCouponData = {
          dialogHidden: true,
          hasSelectGoods: false,
          voucher_coupon_goods_info: { }
        };
        _this.setData(data);
        _this.getCalculationInfo();
      },
      fail: function(res){
        data = {};
        _this.cart_data_arr[index].num = currentNum;
        data['goodsList['+index+'].num'] = currentNum;
        _this.setData(data);
      }
    })
  },
  deleteGoods: function(index){
    var goodsList = this.data.goodsList,
        _this = this,
        listExcludeDelete;

    app.sendRequest({
      url : '/index.php?r=AppShop/deleteCart',
      method: 'post',
      data: {
        cart_id_arr: [this.cart_data_arr[index].cart_id],
        sub_shop_app_id: this.franchisee_id
      },
      success: function(res){
        (listExcludeDelete = goodsList.concat([])).splice(index, 1);
        if(listExcludeDelete.length == 0){
          app.turnBack();
          return;
        }

        var deleteGoodsId = goodsList[index],
            noSameGoodsId = true;

        for (var i = listExcludeDelete.length - 1; i >= 0; i--) {
          if(listExcludeDelete[i].id == deleteGoodsId){
            noSameGoodsId = false;
            break;
          }
        }
        if(noSameGoodsId && _this.data.additional_info){
          let a =  delete _this.data.additional_info[deleteGoodsId];
          _this.setData({
            additional_info: a
          })
        }
        _this.cart_data_arr.splice(index, 1);
        _this.setData({
          goodsList: listExcludeDelete,
          selectDiscountInfo: '',
          exchangeCouponData: {
            dialogHidden: true,
            hasSelectGoods: false,
            voucher_coupon_goods_info: {}
          }
        })
        _this.getCalculationInfo();
      }
    });
  },
  confirmPayment: function(e){
    var _this = this,
        selected_benefit = this.data.selectDiscountInfo,
        tostoreOrderType = this.data.tostoreOrderType;

        if(this.data.pickUpType == 1 && !this.data.selectAddress){
          app.showModal({
            content: '请完善地址信息',
            confirmText: '去填写',
            confirm: function () {
              _this.goToMyAddress();
            }
          });
          return;
        }

        if (this.data.pickUpType == 2 && !this.data.selectSameJourney) {
          app.showModal({
            content: '请选择同城地址',
            confirmText: '去填写',
            confirm: function () {
              _this.goSameJourneyAddress();
            }
          });
          return;
        }

        if (this.data.pickUpType == 2 && !this.data.sameJourneyDateTime && this.data.sameJourneyTimeType != 1) {
          app.showModal({
            content: '请选择取货时间'
          });
          return;
        }
    
        if (this.data.pickUpType == 3 && !this.data.selectDelivery) {
          app.showModal({
            content: '请选择上门自提地址',
            confirmText: '去填写',
            confirm: function () {
              _this.toDeliveryList();
            }
          });
          return;
        }
        
        if (this.data.pickUpType == 3 && this.data.selfAppointmentSwitch && !tostoreOrderType){
          app.showModal({
            content: '请选择取货时间'
          });
          return;
        }
        let year = new Date().getFullYear();
        let tostoreDateTime = year + '-' +this.data.tostoreDateTime + ' ' + (this.data.tostoreHourTime || '');

        if (this.data.pickUpType == 3 && this.data.selfDeliveryPhone == 1 && !util.isPhoneNumber(this.data.phone)) {
          app.showModal({
            content: '请输入正确的手机号'
          });
          return;
        }
      
        if (this.data.hasRequiredSuppInfo && !this.data.deliverydWrite && !this.data.aloneDeliveryShow){
          app.showModal({
            content: '商品补充信息未填写，无法进行支付',
            confirmText: '去填写',
            confirm: function(){
              _this.goToAdditionalInfo();
            }
          });
          return;
        }

        if (this.data.aloneDeliveryShow){
          let a = this.data.additional_info;
          let id = this.data.additional_goodsid_arr[0];
          if (a[id][0].is_required == 0 && a[id][0].value == ''){
            app.showModal({
              content: '请填写' + a[id][0].title,
              confirmText: '确认'
            });
            return;
          }
        }

    if(this.requesting){
      return;
    }
    this.requesting = true;

    app.sendRequest({
      url : '/index.php?r=AppShop/addCartOrder',
      method: 'post',
      data: {
        new: 1,
        cart_arr: this.cart_data_arr,
        formId: e.detail.formId,
        sub_shop_app_id: this.franchisee_id,
        selected_benefit: selected_benefit,
        is_balance: this.data.useBalance ? 1 : 0,
        ecommerce_info: {
          'ec_tostore_data': {
            'ec_tostore_order_type': tostoreOrderType,
            'ec_tostore_appointment_time': tostoreOrderType == 1 || !this.data.selfAppointmentSwitch ? '' : tostoreDateTime,
            'ec_tostore_buyer_phone': this.data.phone || '',
            'ec_tostore_appointment_time_type': this.data.tostoreTimeType || '',
            'ec_tostore_location_id': this.data.locationId || ''
          },
          'intra_city_data': {
            'intra_city_appointment_arrive_time': this.data.sameJourneyTimeType == 1 ? '' : this.data.sameJourneyDateTime
          },
        },
        pick_up_type: this.data.pickUpType,
        self_delivery_app_store_id: this.data.pickUpType == 3 ? this.data.selectDelivery.id: '',
        remark: this.data.orderRemark,
        address_id: this.data.pickUpType == 1 ? this.data.selectAddress.id : this.data.selectSameJourney.id,
        additional_info: this.data.additional_info,
        voucher_coupon_goods_info: this.data.exchangeCouponData.voucher_coupon_goods_info,
        is_pay_on_delivery: this.data.cashOnDelivery ? 1 : 0
      },
      success: function(res){
        if (_this.data.cashOnDelivery){
          let pagePath = '/eCommerce/pages/goodsOrderPaySuccess/goodsOrderPaySuccess?detail=' + res.data + (_this.franchisee_id ? '&franchisee=' + _this.franchisee_id : '');
          app.turnToPage(pagePath, 1);
        }else{
          _this.payOrder(res.data);
        }
      },
      fail: function(){
        _this.requesting = false;
      },
      successStatusAbnormal: function(){
        _this.requesting = false;
      }
    });
  },
  payOrder: function(orderId){
    var _this = this;

    function paySuccess() {
      var pagePath = '/eCommerce/pages/goodsOrderPaySuccess/goodsOrderPaySuccess?detail=' + orderId + (_this.franchisee_id ? '&franchisee='+_this.franchisee_id : '') + '&is_group=' + !!_this.is_group;
      if(!_this.franchisee_id){
        app.sendRequest({
          url: '/index.php?r=AppMarketing/CheckAppCollectmeStatus',
          data: {
            'order_id': orderId,
            sub_app_id: _this.franchisee_id
          },
          success: function(res){
            if(res.valid == 0) {
              pagePath += '&collectBenefit=1';
            }
            app.turnToPage(pagePath, 1);
          }
        });
      } else {
        app.turnToPage(pagePath, 1);
      }
    }

    function payFail(){
      if(_this.is_group){
        if(_this.data.teamToken){
          app.turnBack();
          return;
        }
        app.turnToPage('/eCommerce/pages/groupOrderDetail/groupOrderDetail?id=' + orderId + (_this.franchisee_id ? '&franchisee=' + _this.franchisee_id : ''), 1);
      }else{
        app.turnToPage('/eCommerce/pages/goodsOrderDetail/goodsOrderDetail?detail=' + orderId + (_this.franchisee_id ? '&franchisee=' + _this.franchisee_id : ''), 1);
      }
    }

    if(this.data.totalPayment == 0){
      app.sendRequest({
        url: '/index.php?r=AppShop/paygoods',
        data: {
          order_id: orderId,
          total_price: 0
        },
        success: function(res){
          paySuccess();
        },
        fail: function(){
          payFail();
        },
        successStatusAbnormal: function () {
          payFail();
        }
      });
      return;
    }
    app.sendRequest({
      url: '/index.php?r=AppShop/GetWxWebappPaymentCode',
      data: {
        order_id: orderId
      },
      success: function (res) {
        var param = res.data;

        param.orderId = orderId;
        param.success = paySuccess;
        param.goodsType = 0;
        param.fail = payFail;
        _this.wxPay(param);
      },
      fail: function(){
        payFail();
      },
      successStatusAbnormal: function () {
        payFail();
      }
    })
  },
  wxPay: function(param){
    var _this = this;
    wx.requestPayment({
      'timeStamp': param.timeStamp,
      'nonceStr': param.nonceStr,
      'package': param.package,
      'signType': param.signType,
      'paySign': param.paySign,
      success: function(res){
        app.wxPaySuccess(param);
        param.success();
      },
      fail: function(res){
        if(res.errMsg === 'requestPayment:fail cancel'){
          app.showModal({
            content: '支付已取消',
            complete: param.fail
          })
          return;
        }
        app.showModal({
          content: '支付失败',
          complete: param.fail
        })
        app.wxPayFail(param, res.errMsg);
      }
    })
  },
  goToMyAddress: function () {
    var addressId = this.data.selectAddress && this.data.selectAddress.id;
    this.isFromSelectAddress = true;
    app.turnToPage('/eCommerce/pages/myAddress/myAddress?id=' + addressId);
  },
  useBalanceChange: function(e){
    this.setData({
      useBalance: e.detail.value
    });
    this.getCalculationInfo();
  },
  useCashDelivery: function(e){
    this.setData({
      cashOnDelivery: e.detail.value
    })
  },
  deliveryWayChange: function(event){
    let type = event.currentTarget.dataset.type;
    if (type == 3){
      this.getSelfDeliveryList();
    }
    this.setData({
      pickUpType: type,
      sameJourneyTimeType: type == 2 ? 1 : '',
      isShowPickMask: false,
      cashOnDelivery: false
    })
    this.getCalculationInfo();
  },
  goToAdditionalInfo: function(){
    app.setGoodsAdditionalInfo(this.data.additional_info);
    app.turnToPage('/eCommerce/pages/goodsAdditionalInfo/goodsAdditionalInfo');
  },
  exchangeCouponInit: function(id){
    var _this = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/getGoods',
      data: {
        data_id: id
      },
      success: function (res) {
        var goods = res.data[0].form_data;
        var goodsModel = [];
        var selectModelInfo = {
          'models': [],
          'price': 0,
          'modelId': '',
          'models_text': '',
          'imgurl': ''
        };
        if(goods.model_items.length){
          // 有规格
          selectModelInfo['price'] = Number(goods.model_items[0].price);
          selectModelInfo['imgurl'] = goods.model_items[0].img_url;
          selectModelInfo['modelId'] = goods.model_items[0].id;
        } else {
          selectModelInfo['price'] = Number(goods.price);
          selectModelInfo['imgurl'] = goods.cover;
        }
        for(var key in goods.model){
          if(key){
            goodsModel.push(goods.model[key]); // 转成数组
            selectModelInfo['models'].push(goods.model[key].subModelId[0]);
            selectModelInfo['models_text'] += '“' + goods.model[key].subModelName[0] + '” ';
          }
        }
        goods.model = goodsModel; // 将原来的结构转换成数组
        _this.setData({
          'exchangeCouponData.dialogHidden': false, // 显示模态框
          'exchangeCouponData.goodsInfo': goods,
          'exchangeCouponData.selectModelInfo': selectModelInfo
        });
      },
      successStatusAbnormal: function(){
        app.showModal({
          content: '兑换的商品已下架'
        });
      }
    });
  },
  exchangeCouponHideDialog: function(){
    this.setData({
      selectDiscountInfo: {
        title: "不使用优惠",
        name: '无',
        no_use_benefit: 1
      },
      'exchangeCouponData.dialogHidden': true,
      'exchangeCouponData.hasSelectGoods': false,
      'exchangeCouponData.voucher_coupon_goods_info': {}
    })
    this.getCalculationInfo();
  },
  exchangeCouponSelectSubModel: function(e){
    var dataset = e.target.dataset,
        modelIndex = dataset.modelIndex,
        submodelIndex = dataset.submodelIndex,
        data = {},
        selectModels = this.data.exchangeCouponData.selectModelInfo.models,
        model = this.data.exchangeCouponData.goodsInfo.model,
        text = '';

    selectModels[modelIndex] = model[modelIndex].subModelId[submodelIndex];

    // 拼已选中规格文字
    for (let i = 0; i < selectModels.length; i++) {
      let selectSubModelId = model[i].subModelId;
      for (let j = 0; j < selectSubModelId.length; j++) {
        if( selectModels[i] == selectSubModelId[j] ){
          text += '“' + model[i].subModelName[j] + '” ';
        }
      }
    }
    data['exchangeCouponData.selectModelInfo.models'] = selectModels;
    data['exchangeCouponData.selectModelInfo.models_text'] = text;

    this.setData(data);
    this.exchangeCouponResetSelectCountPrice();
  },
  exchangeCouponResetSelectCountPrice: function(){
    var _this = this,
        selectModelIds = this.data.exchangeCouponData.selectModelInfo.models.join(','),
        modelItems = this.data.exchangeCouponData.goodsInfo.model_items,
        data = {};

    for (var i = modelItems.length - 1; i >= 0; i--) {
      if(modelItems[i].model == selectModelIds){
        data['exchangeCouponData.selectModelInfo.stock'] = modelItems[i].stock;
        data['exchangeCouponData.selectModelInfo.price'] = modelItems[i].price;
        data['exchangeCouponData.selectModelInfo.modelId'] = modelItems[i].id;
        data['exchangeCouponData.selectModelInfo.imgurl'] = modelItems[i].img_url;
        break;
      }
    }
    this.setData(data);
  },
  exchangeCouponConfirmGoods: function(){
    let _this = this;
    let goodsInfo = _this.data.exchangeCouponData.goodsInfo;
    let model = goodsInfo.model;
    let selectModels = _this.data.exchangeCouponData.selectModelInfo.models;
    let model_value_str = '';
    if(selectModels.length > 0){
      for (let i = 0; i < selectModels.length; i++) {
        let selectSubModelId = model[i].subModelId;
        for (let j = 0; j < selectSubModelId.length; j++) {
          if( selectModels[i] == selectSubModelId[j] ){
            model_value_str += model[i].subModelName[j] + '； ';
          }
        }
      }
    }
    goodsInfo['model_value_str'] = model_value_str;
    _this.setData({
      'exchangeCouponData.dialogHidden': true,
      'exchangeCouponData.selectModelInfo': {},
      'exchangeCouponData.hasSelectGoods': true,
      'exchangeCouponData.voucher_coupon_goods_info': {
        goods_id: goodsInfo.id,
        num: 1,
        model_id: _this.data.exchangeCouponData.selectModelInfo.modelId
      },
      'exchangeCouponData.goodsInfo': goodsInfo
    });
    _this.getCalculationInfo();
  },
  inputGoodsCount: function (e) {
    let value = +e.detail.value;
    let index = e.target.dataset.index;

    if (isNaN(value) || value <= 0) {
      return;
    }
    clearTimeout(this.inputTimer);
    this.inputTimer = setTimeout(() => {
      this.changeGoodsNum(index, value);
    }, 500);
  },
  toDeliveryList: function (){
    let _this = this;
    let url = '';
    if (_this.franchisee_id){
      url += '?franchiseeId=' + _this.franchisee_id;
      url += _this.data.selectDelivery.id ? '&deliveryId=' + _this.data.selectDelivery.id : '';
    }else{
      url += _this.data.selectDelivery.id ? '?deliveryId=' + _this.data.selectDelivery.id : '';
    }
    if(this.data.onlyImmediatlyPickSwitch){
      this.onlyImme = true;
    }
    app.turnToPage('/eCommerce/pages/goodsDeliveryList/goodsDeliveryList' + url);
  },
  showMemberDiscount: function(){
    this.selectComponent('#component-memberDiscount').showDialog(this.data.selectDiscountInfo);
  },
  afterSelectedBenefit: function(event){
    this.setData({
      selectDiscountInfo: event.detail.selectedDiscount,
      'exchangeCouponData.hasSelectGoods': false,
      'exchangeCouponData.voucher_coupon_goods_info': {}  
    })
    this.getCalculationInfo();
  },
  getSuppInfo: function (suppInfoArr) {
    var _this = this;
    app.sendRequest({
      hideLoading: true,
      url: '/index.php?r=pc/AppShop/GetDelivery',
      method: 'post',
      data: {
        delivery_ids: suppInfoArr
      },
      success: function (res) {
        for (let i = 0; i < res.data.length; i++) {
          let suppInfo = res.data[i].delivery_info;
          for (let j = 0; j < suppInfo.length; j++) {
            if (suppInfo[j].is_required == 0 && suppInfo[j].is_hidden == 1) {
              _this.setData({
                hasRequiredSuppInfo: true
              })
            }
            if (suppInfo[j].is_hidden == 1){
              _this.setData({
                noAdditionalInfo: false
              })
            }
          }
        }
        // 单商品单补充信息时直接展示
        if (res.data.length == 1 && _this.data.additional_goodsid_arr.length == 1){
          let deliveryIndex = 0;
          let showIndex = 0;
          for (let i = 0; i < res.data[0].delivery_info.length; i++){
            if (res.data[0].delivery_info[i].is_hidden == 1) {
              deliveryIndex++;
              showIndex = i;
            }
          }
          if (deliveryIndex == 1){
            let data = {};
            data[_this.data.additional_goodsid_arr[0]] = [];
            data[_this.data.additional_goodsid_arr[0]].push({
              title: res.data[0].delivery_info[showIndex].name,
              type: res.data[0].delivery_info[showIndex].type,
              is_required: res.data[0].delivery_info[showIndex].is_required,
              value: ''
            })
            _this.setData({
              additional_info: data,
              aloneDeliveryShow: true
            })
          }
        }
      }
    })
  },
  getSelfDeliveryList: function () {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/getSelfDeliveryList',
      data: {
        sub_shop_app_id: _this.franchisee_id,
      },
      success: function (res) {
        let storeList = res.data.store_list_data
        if (!storeList) {
          app.showModal({
            content: '商家暂无自提门店',
            confirm: function () {
              app.turnBack();
            }
          })
          return;
        }
        if (storeList.length == 1){
          _this.setData({
            selectDelivery: storeList[0]
          })
        }
        if (storeList.length >= 2) {
          app.showModal({
            content: '当前尚未选择自提点',
            confirmText: '去设置',
            cancelText: '取消',
            showCancel: true,
            confirm: function () {
              _this.toDeliveryList();
            },
            cancel: function () {
              app.turnBack();
            }
          })
        }
        _this.getGoodsStoreSet(3);
      }
    })
  },
  closeGoodsPick: function(){
    this.setData({
      isShowPickMask: false,
      isShowServiceTime: false,
      isShowSameJourneyTime: false
    })
  },
  selectPickMethod: function (first) {
    let _this = this;
    let cartIdArr = this.cart_id_arr;
    app.sendRequest({
      url: '/index.php?r=AppEcommerce/getCanUsePickUpTypeAtAddOrder',
      method: 'post',
      data: {
        cart_id_arr: cartIdArr,
        sub_shop_app_id: _this.franchisee_id
      },
      success: function (res) {
        _this.setData({
          pickUpTypeArr: res.data.goods_pick_up_type_arr,
          intraCityData: res.data.intra_city_data,
          isShowPickMask: first == 'first' ? false : true,
          pickUpType: !_this.data.pickUpType ? res.data.goods_pick_up_type_arr[0] : _this.data.pickUpType
        })
        if (first == 'first'){
          switch (_this.data.pickUpType){
            case '3':
              _this.getSelfDeliveryList();
              break;
            case '2':
              _this.setData({
                sameJourneyTimeType: 1
              })
              break;
          }
        }
        _this.getCalculationInfo();
      }
    });
  },
  showServiceTime: function(type){
    let deliveryData = this.data.selectDelivery;
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppEcommerce/GetEcTostoreAppointmentDateList',
      data: {
        sub_shop_app_id: _this.franchisee_id,
        self_delivery_app_store_id: deliveryData.id || '',
      },
      success: function (res) {
        let data = res.data;
        if(type == 'onlyImme'){
          _this.setData({
            waitingQueueTime: data.duration_time,
            tostoreOrderType: 1
          })
          return;
        }
        let tostoreTimeType = data.setting_data.appointment.appointment_time_type; //1为天 2为时 3为半小时
        let tostoreDateTime = '';
        let tostoreWeekTime = '';
        let dateArr = data.date_arr;
        let advanceAppointmentInfo = data.setting_data.appointment.advance_appointment_info;
        let startHours = new Date().getHours();
        let businessTimeRule = data.business_time_rule; //上门自提营业时间
        let maxEndHour = 24;
        let noImmediaPick = data.setting_data.immediate_info.status == 1 ? true : false; //判断上门自提立即取货开关开没开
        let noAppointmentShow = true; //是否显示暂无营业时间
        if (businessTimeRule.type == 2){ //获取自定义当天营业时间的终止小时
          let week = dateArr[0].week;
          let timeArr;
          businessTimeRule.custom.business_time.map((item) => {
            if (week == 0) {
              week = 7;
            }
            if (item.business_week[week - 1] == 1) {
              timeArr = item.business_time_interval;
              maxEndHour = +timeArr[timeArr.length - 1].end_time.substring(0, 2);
            }
          })
        }

        //当天超过营业时间段则当天不可用
         for (let i = 0; i < dateArr.length; i++){
          if (i == 0 && ((advanceAppointmentInfo.type == 2 && +advanceAppointmentInfo.num + startHours >= maxEndHour) || (advanceAppointmentInfo.type == 1 && startHours >= maxEndHour))) { dateArr[i].is_vaild = 0; noImmediaPick = false};
          if (dateArr[i].is_vaild == 1 && tostoreTimeType != 1){
            tostoreDateTime = dateArr[i].date;
            tostoreWeekTime = dateArr[i].week;
            break;
          }
        }
        dateArr.map((item) => {
          if (item.is_vaild == 1){
            noAppointmentShow = false;
          }
        })
        _this.businessTimeType = businessTimeRule.type;
        _this.setData({
          getEcTostoredate: data,
          waitingQueueTime: data.duration_time,
          tostoreTimeType: tostoreTimeType,
          isShowServiceTime: true,
          noImmediaPick: noImmediaPick,
          tostoreDateTime: _this.data.tostoreDateTime ? _this.data.tostoreDateTime : tostoreDateTime,
          tostoreWeekTime: _this.data.tostoreWeekTime ? _this.data.tostoreWeekTime : tostoreWeekTime,
          businessTimeRule: businessTimeRule.type == 1 ? '' : businessTimeRule.custom.business_time,
          advanceAppointmentInfo: advanceAppointmentInfo,
          noAppointmentShow: noAppointmentShow
        })
        if(tostoreTimeType != 1){
          _this.getTostoreTime();
        }
        businessTimeRule.type == 2 && _this.getNoAppointmentWord();
      }
    });
  },
  // 暂无可预约时间
  getNoAppointmentWord: function(){
    let a = '商家营业时间：';
    let b = '';
    let businessTimeRule = this.data.businessTimeRule;
    businessTimeRule.map((item) => {
      for (let i = 0; i < item.business_week.length;i++){
        if (item.business_week[i] == 1){
          switch(i){
            case 0:
              a += '周日、';
              break;
            case 1:
              a += '周一、';
              break;
            case 2:
              a += '周二、';
              break;
            case 3:
              a += '周三、';
              break;
            case 4:
              a += '周四、';
              break;
            case 5:
              a += '周五、';
              break;
            case 6:
              a += '周六、';
              break;
          }
        }
      }
      item.business_time_interval.map((item) => {
        a += item.start_time + '-' + item.end_time + ' ';
      })
    })
    let appointment = this.data.getEcTostoredate.setting_data.appointment;
    let advanceInfo = appointment.advance_appointment_info;
    switch (advanceInfo.type){
      case '1': 
        b += '无需提前，';
        break;
      case '2':
        b += '需提前' + advanceInfo.num + '小时，';
        break;
      case '3':
        b += '需提前' + advanceInfo.num + '天，';
        break;
    }
    b += '最多可预约' + appointment.valid_days + '天内时间';
    this.setData({
      noAppointmentWorda: a,
      noAppointmentWordb: b
    })
  },
  // 获取用户手机号回调
  getPhoneNumber: function (e) {
    let that = this;
    if (/getPhoneNumber:fail/.test(e.detail.errMsg)) {
      return;
    }
    app.sendRequest({
      url: '/index.php?r=AppUser/GetPhoneNumber',
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (res) {
        app.setUserInfoStorage({
          phone: res.data
        })
        that.setData({
          phone: res.data
        });
      },
      successStatus5: function () {
        app.goLogin({
          success: function () {
            app.showModal({
              content: '获取手机号失败，请再次点击授权获取'
            });
          },
          fail: function () {
            app.showModal({
              content: '获取手机号失败，请再次点击授权获取'
            });
          }
        });
      }
    });
  },
  inputPhoneNumber: function(e){
    this.setData({
      phone: e.detail.value
    }) 
  },
  getInStoreSeat: function () {
    var _this = this;
    wx.scanCode({
      success: function (res) {
        let path = res.path;
        let locationId = path.split(/\?location_id=/)[1];
        app.sendRequest({
          url: '/index.php?r=AppEcommerce/getEcLocationData',
          data: {
            id: locationId,
            sub_shop_app_id: _this.franchisee_id
          },
          success: function (res) {
            if(res.data.status == 0){
              _this.setData({
                locationId: locationId,
                inStoreSeatName: res.data.title
              })
            }else{
              app.showModal({
                content: '未检索到座位号'
              })
            }
          }
        })
      },
      fail: function (res) {
        app.showModal({
          content: '未检索到座位号'
        })
      }
    })
  },
  goSameJourneyAddress: function(e){
    let selectSameJourney = this.data.selectSameJourney;
    this.isFromSelectAddress = true;
    app.turnToPage('/eCommerce/pages/goodsSameJourney/goodsSameJourney?from=preview&sameJourneyId=' + (selectSameJourney ? selectSameJourney.id : '') + '&franchiseeId=' + this.franchisee_id);
  },
  getGoodsStoreSet: function(type){
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppEcommerce/getPickUpGoodsTypeSetting',
      data: {
        pick_up_type: type,
        sub_shop_app_id: this.franchisee_id
      },
      success: function (res) {
        let configData = res.data.config_data;
        if (type == 3 && configData){
          _this.setData({
            selfAppointmentSwitch: (configData.pick_up_time_status == 1 && configData.appointment.status == 1) ? true : false,
            onlyImmediatlyPickSwitch: (configData.pick_up_time_status == 1 && configData.appointment.status != 1 && configData.immediate_info.self_pcik_up_status == 1) ? true : false,
            selfDeliveryPhone: configData.is_phone,
            selfDeliveryScan: (configData.pick_up_time_status == 1 && configData.immediate_info.status == 1 && configData.immediate_info.scan_qrcode_status == 1) ? true : false
          })
          // 只有立即取货前台自取时显示时间
          if (_this.data.onlyImmediatlyPickSwitch){
            _this.showServiceTime('onlyImme');
          }
        } else if (type == 2 && configData){
          _this.getsameJourneyTime(configData.business_rule);
        }
      }
    })
  },
  tostoreImmediately: function(){
    this.setData({
      tostoreOrderType: 1,
      tostoreHourTime: '',
      isShowServiceTime: false
    })
  },
  // 上门自提
  selectTostoreTime: function(e){
    let dateArr = this.data.getEcTostoredate.date_arr;
    let index = e.currentTarget.dataset.index;
    let tostoreDateTime = dateArr[index].date;
    let tostoreWeekTime = dateArr[index].week;
    this.setData({
      tostoreOrderType: 2,
      dateIndex: index,
      tostoreDateTime: tostoreDateTime,
      tostoreWeekTime: tostoreWeekTime,
      isShowServiceTime: this.data.tostoreTimeType != 1 ? true : false
    })
    this.getTostoreTime();
  },
  getTostoreTime: function(){
    let currentMonth = new Date().getMonth() + 1;
    let currentMinute = new Date().getMinutes();
    let startHours = new Date().getHours();
    let currentDay = new Date().getDate();
    let currentDate = (currentMonth < 10 ? '0' + currentMonth : currentMonth) + '-' + (currentDay < 10 ? '0' + currentDay : currentDay);
    let tostoreHoursArr = [];
    let currentLimitFlag = true;
    let businessTimeRule = this.data.businessTimeRule;
    let tostoreWeekTime = Number(this.data.tostoreWeekTime);
    let businessTime;
    let showImmediatelyTime = this.businessTimeType == 1 ? true : false; //1为全年 2为自定义
    let advanceAppointmentInfo = this.data.advanceAppointmentInfo;
    let advanceTime = +advanceAppointmentInfo.num + startHours > 24 ? +advanceAppointmentInfo.num + startHours - 24 : +advanceAppointmentInfo.num + startHours;
    this.businessTimeType == 2 && businessTimeRule.map((item) => {
      if (tostoreWeekTime == 0){
        tostoreWeekTime = 7;
      }
      if (item.business_week[tostoreWeekTime - 1] == 1){
        businessTime = item.business_time_interval;
      }
    })
    if (currentDate === this.data.tostoreDateTime){
      if(this.businessTimeType == 2){
        businessTime.map((item) => {
          let fSH = startHours; //是否要判断分钟，初始开始小时
          let fEH = Number(item.end_time.substring(0, 2)); //是否要判断分钟，初始结束小时
          let sH = Number(item.start_time.substring(0, 2));
          let eH = Number(item.end_time.substring(0, 2));
          let sT = Number(item.start_time.substring(3, 5));
          let eT = Number(item.end_time.substring(3, 5));
          // 提前预约时间
          if (startHours < advanceTime) { fSH = startHours = advanceTime };
          if (startHours >= sH && startHours <= eH && !advanceTime) { showImmediatelyTime = true}
          if (startHours <= sH){
            startHours = sH;
            currentMinute = 0;
          } else if (startHours > eH){
            return;
          }
          for (; startHours <= eH; startHours++){
            if (this.data.tostoreTimeType == 2){
              // 小时
              if (startHours == fEH || (startHours == fSH && currentMinute > 0)){continue;}
              tostoreHoursArr.push(startHours + ':00-' + (startHours+1) + ':00');
            }else{
              // 半小时
              if (startHours == fSH && currentMinute <= 30 && currentMinute != 0) {
                tostoreHoursArr.push(startHours + ':30-' + (startHours + 1) + ':00');
                continue;
              } else if (startHours == fSH && currentMinute > 30) { continue }; //开始分钟数大于三十分钟则跳过当前时间段

              if (startHours == fEH && eT >= 30) {
                tostoreHoursArr.push(startHours + ':00-' + startHours + ':30');
                continue;
              } else if (startHours == fEH && eT == 0) { continue }; //结束分钟数等于0则跳过当前时间段
              tostoreHoursArr.push(startHours + ':00-' + startHours + ':30');
              tostoreHoursArr.push(startHours + ':30-' + (startHours + 1) + ':00');
            }
          }
        })
      }else{
        if (startHours < advanceTime) { startHours = advanceTime };
        for (; startHours < 24; startHours++) {
          if (this.data.tostoreTimeType == 2) {
            // 小时
            if (currentLimitFlag && currentMinute > 0) {
              currentLimitFlag = false;
              startHours++
            }
            if( startHours >= 24){continue};
            tostoreHoursArr.push(startHours + ':00-' + (startHours + 1) + ':00');
          } else {
            // 半小时
            if (currentLimitFlag && currentMinute > 0 && currentMinute <= 30) {
              currentLimitFlag = false;
              tostoreHoursArr.push(startHours + ':30-' + (startHours + 1) + ':00');
              continue;
            }
            if (currentLimitFlag && currentMinute > 30) {
              currentLimitFlag = false;
              startHours++
            }
            if( startHours >= 24){continue};
            tostoreHoursArr.push(startHours + ':00-' + startHours + ':30');
            tostoreHoursArr.push(startHours + ':30-' + (startHours + 1) + ':00');
          }
        }
      }
    }else{
      if (this.businessTimeType == 2){
        businessTime.map((item) => {
          let fSH = Number(item.start_time.substring(0, 2)); //是否要判断分钟，初始开始小时
          let fEH = Number(item.end_time.substring(0, 2)); //是否要判断分钟，初始结束小时
          // 预约提前时间
          let sH = Number(item.start_time.substring(0, 2));
          if (this.data.getEcTostoredate.date_arr[1].date == this.data.tostoreDateTime &&  sH < advanceTime && +advanceAppointmentInfo.num + startHours > 24) { sH = advanceTime};
          let eH = Number(item.end_time.substring(0, 2));
          let sT = Number(item.start_time.substring(3, 5));
          let eT = Number(item.end_time.substring(3, 5));
          for (; sH <= eH; sH++) {
            if (this.data.tostoreTimeType == 2) {
              if (sH == fEH || (sH == fSH && sT > 0)){continue}
              tostoreHoursArr.push(sH + ':00-' + (sH + 1) + ':00');
            } else {
              if (sH == fSH && sT <= 30 && sT != 0){
                tostoreHoursArr.push(sH + ':30-' + (sH + 1) + ':00');
                continue;
              } else if (sH == fSH && sT > 30) { continue}; //开始分钟数大于三十分钟则跳过当前时间段

              if (sH == fEH && eT <= 30 && eT != 0){
                tostoreHoursArr.push(sH + ':00-' + sH + ':30');
                continue;
              } else if (sH == fEH && eT == 0) { continue }; //结束分钟数等于0则跳过当前时间段
              tostoreHoursArr.push(sH + ':00-' + sH + ':30');
              tostoreHoursArr.push(sH + ':30-' + (sH + 1) + ':00');
            }
          }
        })
      }else {
        let i = 0;
        if (this.data.getEcTostoredate.date_arr[1].date == this.data.tostoreDateTime && i < advanceTime && +advanceAppointmentInfo.num + startHours > 24) { i = advanceTime };
        for (; i < 24; i++) {
          if (this.data.tostoreTimeType == 2) {
            tostoreHoursArr.push(i + ':00-' + (i + 1) + ':00');
          } else {
            tostoreHoursArr.push(i + ':00-' + i + ':30');
            tostoreHoursArr.push(i + ':30-' + (i + 1) + ':00');
          }
        }
      }
    }
    this.setData({
      tostoreHoursArr: tostoreHoursArr,
      showImmediatelyTime: showImmediatelyTime
    })
  },
  selectTostoreHourTime: function(e){
    let tostoreHoursArr = this.data.tostoreHoursArr;
    let index = e.currentTarget.dataset.index;
    let tostoreHourTime = tostoreHoursArr[index];

    this.setData({
      tostoreOrderType: 2,
      tostoreHourTime: tostoreHourTime,
      isShowServiceTime: false
    })
  },
  // 同城
  showSameJourneyTime: function(){
    if (!this.data.selectSameJourney.id){
      app.showModal({
        content: '请先选择地址'
      })
      return
    }
    this.getGoodsStoreSet(2);
  },
  getsameJourneyTime: function (businessRule){
    let sameJourneyHoursArr = [];
    let currentMinute = new Date().getMinutes() + Number(this.data.sameJourneyImmediatlyTime);
    let startHours = new Date().getHours();
    // 如果立即取货时间+当前时间大于预约时间
    if (currentMinute >= 60){
      startHours++
      currentMinute = currentMinute - 60;
    }
    if (businessRule.type == 1){
      let currentLimitFlag = true;
      for (; startHours < 24; startHours++) {
        // 半小时
        if (currentLimitFlag && currentMinute > 0 && currentMinute <= 30) {
          currentLimitFlag = false;
          sameJourneyHoursArr.push(startHours + ':30');
          continue;
        }
        if (currentLimitFlag && currentMinute > 30) {
          currentLimitFlag = false;
          startHours++
        }
        sameJourneyHoursArr.push(startHours + ':00');
        sameJourneyHoursArr.push(startHours + ':30');
      }
    }else{
      let currentWeek = new Date().getDay();
      let businessTime;
      businessRule.type == 2 && businessRule.custom.business_time.map((item) => {
        if (currentWeek == 0) {
          currentWeek = 7;
        }
        if (item.business_week[currentWeek - 1] == 1) {
          businessTime = item.business_time_interval;
        }
      })
      businessTime.map((item) => {
        let fSH = startHours; //是否要判断分钟，初始开始小时
        let fEH = Number(item.end_time.substring(0, 2)); //是否要判断分钟，初始结束小时
        let sH = Number(item.start_time.substring(0, 2));
        let eH = Number(item.end_time.substring(0, 2));
        let sT = Number(item.start_time.substring(3, 5));
        let eT = Number(item.end_time.substring(3, 5));
        if (startHours <= sH) {
          startHours = sH;
          currentMinute = 0;
        } else if (startHours > eH) {
          return;
        }
        for (; startHours <= eH; startHours++) {
          if (startHours == fSH && currentMinute <= 30 && currentMinute != 0) {
            sameJourneyHoursArr.push(startHours + ':30');
            continue;
          } else if (startHours == fSH && currentMinute > 30) { continue }; //开始分钟数大于三十分钟则跳过当前时间段

          if (startHours == fEH && eT < 30) {
            sameJourneyHoursArr.push(startHours + ':00');
            continue;
          } else if (startHours == fEH && eT == 0) { continue }; //结束分钟数等于0则跳过当前时间段
          sameJourneyHoursArr.push(startHours + ':00');
          sameJourneyHoursArr.push(startHours + ':30');
        }
      })
    }
    // sameJourneyHoursArr.unshift('尽快送达(预计' + this.data.sameJourneyImmediatlyTime + '分钟后送达)');
    this.setData({
      sameJourneyHoursArr: sameJourneyHoursArr,
      isShowSameJourneyTime: true
    })
  },
  selectSameJourneyTime: function (e) {
    let type = e.currentTarget.dataset.type;
    let sameJourneyHoursArr = this.data.sameJourneyHoursArr;
    let index = e.currentTarget.dataset.index;
    let sameJourneyDateTime = sameJourneyHoursArr[index];

    this.setData({
      sameJourneyTimeType: type == 'immedia' ? 1 : 2,
      sameJourneyDateTime: type == 'immedia' ? '' : sameJourneyDateTime,
      isShowSameJourneyTime: false
    })
  },
  // 输入手机号
  inputPhone: function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  // 补充信息
  inputFormControl: function (e) {
    let a = this.data.additional_info;
    let b = this.data.additional_goodsid_arr[0];
    a[b][0].value = e.detail.value
    this.setData({
      additional_info: a
    })
  },
  addDeliveryImg: function () {
    let _this = this;
    let a = this.data.additional_info;
    let b = this.data.additional_goodsid_arr[0];
    let images = a[b][0].value || [];

    app.chooseImage((image) => {
      a[b][0].value = images.concat(image);
      _this.setData({
        additional_info: a
      })
    }, 9)
  },
  deleteImage: function (e) {
    let _this = this;
    let a = this.data.additional_info;
    let b = this.data.additional_goodsid_arr[0];
    let index = e.currentTarget.dataset.imageIndex;
    let images = a[b][0].value;

    images.splice(index, 1);
    a[b][0].value = images;
    _this.setData({
      additional_info: a
    })
  }
})
