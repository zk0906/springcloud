var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    goodsList: [],
    discountList: [],
    selectDiscountInfo: {},
    orderRemark: '', //  留言
    is_self_delivery: 1, //  0快递  1自提
    express_fee: '', //  运费
    balance: '',
    useBalance: true, //  是否使用储值金
    deduction: '',
    discount_cut_price: '', //  折扣金额
    group_buy_price: '',
    original_price: '',
    totalPayment: '',
    storeConfig: '',
    noAdditionalInfo: true,
    is_group: '', //  拼团
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
    userInfo: {
      nick_name: '',
      phone: ''
    },
    notice: true
  },
  franchisee_id: '',
  cart_id_arr: [],
  requesting: false,
  additional_info: {},
  is_group: '',
  inputTimer: '',
  hasRequiredSuppInfo: false,
  onLoad: function(options) {
    let goodsList = options.cart_arr ? JSON.parse(decodeURIComponent(options.cart_arr)) : [];
    let leaderInfo = options.leaderInfo ? JSON.parse(decodeURIComponent(options.leaderInfo)) : [];
    let group_id = options.group_id ? options.group_id : '';
    for (let item of goodsList) {
      this.cart_id_arr.push(item.cart_id);
    }
    this.dataInitial();
    this.setData({
      goodsList: goodsList,
      leaderInfo: leaderInfo,
      group_id: group_id,
      'userInfo.phone': app.globalData.userInfo.phone
    })
  },
  dataInitial: function() {
    this.getCalculationInfo();
    this.getAppECStoreConfig();
  },
  getCalculationInfo: function() {
    var _this = this;

    app.sendRequest({
      url: '/index.php?r=AppShop/calculationPrice',
      method: 'post',
      data: {
        sub_shop_app_id: this.franchisee_id,
        cart_id_arr: this.cart_id_arr,
        is_balance: this.data.useBalance ? 1 : 0,
        is_self_delivery: this.data.is_self_delivery,
        selected_benefit: this.data.selectDiscountInfo,
        voucher_coupon_goods_info: this.data.exchangeCouponData.voucher_coupon_goods_info
      },
      success: function(res) {
        let info = res.data;
        let benefits = info.can_use_benefit;
        let goods_info = info.goods_info;
        let additional_info_goods = [];
        let selectDiscountInfo = info.selected_benefit_info;
        let suppInfoArr = [];
        let additional_goodsid_arr = [];

        let goodsBenefitsData = [];
        benefits.coupon_benefit && benefits.coupon_benefit.length ? goodsBenefitsData.push({
          label: 'coupon',
          value: benefits.coupon_benefit
        }) : '';
        benefits.all_vip_benefit && benefits.all_vip_benefit.length ? goodsBenefitsData.push({
          label: 'vip',
          value: benefits.all_vip_benefit
        }) : '';
        Array.isArray(benefits.integral_benefit) ? '' : benefits.integral_benefit && goodsBenefitsData.push({
          label: 'integral',
          value: [benefits.integral_benefit]
        });

        // 优惠券：兑换券操作
        if (selectDiscountInfo.discount_type == 'coupon' && selectDiscountInfo.type == 3 && _this.data.exchangeCouponData.hasSelectGoods == false) {
          _this.exchangeCouponInit(parseInt(selectDiscountInfo.value));
        }

        for (var i = 0; i <= goods_info.length - 1; i++) {
          if (goods_info[i].delivery_id && goods_info[i].delivery_id != 0 && additional_goodsid_arr.indexOf(goods_info[i].id) == -1) {
            suppInfoArr.push(goods_info[i].delivery_id);
            additional_goodsid_arr.push(goods_info[i].id);
            additional_info_goods.push(goods_info[i]);
          }
        }
        let group_buy_price = String(info.original_price - info.group_buy_discount_price);
        if (group_buy_price.split('.')[1]) {
          group_buy_price = Number(group_buy_price).toFixed(2);
        }
        if (suppInfoArr.length && !_this.hasRequiredSuppInfo) {
          _this.getSuppInfo(suppInfoArr);
        }
        _this.setData({
          discountList: goodsBenefitsData,
          selectDiscountInfo: selectDiscountInfo,
          express_fee: info.express_fee,
          discount_cut_price: info.discount_cut_price,
          balance: info.balance,
          deduction: info.use_balance,
          original_price: info.original_price,
          group_buy_price: group_buy_price,
          totalPayment: info.price,
          noAdditionalInfo: suppInfoArr.length ? false : true,
          canCashDelivery: info.is_pay_on_delivery,
          cashOnDelivery: info.price > 0 ? _this.data.cashOnDelivery : false,
          selfPayOnDelivery: info.self_pay_on_delivery
        })
        app.setPreviewGoodsInfo(additional_info_goods);
      }
    });
  },
  getAppECStoreConfig: function() {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppEcommerce/getAppBECStoreConfig',
      data: {
        sub_shop_app_id: _this.franchisee_id
      },
      success: function(res) {
        if (res.data.express == 0) {
          _this.getSelfDeliveryList();
        }
        _this.setData({
          storeConfig: res.data,
          storeStyle: _this.franchisee_id ? '' : res.data.color_config
        })
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
        if (!res.data.store_list_data) {
          app.showModal({
            content: '商家暂无自提门店',
            confirm: function () {
              app.turnBack();
            }
          })
          return;
        }
      }
    })
  },
  remarkInput: function(e) {
    var value = e.detail.value;
    
    this.setData({
      orderRemark: value
    });
  },
  clickMinusButton: function(e) {
    var index = e.currentTarget.dataset.index,
      goods = this.data.goodsList[index];
    if (goods.buyCount <= 0) return;
    this.changeGoodsNum(index, 'minus');
  },
  clickPlusButton: function(e) {
    var index = e.currentTarget.dataset.index,
      goods = this.data.goodsList[index];

    this.changeGoodsNum(index, 'plus');
  },
  changeGoodsNum: function(index, type) {
    var goods = this.data.goodsList[index],
      currentNum = +goods.buyCount,
      targetNum = type == 'plus' ? currentNum + 1 : (type == 'minus' ? currentNum - 1 : Number(type)),
      that = this,
      data = {},
      param;

    if (targetNum == 0 && type == 'minus') {
      app.showModal({
        content: '确定从购物车删除该商品？',
        showCancel: true,
        confirm: function() {
          data['goodsList[' + index + '].num'] = targetNum;
          that.setData(data);
          that.deleteGoods(index);
        }
      })
      return;
    }
    if (this.data.is_group) {
      param.is_group_buy = this.data.is_group ? 1 : 0;
      param.num_of_group_buy_people = this.data.group_buy_people;
      param.team_token = this.data.teamToken;
    }
    param = {
      goods_id: goods.id,
      model_id: goods.modelId || '',
      num: targetNum,
      leader_token: that.data.leaderInfo.user_token,
      group_id: that.data.group_id
    };
    app.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/addCart',
      method: 'post',
      data: param,
      success: function(res) {
        data['goodsList[' + index + '].buyCount'] = targetNum;
        data.selectDiscountInfo = '';
        data.exchangeCouponData = {
          dialogHidden: true,
          hasSelectGoods: false,
          voucher_coupon_goods_info: {}
        };
        that.setData(data);
        // 修复价格异常
        that.initData(that.data.leaderInfo.user_token,that.data.group_id);
        that.getCalculationInfo();
      },
      fail: function(res) {
        data = {};
        data['goodsList[' + index + '].buyCount'] = currentNum;
        that.setData(data);
      }
    })
  },
  deleteGoods: function(index) {
    var goodsList = this.data.goodsList;
    var that = this;
    var listExcludeDelete;
    app.sendRequest({
      url: '/index.php?r=AppShop/deleteCart',
      method: 'post',
      data: {
        cart_id_arr: [goodsList[index].cart_id],
        sub_shop_app_id: this.franchisee_id
      },
      success: function(res) {
        (listExcludeDelete = goodsList.concat([])).splice(index, 1);
        if (listExcludeDelete.length == 0) {
          that.setData({ goodsList: listExcludeDelete });
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
        if(noSameGoodsId){
          delete that.additional_info[deleteGoodsId];
        }

        that.setData({
          goodsList: listExcludeDelete,
          selectDiscountInfo: '',
          exchangeCouponData: {
            dialogHidden: true,
            hasSelectGoods: false,
            voucher_coupon_goods_info: {}
          }
        })
        that.getCalculationInfo();
      }
    });
  },
  previewPay: function(e) {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/CheckIsDistributorGroupLeader',
      method: 'post',
      data: {
        leader_token: _this.data.leaderInfo.user_token,
      },
      success: function(res) {
        if (res.data == 1) {
          _this.confirmPayment(e);
        }else {
          app.showModal({
            content: '团长资质审核中，请先在其他团长里购买!'
          })
        }
      }
    })
  },
  confirmPayment: function(e) {
    var list = this.data.goodsList,
      that = this,
      cart_data_arr = [],
      selected_benefit = this.data.selectDiscountInfo;

    if (that.data.userInfo.nick_name == '') {
      app.showModal({
        content: '请填写提货人姓名'
      })
      return;
    }
    if (that.data.userInfo.phone == '' || that.data.userInfo.phone == null || that.data.userInfo.phone.length != 11) {
      app.showModal({
        content: '请填写正确的提货人手机号'
      })
      return;
    }
    for (let item of list) {
      cart_data_arr.push({
        cart_id: item.cart_id,
        goods_id: item.id,
        model_id: item.modelId,
        num: item.buyCount
      })
    }
    if (this.requesting) {
      return;
    }
    this.requesting = true;

    let data = {
      cart_arr: cart_data_arr,
      formId: e.detail.formId,
      sub_shop_app_id: this.franchisee_id,
      selected_benefit: selected_benefit,
      is_balance: this.data.useBalance ? 1 : 0,
      remark: this.data.orderRemark,
      additional_info: this.additional_info,
      voucher_coupon_goods_info: this.data.exchangeCouponData.voucher_coupon_goods_info,
      is_pay_on_delivery: this.data.cashOnDelivery ? 1 : 0,
      not_need_user_address: 1,
      leader_token: that.data.leaderInfo.user_token,
      group_id: that.data.group_id,
      dis_notice: that.data.userInfo,
      is_self_delivery: that.data.is_self_delivery
    };
    app.sendRequest({
      url: '/index.php?r=AppShop/addCartOrder',
      method: 'post',
      data: data,
      success: function(res) {
        app.removeStorage({ key: that.data.leaderInfo.user_token + 'Width' + that.data.group_id});
        that.setData({ goodsList: [] });
        that.payOrder(res.data);
      },
      fail: function() {
        that.requesting = false;
      },
      successStatusAbnormal: function() {
        that.requesting = false;
      }
    });
  },
  payOrder: function(orderId) {
    var that = this;

    function paySuccess() {
      var pagePath = '/promotion/pages/communityGroupPaySuccess/communityGroupPaySuccess?detail=' + orderId + (that.franchisee_id ? '&franchisee=' + that.franchisee_id : '') + '&is_group=' + !!that.is_group;
      if (!that.franchisee_id) {
        app.sendRequest({
          url: '/index.php?r=AppMarketing/CheckAppCollectmeStatus',
          data: {
            'order_id': orderId,
            sub_app_id: that.franchisee_id
          },
          success: function(res) {
            if (res.valid == 0) {
              pagePath += '&collectBenefit=1';
            }
            app.turnToPage(pagePath, 1);
          }
        });
      } else {
        app.turnToPage(pagePath, 1);
      }
    }

    function payFail() {
      app.turnToPage('/promotion/pages/communityGroupOrderDetail/communityGroupOrderDetail?detail=' + orderId + (that.franchisee_id ? '&franchisee=' + that.franchisee_id : ''), 1);
    }

    if (this.data.totalPayment == 0) {
      app.sendRequest({
        url: '/index.php?r=AppShop/paygoods',
        data: {
          order_id: orderId,
          total_price: 0
        },
        success: function(res) {
          paySuccess();
        },
        fail: function() {
          payFail();
        },
        successStatusAbnormal: function() {
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
      success: function(res) {
        var param = res.data;

        param.orderId = orderId;
        param.success = paySuccess;
        param.goodsType = 0;
        param.fail = payFail;
        that.wxPay(param);
      },
      fail: function() {
        payFail();
      },
      successStatusAbnormal: function() {
        payFail();
      }
    })
  },
  wxPay: function(param) {
    var that = this;
    wx.requestPayment({
      'timeStamp': param.timeStamp,
      'nonceStr': param.nonceStr,
      'package': param.package,
      'signType': param.signType,
      'paySign': param.paySign,
      success: function(res) {
        app.wxPaySuccess(param);
        param.success();
      },
      fail: function(res) {
        if (res.errMsg === 'requestPayment:fail cancel') {
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
  useBalanceChange: function(e) {
    this.setData({
      useBalance: e.detail.value
    });
    this.getCalculationInfo();
  },
  useCashDelivery: function(e) {
    if (this.data.selfPayOnDelivery == 0 && e.detail.value) {
      this.setData({
        is_self_delivery: false
      })
    }
    this.setData({
      cashOnDelivery: e.detail.value
    })
  },
  goToAdditionalInfo: function(){
    app.setGoodsAdditionalInfo(this.additional_info);
    app.turnToPage('/eCommerce/pages/goodsAdditionalInfo/goodsAdditionalInfo');
  },
  exchangeCouponInit: function(id) {
    var _this = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/getGoods',
      data: {
        data_id: id
      },
      success: function(res) {
        var goods = res.data[0].form_data;
        var goodsModel = [];
        var selectModelInfo = {
          'models': [],
          'price': 0,
          'modelId': '',
          'models_text': '',
          'imgurl': ''
        };
        if (goods.model_items.length) {
          // 有规格
          selectModelInfo['price'] = Number(goods.model_items[0].price);
          selectModelInfo['imgurl'] = goods.model_items[0].img_url;
          selectModelInfo['modelId'] = goods.model_items[0].id;
        } else {
          selectModelInfo['price'] = Number(goods.price);
          selectModelInfo['imgurl'] = goods.cover;
        }
        for (var key in goods.model) {
          if (key) {
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
      successStatusAbnormal: function() {
        app.showModal({
          content: '兑换的商品已下架'
        });
      }
    });
  },
  exchangeCouponHideDialog: function() {
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
  exchangeCouponSelectSubModel: function(e) {
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
        if (selectModels[i] == selectSubModelId[j]) {
          text += '“' + model[i].subModelName[j] + '” ';
        }
      }
    }
    data['exchangeCouponData.selectModelInfo.models'] = selectModels;
    data['exchangeCouponData.selectModelInfo.models_text'] = text;

    this.setData(data);
    this.exchangeCouponResetSelectCountPrice();
  },
  exchangeCouponResetSelectCountPrice: function() {
    var _this = this,
      selectModelIds = this.data.exchangeCouponData.selectModelInfo.models.join(','),
      modelItems = this.data.exchangeCouponData.goodsInfo.model_items,
      data = {};

    for (var i = modelItems.length - 1; i >= 0; i--) {
      if (modelItems[i].model == selectModelIds) {
        data['exchangeCouponData.selectModelInfo.stock'] = modelItems[i].stock;
        data['exchangeCouponData.selectModelInfo.price'] = modelItems[i].price;
        data['exchangeCouponData.selectModelInfo.modelId'] = modelItems[i].id;
        data['exchangeCouponData.selectModelInfo.imgurl'] = modelItems[i].img_url;
        break;
      }
    }
    this.setData(data);
  },
  exchangeCouponConfirmGoods: function() {
    let _this = this;
    let goodsInfo = _this.data.exchangeCouponData.goodsInfo;
    let model = goodsInfo.model;
    let selectModels = _this.data.exchangeCouponData.selectModelInfo.models;
    let model_value_str = '';
    if (selectModels.length > 0) {
      for (let i = 0; i < selectModels.length; i++) {
        let selectSubModelId = model[i].subModelId;
        for (let j = 0; j < selectSubModelId.length; j++) {
          if (selectModels[i] == selectSubModelId[j]) {
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
  inputGoodsCount: function(e) {
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
  showMemberDiscount: function() {
    this.selectComponent('#component-memberDiscount').showDialog(this.data.selectDiscountInfo);
  },
  afterSelectedBenefit: function(event) {
    this.setData({
      selectDiscountInfo: event.detail.selectedDiscount,
      'exchangeCouponData.hasSelectGoods': false,
      'exchangeCouponData.voucher_coupon_goods_info': {}
    })
    this.getCalculationInfo();
  },
  getSuppInfo: function(suppInfoArr) {
    var _this = this;
    app.sendRequest({
      hideLoading: true,
      url: '/index.php?r=pc/AppShop/GetDelivery',
      method: 'post',
      data: {
        delivery_ids: suppInfoArr
      },
      success: function(res) {
        for (let i = 0; i < res.data.length; i++) {
          let suppInfo = res.data[i].delivery_info;
          for (let j = 0; j < suppInfo.length; j++) {
            if (suppInfo[j].is_required == 0) {
              _this.hasRequiredSuppInfo = true;
              return;
            }
          }
        }
      }
    })
  },
  // 手机号授权
  getPhoneNumber: function(e) {
    let _this = this;
    if (e.detail.errMsg == "getPhoneNumber:fail user deny" || e.detail.errMsg == "getPhoneNumber:fail:user denied" || e.detail.errMsg == "getPhoneNumber:fail:cancel to confirm login") {
      app.addLog(e.detail);
    } else if (e.detail.errMsg == "getPhoneNumber:fail 该 appid 没有权限" || e.detail.errMsg == "getPhoneNumber:fail jsapi has no permission, event…sg=permission got, detail=jsapi has no permission") {
      app.showModal({
        content: '该appid没有权限，目前该功能针对非个人开发者，且完成了认证的小程序开放（不包含海外主体）'
      });
    } else {
      app.checkSession(function() {
        app.sendRequest({
          hideLoading: true,
          url: '/index.php?r=AppUser/GetPhoneNumber',
          data: {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          },
          success: function(res) {
            app.setUserInfoStorage({
              phone: res.data
            })
            _this.setData({
              'userInfo.phone': res.data
            })
          },
          successStatus5: function() {
            app.goLogin({
              success: function() {
                app.showModal({
                  content: '获取手机号失败，请再次点击授权获取'
                });
              },
              fail: function() {
                app.showModal({
                  content: '获取手机号失败，请再次点击授权获取'
                });
              }
            });
          }
        })
      });
    }
  },
  changeUserInfo: function(e) {
    let types = e.currentTarget.dataset.type;
    let value = e.detail.value;
    if (types == 'phone') {
      this.setData({
        'userInfo.phone': value
      })
    } else {
      this.setData({
        'userInfo.nick_name': value
      })
    }
  },
  closeNotice: function() {
    this.setData({
      notice: false
    })
  },
  resetPreViewCark: function() {
    let key = `${this.data.leaderInfo.user_token}Width${this.data.group_id}`;
    let data = wx.getStorageSync('communityGoodCark') || {};
    data[key] = this.data.goodsList;
    app.setStorage({
      key: 'communityGoodCark',
      data: data
    })
  },
  onUnload: function() {
    this.resetPreViewCark();
  },
  initData: function (leader_token, group_id) {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/GetGroupsByDistance',
      method: 'post',
      data: {
        leader_token,
        group_id,
        shop_type: 1
      },
      success: function (res) {
        let communityGoodsList = res.data[0].goods_info;
        _this._fixLocalStorageShopCark(_this.data.goodsList, communityGoodsList);
      }
    })
  },
  /**
   * [删除下架商品]
   * @param shopCark {array} 本地缓存购物车数据
   * @param communityGoodsList {array} 商品列表
   */
  _fixLocalStorageShopCark: function (shopCark, communityGoodsList) {
    shopCark.forEach((item, index) => {
      let shopIndex = this.findTagIndex(communityGoodsList, item.id);
      if (shopIndex < 0) {
        shopCark.splice(index, 1);
      } else {
        if (item.modelId != 0) {
          let modelIndex = this.findTagIndex(communityGoodsList[shopIndex].form_data.goods_model, item.modelId);
          if (modelIndex < 0) {
            shopCark.splice(index, 1);
          } else {
            item.price = communityGoodsList[shopIndex].form_data.goods_model[modelIndex].price;
            item.stock = communityGoodsList[shopIndex].form_data.goods_model[modelIndex].stock;
          }
        } else {
          item.price = communityGoodsList[shopIndex].price;
          item.stock = communityGoodsList[shopIndex].stock;
        }
      }
      this.setData({
        goodsList: shopCark
      })
    });
  },
  /**
   * [获取所在索引]
   * @param arr {array} 商品列表
   * @param id {string} 指定id
   */
  findTagIndex: function (arr, id) {
    let index = arr.findIndex(function (item) {
      return item.id == id;
    })
    return index;
  }
})