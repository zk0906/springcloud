var app = getApp()

Page({
  data: {
    orderData: {},
    orderInfo: {},
    orderStatus: {
      '0': '买家待付款',
      '1': '商家待发货',
      '2': '商家配送中',
      '3': '订单待评价',
      '4': '退款审核中',
      '5': '退款中',
      '6': '订单已完成',
      '7': '已关闭',
      '10': '商品待提货'
    },
    orderIcon: {
      '0': 'goods-undone-payment',
      '1': 'goods-undone-ship',
      '2': 'goods-undone-receipt',
      '3': 'goods-undone-evaluation',
      '4': 'goods-refund',
      '5': 'goods-refund-doing',
      '6': 'goods-order-complete',
      '7': 'goods-order-close',
      '10': 'goods-undone-receipt'
    },
    refundStatus: ['退款审核中', '', '', '等待买家退货', '商家待收货', '', '已退款'],
    refundIcon: ['goods-refund-review', '', '', 'goods-refund', 'goods-undone-receipt', '', 'goods-already-refund'],
    refundReason: ['多拍/拍错/不想要', '快递延期', '未按约定时间发货', '快递记录出错', '内容与描述不符', '其它'],
    goodsAdditionalInfo: {},
    hasAdditionalInfo: false,
    customFields: [],
    orderId: '',
    isFromTemplateMsg: false,
    originalPrice: '',
    useBalance: '',
    freightAdress: {},
    express_fee: '',
    discount_cut_price: '',
    isFromBack: false,
    showWriteOffCodeBox: false,
    showEventDialog: false,
    eventType: '',
    hasAlreadyGoods: false,
    showLeaderAddress: false,
    formGroup: ''
  },
  verifiTimeInterval: '', // 定时器,间断发送消息
  onLoad: function(options) {
    this.setData({
      orderId: options.detail,
      isFromTemplateMsg: options.from === 'template_msg' ? true : false,
      franchiseeId: options.franchisee || '',
      formGroup: options.formGroup || ''
    })
    this.dataInitial();
  },
  onShow: function() {
    if (this.data.isFromBack) {
      if(this.data.formGroup == '') {
        this.getOrderDetail(this.data.orderId);
      }else {
        this.getOrderDetailGroup(this.data.orderId);
      }
    } else {
      this.setData({
        isFromBack: true
      })
    }
  },
  // 每个页面数据初始化函数 dataInitial
  dataInitial: function() {
    if(this.data.formGroup == '') {
      this.getOrderDetail(this.data.orderId);
    }else {
      this.getOrderDetailGroup(this.data.orderId);
    }
    this.getAppECStoreConfig();
    this.setData({
      appName: app.globalData.appTitle,
      appLogo: app.globalData.appLogo
    })
  },
  getOrderDetail: function(orderId) {
    var that = this;
    app.getOrderDetail({
      data: {
        order_id: orderId,
        sub_shop_app_id: this.data.franchiseeId
      },
      success: function(res) {
        var data = res.data[0],
          form_data = data.form_data,
          hasAdditionalInfo = false,
          additional_info_goods = [],
          additional_goodsid_arr = [],
          address_id = '';

        if (form_data.additional_info) {
          for (var i = 0; i < form_data.goods_info.length; i++) {
            var deliveryId = form_data.goods_info[i].delivery_id,
              goodsId = form_data.goods_info[i].goods_id;

            if (deliveryId && deliveryId != '0' && additional_goodsid_arr.indexOf(goodsId) == -1) {
              additional_info_goods.push(form_data.goods_info[i]);
              additional_goodsid_arr.push(goodsId);
              hasAdditionalInfo = true;
            }
          }
        }

        let remark = form_data.remark;
        form_data.remark = remark ? remark.replace(/\n|\\n/g, '\n') : remark;


        //判断是否有已退商品或部分退款
        if (form_data.refunded_price) {
          that.setData({
            hasAlreadyGoods: true
          })
        }

        that.setData({
          orderData: data,
          orderInfo: form_data,
          hasAdditionalInfo: hasAdditionalInfo,
          discount_cut_price: form_data.discount_cut_price,
          useBalance: form_data['use_balance'],
          express_fee: res.data[0]['express_fee']
        });
        that.initCommunity(form_data.dis_group_info.leader_token);
        app.setPreviewGoodsInfo(additional_info_goods);

        app.setGoodsAdditionalInfo(form_data.additional_info || {});
        that.getRefundConfigByPickUpType(form_data.pick_up_type);
      }
    })
  },
  getOrderDetailGroup: function(orderId) {
    let that = this;
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/GetOrderByGroupLeader',
      method: 'post',
      data: {
        order_id: orderId
      },
      success: function(res) {
        var data = res.data[0],
          form_data = data.form_data,
          hasAdditionalInfo = false,
          additional_info_goods = [],
          additional_goodsid_arr = [],
          address_id = '';

        if (form_data.additional_info) {
          for (var i = 0; i < form_data.goods_info.length; i++) {
            var deliveryId = form_data.goods_info[i].delivery_id,
              goodsId = form_data.goods_info[i].goods_id;

            if (deliveryId && deliveryId != '0' && additional_goodsid_arr.indexOf(goodsId) == -1) {
              additional_info_goods.push(form_data.goods_info[i]);
              additional_goodsid_arr.push(goodsId);
              hasAdditionalInfo = true;
            }
          }
        }

        let remark = form_data.remark;
        form_data.remark = remark ? remark.replace(/\n|\\n/g, '\n') : remark;


        //判断是否有已退商品或部分退款
        if (form_data.refunded_price) {
          that.setData({
            hasAlreadyGoods: true
          })
        }

        that.setData({
          orderData: data,
          orderInfo: form_data,
          hasAdditionalInfo: hasAdditionalInfo,
          discount_cut_price: form_data.discount_cut_price,
          useBalance: form_data['use_balance'],
          express_fee: res.data[0]['express_fee']
        });
        that.initCommunity(form_data.dis_group_info.leader_token);
        app.setPreviewGoodsInfo(additional_info_goods);

        app.setGoodsAdditionalInfo(form_data.additional_info || {});
      }
    })
  },
  orderDelete: function(e) {
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/HideOrder',
      data: {
        order_id: orderId,
        sub_shop_app_id: franchiseeId
      },
      success: function(res) {
        app.turnBack()
      },
      complete: function() {
        _this.setData({
          showEventDialog: false
        });
      }
    })
  },
  cancelOrder: function(e) {
    var orderId = this.data.orderInfo.order_id,
      that = this;

    app.sendRequest({
      url: '/index.php?r=AppShop/cancelOrder',
      data: {
        order_id: orderId,
        sub_shop_app_id: that.data.franchiseeId
      },
      success: function(res) {
        var data = {};
        data['orderInfo.status'] = 7;
        that.setData(data);
      },
      complete: function() {
        that.setData({
          showEventDialog: false
        });
      }
    })
  },
  payOrder: function(e) {
    var address_info = this.data.orderInfo.address_info,
      that = this,
      orderId = this.data.orderInfo.order_id;

    if (this.data.orderInfo.total_price == 0) {
      app.sendRequest({
        url: '/index.php?r=AppShop/paygoods',
        data: {
          order_id: orderId,
          total_price: 0
        },
        success: function(res) {
          setTimeout(function() {
            app.showToast({
              'title': '支付成功',
              'icon': 'success',
              'success': function() {
                that.paySuccessCallback();
              }
            });
          });
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
        param.goodsType = that.data.orderInfo.goods_type;
        param.success = function() {
          that.paySuccessCallback();
        };
        app.wxPay(param);
      }
    })
  },
  applyDrawback: function() {
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    let pagePath = '/eCommerce/pages/previewGoodsRefund/previewGoodsRefund?orderId=' + orderId + (franchiseeId ? '&franchisee=' + franchiseeId : '');
    app.turnToPage(pagePath);
  },
  editorRefund: function() {
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    let pagePath = '/eCommerce/pages/goodsRefundPage/goodsRefundPage?type=editor&orderId=' + orderId + (franchiseeId ? '&franchisee=' + franchiseeId : '');
    app.turnToPage(pagePath);
  },
  receiveDrawback: function() {
    var orderId = this.data.orderInfo.order_id,
      that = this;

    app.sendRequest({
      url: '/index.php?r=AppShop/comfirmRefund',
      data: {
        order_id: orderId,
        sub_shop_app_id: that.data.franchiseeId
      },
      success: function(res) {
        var data = {};

        data['orderInfo.status'] = 7;
        that.setData(data);
      },
      complete: function() {
        that.setData({
          showEventDialog: false
        });
      }
    })
  },
  checkLogistics: function() {
    var orderId = this.data.orderId;
    app.turnToPage('/eCommerce/pages/logisticsPage/logisticsPage?detail=' + orderId);
  },
  sureReceipt: function() {
    var orderId = this.data.orderId,
      that = this,
      addTime = Date.now();

    app.sendRequest({
      url: '/index.php?r=AppShop/comfirmOrder',
      data: {
        order_id: orderId,
        sub_shop_app_id: that.data.franchiseeId
      },
      success: function(res) {
        let data = {};
        data['orderInfo.status'] = 3;
        that.setData(data);
        //获取积分弹窗
        app.sendRequest({
          hideLoading: true,
          url: '/index.php?r=appShop/getIntegralLog',
          data: {
            add_time: addTime
          },
          success: function(res) {
            if (res.status == 0) {
              res.data && that.setData({
                'rewardPointObj': {
                  showModal: true,
                  count: res.data,
                  callback: ''
                }
              });
            }
          }
        })
      },
      complete: function() {
        that.setData({
          showEventDialog: false
        });
      }
    })
  },
  makeComment: function() {
    var franchiseeId = this.data.franchiseeId,
      pagePath = '/eCommerce/pages/makeComment/makeComment?detail=' + this.data.orderInfo.order_id + (franchiseeId ? '&franchisee=' + franchiseeId : '');
    app.turnToPage(pagePath);
  },
  goToHomepage: function() {
    var router = app.getHomepageRouter();
    app.turnToPage('/pages/' + router + '/' + router, true);
  },
  seeAdditionalInfo: function () {
    app.turnToPage('/eCommerce/pages/goodsAdditionalInfo/goodsAdditionalInfo?from=goodsOrderDetail');
  },
  paySuccessCallback: function() {
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    let pagePath = '/promotion/pages/communityGroupPaySuccess/communityGroupPaySuccess?detail=' + orderId +
      (franchiseeId ? '&franchisee=' + franchiseeId : '');
    app.turnToPage(pagePath, 1);
  },
  copyOrderId: function() {
    let _this = this;
    wx.setClipboardData({
      data: _this.data.orderId,
      success: function(res) {
        app.showToast({
          title: '复制成功',
          icon: 'success'
        })
      }
    })
  },
  // 核销码
  getWriteOffCodeBox: function() {
    let _this = this;
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    app.sendRequest({
      url: '/index.php?r=AppShop/GetOrderVerifyCode',
      data: {
        'sub_shop_app_id': franchiseeId,
        'order_id': orderId
      },
      success: _this.setVerificationCodeData
    })
  },
  setVerificationCodeData: function(res) {
    let _this = this;
    _this.setData({
      'codeImgUrl': res.data.qrcode_url,
      'codeNum': res.data.code,
      'codeStatus': res.data.status,
      'showWriteOffCodeBox': true
    });
    _this.connectSocket();
  },
  connectSocket: function() {
    var _this = this;
    wx.connectSocket({
      url: 'wss://ceshi.zhichiwangluo.com',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET'
    });
    wx.onSocketOpen(function(res) {
      let data = {
        'action': 'mark_client',
        'user_token': app.globalData.userInfo.user_token,
        'scenario_name': 'app_order_verify',
        'session_key': app.globalData.sessionKey
      };
      wx.sendSocketMessage({
        data: JSON.stringify(data)
      });
      _this.verifiTimeInterval = setInterval(function() {
        let data = {
          'action': 'heartbeat',
          'user_token': app.globalData.userInfo.user_token,
          'scenario_name': 'app_order_verify',
          'session_key': app.globalData.sessionKey
        };
        wx.sendSocketMessage({
          data: JSON.stringify(data)
        })
      }, 30000);
    });
    wx.onSocketMessage(function(res) {
      let data = JSON.parse(res.data);
      if (data.action == 'push_to_client') {
        let msg = JSON.parse(data.msg);
        if ((msg.type == 'app_order_verify') && (msg.status == 0)) {
          _this.setData({
            'codeStatus': 1
          });
          clearInterval(_this.verifiTimeInterval);
          wx.closeSocket();
        }
      }
    });
  },
  hideWriteOffCodeBox: function() {
    var _this = this;
    this.setData({
      'showWriteOffCodeBox': false
    })
    clearInterval(_this.verifiTimeInterval);
    wx.closeSocket();
  },
  hideEventDialog: function() {
    this.setData({
      showEventDialog: false
    })
  },
  showEventDialog: function(event) {
    this.setData({
      eventType: event.currentTarget.dataset.type,
      showEventDialog: true
    })
  },
  goOrderProgress: function() {
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    let pagePath = '/eCommerce/pages/goodsOrderProgress/goodsOrderProgress?orderId=' + orderId + (franchiseeId ? '&franchisee=' + franchiseeId : '');
    app.turnToPage(pagePath);
  },
  returnInfor: function() {
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    let pagePath = '/eCommerce/pages/goodsReturnInfor/goodsReturnInfor?orderId=' + orderId + (franchiseeId ? '&franchisee=' + franchiseeId : '');
    app.turnToPage(pagePath);
  },
  cancelRefund: function() {
    let _this = this;
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    app.sendRequest({
      url: '/index.php?r=appShop/cancelRefund',
      data: {
        'order_id': orderId,
        'sub_shop_app_id': franchiseeId
      },
      success: function() {
        _this.getOrderDetail(orderId);
      }
    })
  },
  getAppECStoreConfig: function() {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppEcommerce/getAppBECStoreConfig',
      data: {
        'sub_shop_app_id': _this.data.franchiseeId
      },
      success: function(res) {
        if(!res.data.refund_config){return};
        _this.setData({
          refundAdress: res.data.refund_config.address,
          refundWithGoods: res.data.refund_config.refund_with_goods,
          isFullRefund: res.data.refund_config.is_full_refund,
        })
      }
    })
  },
  deliveryDrawback: function() {
    let _this = this;
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    app.sendRequest({
      url: '/index.php?r=AppShop/applyRefund',
      data: {
        order_id: orderId,
        sub_shop_app_id: franchiseeId
      },
      success: function(res) {
        _this.getOrderDetail(orderId);
      },
      complete: function() {
        _this.setData({
          showEventDialog: false
        });
      }
    })
  },
  goAlreadyGoodsPage: function() {
    let pagePath = '/eCommerce/pages/goodsAlreadyRefunded/goodsAlreadyRefunded';
    app.turnToPage(pagePath);
  },
  // 新增社区团购信息
  initCommunity: function(leaderToken) {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/GetDistributorExtList',
      method: 'post',
      data: {
        leader_token: leaderToken
      },
      success: function(res) {
        let leaderInfo = res.data[0];
        _this.setData({ 
          leaderInfo: leaderInfo
        })
      }
    })
  },
  callPhone: function(e) {
    let phone = e.currentTarget.dataset.phone;
    app.makePhoneCall(phone);
  },
  showLeader: function() {
    let showLeaderAddress = this.data.showLeaderAddress;
    this.setData({
      showLeaderAddress: !showLeaderAddress
    })
  },
  // 获取退款设置
  getRefundConfigByPickUpType: function(type){
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppEcommerce/getRefundConfigByPickUpType',
      data: {
        pick_up_type: type
      },
      success: function (res) {
        if (res.data && res.data.config_data){
          let data = res.data.config_data;
          _this.setData({
            refundAdress: data.address,
            refundWithGoods: data.refund_with_goods,
            isFullRefund: data.is_full_refund
          })
        }
      }
    })
  }
})