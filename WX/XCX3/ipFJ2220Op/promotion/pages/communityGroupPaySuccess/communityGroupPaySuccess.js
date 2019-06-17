import Scratch from "../../../utils/scratch.js"
var app = getApp()

Page({
  data: {
    status: 0, // 0: 普通页面 1:有集集乐的情况
    orderId: '',
    collectBenefitData: {}, // 集集乐数据
    starData: [], //集集乐的星 light:已集样式 dark:未集样式
    isFail: true, //刮刮乐未中奖
    isWinning: true, //刮刮乐中奖
    isComfort: true, //刮刮乐安慰奖
    isWhole: true, //刮奖区域是否显示
    scratchId: '', //活动号
    isShowteam: false,
    winingTitle: '',
    canShow: wx.canIUse('cover-view'),
    isScroll: true, //刮刮乐当在 canvas 中移动时且有绑定手势事件时禁止屏幕滚动以及下拉刷新
    ifWxCoupon: false,
    timestamp: '',
    signature: '',
    ifGetComfort: false,
    notice: true
  },
  onLoad: function(options) {
    let that = this;
    // 判断是否有集集乐活动
    if (options.collectBenefit == 1) {
      that.getCollectBenefitData(options.detail);
      that.setData({
        'status': 1
      });
    }
    that.setData({
      'orderId': options.detail || '',
      'code': options.code || ''
    });
    that.getOrderDetail();
    that.getGoldenData(options.detail);
    let systemInfo = app.globalData.systemInfo;
    let width = 558 * systemInfo.windowWidth / 750;
    let height = 258 * systemInfo.windowWidth / 750;
    that.scratch = new Scratch(that, {
      canvasWidth: width,
      canvasHeight: height,
      imageResource: app.getSiteBaseUrl() + '/index.php?r=Download/DownloadResourceFromUrl&url=' + app.getCdnUrl() + '/static/webapp/images/scratchMovie.png',
      maskColor: "red",
      r: 15,
      callback: () => {
        that.setData({
          hideCanvas: true
        })
        //微信优惠券  主动跳转到领券页面
        if (that.data.ifWxCoupon) {
          setTimeout(function() {
            that.toAddCard()
          }, 500)
        }
      },
      imgLoadCallback: () => {
        setTimeout(function() {
          that.setData({
            isShowteam: true
          });
        }, 150);
      }
    });
  },
  touchStart: function(e) {
    if (!this.isStart) return
    let pos = this.drawRect(e.touches[0].x, e.touches[0].y)
    this.ctx.clearRect(pos[0], pos[1], pos[2], pos[2])
    this.ctx.draw(true)
  },
  touchMove: function(e) {
    if (!this.isStart) return
    let pos = this.drawRect(e.touches[0].x, e.touches[0].y)
    this.ctx.clearRect(pos[0], pos[1], pos[2], pos[2])
    this.ctx.draw(true)
  },
  touchEnd: function(e) {
    if (!this.isStart) return
    //自动清楚采用点范围值方式判断
    let {
      canvasWidth,
      canvasHeight,
      minX,
      minY,
      maxX,
      maxY
    } = this
    if (maxX - minX > .5 * canvasWidth && maxY - minY > .5 * canvasHeight) {
      this.ctx.draw()
      this.endCallBack && this.endCallBack()
      this.isStart = false
      this.page.setData({
        "isScroll": true
      })
    }
  },
  //砸金蛋
  getGoldenData: function(id) {
    let that = this;
    app.sendRequest({
      url: "/index.php?r=appLotteryActivity/getTimeAfterConsume",
      method: "post",
      data: {
        order_id: id,
        sub_app_id: that.data.franchiseeId
      },
      success: function(data) {
        if (data.data) {
          if (that.data.code) {
            that.setData({
              isWhole: true,
            })
          } else {
            that.setData({
              isWhole: false,
              scratchId: data.data
            })
          }
        } else {
          that.setData({
            isWhole: true,
          })
        }
        if (data.integral) { //支付获取积分
          that.setData({
            'rewardPointObj': {
              showModal: true,
              count: data.integral,
              callback: ''
            }
          })
        }
      }
    })
  },
  showAreaClick: function() {
    //点击刮奖
    let that = this;
    that.setData({
      isShowteam: false
    })
    app.sendRequest({
      url: "/index.php?r=appLotteryActivity/lottery",
      hideLoading: true,
      data: {
        activity_id: that.data.scratchId,
        sub_app_id: that.data.franchiseeId
      },
      success: function(res) {
        let data = res.data;
        that.scratch.start();
        if (data.title == '谢谢参与') {
          that.setData({
            isFail: false
          })
        } else {
          let params = {
            ifWxCoupon: data.card_id || false,
            timestamp: data.timestamp || '',
            signature: data.signature || ''
          };
          if (data.is_comfort) {
            params['isComfort'] = false;
          } else {
            params['isWinning'] = false;
            params['winingTitle'] = data.title;
          }
          that.setData(params)
        }
      }
    })
  },
  // 获取集集乐数据
  getCollectBenefitData: function(id) {
    let that = this;
    app.sendRequest({
      url: '/index.php?r=AppMarketing/CollectmeSendCoupon',
      data: {
        'order_id': id,
        sub_app_id: that.data.franchiseeId
      },
      hideLoading: true,
      success: function(res) {
        let starData = [];
        for (var i = 0; i < res.data.star_num; i++) {
          starData.push('light');
        }
        for (var i = 0; i < res.data.collect_num - res.data.star_num; i++) {
          starData.push('dark');
        }
        that.setData({
          'collectBenefitData': res.data,
          'starData': starData
        });
      }
    });
  },
  goToHomepage: function() {
    let router = app.getHomepageRouter();
    app.reLaunch({
      url: '/pages/' + router + '/' + router
    });
  },
  goToOrderDetail: function() {
    let groupPath = '/promotion/pages/communityGroupOrderDetail/communityGroupOrderDetail?detail=' + this.data.orderId;
    app.turnToPage(groupPath, true);
  },
  getOrderDetail: function() {
    var _this = this;
    app.getOrderDetail({
      data: {
        order_id: _this.data.orderId,
        sub_shop_app_id: _this.data.franchiseeId
      },
      success: function(res) {
        _this.setData({
          orderInfo: res.data[0].form_data
        });
      }
    })
  },
  toAddCard: function() {
    let _data = this.data,
      wxcouponId = _data.ifWxCoupon,
      _this = this;

    wx.addCard({
      cardList: [{
        cardId: wxcouponId,
        cardExt: '{"nonce_str":"' + _data.timestamp + '","timestamp":"' + _data.timestamp + '", "signature":"' + _data.signature + '"}'
      }],
      success: function(res) {
        _this.setData({
          ifWxCoupon: false,
          ifGetComfort: true
        });
        app.sendRequest({
          url: '/index.php?r=appLotteryActivity/recvWeChatCoupon',
          data: {
            card_id: res.cardList[0].cardId,
            sub_app_id: _data.franchisee,
            activity_id: _data.scratchId,
          },
          success: function(res) {
            app.showModal({
              title: '提示',
              content: '领取卡券成功',
              showCancel: false
            });
          }
        });
      }
    })
  },
  closeNotice: function() {
    this.setData({
      notice : false
    })
  },
  callPhone: function (e) {
    let phone = e.currentTarget.dataset.phone;
    app.makePhoneCall(phone);
  }
})