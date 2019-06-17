var WxParse = require('components/wxParse/wxParse.js');
var util    = require('utils/util.js');
var customEvent = require('utils/custom_event.js');

App({
  onLaunch: function () {
    let userInfo;
    if (userInfo = wx.getStorageSync('userInfo')) {
      this.globalData.userInfo = userInfo;
    }
    this.appInitial();
  },
  appInitial: function () {
    let that = this;
    this._getSystemInfo({
      success: function (res) {
        that.setSystemInfoData(res);
      }
    });

    wx.request({
      url: this.globalData.siteBaseUrl +'/index.php?r=AppUser/MarkWxXcxStatus',
      data: {
        app_id: this.getAppId(),
        his_id: this.globalData.historyDataId
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      }
    });
  },
  onShow: function (options) {
    this._logining = false;
    if ((options && [1007, 1008, 1011, 1012, 1013, 1014, 1019, 1020, 1024, 1029, 1035, 1036, 1038, 1043, 1044, 1058, 1067, 1073, 1074, 1091, 1096].indexOf(+options.scene) > -1) || !this.globalData.appOptions) {
      this.globalData.appOptions = options;
    }
    let that = this;
    if (options && options.scene && ([1011, 1012, 1013, 1007, 1008, 1035, 1036, 1047, 1048, 1049].indexOf(options.scene) > -1)){
      if(options.query.location_id){
        this.globalData.urlLocationId = options.query.location_id;
      }
      // 分销跟换user_token获取方式
      if(options.query.p_id){
        that.sendRequest({
          url: '/index.php?r=AppDistribution/GetUserTokenByPId',
          data: {
            p_id: options.query.p_id
          },
          success: res => {
            if (res.data && res.data.user_token) {
              that._getPromotionUserToken({
                user_token: res.data.user_token
              });
            }
          }
        })
      }
      if (options.query.user_token || (options.query.scene&&options.query.scene.indexOf('is_share') > -1)) {
        if(options.query.user_token){
          this._getPromotionUserToken({
            user_token: options.query.user_token
          });
        }else{
          let scene = decodeURIComponent(options.query.scene);
          let obj = {};
          let reg = /([^?&=]+)=([^?&=]*)/g;
          scene.replace(reg, function (rs, $1, $2) {
            var name = decodeURIComponent($1);
            var val = decodeURIComponent($2);
            val = String(val);
            obj[name] = val;
          });
          that.sendRequest({
            url: '/x70bSwxB/card/userTokenToUserId',
            data: {
              user_id: obj.is_share,
              app_id: that.globalData.appId
            },
            success: res => {
              if (res.data && res.data.user_token) {
                this._getPromotionUserToken({
                  user_token: res.data.user_token
                });
              }
            }
          })
        }
      }
      if (options.query.leader_user_token) {
        that.showModal({
          content: '是否要成为推广人员的团员',
          showCancel: true,
          confirm: function () {
            that._getPromotionUserToken({
              leader_user_token: options.query.leader_user_token
            });
          }
        })
      }
      if (options.query.needStatistics == 1 && options.query.statisticsType) {
        let detail = options.query.detail;
        let param = "";
        let params = {};
        let objId = (options.query.statisticsType != 9 && options.query.statisticsType != 10) ? (options.query.statisticsType == 11 ? options.path.split('/')[2] : detail) : options.query.statisticsType
        params = {
          obj_id: objId,
          type: options.query.statisticsType
        }
        if (options.query.statisticsType == 9 || options.query.statisticsType == 10) {
          params = {
            obj_id: options.query.statisticsType,
            type: options.query.statisticsType
          }
        } else if (options.query.statisticsType == 11) {
          let newOption = Object.assign({}, options.query)
          delete newOption.needStatistics;
          delete newOption.statisticsType;
          for (let i in newOption) {
            param += '&' + i + '=' + newOption[i]
          }
          params = {
            obj_id: objId,
            type: 11,
            params: param
          }
        }
        that.sendRequest({
          hideLoading: true,
          url: '/index.php?r=AppShop/AddQRCodeStat',
          method: 'POST',
          data: params
        })
      }
      if(options.query.p_u){
        that.globalData.p_u = options.query.p_u;
      }
    }
    if (options && options.scene && options.query.pageShareKey) {
      that.sendRequest({
        url: '/index.php?r=appShop/shareSuccess',
        data: {
          share_key: options.query.pageShareKey
        },
        success: res => { }
      })
    }
    // 公众号组件目前仅支持这4个场景
    if (options && options.scene && ([1011, 1047, 1089, 1038].indexOf(options.scene) == -1)){
      that.globalData.canIUseOfficialAccount = true;//不提示不兼容
    }
    // 分销判断 名片插件是否在底部导航
    let tabBarPagePathArr = this.getTabPagePathArr();
    if (tabBarPagePathArr.indexOf('/pages/tabbarPluginx70bSwxB/tabbarPluginx70bSwxB') > -1) {
      that.globalData.isVcardInTabbar = true;
      if (options.query.vcard_user_id) {
        that.globalData.vcardShareUser = options.query.vcard_user_id;
      }
    }

    let chain = wx.getStorageSync('chainStore');
    if (chain) {
      this.globalData.chainAppId = chain.app_id;
      this.globalData.chainNotLoading = true;
      this.getChainStoreInfo();
    }
  },
  onPageNotFound: function(){
    let that = this;
    let router = that.getHomepageRouter();
    that.turnToPage('/pages/' + router + '/' + router, true, function(){
      that.showModal({
        content: '您跳转的页面不存在，已经返回首页',
        success: function(){
        }
      });
    });
  },
  onError: function(error){
    this.addError(error)
  },
  onHide: function(){
    this.sendLog();
  },
  _getPromotionUserToken: function (param) {
    let that = this;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppDistribution/userBind',
      method: 'post',
      data: param,
      success: function (res) {
        // that.setPageTitle(res.data.nickname);
      },
      successStatusAbnormal: function (res) {
        if(res.status == 99){
          let homepageRouter = that.getHomepageRouter();
          that.turnToPage('/pages/' + homepageRouter + '/' + homepageRouter, true);
        }
        if (res.status == 100){
          that.turnToPage('/promotion/pages/promotionApply/promotionApply', true);
        }
      }
    });
  },


  returnSubPackageRouter: function(router){
    switch (router) {
      case 'goldenEggs':
      case 'luckyWheelDetail':
      case 'scratch':
        return '/awardManagement/pages/' + router + '/' + router;
        break;
      case 'advanceSearch':
      case 'bindCellphone':
      case 'extensionPage':
      case 'mapDetail':
        return '/default/pages/' + router + '/' + router;
        break;
      case 'addAddress':
      case 'appointmentOrderDetail':
      case 'balance':
      case 'couponList':
      case 'couponListPage':
      case 'couponReceiveListPage':
      case 'goodsAdditionalInfo':
      case 'goodsComment':
      case 'goodsOrderDetail':
      case 'goodsOrderPaySuccess':
      case 'groupCenter':
      case 'groupOrderDetail':
      case 'groupRules':
      case 'logisticsPage':
      case 'makeAppointment':
      case 'makeComment':
      case 'myAddress':
      case 'myOrder':
      case 'previewAppointmentOrder':
      case 'previewGoodsOrder':
      case 'recharge':
      case 'searchAddress':
      case 'transferOrderDetail':
      case 'transferPage':
      case 'transferPaySuccess':
      case 'verificationCodePage':
      case 'vipCard':
      case 'goodsCustomerService':
      case 'goodsFootPrint':
      case 'goodsFavorites':
        return '/eCommerce/pages/' + router + '/' + router;
        break;
      case 'shoppingCart':
        return '/eCommerce/pages/goodsShoppingCart/goodsShoppingCart';
        break;
      case 'franchiseeCooperation':
      case 'franchiseeDetail':
      case 'franchiseeDetail4':
      case 'franchiseeFacility':
      case 'franchiseeEnter':
      case 'franchiseeEnterStatus':
      case 'franchiseeList':
      case 'franchiseePerfect':
      case 'franchiseeTostore':
      case 'franchiseeWaimai':
      case 'goodsMore':
        return '/franchisee/pages/' + router + '/' + router;
        break;
      case 'communityDetail':
      case 'communityFailpass':
      case 'communityNotify':
      case 'communityPage':
      case 'communityPublish':
      case 'communityReply':
      case 'communityReport':
      case 'communityUsercenter':
      case 'newsDetail':
      case 'newsReply':
        return '/informationManagement/pages/' + router + '/' + router;
        break;
      case 'makeTostoreComment':
      case 'paySuccess':
      case 'previewOrderDetail':
      case 'previewTakeoutOrder':
      case 'takeoutMakeComment':
      case 'takeoutOrderDetail':
      case 'tostoreComment':
      case 'tostoreOrderDetail':
        return '/orderMeal/pages/' + router + '/' + router;
        break;
      case 'promotionApply':
      case 'promotionCommission':
      case 'promotionGoods':
      case 'promotionLeaderPromotion':
      case 'promotionMyIdentity':
      case 'promotionMyPromotion':
      case 'promotionShopSetting':
      case 'promotionTeam':
      case 'promotionUserCenter':
      case 'promotionUserLevel':
      case 'promotionWithdraw':
      case 'promotionWithdrawOffline':
      case 'promotionWithdrawRecord':
      case 'communityGroupGoodDetail':
      case 'communityGroupSearchVillage':
        return '/promotion/pages/' + router + '/' + router;
        break;
      case 'myIntegral':
      case 'myMessage':
      case 'vipCardList':
      case 'winningRecord':
        return '/userCenter/pages/' + router + '/' + router;
        break;
      case 'videoAssess':
      case 'videoDetail':
      case 'videoUsercenter':
        return '/video/pages/' + router + '/' + router;
        break;
      case 'userCenter':
        return '/pages/userCenter/userCenter';
        break;
      case 'myGroup':
         return '/group/pages/gpmyOrder/gpmyOrder';
         break
    }
  },
  _getSystemInfo: function (options) {
    wx.getSystemInfo({
      success: function (res) {
        typeof options.success === 'function' && options.success(res);
      },
      fail: function (res) {
        typeof options.fail === 'function' && options.fail(res);
      },
      complete: function (res) {
        typeof options.complete === 'function' && options.complete(res);
      }
    });
  },
  sendRequest: function (param, customSiteUrl) {
    let that   = this;
    let data   = param.data || {};
    let header = param.header;
    let requestUrl;

    if(param.subshop){
      data._app_id = data.app_id = param.subshop;
      param.chain = false;
    }
    if (param.chain && this.globalData.chainAppId){
      data._app_id = data.app_id = this.getChainAppId();
    }

    if(data.app_id){
      data._app_id = data.app_id;
    } else {
      data._app_id = data.app_id = this.getAppId();
    }

    if(!this.globalData.notBindXcxAppId){
      data.session_key = this.getSessionKey();
    }

    if(customSiteUrl) {
      requestUrl = customSiteUrl + param.url;
    } else {
      requestUrl = this.globalData.siteBaseUrl + param.url;
    }

    if(param.method){
      if(param.method.toLowerCase() == 'post'){
        data = this._modifyPostParam(data);
        header = header || {
          'content-type': 'application/x-www-form-urlencoded;'
        }
      }
      param.method = param.method.toUpperCase();
    }

    if(!param.hideLoading){
      this.showLoading({
        title: '请求中...'
      });
    }
    wx.request({
      url: requestUrl,
      data: data,
      method: param.method || 'GET',
      header: header || {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode && res.statusCode != 200) {
          that.hideToast();
          that.showToast({
            title: ''+res.errMsg,
            icon: 'none'
          });
          typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal(res.data);
          return;
        }
        if (res.data.status) {
          if (res.data.status == 2 || res.data.status == 401) {
            that.goLogin({
              success: function () {
                that.sendRequest(param, customSiteUrl);
              },
              fail: function () {
                typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal(res.data);
              }
            });
            return;
          }
          if(res.data.status == 5){
            typeof param.successStatus5 == 'function' && param.successStatus5(res.data);
            return;
          }
          if (res.data.status != 0) {
            if (typeof param.successStatusAbnormal == 'function' && (param.successStatusAbnormal(res.data) === false)) {
              return;
            }
            that.hideToast();
            that.showModal({
              content: ''+res.data.data,
              confirm : function() {
                typeof param.successShowModalConfirm == 'function' && param.successShowModalConfirm(res.data);
              }
            });
            return;
          }
        }
        typeof param.success == 'function' && param.success(res.data);
      },
      fail: function (res) {
        console.log('request fail:', requestUrl, res.errMsg);
        that.addLog('request fail:', requestUrl, res.errMsg);
        that.hideToast();
        if(res.errMsg == 'request:fail url not in domain list'){
          that.showToast({
            title: '请配置正确的请求域名',
            icon: 'none',
            duration: 2000
          });
        }
        typeof param.fail == 'function' && param.fail(res.data);
      },
      complete: function (res) {
        param.hideLoading || that.hideLoading();
        typeof param.complete == 'function' && param.complete(res.data);
      }
    });
  },
  _modifyPostParam: function (obj) {
    let query = '';
    let name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this._modifyPostParam(innerObj) + '&';
        }
      } else if (value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this._modifyPostParam(innerObj) + '&';
        }
      } else if (value !== undefined && value !== null) {
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  },
  turnToPage: function (url, isRedirect) {
    let tabBarPagePathArr = this.getTabPagePathArr();
    if (this.globalData.turnToPageFlag)return;
    this.globalData.turnToPageFlag = true;
    setTimeout(() => {
      this.globalData.turnToPageFlag = false;
    }, 1000);
    let curl = url.replace(/\?(.)+/, '');
    if(tabBarPagePathArr.indexOf(curl) != -1) {
      this.switchToTab(url);
      return;
    }
    let router = url.split('/');
    router = router[router.length-2];
    if(/page/.test(router)){
      let subPack = this.subPackagePages || {};
      for(let i in subPack){
        if (subPack[i].indexOf(router) > -1){
          url = '/' + i + url;
          break;
        }
      }
    }
    if(this.globalData.chainAppId){
      url = this.chainTurnToPage(url);
    }
    if(!isRedirect){
      wx.navigateTo({
        url: url,
        complete: (res) => {
          if (res.errMsg && /fail/i.test(res.errMsg)) {
            let errMsg = '跳转的页面不存在';
            if (/webview\scount\slimit\sexceed/i.test(res.errMsg)) {
              errMsg = '页面栈达到最大10层限制，跳转失败';
            }
            this.showModal({
              content: errMsg
            });
          }
        }
      });
    } else {
      wx.redirectTo({
        url: url,
        complete: (res) => {
          if (res.errMsg && /fail/i.test(res.errMsg)) {
            this.showModal({
              content: '跳转的页面不存在'
            });
          }
        }
      });
    }
    this.setPageRouter(url);
  },
  chainTurnToPage: function(url){
    let that = this;
    let router = url.split('/');
    router = router[router.length-2];
    let pages = ['shoppingCart', 'tabbarShoppingCart', 'groupCenter', 'tabbarGroupCenter', 'tabbarTransferPage', 'winningRecord'];
    if(pages.indexOf(router) > -1){
      let m = url.match(/(^|&|\?)franchisee=([^&]*)(&|$)/);
      if(!(m && m[2])){
        if(/\?/.test(url)){
          url += '&franchisee=' + that.globalData.chainAppId;
        }else{
          url += '?franchisee=' + that.globalData.chainAppId;
        }
      }
    }
    return url;
  },
  reLaunch: function (options) {
    this.setPageRouter(options.url);

    wx.reLaunch({
      url: options.url,
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  switchToTab: function (url) {
    wx.switchTab({
      url: url
    });
  },
  turnBack: function (options) {
    options = options || {};
    wx.navigateBack({
      delta: options.delta || 1
    });
  },
  navigateToXcx: function (param = {}) {
    let that = this;
    if (wx.navigateToMiniProgram) {
      wx.navigateToMiniProgram({
        appId: param.appId,
        path: param.path,
        fail: function (res) {
          that.showModal({
            content: '' + res.errMsg
          })
        }
      });
    } else {
      this.showUpdateTip();
    }
  },
  setPageTitle: function (title) {
    wx.setNavigationBarTitle({
      title: title
    });
  },
  showToast: function (param) {
    wx.showToast({
      title: param.title,
      icon: param.icon,
      duration: param.duration || 1500,
      success: function (res) {
        typeof param.success == 'function' && param.success(res);
      },
      fail: function (res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  hideToast: function () {
    wx.hideToast();
  },
  showLoading: function(param){
    wx.showLoading({
      title: param.title,
      success: function (res) {
        typeof param.success == 'function' && param.success(res);
      },
      fail: function (res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  hideLoading: function(){
    wx.hideLoading();
  },
  showModal: function (param) {
    wx.showModal({
      title: param.title || '提示',
      content: param.content,
      showCancel: param.showCancel || false,
      cancelText: param.cancelText || '取消',
      cancelColor: param.cancelColor || '#000000',
      confirmText: param.confirmText || '确定',
      confirmColor: param.confirmColor || '#3CC51F',
      success: function (res) {
        if (res.confirm) {
          typeof param.confirm == 'function' && param.confirm(res);
        } else {
          typeof param.cancel == 'function' && param.cancel(res);
        }
      },
      fail: function (res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  chooseVideo: function (callback, maxDuration) {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: maxDuration || 60,
      camera: ['front', 'back'],
      success: function (res) {
        typeof callback == 'function' && callback(res.tempFilePaths[0]);
      }
    })
  },
  chooseImage: function (callback, count) {
    let that = this;
    wx.chooseImage({
      count: count || 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths,
            imageUrls = [],
            imglength = 0;

        that.showToast({
          title: '提交中...',
          icon: 'loading',
          duration: 10000
        });
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url : that.globalData.siteBaseUrl+ '/index.php?r=AppData/uploadImg',
            filePath: tempFilePaths[i],
            name: 'img_data',
            success: function (res) {
              let data = JSON.parse(res.data);
              if (data.status == 0) {
                // imageUrls.push(data.data);
                imageUrls[i] = data.data;
                imglength++;
                if (imglength == tempFilePaths.length) {
                  that.hideToast();
                  typeof callback == 'function' && callback(imageUrls);
                }
              } else {
                that.hideToast();
                that.showModal({
                  content: data.data
                })
              }
            },
            fail: function (res) {
              that.hideToast();
              that.showModal({
                content: '' + res.errMsg
              });
            }
          })
        }
      },
      fail: function (res) {
        if (res.errMsg != 'chooseImage:fail cancel'){
          that.showModal({
            content: '' + res.errMsg
          })
        }
      }
    })
  },
  previewImage: function (options) {
    wx.previewImage({
      current: options.current || '',
      urls: options.urls || [options.current]
    })
  },
  playVoice: function (filePath) {
    wx.playVoice({
      filePath: filePath
    });
  },
  pauseVoice: function () {
    wx.pauseVoice();
  },
  countUserShareApp: function (callback) {
    let addTime = Date.now();
    this.sendRequest({
      url: '/index.php?r=AppShop/UserShareApp',
      complete: function (res) {
        if (res.status == 0) {
          typeof callback === 'function' && callback(addTime);
        }
      }
    });
  },
  getShareKey: function(){
    let that = this;
    that.sendRequest({
      url: "/index.php?r=appShop/getAppShareKey",
      success: res=>{
        if(res.status == 0){
          that.globalData.pageShareKey = res.data;
        }
      }
    })
  },
  shareAppMessage: function (options) {
    let that = this,
        pageInstance = this.getAppCurrentPage(),
        pageShareKey = that.globalData.pageShareKey,
        path = options.path;
        if (pageShareKey) {
          if (path.indexOf('?') < 0) {
            path = path + '?pageShareKey=' + pageShareKey
          } else {
            path = path + '&pageShareKey=' + pageShareKey
          }
        } else {
          path = path
        }
    return {
      title: options.title || this.getAppTitle() || '即速应用',
      desc: options.desc || this.getAppDescription() || '即速应用，拖拽生成app，无需编辑代码，一键打包微信小程序',
      path: path,
      imageUrl: options.imageUrl || '',
      success: function () {
        // // 统计用户分享
        // that.countUserShareApp(options.success);
      },
      complete:function(res){
        if (pageInstance.data.needbackToHomePage){
          pageInstance.setData({
            backToHomePage: {
              showButton: true
            },
            needbackToHomePage: false
          })
        }
      }
    }
  },

  wxPay: function (param) {
    let _this = this;
    wx.requestPayment({
      'timeStamp': param.timeStamp,
      'nonceStr': param.nonceStr,
      'package': param.package,
      'signType': param.signType,
      'paySign': param.paySign,
      success: function(res){
        _this.wxPaySuccess(param);
        typeof param.success === 'function' && param.success();
      },
      fail: function(res){
        if(res.errMsg === 'requestPayment:fail cancel'){
          _this.showModal({
            content: '支付已取消',
            complete: function(){
              typeof param.fail === 'function' && param.fail();
            }
          });
          return;
        }
        if(res.errMsg === 'requestPayment:fail'){
          res.errMsg = '支付失败';
        }
        _this.showModal({
          content: res.errMsg
        })
        _this.wxPayFail(param, res.errMsg);
        typeof param.fail === 'function' && param.fail();
      }
    })
  },
  wxPaySuccess: function (param) {
    let orderId = param.orderId,
        goodsType = param.goodsType,
        formId = param.package.substr(10),
        t_num = goodsType == 1 ? 'AT0104':'AT0009';

    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/SendXcxOrderCompleteMsg',
      data: {
        formId: formId,
        t_num: t_num,
        order_id: orderId
      }
    })
  },
  wxPayFail: function (param, errMsg) {
    let orderId = param.orderId,
        formId = param.package.substr(10);

    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/SendXcxOrderCompleteMsg',
      data: {
        formId: formId,
        t_num: 'AT0010',
        order_id: orderId,
        fail_reason: errMsg
      }
    })
  },
  makePhoneCall: function (number, callback) {
    wx.makePhoneCall({
      phoneNumber: number,
      success: callback
    })
  },
  getLocation: function (options) {
    wx.getLocation({
      type: options.type || 'wgs84',
      altitude: options.altitude || false,
      success: function(res){
        typeof options.success === 'function' && options.success(res);
      },
      fail: function(res){
        typeof options.fail === 'function' && options.fail(res);
      }
    })
  },
  chooseLocation: function (options) {
    let that = this;
    wx.chooseLocation({
      success: function(res){
        typeof options.success === 'function' && options.success(res);
      },
      cancel: options.cancel,
      fail: function(res){
        if (res.errMsg === 'chooseLocation:fail auth deny'){
          that.showModal({
            content: '您之前拒绝授权我们使用您的定位，致使我们无法定位，是否重新授权定位？',
            showCancel: true,
            cancelText: "否",
            confirmText: "是",
            confirm: function () {
              wx.openSetting({
                success: function (res) {
                  if (res.authSetting['scope.userLocation'] === true) {
                    that.chooseLocation(options);
                  }
                }
              })
            },
            cancel : function(){
              typeof options.fail === 'function' && options.fail();
            }
          })
        }else{
          typeof options.fail === 'function' && options.fail();
        }
      }
    });
  },
  openLocation: function (options) {
    wx.openLocation(options);
  },
  setClipboardData: function (options) {
    wx.setClipboardData({
      data: options.data || '',
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  getClipboardData: function (options) {
    wx.getClipboardData({
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  showShareMenu: function (options) {
    options = options || {};
    wx.showShareMenu({
      withShareTicket: options.withShareTicket || false,
      success: options.success,
      fail: options.fail,
      complete: options.complete
    });
  },
  scanCode: function (options) {
    options = options || {};
    wx.scanCode({
      onlyFromCamera: options.onlyFromCamera || false,
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  pageScrollTo: function (scrollTop) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: scrollTop
      });
    } else {
      this.showUpdateTip();
    }
  },
  getAuthSetting: function () {
    wx.getSetting({
      success: function (res) {
        return res.authSetting;
      },
      fail: function () {
        return {};
      }
    })
  },
  getStorage: function (options) {
    options = options || {};
    wx.getStorage({
      key: options.key || '',
      success: function (res) {
        typeof options.success === 'function' && options.success(res);
      },
      fail: function () {
        typeof options.fail === 'function' && options.fail();
      },
      complete: function () {
        typeof options.complete === 'function' && options.complete();
      }
    })
  },
  setStorage: function (options) {
    options = options || {};
    wx.setStorage({
      key: options.key || '',
      data: options.data || '',
      success: function () {
        typeof options.success === 'function' && options.success();
      },
      fail: function () {
        typeof options.fail === 'function' && options.fail();
      },
      complete: function () {
        typeof options.complete === 'function' && options.complete();
      }
    })
  },
  removeStorage: function (options) {
    options = options || {};
    wx.removeStorage({
      key: options.key || '',
      success: function () {
        typeof options.success === 'function' && options.success();
      },
      fail: function () {
        typeof options.fail === 'function' && options.fail();
      },
      complete: function () {
        typeof options.complete === 'function' && options.complete();
      }
    })
  },
  createAnimation: function (options) {
    options = options || {};
    return wx.createAnimation({
      duration: options.duration,
      timingFunction: options.timingFunction,
      transformOrigin: options.transformOrigin,
      delay: options.delay
    });
  },
  chooseAddress: function (options) {
    let that = this;
    options = options || {};
    wx.chooseAddress({
      success: function (res) {
        typeof options.success === 'function' && options.success(res);
      },
      fail: function (res) {
        if (res && (res.errMsg === "chooseAddress:fail auth deny" || res.errMsg === "chooseAddress:fail:auth denied" )) {
          wx.showModal({
            title: '提示',
            content: '获取通讯地址失败，这将影响您使用小程序，您可以点击右上角的菜单按钮，选择关于。进入之后再点击右上角的菜单按钮，选择设置，然后将通讯地址按钮打开，返回之后再重试。',
            showCancel: false,
            confirmText: "确定",
            success: function (res) {
            }
          })
        }else{
          typeof options.fail === 'function' && options.fail(res);
        }
      },
      complete: function (res) {
        typeof options.complete === 'function' && options.complete(res);
      }
    })
  },
  downloadFile : function(url, successfn){
    wx.downloadFile({
      url: url,
      success: function(res) {
        successfn && successfn(res);
      }
    })
  },
  connectWifi:function(option){
    wx.connectWifi({
      SSID: option.SSID || '',
      BSSID: option.BSSID || '',
      password: option.password || '',
      success: function(res){
        option.success && option.success(res)
      },
      fail:function(res){
        option.fail && option.fail(res)
      },
      complete:function(res){
        option.complete && option.complete(res);
      }
    })
  },
  startWifi:function(option){
    wx.startWifi({
      success:function(res){
        option.success && option.success(res);
      },
      fail:function(res){
        option.fail && option.fail(res);
      },
      complete:function (res) {
        option.complete && option.complete(res);
      }
    })
  },
  wifiErrCode:function(code){
    switch(code){
      case 12000:
        return '未初始化Wi-Fi模块';
        break;
      case 12001:
        return '系统暂不支持连接 Wi-Fi';
        break;
      case 12002:
        return 'Wi-Fi 密码错误';
        break;
      case 12003:
        return '连接超时';
        break;
      case 12004:
        return '重复连接 Wi-Fi';
        break;
      case 12005:
        return '未打开 Wi-Fi 开关';
        break;
      case 12006:
        return '未打开 GPS 定位开关';
        break;
      case 12007:
        return '已拒绝授权链接 Wi-Fi';
        break;
      case 12008:
        return 'Wi-Fi名称无效';
        break;
      case 12009:
        return '运营商配置拒绝连接 Wi-Fi';
        break;
      case 12010:
        return '系统错误';
        break;
      case 12011:
        return '无法配置 Wi-Fi';
        break;
      default:
        return '连接失败';
        break;
    }
  },
  checkSession: function(callback){
    let that = this;
    wx.checkSession({
      success: function () {
        typeof callback == 'function' && callback();
        console.log('session valid');
      },
      fail: function () {
        console.log('session Invalid');
        that.setSessionKey('');
        that._login({
          success: function(){
            typeof callback == 'function' && callback();
          }
        });
      }
    })
  },
  goLogin: function (options) {
    this._sendSessionKey(options);
  },
  isLogin: function () {
    return this.getIsLogin();
  },
  _sendSessionKey: function (options) {
    let that = this, key;
    try {
      key = wx.getStorageSync('session_key');
    } catch(e) {
      console.log('wx.getStorageSync session_key error');
      console.log(e);
      that.addLog('wx.getStorageSync session_key error');
    }
    console.log('_logining', that._logining);
    that.addLog('_logining', that._logining);
    if(that._logining){
      that.globalData.showGetUserInfoOptions.push(options);
      return;
    }
    that._logining = true;
    that.globalData.showGetUserInfoOptions = [];
    that.globalData.showGetUserInfoOptions.push(options);

    if (!key) {
      console.log("check login key=====");
      that.addLog("check login key=====");
      this._login();

    } else {
      this.globalData.sessionKey = key;
      let addTime = Date.now();
      this.sendRequest({
        hideLoading: true,
        url: '/index.php?r=AppUser/onLogin',
        success: function (res) {
          if (!res.is_login) {
            that._login();
            return;
          } else if (res.is_login == 2) {
            that.globalData.notBindXcxAppId = true;
          }
          that._requestUserInfo(res.is_login);
          if (!that.globalData.isGoBindPhone){
            that.loginForRewardPoint(addTime);
          }
        },
        fail: function (res) {
          console.log('_sendSessionKey fail');
          that.addLog('_sendSessionKey fail');
          let callback = that.globalData.showGetUserInfoOptions;
          for(let i = 0; i < callback.length; i++){
            let options = callback[i];
            typeof options.fail == 'function' && options.fail(res);
          }
        },
        successStatusAbnormal: function(){
          that._logining = false;
        }
      });
    }
  },
  _logining: false,
  _login: function () {
    let that = this;

    wx.login({
      success: function (res) {
        if (res.code) {
          that._sendCode(res.code);
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
          that.addLog('获取用户登录态失败！' + res.errMsg);
        }
      },
      fail: function (res) {
        that._logining = false;
        console.log('login fail: ' + res.errMsg);
        that.addLog('login fail: ' + res.errMsg);
      }
    })
  },
  _sendCode: function (code) {
    let that = this;
    let addTime = Date.now();
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppUser/onLogin',
      data: {
        code: code
      },
      success: function (res) {
        if (res.is_login == 2) {
          that.globalData.notBindXcxAppId = true;
        }
        that.setSessionKey(res.data || that.globalData.sessionKey);
        that._requestUserInfo(res.is_login);
        if (!that.globalData.isGoBindPhone) {
          that.loginForRewardPoint(addTime);
        }
      },
      fail: function (res) {
        that._logining = false;
        console.log('_sendCode fail');
        that.addLog('_sendCode fail');
      },
      successStatusAbnormal: function(){
        that._logining = false;
      }
    })
  },
  _requestUserInfo: function (is_login) {
    if (is_login == 1) {
      this._requestUserXcxInfo();
    } else {
      this._requestUserWxInfo();
    }
  },
  _requestUserXcxInfo: function () {
    let that = this;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppData/getXcxUserInfo',
      success: function (res) {
        if (res.data) {
          that.setUserInfoStorage(res.data);
        }
        that.setIsLogin(true);
        that.getShareKey();
        that._isPromotionPerson();
        that._hasSelfCard();
        let callback = that.globalData.showGetUserInfoOptions;
        for(let i = 0; i < callback.length; i++){
          let options = callback[i];
          typeof options.success === 'function' && options.success();
        }
      },
      fail: function (res) {
        console.log('_requestUserXcxInfo fail');
        that.addLog('_requestUserXcxInfo fail');
      },
      complete: function(){
        that._logining = false;
      }
    })
  },
  _requestUserWxInfo: function () {
    let that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            lang: 'zh_CN',
            success: function (msg) {
              that._sendUserInfo(msg.userInfo);
            },
            fail: function(msg){
              console.log('getUserInfo fail');
              that.addLog('getUserInfo fail', msg);
            }
          })
        }else{
          let pageInstance = that.getAppCurrentPage();
          pageInstance.setData({
            showGetUserInfo: true
          });
        }
      },
      fail: function(res){
        let pageInstance = that.getAppCurrentPage();
        pageInstance.setData({
          showGetUserInfo: true
        });
      }
    })

  },
  _sendUserInfo: function (userInfo) {
    let that = this;
    let pageInstance = that.getAppCurrentPage();
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppUser/LoginUser',
      method: 'post',
      data: {
        nickname: userInfo['nickName'],
        gender: userInfo['gender'],
        city: userInfo['city'],
        province: userInfo['province'],
        country: userInfo['country'],
        avatarUrl: userInfo['avatarUrl']
      },
      success: function (res) {
        that.setUserInfoStorage(res.data.user_info);
        that.setIsLogin(true);
        that.getShareKey();
        that._isPromotionPerson();
        that._hasSelfCard();
        let callback = that.globalData.showGetUserInfoOptions;
        for(let i = 0; i < callback.length; i++){
          let options = callback[i];
          typeof options.success === 'function' && options.success();
        }
      },
      fail: function (res) {
        console.log('_sendUserInfo fail');
        that.addLog('_sendUserInfo fail');
        let callback = that.globalData.showGetUserInfoOptions;
        for(let i = 0; i < callback.length; i++){
          let options = callback[i];
          typeof options.fail == 'function' && options.fail(res);
        }
      },
      complete: function(){
        pageInstance.setData({
          showGetUserInfo: false
        });
        that._logining = false;
      }
    })
  },

  onPageLoad: function (event) {
    let pageInstance  = this.getAppCurrentPage();
    let detail        = event.detail || '';
    let promotionName = event.promotionName;
    let that = this;
    pageInstance.sharePageParams = event;

    for (let i = 0; i < componentArr.length; i++){
      let type = componentArr[i];
      let comp = customComponent[type];
      for (let j in comp.events){
        pageInstance[j] = comp[j];
      }
    }

    let appOption = this.globalData.appOptions;
    if (appOption && appOption.path && appOption.path.split('/')[1] != this.globalData.homepageRouter && this.getTabPagePathArr().indexOf('/' + appOption.path) == -1 && appOption.path == pageInstance.route && !pageInstance.isbackHome) {
      pageInstance.isbackHome = true;
      pageInstance.setData({
        'backToHomePage': {
          showButton: true,
          showTip: true
        }
      })
    } else {
      pageInstance.setData({
        'backToHomePage': {
          showButton: false,
          showTip: false
        }
      })
    }
    pageInstance.setData({
      dataId: detail,
      addShoppingCartShow: false,
      addTostoreShoppingCartShow: false,
      // 微信开放组件兼容性
      canIUseOfficialAccount: that.globalData.canIUseOfficialAccount
    });
    this.setPageUserInfo();
    if (detail) {
      pageInstance.dataId = detail;
    }
    if (promotionName) {
      let userInfo = this.getUserInfo();
      this.setPageTitle(promotionName);
    }
    if (!!pageInstance.carouselGroupidsParams) {
      for(let i in pageInstance.carouselGroupidsParams){
        let compid = pageInstance.carouselGroupidsParams[i].compid;
        let carouselgroupId = pageInstance.carouselGroupidsParams[i].carouselgroupId;
        if(carouselgroupId){
          let deletePic = {};
          deletePic[compid + '.content'] = [];
          pageInstance.setData(deletePic);
        }
      }
    }
    this.globalData.takeoutRefresh = false;
    this.globalData.tostoreRefresh = false;
    if(pageInstance.page_router){
      this.globalData['franchiseeTplChange-' + pageInstance.page_router] = false;
    }

    if(!this.globalData.chainNotLoading){
      pageInstance.dataInitial();
    }

    if (that.globalData.isGoBindPhone){
      that.loginForRewardPoint(that.globalData.loginGetIntegralTime);
      that.globalData.loginGetIntegralTime = '';
      that.globalData.isGoBindPhone = false;
    }
  },
  pullRefreshTime : '',
  onPagePullDownRefresh: function(){
    let pageInstance  = this.getAppCurrentPage();
    let that = this;

    let downcountArr = pageInstance.downcountArr;
    if(downcountArr && downcountArr.length){
      for (let i = 0; i < downcountArr.length; i++) {
        downcountArr[i] && downcountArr[i].clear();
      }
    }

    let dco = pageInstance.downcountObject;
    for (let key in dco) {
      let dcok = dco[key]
      if (dcok && dcok.length) {
        for (let i = 0; i < dcok.length; i++) {
          dcok[i] && dcok[i].clear();
        }
      }
    }

    //秒杀清除定时器
    let downcountObject = pageInstance.downcountObject;
    for (let key in downcountObject) {
      if (downcountObject[key] && downcountObject[key].length) {
        let downcountObjectNew = downcountObject[key]
        for (let i = 0; i < downcountObjectNew.length; i++) {
          downcountObjectNew[i] && downcountObjectNew[i].clear();
        }
      }
    }

    pageInstance.setData({
      addShoppingCartShow: false,
      addTostoreShoppingCartShow: false
    });
    this.setPageUserInfo();
    pageInstance.requestNum = 1;
    this.pageDataInitial(true);

    clearTimeout(this.pullRefreshTime);
    this.pullRefreshTime = setTimeout(function(){
      wx.stopPullDownRefresh();
    }, 3000);
  },
  setPageScroll: function (pageInstance){
    let that = this;
    for (let i in pageInstance.data) {

      if (pageInstance.data[i] && pageInstance.data[i].hidden) { // 判断组件是否隐藏
        continue;
      }

      if (/^bbs[\d]+$/.test(i)) {
        pageInstance.reachBottomFuc = [{
          param: {
            compId: i
          },
          triggerFuc: function (param) {
            customComponent['bbs'].bbsScrollFuc(param.compId);
          }
        }];
      }
      if (/^list_vessel[\d]+$/.test(i)) {
        let component = pageInstance.data[i];
        if (component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0) {
          pageInstance.reachBottomFuc = [{
            param: component,
            triggerFuc: function (param) {
              that.pageScrollFunc(param.compId);
            }
          }];
        }
      }
      if (/^goods_list[\d]+$/.test(i)) {
        let component = pageInstance.data[i];
        if (component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0) {
          pageInstance.reachBottomFuc = [{
            param: component,
            triggerFuc: function (param) {
              that.goodsScrollFunc(param.compId);
            }
          }];
        }
      }
      if (/^seckill[\d]+$/.test(i)) {
        let component = pageInstance.data[i];
        if (component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0) {
          pageInstance.reachBottomFuc = [{
            param: component,
            triggerFuc: function (param) {
              customComponent['seckill'].seckillScrollFunc(param.compId);
            }
          }];
        }
      }
      if (/^video_list[\d]+$/.test(i)) {
        let component = pageInstance.data[i];
        if (component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0) {
          pageInstance.reachBottomFuc = [{
            param: component,
            triggerFuc: function (param) {
              customComponent['video-list'].videoScrollFunc(param.compId);
            }
          }];
        }
      }
      if (/^news[\d]+$/.test(i)) { //资讯列表滚动到底部加载数据,只能有一个
        let component = pageInstance.data[i],
          needAdd = (component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0) || component.customFeature.vesselAutoheight === undefined;
        if (needAdd) {
          pageInstance.reachBottomFuc = [{
            param: component,
            triggerFuc: function (param) {
              customComponent['news'].getNewsList({compid: param.compId});
            }
          }]
        }
      }
      if (/^topic[\d]+$/.test(i)) { //话题列表滚动到底部加载数据,只能有一个
        let component = pageInstance.data[i];
        if (component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0) {
          pageInstance.reachBottomFuc = [{
            param: component,
            triggerFuc: function (param) {
              customComponent['topic'].getTopListData(pageInstance, param.compId);
            }
          }]
        }
      }
      if (/^franchisee_list[\d]+$/.test(i)) { //多商家列表滚动到底部加载数据,只能有一个
        let component = pageInstance.data[i];
        if (component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0) {
          pageInstance.reachBottomFuc = [{
            param: component,
            triggerFuc: function (param) {
              that.franchiseeScrollFunc(param.compId);
            }
          }];
        }
      }
      if (/^exchange_coupon[\d]+$/.test(i)) { //多商家列表滚动到底部加载数据,只能有一个
        let component = pageInstance.data[i];
        if (component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0) {
          pageInstance.reachBottomFuc = [{
            param: component,
            triggerFuc: function (param) {
              that.exchangeCouponScrollFunc(param.compId);
            }
          }];
        }
      }
      if (/^dynamic_classify[\d]+$/.test(i)) { //动态分类滚动到底部加载数据,只能有一个
        let component = pageInstance.data[i];
        if (component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0) {
          pageInstance.reachBottomFuc = [{
            param: component,
            triggerFuc: function (param) {
              that.pageScrollFunc(param.compId);
            }
          }];
        }
      }
      if (/^community_group[\d]+$/.test(i)) { //社区团购滚动到底部加载数据,只能有一个
        let component = pageInstance.data[i];
        if (component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0) {
          pageInstance.reachBottomFuc = [{
            param: component,
            triggerFuc: function (param) {
              that.communityGroupScrollFunc(param.compId);
            }
          }];
        }
      }
      if (/^group_buy_list[\d]+$/.test(i)) { //拼团滚动到底部加载数据,只能有一个
        let component = pageInstance.data[i];
        if (component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0) {
          pageInstance.reachBottomFuc = [{
            param: component,
            triggerFuc: function (param) {
              customComponent["group-buy-list"].catchMoreGroupList(param.compId);
            }
          }];
        }
      }
    }
  },

  pageDataInitial: function (isPullRefresh, pageIn) {
    let _this          = this;
    let pageInstance   = pageIn || this.getAppCurrentPage();
    let pageRequestNum = pageInstance.requestNum;
    let newdata        = {};
    pageInstance.downcountObject = {};

    if(!pageInstance.pageLoaded){
      this._getPageData(pageInstance.page_router);
      return;
    }

    if (!isPullRefresh){
      _this.setPageScroll(pageInstance);
    }

    if (pageInstance.slidePanelComps.length) {
      for (let i in pageInstance.slidePanelComps){
        let compid = pageInstance.slidePanelComps[i].compid;
        customComponent["sliding-panel"].init(compid, pageInstance);
      }
    }
    if (!!pageInstance.exchangeCouponComps.length) {
      for (let i in pageInstance.exchangeCouponComps) {
        let compid = pageInstance.exchangeCouponComps[i].compid;
        customComponent["exchange-coupon"].init(compid, pageInstance);
      }
    }
    // 优先判断页面是否绑定了数据对象，没有绑定时直接展示页面，绑定时就等数据请求之后再展示
    if (!!pageInstance.dataId && !!pageInstance.page_form) {
      let dataid = parseInt(pageInstance.dataId);
      let param = {};

      param.data_id = dataid;
      param.form = pageInstance.page_form;

      pageInstance.requestNum = pageRequestNum + 1;
      _this.sendRequest({
        hideLoading: pageRequestNum++ == 1 ? false : true,
        url: '/index.php?r=AppData/getFormData',
        data: param,
        method: 'post',
        chain: true,
        success: function (res) {
          let newdata = {};
          let formdata = res.data[0].form_data;

          for (let i in formdata) {
            if (i == 'category') {
              continue;
            }
            if(/region/.test(i)){
              continue;
            }

            let description = formdata[i];
            if (_this.needParseRichText(description)) {
              formdata[i] = _this.getWxParseResult(description,  'detail_data.' + i);
            }
          }
          newdata['detail_data'] = formdata;
          pageInstance.setData(newdata);

          // 当有视频字段时，请求视频链接，并放到数据里
          let field = _this.getFormPageField(pageInstance.data);
          for (let i in formdata) {
            if (field.indexOf(i) > -1 && formdata[i] instanceof Object && formdata[i].type === 'video') {
              let video = formdata[i];

              pageInstance.requestNum = pageRequestNum + 1;
              _this.sendRequest({
                hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
                url: '/index.php?r=AppVideo/GetVideoLibUrl',
                data: {
                  id : video.id
                },
                chain: true,
                method: 'get',
                success: function (res) {
                  let videoUrl = res.data,
                      newdata = {};

                  newdata['detail_data.'+i+'.videoUrl'] = videoUrl;
                  pageInstance.setData(newdata);
                }
              });
            }
          }

          if (pageInstance.carouselGroupidsParams && !!pageInstance.carouselGroupidsParams.length) {
            for (let i in pageInstance.carouselGroupidsParams) {
              let compid = pageInstance.carouselGroupidsParams[i].compid;
              customComponent["carousel"].detailPageInit(compid, pageInstance);
            }
          }

          if (!!pageInstance.dynamicVesselComps.length) {
            for (let i in pageInstance.dynamicVesselComps) {
              let compid = pageInstance.dynamicVesselComps[i].compid;
              customComponent["dynamic-vessel"].detailPageInit(compid, pageInstance, formdata);
            }
          }
        },
        complete: function () {
          pageInstance.setData({
            page_hidden: false
          });
        }
      })
    } else {
      pageInstance.setData({
        page_hidden: false
      });
    }

    if (!!pageInstance.carouselGroupidsParams.length) {
      for (let i in pageInstance.carouselGroupidsParams) {
        let compid = pageInstance.carouselGroupidsParams[i].compid;
        customComponent["carousel"].init(compid, pageInstance);
      }
    }

    if (pageInstance.user_center_compids_params.length) {
      for (let i in pageInstance.user_center_compids_params) {
        let compid = pageInstance.user_center_compids_params[i].compid
        this._initUserCenterData(pageInstance, compid);
      }
    }
    if (!!pageInstance.list_compids_params.length) {
      for (let i in pageInstance.list_compids_params) {
        let compid = pageInstance.list_compids_params[i].compid;
        customComponent["list-vessel"].init(compid, pageInstance);
      }
    }

    if (!!pageInstance.goods_compids_params.length) {
      for (let i in pageInstance.goods_compids_params) {
        let compid = pageInstance.goods_compids_params[i].compid;
        let param = pageInstance.goods_compids_params[i].param;
        let compData = pageInstance.data[compid];
        let customFeature = compData.customFeature;
        let newInitData = {};
        newInitData[compid + '.goods_data'] = [];
        newInitData[compid + '.is_more'] = 1;
        newInitData[compid + '.loadingFail'] = false;
        newInitData[compid + '.curpage'] = 0;
        pageInstance.setData(newInitData);
        param.page = 1;
        if (customFeature.controlCheck) {
          param.is_integral = 3
          pageInstance.goods_compids_params[i].param.is_integral = 3
        } else {
          if (customFeature.isIntegral) {
            param.is_integral = 1
            pageInstance.goods_compids_params[i].param.is_integral = 1
          } else {
            param.is_integral = 5
            pageInstance.goods_compids_params[i].param.is_integral = 5
          }
        }
        if(customFeature.isShowGroupBuyGoods){
          param.is_group_buy = 1;
        }
        param.is_count = 0;

        if (customFeature.source && customFeature.source != 'none') {
          param.idx_arr = {
            "idx": "category",
            "idx_value": customFeature.source
          }
        }

        if (param.form === 'goods' && customFeature.pickUpArr){
          param.pick_up_type = [];
          if (customFeature.pickUpArr.express){
            param.pick_up_type.push(1);
          }

          if (customFeature.pickUpArr.sameJourney) {
            param.pick_up_type.push(2);
          }

          if (customFeature.pickUpArr.selfLifting) {
            param.pick_up_type.push(3);
          }
        }

        if (param.form === 'takeout') {
          customComponent["waimai"].init(compid, pageInstance, param);
        }else if(param.form === 'tostore'){
          _this.getTostoreCartList();

          param.page_size = customFeature.loadingNum || 10;
          pageInstance.requestNum = pageRequestNum + 1;
          _this.sendRequest({
            hideLoading: pageRequestNum++ == 1 ? false : true,
            url: '/index.php?r=AppShop/GetGoodsList',
            data: param,
            method: 'post',
            chain: true,
            subshop: pageInstance.franchiseeId || '',
            success: function (res) {
              if (res.status == 0) {
                let newdata = {};
                let goodslist = res.data;
                if (_this.getHomepageRouter() == pageInstance.page_router) {
                  let second = new Date().getMinutes().toString();
                  if (second.length <= 1) {
                    second = '0' + second;
                  }
                  let currentTime = new Date().getHours().toString() + second,
                      showFlag = true,
                      showTime = '';

                  pageInstance.requestNum = pageRequestNum + 1;
                  _this.sendRequest({
                    hideLoading: pageRequestNum++ == 1 ? false : true,
                    url: '/index.php?r=AppShop/getBusinessTime',
                    method: 'post',
                    data: {
                    },
                    chain: true,
                    subshop: pageInstance.franchiseeId || '',
                    success: function (res) {
                      let businessTime = res.data.business_time;
                      if(businessTime && businessTime.length){
                        for (let i = 0; i < businessTime.length; i++) {
                          showTime += businessTime[i].start_time.substring(0, 2) + ':' + businessTime[i].start_time.substring(2, 4) + '-' + businessTime[i].end_time.substring(0, 2) + ':' + businessTime[i].end_time.substring(2, 4) + (businessTime.length == 1 ? '' : (i <= businessTime.length - 1 ? ' / ' : ''));
                          if (+currentTime > +businessTime[i].start_time && +currentTime < +businessTime[i].end_time) {
                            showFlag = false;
                          }
                        }
                      }
                      if (showFlag) {
                        _this.showModal({
                          content: '店铺休息中,暂时无法接单。营业时间为：' + showTime
                        })
                      }
                    }
                  });
                }
                goodslist.map((item) => {
                  item.form_data.goods_model && delete item.form_data.goods_model
                })
                newdata[compid + '.goods_data'] = goodslist;
                newdata[compid + '.is_more'] = res.is_more;
                newdata[compid + '.curpage'] = 1;
                pageInstance.setData(newdata);
              }
            },
            fail: function (res) {
              let newdata = {};
              newdata[compid + '.loadingFail'] = true;
              newdata[compid + '.loading'] = false;
              pageInstance.setData(newdata);
            }
          });
        }else if (param.form == 'new_appointment') {
          _this.sendRequest({
            url: '/index.php?r=AppAppointment/GetUsedTpl',
            method:'POST',
            chain: true,
            subshop: pageInstance.franchiseeId || '',
            success(res) {
              param.tpl_id = res.data.length?res.data[0].id : '' ;
              param.unit = res.data.length ? res.data[0].unit : '';
              pageInstance.setData({
                [compid + '.customFeature.tpl_id']: param.tpl_id,
                [compid + '.customFeature.unit']: param.unit,
                [compid + '.customFeature.now_date']: new Date().getTime()
              })
              if (!param.tpl_id){
                let noAppointTpl = {};
                noAppointTpl[compid +'.goods_data'] = [];
                noAppointTpl[compid + '.is_more'] = 0;
                pageInstance.setData(noAppointTpl)
                return
              }
              var isClassify = false;
              if (!!pageInstance.newClassifyGroupidsParams.length) {
                let params = pageInstance.newClassifyGroupidsParams;
                for (let i = 0; i < params.length; i++) {
                  let newClassifyCompid = params[i].compid;
                  if (pageInstance.data[newClassifyCompid].customFeature.refresh_object == customFeature.id) {
                    isClassify = true;
                  }
                }
              }
              if (!isClassify) {
                param.page_size = customFeature.loadingNum || 10;
                pageInstance.requestNum = pageRequestNum + 1;
                _this.sendRequest({
                  hideLoading: pageRequestNum++ == 1 ? false : true,
                  url: '/index.php?r=AppShop/GetGoodsList',
                  data: param,
                  method: 'post',
                  chain: true,
                  subshop: pageInstance.franchiseeId || '',
                  success: function (res) {
                    if (res.status == 0) {
                      for (let i in res.data) {
                        res.data[i].form_data.price = res.data[i].form_data.min_price;
                        delete res.data[i].form_data.description;
                      }
                      newdata = {};
                      newdata[compid + '.goods_data'] = res.data;
                      newdata[compid + '.is_more'] = res.is_more;
                      newdata[compid + '.curpage'] = 1;
                      pageInstance.setData(newdata);
                    }
                  },
                  fail: function (res) {
                    let newdata = {};
                    newdata[compid + '.loadingFail'] = true;
                    newdata[compid + '.loading'] = false;
                    pageInstance.setData(newdata);
                  }
                });
                if (param.form === 'goods') {
                  _this.getAppECStoreConfig((res) => {
                    let newdata = {};
                    newdata[compid + '.storeStyle'] = res.color_config;
                    pageInstance.setData(newdata);
                  })
                }
              }
            }
          })

        }else {
          var isClassify = false;
          if (!!pageInstance.newClassifyGroupidsParams.length) {
            let params = pageInstance.newClassifyGroupidsParams;
            for (let i = 0; i < params.length; i++) {
              let newClassifyCompid = params[i].compid;
              if (pageInstance.data[newClassifyCompid].customFeature.refresh_object == customFeature.id){
                isClassify = true;
              }
            }
          }
          if (!isClassify){
            param.page_size = customFeature.loadingNum || 10;
            pageInstance.requestNum = pageRequestNum + 1;
            _this.sendRequest({
              hideLoading: pageRequestNum++ == 1 ? false : true,
              url: '/index.php?r=AppShop/GetGoodsList',
              data: param,
              method: 'post',
              chain: true,
              subshop: pageInstance.franchiseeId || '',
              success: function (res) {
                if (res.status == 0) {
                  for(let i in res.data){
                    if (res.data[i].form_data.goods_model) {
                      let minPrice = res.data[i].form_data.goods_model[0].price;
                      let virtualMinPrice;
                      res.data[i].form_data.goods_model.map((goods) => {
                        if (+minPrice >= +goods.price){
                          minPrice = goods.price;
                          virtualMinPrice = goods.virtual_price;
                        }
                      })
                      res.data[i].form_data.virtual_price = virtualMinPrice;
                      res.data[i].form_data.price = minPrice;
                    }
                    res.data[i].form_data.discount = (res.data[i].form_data.price * 10 / res.data[i].form_data.virtual_price).toFixed(2);
                    delete res.data[i].form_data.description;
                  }
                  newdata = {};
                  newdata[compid + '.goods_data'] = res.data;
                  newdata[compid + '.is_more'] = res.is_more;
                  newdata[compid + '.curpage'] = 1;
                  pageInstance.setData(newdata);
                }
              },
              fail: function (res) {
                let newdata = {};
                newdata[compid + '.loadingFail'] = true;
                newdata[compid + '.loading'] = false;
                pageInstance.setData(newdata);
              }
            });
          }
          // 电商店铺风格
          if (param.form === 'goods'){
            _this.getAppECStoreConfig((res)=> {
              let newdata = {};
              newdata[compid + '.storeStyle'] = res.color_config;
              pageInstance.setData(newdata);
            })
          }
        }
      }
    }
    if (!!pageInstance.franchiseeComps.length) {
      for (let i in pageInstance.franchiseeComps) {
        let compid = pageInstance.franchiseeComps[i].compid;
        let param = pageInstance.franchiseeComps[i].param;
        customComponent['franchisee-list'].init(compid, pageInstance);
      }
    }


    if (!!pageInstance.relobj_auto.length) {
      for (let i in pageInstance.relobj_auto) {
        let obj = pageInstance.relobj_auto[i];
        customComponent["count-ele"].init(obj, pageInstance);
      }
    }

    if(pageInstance.bbsCompIds.length){
      for (let i in pageInstance.bbsCompIds) {
        let compid = pageInstance.bbsCompIds[i];
        customComponent['bbs'].init(compid, pageInstance);
      }
    }

    if (!!pageInstance.communityComps.length) {
      for (let i in pageInstance.communityComps) {
        let compid = pageInstance.communityComps[i].compid;
        customComponent['community'].init(compid, pageInstance);
      }
    }

    if (pageInstance.cityLocationComps.length){
      for (let i in pageInstance.cityLocationComps){
        let compid = pageInstance.cityLocationComps[i];
        customComponent['citylocation'].init(compid, pageInstance);
      }
    }


    if (!!pageInstance.seckillOnLoadCompidParam.length) {
      for (let i in pageInstance.seckillOnLoadCompidParam) {
        let compid = pageInstance.seckillOnLoadCompidParam[i].compid;
        customComponent['seckill'].init(compid, pageInstance);
      }
    }

    if (!!pageInstance.newClassifyGroupidsParams.length) {
      let params = pageInstance.newClassifyGroupidsParams;
      for(let i = 0; i < params.length; i++){
        let compid = params[i]['compid'];
        customComponent["new-classify"].init(compid, pageInstance);
      }
    }
    if (!!pageInstance.dynamicClassifyGroupidsParams.length) {
      let params = pageInstance.dynamicClassifyGroupidsParams;
      for(let i = 0; i < params.length; i++){
        let compid = params[i]['compid'];
        customComponent["dynamic-classify"].init(compid, pageInstance);
      }
    }
    if (pageInstance.videoListComps.length) {
      for (let i in pageInstance.videoListComps) {
        let compid = pageInstance.videoListComps[i].compid;
        customComponent["video-list"].init(compid, pageInstance);
      }
    }
    if (pageInstance.videoProjectComps.length) {
      for (let i in pageInstance.videoProjectComps) {
        let compid = pageInstance.videoProjectComps[i].compid;
        customComponent['video'].init(compid, pageInstance);
      }
    }
    // 资讯组件
    if (pageInstance.newsComps && pageInstance.newsComps.length) {
      for (let i in pageInstance.newsComps) {
        let compid = pageInstance.newsComps[i].compid;
        customComponent['news'].init(compid, pageInstance);
      }
    }
    if (!isPullRefresh && pageInstance.popupWindowComps.length) {
      customComponent["popup-window"] && customComponent["popup-window"].init(pageInstance);
    }

    if (pageInstance.tostoreComps.length){
      for (let i in pageInstance.tostoreComps) {
        let compid = pageInstance.tostoreComps[i].compid;
        customComponent["tostore"].init(compid, pageInstance);
      }
    }
    // 表单组件
    if (pageInstance.formVesselComps.length) {
      customComponent["form-vessel"] && customComponent["form-vessel"].init(pageInstance);
    }
    //排号组件
    if (pageInstance.rowNumComps.length) {
      customComponent["row-num"] && customComponent["row-num"].init(pageInstance);
    }
    if (!isPullRefresh){
      // 悬浮窗有无底部导航判断
      customComponent["suspension"] && customComponent["suspension"].init(pageInstance);
      customComponent["new-suspension"] && customComponent["new-suspension"].init(pageInstance);
      customComponent["franchisee-chain"] && customComponent["franchisee-chain"].init(pageInstance);
      customComponent["album"] && customComponent["album"].init(pageInstance);
    }
    // 签到组件
    if (pageInstance.signInComps.length) {
      for (let i in pageInstance.signInComps) {
        let compid = pageInstance.signInComps[i].compid;
        customComponent["sign-in"] && customComponent["sign-in"].init(compid,pageInstance);
      }
    }
    if (pageInstance.topicComps && pageInstance.topicComps.length) {
      let pageRouter = this.getPageRouter();
      this.globalData.susTopicsMap[pageRouter] = this.globalData.susTopicsMap[pageRouter] || [];
      for (let i in pageInstance.topicComps) {
        let compid = pageInstance.topicComps[i].compid;
        customComponent["topic"].init(compid, pageInstance);
      }
    }
    if (pageInstance.searchComponentParam && pageInstance.searchComponentParam.length) {
      for (let i in pageInstance.searchComponentParam) {
        let searchComp = pageInstance.searchComponentParam[i];
        let compid = searchComp.compid;
        customComponent["search"].init(compid, pageInstance);
      }
    }
    if (pageInstance.topicClassifyComps && pageInstance.topicClassifyComps.length) {
      for (let i in pageInstance.topicClassifyComps) {
        let topicClassifyComp = pageInstance.topicClassifyComps[i],
          compid = topicClassifyComp.compid;
        customComponent["topic-classify"].init(compid, pageInstance);
      }
    }
    if (pageInstance.topicSortComps && pageInstance.topicSortComps.length) {
      for (let i in pageInstance.topicSortComps) {
        let topicSortComp = pageInstance.topicSortComps[i],
          compid = topicSortComp.compid;

        customComponent["topic-sort"].init(compid, pageInstance);
      }
    }

    if (pageInstance.newCountComps && pageInstance.newCountComps.length) {
      for (let i in pageInstance.newCountComps) {
        let newCountComp = pageInstance.newCountComps[i],
            compid = newCountComp['compid'],
            contentPaths = newCountComp['contentPaths'];
        customComponent["new-count"].init(compid, contentPaths, pageInstance);
      }
    }
    //秒杀时间轴
    if (pageInstance.timelineComps && pageInstance.timelineComps.length){
      for (let i = 0; i < pageInstance.timelineComps.length;i++){
        let compid = pageInstance.timelineComps[i].compid;
        customComponent['timeline'].init(compid, pageInstance);
      }
    }
    // 社区团购
    if (pageInstance.communityGroupComps && pageInstance.communityGroupComps.length) {
      for (const item of pageInstance.communityGroupComps) {
        let compid = item.compid;
        let param = item.param || {};
        customComponent['community-group'].init(compid, param, pageInstance);
      }
    }
    if (pageInstance.groupBuyListComps && pageInstance.groupBuyListComps.length) {
      for (let index in pageInstance.groupBuyListComps) {
        let compid = pageInstance.groupBuyListComps[index].compid;
        customComponent['group-buy-list'].init(compid, pageInstance);
      }
    }
  },
  // 新计数组件计数
  newCountTapEvent: function (e) {
    let that = this,
      pageInstance = this.getAppCurrentPage(),
      dataset = e.currentTarget.dataset,
      contentPath = dataset.contentPath,
      customFeature = dataset.customFeature,
      param = dataset.param,
      isListVessel = /^list\_vessel\d+/.test(contentPath),
      userTodayCount = 0,
      userAllCount = 0;


    if (this.newCountIsTaping) { // 防止重复点击
      this.showToast({
        title: '请勿重复点击',
        icon: 'none'
      });
      return;
    }
    this.newCountIsTaping = true;

    if (isListVessel) {
      let likeCountInfo = dataset.likeCountInfo;
      userTodayCount = +likeCountInfo.user_today_count + 1;
      userAllCount = +likeCountInfo.user_all_count + 1;
    }else {
      userTodayCount = +dataset.userTodayCount + 1;
      userAllCount = +dataset.userAllCount + 1;
    }

    if (param.count_type == 1 && param.support_cancel == 0) { // 不支持取消点赞
      if (param.effect == 0 && userAllCount > param.total_times) {
        this.showToast({
          title: '点赞数已用完',
          icon: 'none'
        });
        this.newCountIsTaping = false;
        return;
      }else if (param.effect == 1 && userTodayCount > param.total_times) {
        this.showToast({
          title: '今日点赞数已用完',
          icon: 'none'
        });
        this.newCountIsTaping = false;
        return;
      }
    }

    if (isListVessel) { // 组件在动态列表中
      param.data_id = dataset.dataId;
      if (param.support_cancel == 1 && userAllCount > 1) {
        customComponent["new-count"].newCountDelCount(param, function (res) {
          contentPath += '['+ dataset.index +'].count_info.like_info';
          customComponent["new-count"].newCountSetNewData(pageInstance, contentPath, res, function () {
            if (res.status == 0) {
              that.showToast({
                title: '点赞取消',
                icon: 'none'
              });
            }
            that.newCountIsTaping = false;
          });
        });
      }else {
        customComponent["new-count"].newCountAddCount(param, function (res) {
          contentPath += '['+ dataset.index +'].count_info.like_info';
          customComponent["new-count"].newCountSetNewData(pageInstance, contentPath, res, function () {
            if (res.status == 0) {
              that.showToast({
                title: '点赞成功',
                icon: 'none'
              });
            }
            that.newCountIsTaping = false;
          });
        })
      }
    }else { // 组件直接放在页面上或是在除动态列表以外的容器中
      customComponent["new-count"].containerNotListVesselNewCountTap(pageInstance, contentPath, customFeature, param, userAllCount, function (res) {
        if (res.status != 0) {
          that.showToast({
            title: res.data || '操作失败',
            icon: 'none'
          })
        }
        that.newCountIsTaping = false;
        if (param.data_id) { // 动态详情页面点赞
          if (!that.globalData.listVesselRefresh) {
            let lastPageRouter = that.getLastPageRouter();
            that.globalData.listVesselRefresh = true;
            if (that.globalData.needRefreshPages.indexOf(lastPageRouter) < 0) {
              that.globalData.needRefreshPages.push(lastPageRouter);
            }
          }
          that.globalData.newCountDataOnPage[that.getPageRouter()].LCompids.forEach(function (itemCompid) {
            if (itemCompid === contentPath) {
              return;
            }
            customComponent["new-count"].newCountSetNewData(pageInstance, itemCompid, res);
          })
        }
      });
    }

  },
  initialCommunityList: function (compid, pageIns){
    // 点击事件导致这个方法暂时没有完全移到类里面，等想到好的方法了在完全移过去
    customComponent['community'].initialCommunityList(compid, pageIns);
  },
  onPageScroll: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let pageRouter = pageInstance.page_router;

    this.globalData.susTopicCompids = this.globalData.susTopicsMap[pageRouter];
    if (this.globalData.susTopicCompids && this.globalData.susTopicCompids.length) { // 有悬浮窗话题列表判断是否要显示向上按钮
      let topBtnShow = e.scrollTop > 0 && (this.globalData.pageScrollTop - e.scrollTop > 0);
      for (let i in (this.globalData.susTopicCompids)) {
        let compid = this.globalData.susTopicCompids[i];
        if ((pageInstance.data[compid].topicSuspension.topBtnShow || false) !== topBtnShow) {
          pageInstance.setData({[compid + '.topicSuspension.topBtnShow']: topBtnShow});
        }
      }
    }
    this.globalData.pageScrollTop = e.scrollTop;
  },
  refreshOneTopicData: function (param) {
    if (!param.articleId || !param.compid) {
      return;
    }
    let pageInstance = this.getAppCurrentPage();
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppSNS/GetArticleByPage',
      data: {article_id: param.articleId, page: 1, page_size: 10},
      method: 'post',
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        if (!res.data.length) {
          return;
        }
        pageInstance.setData({[param.compid + '.topicList['+ param.index +']']: res.data[0]});
      },
      fail: function () {
      }
    });
  },
  topicEleScrollFunc: function (e) {
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      compid = dataset.compid;
    customComponent['topic'].getTopListData(null, compid);
  },
  switchTopiclistOrderBy: function (e) {
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      compid = dataset.compid,
      orderby = dataset.orderby,
      pageInstance = this.getAppCurrentPage(),
      newdata = {};

    if (pageInstance.data[compid].relateTopicCompId) {
      let topicCompId = pageInstance.data[compid].relateTopicCompId,
        topicListParam = pageInstance.data[topicCompId].listParam;

      newdata[compid + '.currentOrderby'] = orderby;
      newdata[topicCompId + '.listParam.orderby'] = orderby;
      newdata[topicCompId + '.listStatus.loading'] = false;
      newdata[topicCompId + '.listStatus.isMore'] = true;
      newdata[topicCompId + '.topicList'] = [];

      if (orderby === 'distance' && !topicListParam.latitude) {
        this.getLocation({
          success: res => {
            newdata[topicCompId + '.listParam.page'] = 1;
            newdata[topicCompId + '.listParam.orderby'] = orderby;
            newdata[topicCompId + '.listParam.latitude'] = res.latitude;
            newdata[topicCompId + '.listParam.longitude'] = res.longitude;
            pageInstance.setData(newdata);
            customComponent['topic'].getTopListData(pageInstance, topicCompId);
          }
        });
      }else {
        newdata[topicCompId + '.listParam.page'] = 1;
        pageInstance.setData(newdata);
        customComponent['topic'].getTopListData(pageInstance, topicCompId);
      }
    }else {
      this.showModal({content: '话题排序未找到绑定的话题列表'});
    }
  },
  switchTopicCategory: function (e) {
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      compid = dataset.compid,
      section_id = dataset.sectionid || 0,
      category_id = dataset.categoryid || 0,
      topicCompId = dataset.topicCompid,
      pageInstance = this.getAppCurrentPage(),
      newdata = {};

    if (topicCompId) {
      let searchCompId = pageInstance.data[topicCompId].relateSearchCompId;

      newdata[compid + '.selectedSectionId'] = section_id;
      newdata[compid + '.selectedCategoryId'] = category_id;
      newdata[topicCompId + '.listStatus.loading'] = false;
      newdata[topicCompId + '.listStatus.isMore'] = true;
      newdata[topicCompId + '.listParam.search_value'] = '';
      newdata[topicCompId + '.topicList'] = [];

      if (searchCompId) {
        newdata[searchCompId + '.searchValue'] = '';
      }
      newdata[topicCompId + '.listParam.page'] = 1;
      newdata[topicCompId + '.listParam.section_id'] = section_id;
      newdata[topicCompId + '.listParam.category_id'] = category_id;

      pageInstance.setData(newdata);
      customComponent['topic'].getTopListData(pageInstance, topicCompId);
    }else {
      this.showModal({content: '话题分类未找到绑定的话题列表'});
    }
  },
  turnToTopicDetail: function (e) {
    if (this.globalData.topicTurnToDetail) {
      return;
    }
    this.globalData.topicTurnToDetail = true;
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      articlestyle = dataset.articlestyle,
      compid = dataset.compid,
      index = dataset.index,
      pageInstance = this.getAppCurrentPage(),
      topic = pageInstance.data[compid].topicList[index],
      newdata = {};
    newdata[compid + '.topicList['+ index +'].read_count'] = +topic.read_count + 1;
    pageInstance.setData(newdata);
    let franchisee = this.getPageFranchiseeId();
    let chainParam = franchisee ? '&franchisee=' + franchisee : '';
    this.turnToPage('/informationManagement/pages/communityDetail/communityDetail?detail=' + topic.id + '&articleStyle=' + articlestyle + '&dataLiked=' + topic.is_liked + '&phoneNumber=' + topic.phone + '&sectionid=' + topic.section_id + chainParam);
  },
  pageBackTopAct: function (e) {
    this.pageScrollTo(0);
  },
  turnToTopicPublish: function (e) {
    let pageInstance = this.getAppCurrentPage();
    pageInstance.setData({
      'communityPublishType.show': true
    });
  },
  closeCommunityPublishTypeModal: function () {
    let pageInstance = this.getAppCurrentPage();
    pageInstance.setData({
      'communityPublishType.show': false
    });
  },
  turnToCommunityPublish: function (e) {
    let dataset = e.currentTarget.dataset,
      publishType = dataset.type === 'link' ? 2 : 0,
      pageInstance = this.getAppCurrentPage();
    pageInstance.setData({
      'communityPublishType.show': false,
      'communityPublish.show': true,
      'communityPublish.publishType': publishType,
      'communityPublish.detail': dataset.detail || '',
      'communityPublish.articleId': dataset.articleId || '',
      'communityPublish.reqAudit': dataset.reqAudit || '',
      'communityPublish.from': dataset.from || '',
      'communityPublish.franchisee': dataset.franchisee || ''
    });
  },
  closeCommunityPublishModal: function () {
    let pageInstance = this.getAppCurrentPage();
    pageInstance.setData({
      'communityPublish.show': false
    });
  },
  showTopicCommentBox: function (e) {
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      compid = dataset.compid,
      index = dataset.index,
      pageInstance = this.getAppCurrentPage(),
      topic = pageInstance.data[compid].topicList[index],
      commentBoxShow = topic.comment_box_show;
    pageInstance.setData({[compid + '.topicList['+ index +'].comment_box_show']: !commentBoxShow});
  },
  showTopicPhoneModal: function (e) {
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      phone = dataset.phone,
      compid = dataset.compid,
      pageInstance = this.getAppCurrentPage(),
      topicPhoneModal = pageInstance.data[compid].topicPhoneModal;
    topicPhoneModal.phone = phone.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
    topicPhoneModal.isShow = !topicPhoneModal.isShow;
    pageInstance.setData({[compid + '.topicPhoneModal']: topicPhoneModal});
  },
  topicMakePhoneCall: function (e) {
    let pageInstance = this.getAppCurrentPage(),
      compid = e.currentTarget.dataset.compid,
      phone = pageInstance.data[compid].topicPhoneModal.phone;
    pageInstance.setData({[compid + '.topicPhoneModal.isShow']: false});
    this.makePhoneCall(phone);
  },
  showTopicReplyComment: function (e) {
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      compid = dataset.compid,
      cancel = dataset.cancel,
      pageInstance = this.getAppCurrentPage(),
      topicReplyComment = pageInstance.data[compid].topicReplyComment;
    if (!cancel) {
      let index = dataset.index,
        topic = pageInstance.data[compid].topicList[index],
        newdata = {};
      topicReplyComment.isShow = !topicReplyComment.isShow;
      topicReplyComment.sectionId = topic.section_id;
      topicReplyComment.articleId = topic.id;
      topicReplyComment.compid = compid;
      topicReplyComment.index = index;
      newdata[compid + '.topicReplyComment'] = topicReplyComment;
      newdata[compid + '.topicList['+ index +'].comment_box_show'] = false;
      pageInstance.setData(newdata);
      setTimeout(function () {
        pageInstance.setData({
          [compid + '.topicReplyComment.focus']: true
        });
      }, 300);
    }else {
      pageInstance.setData({
        [compid + '.topicReplyComment.isShow']: !topicReplyComment.isShow,
        [compid + '.topicReplyComment.focus']: false,
        [compid + '.topicReplyComment.text']: ''
      });
    }
  },
  topicCommentReplyInput: function (e) {
    let pageInstance = this.getAppCurrentPage(),
      compid = e.currentTarget.dataset.compid;
    pageInstance.setData({[compid + '.topicReplyComment.text']: e.detail.value});
  },
  topicCommentReplyblur: function (e) {
    let pageInstance = this.getAppCurrentPage(),
      compid = e.currentTarget.dataset.compid;
    pageInstance.setData({[compid + '.topicReplyComment.focus']: false});
  },
  topicCommentReplyfocus: function (e) {
    let pageInstance = this.getAppCurrentPage(),
      compid = e.currentTarget.dataset.compid;
      if (e.detail.height && e.detail.height != this.globalData.kbHeight) {
        let curKbHeight = pageInstance.data.has_tabbar == 1 ? (e.detail.height - 56) : e.detail.height;
        if (/iPhone\s?X/i.test(this.globalData.systemInfo.model)) {
          curKbHeight = 282;
        }
        pageInstance.setData({
          [compid + '.topicReplyComment.focus']: true,
          [compid + '.topicReplyComment.kbHeight']: curKbHeight + 'px'
        });
        return;
      }
    pageInstance.setData({[compid + '.topicReplyComment.focus']: true});
  },
  topicReplycommentSubmit: function (e) {
    let that = this,
      pageInstance = this.getAppCurrentPage(),
      compid = e.currentTarget.dataset.compid,
      topicReplyComment = pageInstance.data[compid].topicReplyComment;
    if (/^\s*$/.test(topicReplyComment.text)) {
      this.showModal({ content: '请填写回复内容' });
      return;
    }
    if (this.globalData.isTopicCommentSubmiting) {
      return;
    }
    this.globalData.isTopicCommentSubmiting = true;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppSNS/AddComment',
      data: {
        section_id: topicReplyComment.sectionId,
        article_id: topicReplyComment.articleId,
        text: topicReplyComment.text
      },
      method: 'post',
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        that.showToast({
          title: '回复成功',
          icon: 'success',
          duration: 1500,
          success: function () {
            pageInstance.setData({
              [compid + '.topicReplyComment.isShow']: false,
              [compid + '.topicReplyComment.text']: ''
            });
            that.refreshOneTopicData(topicReplyComment);
          }
        });
      },
      complete: function (res) {
        that.globalData.isTopicCommentSubmiting = false;
      }
    });
  },
  topicPerformLikeAct: function (e) {
    let that = this,
      currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      compid = dataset.compid,
      index = dataset.index,
      isliked = dataset.isliked,
      pageInstance = this.getAppCurrentPage(),
      topic = pageInstance.data[compid].topicList[index];
    // if (isliked == 1) {
    //   that.showToast({ title: '己点赞' });
    //   pageInstance.setData({[compid + '.topicList['+ index +'].comment_box_show']: false});
    //   return;
    // }
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppSNS/PerformLike',
      data: {
        obj_type : 1,
        obj_id : topic.id
      },
      method: 'post',
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        if (res.status == 0) {
          that.showToast({
            title : isliked == 1 ? '点赞取消' : '点赞成功',
            icon: 'success',
            success: function () {
              pageInstance.setData({[compid + '.topicList['+ index +'].comment_box_show']: false});
              that.refreshOneTopicData({'articleId': topic.id, index, compid});
            }
          });
        }
      }
    });
  },
  topicImgLoad : function(event) {
    let pageInstance = this.getAppCurrentPage(),
      owidth = event.detail.width,
      oheight = event.detail.height,
      topicId = event.currentTarget.dataset.topicId,
      compid = event.currentTarget.dataset.compid,
      oscale = owidth / oheight,
      cwidth = 290 ,
      cheight = 120,
      ewidth , eheight;

    if (event.currentTarget.dataset.style == 1) {
      cwidth = 240;
    }

    if( oscale > cwidth / cheight ){
      ewidth = cwidth;
      eheight = cwidth / oscale;
    }else{
      ewidth = cheight * oscale;
      eheight = cheight;
    }

    pageInstance.setData({
      [compid + '.oneImgArr.'+ topicId +'.imgData']: {
        imgWidth : ewidth * 2.34,
        imgHeight : eheight * 2.34
      }
    });
  },
  getIntegralLog: function (addTime) {
    let pageInstance = this.getAppCurrentPage();
    this.showToast({ title: '转发成功', duration: 500 });
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=appShop/getIntegralLog',
      data: { add_time: addTime },
      success: function (res) {
        res.data && pageInstance.setData({
          'rewardPointObj': {
            showModal: true,
            count: res.data,
            callback: ''
          }
        });
      }
    });
  },
  CountSpreadCount: function (articleId) {
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppSNS/CountSpreadCount',
      data: { article_id: articleId },
      success: function (res) {}
    })
  },
  formVirtualPrice: function (formdata) {
    let modelVP = [];
    let price = '';
    for (let l in formdata.goods_model) {
      modelVP.push(formdata.goods_model[l].virtual_price == '' ? 0 : Number(formdata.goods_model[l].virtual_price))
    }
    if (Math.min(...modelVP) == Math.max(...modelVP)) {
      if (formdata.virtual_price instanceof Object) {
        price = formdata.virtual_price;
        price[0].text = Math.min(...modelVP).toFixed(2);
      } else {
        price = Math.min(...modelVP).toFixed(2);
      }
    } else {
      if (formdata.virtual_price instanceof Object) {
        price = formdata.virtual_price;
        price[0].text = Math.min(...modelVP).toFixed(2) + '~' + Math.max(...modelVP).toFixed(2);
      } else {
        price = Math.min(...modelVP).toFixed(2) + '~' + Math.max(...modelVP).toFixed(2);
      }
    }
    return price;
  },
  getListVessel: function(comp){
    let that = this;
    let field = [];

    if (Object.prototype.toString.call(comp.content) == "[object Array]"){
      for (let i = 0; i < comp.content.length; i++) {
        let cp = comp.content[i];
        if (typeof cp.content == 'object'){
          let f = that.getListVessel(cp);
          field = field.concat(f);
        } else if (cp.customFeature && cp.customFeature.segment){
          field.push(cp.customFeature.segment);
          if (cp.customFeature.segment == 'default_map') {
            field = field.concat(['region_lng', 'region_lat', 'region_string', 'region_detail']);
          }
        }
      }
    }else{
      for(let i in comp.content){
        let cp = comp.content[i];
        for (let j = 0; j < cp.length; j++) {
          let cpj = cp[j];
          if (typeof cpj.content == 'object') {
            let f = that.getListVessel(cpj);
            field = field.concat(f);
          } else if (cpj.customFeature && cpj.customFeature.segment) {
            field.push(cpj.customFeature.segment);
            if (cpj.customFeature.segment == 'default_map'){
              field = field.concat(['region_lng', 'region_lat', 'region_string', 'region_detail']);
            }
          }
        }
      }
    }
    return field;
  },
  getFormPageField: function(data){
    let that = this;
    let field = [];

    for (let i in data){
      let cp = data[i];
      if (typeof cp.content == 'object'){
        let f = that.getListVessel(cp);
        field = field.concat(f);
      } else if (cp.customFeature && cp.customFeature.segment) {
        field.push(cp.customFeature.segment);
        if (cp.customFeature.segment == 'default_map') {
          field = field.concat(['region_lng', 'region_lat', 'region_string', 'region_detail']);
        }
      }
    }
    return field;
  },
  getNewsCateList: function (event) {
    let that = this;
    let pageInstance = this.getAppCurrentPage(),
      dataset = event.currentTarget.dataset,
      compid = dataset.compid,
      cateId = dataset.id,
      pageObj = {
        isLoading: false,
        noMore: false,
        page: 1
      },
      newData = {};

      newData[compid + '.pageObj'] = pageObj;
      newData[compid + '.selectedCateId'] = cateId;
      newData[compid + '.newslist'] = [];
      pageInstance.setData(newData);

      customComponent['news'].getNewsList({ compid: compid, category_id: cateId, pageInstance: pageInstance });
  },
  getNewsList: function (component_params, callback) {
    // 点击事件导致这个方法暂时没有完全移到类里面，等想到好的方法了在完全移过去
    customComponent['news'].getNewsList(component_params, callback);
  },
  _getPageData: function(router){
    let that = this;
    let currentpage = that.getAppCurrentPage();
    let url = '/index.php?r=AppData/GetAppLayoutConfig';
    let ajdata = {
      his_id: this.globalData.historyDataId,
      page: router
    };
    if (this.globalData.chainAppId && !currentpage.franchiseeId){
      url = '/index.php?r=AppShopData/GetAppLayoutConfig';
      ajdata = {
        his_id: this.globalData.chainHistoryDataId,
        page: router,
        app_id: this.getChainId(),
        parent_app_id: this.getAppId()
      };
    }
    if(currentpage.franchiseeId && router != "userCenterComponentPage"){
      url = '/index.php?r=AppShopData/GetAppLayoutConfig';
      ajdata = {
        app_id : currentpage.franchiseeId,
        parent_app_id: this.getAppId(),
        page: router,
        type: 1
      };
    }
    this.sendRequest({
      hideLoading: true,
      url: url,
      data: ajdata,
      success: function(res){
        let data = res.data;
        if(data.dynamic_data_config && data.dynamic_data_config.dynamic_data_open_status != 0){
          if (!data.dataId && !(data.page_form && data.page_form != 'none')){
            data.page_hidden = false
          }
          currentpage.setData(data);
          currentpage.page_form = data.page_form;
          data.dataId && (currentpage.dataId = data.dataId);
        }
        currentpage.pageLoaded = true;
        that.pageDataInitial('', currentpage);
      },
      complete: function(){
        if (!currentpage.dataId && !(currentpage.page_form && currentpage.page_form != 'none')){
          currentpage.setData({
            page_hidden: false
          });
        }
      }
    })
  },
  tapEventCommonHandler: function(e){
    let form = e.currentTarget.dataset.eventParams;
    let action = form.action;
    let compid = e.currentTarget.dataset.compid;
    if(!form.compid && compid){
      form.compid = compid ;
    }

    if (compid && /^classify\d+$/.test(compid) && action == 'refresh-list') { // 处理旧分类组件选中问题
      let pageInstance = this.getAppCurrentPage();
      let index = e.currentTarget.dataset.index;
      pageInstance.setData({
        [compid + '.customFeature.selected']: index
      })
    }

    customEvent.clickEventHandler[action] && customEvent.clickEventHandler[action](form, '', e);
  },
  _initUserCenterData: function(pageInstance, compid){
    let content = pageInstance.data[compid].content;
    let personMode = pageInstance.data[compid].customFeature['personal-mode'];
    let data = {};
    let url ='/index.php?r=appVipCard/getUserAccountSurvey';
    this.sendRequest({
      url: url,
      success: function (res) {
        let userData = {};
        res.data.buyVip=false;
        res.data.balance = parseInt(res.data.balance);
        for (let item of res.data.all_vip_card) {
          if (item.condition_type == 2) {
            res.data.buyVip = true;//是否显示购买会员按钮
          }
        }
        userData[compid + '.userData'] = res.data;
        pageInstance.setData(userData)
      }
    })
    let goodsTypeList = []
    for (let i = 0; i < 24; i++) {
      let sub = {
        requested: false,
        index: []
      }
      goodsTypeList.push(sub)
    };
    for(let i in content) {
      for (let j in content[i].blockArr){
        let item = content[i].blockArr[j];
        if (item.actionType === 'custom'){
          let action = item.action;
          action.action = item.action.actionType;
          item.bindtap = "tapEventCommonHandler";
          item.param = action;
        } else {
          let goodsTypeReg = new RegExp('(^|&)goodsType=([^&]*)(&|$)');
          let orderIndex = new RegExp('(^|&)currentIndex=([^&]*)(&|$)');
          let goodsType = item.param && item.param.match(goodsTypeReg) ? +item.param.match(goodsTypeReg)[2] : -1;
          let k = item.param && item.param.match(orderIndex) ? +item.param.match(orderIndex)[2] : -1
          if (goodsType >= 0 && goodsType < 4) {
            goodsTypeList[goodsType].index.push([i,j,k])
          }

          if (item.router === 'myOrder' && goodsType != -1 && !goodsTypeList[goodsType].requested) {
            goodsTypeList[goodsType].requested = true;
            setTimeout(() => {
              this.userCenterOrderCount({
                goodsType: goodsType,
              }, (data) => {
                let newdata = {}
                data = [0, ...data]
                for(let i in goodsTypeList[goodsType].index){
                  let index = goodsTypeList[goodsType].index[i]
                  if (i == index[2]) {

                  }
                  newdata[compid + '.content[' + index[0] + ']blockArr[' + index[1] + ']count'] = +data[index[2]]
                }
                pageInstance.setData(newdata)
              })
            }, 0);
          }
        }
      }
    }
    data[compid + '.content'] = content;
    pageInstance.setData(data)
  },
  getAddressByLatLng: function (params, callback) {
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=Map/getAreaInfoByLatAndLng',
      data: {
        latitude: params.lat,
        longitude: params.lng
      },
      success: function(res){
        callback(res)
      }
    })
  },
  onPageShareAppMessage: function (event, callback) {
    let pageInstance = this.getAppCurrentPage();
    let pageRouter   = pageInstance.page_router;
    let pagePath     = '/' + pageInstance.route;
    let desc         = event.target ? event.target.dataset.desc : this.getAppDescription();
    let image        = event.target ? event.target.dataset.image : '';

    pageInstance.setData({
      pageQRCodeData: {
        shareDialogShow: "100%",
        shareMenuShow: false,
      },
      backToHomePage: {
        showButton: false
      },
      needbackToHomePage: pageInstance.data.backToHomePage && pageInstance.data.backToHomePage.showButton
    })

    let pageParam = {
      "detail": pageInstance.dataId,
      "user_token": this.globalData.PromotionUserToken,
      "vcard_user_id": this.globalData.HasCardToShareUserId,
      "franchisee": pageInstance.franchiseeId
    };
    for(let i in pageParam){
      if(pageParam[i]){
        if (pagePath.indexOf('?') < 0){
          pagePath += '?';
        }else{
          pagePath += '&';
        }
        pagePath +=  i + '=' + pageParam[i];
      }
    }

    return this.shareAppMessage({path: pagePath, desc: desc, imageUrl: image, success: callback});
  },
  onPageShow: function () {
    let that             = this;
    let pageInstance     = this.getAppCurrentPage();
    let needRefreshPages = this.globalData.needRefreshPages;
    let pageRouter       = this.getPageRouter();
    let pageIndex        = needRefreshPages.indexOf(pageRouter);

    if (this.globalData.takeoutRefresh) {
      this.pageDataInitial();
      this.globalData.takeoutRefresh = false;
    } else if (this.globalData.tostoreRefresh){
      this.pageDataInitial();
      this.globalData.tostoreRefresh = false;
    } else if (this.globalData.topicRefresh && this.globalData.hasTopicCom) {
      this.pageDataInitial();
      this.globalData.topicRefresh = false;
    } else if (this.globalData.listVesselRefresh && pageIndex > -1) {
      this.pageDataInitial();
      needRefreshPages.splice(pageIndex, 1);
      if (!needRefreshPages.length) {
        this.globalData.listVesselRefresh = false;
      }
    } else if (this.globalData.communityGroupRefresh) {
      this.pageDataInitial();
      this.globalData.communityGroupRefresh = false;
    } else {
      setTimeout(function () {
        that.setPageUserInfo();
      });
    }

    if (this.globalData.topicTurnToDetail) {
      this.globalData.topicTurnToDetail = false;
    }
    if (pageInstance.user_center_compids_params.length) {
      for (let i in pageInstance.user_center_compids_params) {
        let compid = pageInstance.user_center_compids_params[i].compid
        this._initUserCenterData(pageInstance, compid);
      }
    }
    if (!!pageInstance.exchangeCouponComps.length) {
      let _this = that
      for (let i in pageInstance.exchangeCouponComps) {
        let compid = pageInstance.exchangeCouponComps[i].compid;
        customComponent["exchange-coupon"].init(compid, pageInstance);
      }
    }
    if (pageInstance.need_login && !pageInstance.bind_phone) {
      this.goLogin({});
    } else if (pageInstance.need_login && pageInstance.bind_phone && !this.getUserInfo().phone && !that.globalData.isOpenSettingBack) {
      if (this.isLogin()) {
        setTimeout(function(){
          that.turnToPage('/default/pages/bindCellphone/bindCellphone?r=' + pageInstance.page_router, 1);
        }, 1000);
      } else {
        let addTime = Date.now();
        that.globalData.loginGetIntegralTime = addTime;
        that.globalData.isGoBindPhone = true;
        this.goLogin({
          success: function () {
            let userInfo = that.getUserInfo();
            if(!userInfo.phone){
              that.turnToPage('/default/pages/bindCellphone/bindCellphone?r=' + pageInstance.page_router, 1);
            }else{
              that.loginForRewardPoint(addTime);
              that.globalData.isGoBindPhone = false;
            }
          }
        });
      }
      that.globalData.isOpenSettingBack = false;
    }
    // 用户返回刷新排号
    if (pageInstance.rowNumComps.length) {
      this.isOpenRowNumber(pageInstance);
    }
    if (pageInstance.tostoreComps.length && pageInstance.returnToVersionFlag === 1) {
      for (let i in pageInstance.tostoreComps) {
        let compid = pageInstance.tostoreComps[i].compid;
        customComponent["tostore"].init(compid, pageInstance);
      }
    }
    // 多商家列表待审核状态进入预览修改了模板返回需要重新加载
    if(this.globalData['franchiseeTplChange-' + pageInstance.page_router]){
      if (!!pageInstance.franchiseeComps && pageInstance.franchiseeComps.length) {
        for (let i in pageInstance.franchiseeComps) {
          let compid = pageInstance.franchiseeComps[i].compid;
          customComponent['franchisee-list'].getMyAppShopList(compid, pageInstance, true);
          that.globalData['franchiseeTplChange-' + pageInstance.page_router] = false;
        }
      }
    }
    // 签到刷新累积签到详情
    if (pageInstance.signInComps.length) {
      for (let i=0; i<pageInstance.signInComps.length; i++) {
        let compid= pageInstance.signInComps[i].compid;
        customComponent['sign-in'].signInGetIntegralInfo(compid,pageInstance);
        if (!!pageInstance.data[compid].activity_id){
          customComponent['sign-in'].signInGetActivity(compid,pageInstance);
        }
      }
    }
  },
  onPageHide: function () {
    let pageInstance = this.getAppCurrentPage(),
      newdata = {};
    if (pageInstance.popupWindowComps && pageInstance.popupWindowComps.length) { // 隐藏弹窗
      for (let i in pageInstance.popupWindowComps) {
        let compid = pageInstance.popupWindowComps[i].compid;
        if (pageInstance.data[compid] && pageInstance.data[compid].showPopupWindow) {
          newdata[compid + '.showPopupWindow'] = false;
        }

      }
      pageInstance.setData(newdata);
    }
  },
  userCenterOrderCount: function (options, callback) {

    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/countStatusOrder',
      data: {
        parent_shop_app_id: this.getAppId(),
        goods_type: options.goodsType
      },
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          callback(res.data);
        }
      }
    });
  },
  returnListHeight: function (isshow, takeout, mode){
    if (!isshow) {
      return wx.getSystemInfoSync().windowHeight - 43;
    } else {
      if(takeout){
        if (mode == '1') {
          return wx.getSystemInfoSync().windowHeight - 240;
        } else if (mode == '2') {
          return wx.getSystemInfoSync().windowHeight - 213;
        } else {
          return wx.getSystemInfoSync().windowHeight - 163;
        }
      }else{
        if (mode == '1') {
          return wx.getSystemInfoSync().windowHeight - 230;
        } else if (mode == '2') {
          return wx.getSystemInfoSync().windowHeight - 203;
        } else {
          return wx.getSystemInfoSync().windowHeight - 128;
        }
      }
    }
  },
  onPageReachBottom: function ( reachBottomFuc ) {
    for (let i = 0; i < reachBottomFuc.length; i++) {
      let e = reachBottomFuc[i];
      e.triggerFuc(e.param);
    }
  },
  onPageUnload: function (page) {
    let pageInstance = page || this.getAppCurrentPage();
    let pageRouter = page ? page.page_router : pageInstance.page_router;
    this._logining = false;
    let downcountArr = pageInstance.downcountArr;
    if(downcountArr && downcountArr.length){
      for (let i = 0; i < downcountArr.length; i++) {
        downcountArr[i] && downcountArr[i].clear();
      }
    }

    if (this.globalData.newCountDataOnPage[pageRouter]) { // 清除绑定页面上的计数
      delete this.globalData.newCountDataOnPage[pageRouter];
    }
     //清除定时器
     let dco = pageInstance.downcountObject;
     for (let key in dco){
       let dcok = dco[key]
       if (dcok && dcok.length){
         for (let i = 0; i < dcok.length; i++) {
           dcok[i] && dcok[i].clear();
         }
       }
     }

    //秒杀清除定时器
    let downcountObject = pageInstance.downcountObject;
    for (let key in downcountObject) {
      if (downcountObject[key] && downcountObject[key].length) {
        let downcountObjectNew = downcountObject[key]
        for (let i = 0; i < downcountObjectNew.length; i++) {
          downcountObjectNew[i] && downcountObjectNew[i].clear();
        }
      }
    }
  },
  slidePanelStart: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let startX = e.changedTouches[0].clientX;
    let index = pageInstance.data[compid].slideIndex;
    clearInterval(pageInstance.data[compid].slideInterval);
    let data = {};
    data[compid + '.startX'] = startX;
    pageInstance.setData(data);
  },
  slidePanelEnd: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let endX = e.changedTouches[0].clientX;
    let startX = pageInstance.data[compid].startX;
    let index = pageInstance.data[compid].customFeature.slideIndex;
    let direction
    if (Math.abs(startX - endX) > 50) {
      startX - endX > 0 ? index++ : index--;
      if (pageInstance.data[compid].customFeature.autoplay) {
        pageInstance.data[compid].slideInterval = setInterval(() => {
          let index = pageInstance.data[compid].customFeature.slideIndex;
          if (index >= pageInstance.data[compid].content.length ) {
            index = 0;
          } else {
            index += 1;
          }
          let direction = '_interval'
          this.slideAnimation({
            compid: compid,
            num: index,
            pageInstance: pageInstance,
            direction: direction
          })
        }, pageInstance.data[compid].customFeature.interval * 1000)
      } else {
        clearInterval(pageInstance.data[compid].slideInterval);
      }
      if (index >= pageInstance.data[compid].content.length || index < 0) {
        return;
      }
      this.slideAnimation({ compid: compid, num: index, pageInstance: pageInstance, direction: direction})
    }
  },
  slideAnimation: function (params) {
    let animation = wx.createAnimation({
      duration: (params.num == 0 && params.direction) ? 0 : 500
      // duration: 500
    });
    let length = (-750 * params.num) + 'rpx';
    let data = {};
      animation.left(length).step();
    data[params.compid + '.animations'] = animation.export();
    data[params.compid + '.customFeature.slideIndex'] = params.num
    params.pageInstance.setData(data);
  },

  tapPrevewPictureHandler: function (event) {
    this.previewImage({
      current: event.currentTarget.dataset.img || event.currentTarget.dataset.imgarr[0],
      urls: event.currentTarget.dataset.imgarr instanceof Array ? event.currentTarget.dataset.imgarr : [event.currentTarget.dataset.imgarr],
    })
  },
  pageScrollFunc : function(event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];

    if(!compData){
      console.log('pageScrollFunc is not find compData');
      return;
    }
    if(compData.is_search){
      customComponent["search"].searchList( compData.searchEle ,compData.compId, event);
    }else{
      this._pageScrollFunc(event);
    }
  },
  _pageScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];
    let curpage      = (compData.curpage || 0) + 1;
    let newdata      = {};
    let param        = {};
    let _this        = this;
    let customFeature = compData.customFeature;
    let url          = '/index.php?r=AppData/getFormDataList';

    if (compData.type === 'news') {
      if (compData.pageObj.noMore && typeof event == 'object' && event.type == 'tap') {
        _this.showModal({
          content: '已经加载到最后了'
        });
        return;
      }
      customComponent['news'].getNewsList({
        pageInstance: pageInstance,
        compid: compid
      })
      return;
    }

    if(!compData.is_more && typeof event == 'object' && event.type == 'tap'){
      _this.showModal({
        content: '已经加载到最后了'
      });
    }
    if (pageInstance.requesting || !compData.is_more) {
      return;
    }
    pageInstance.requesting = true;
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);

    if (pageInstance.list_compids_params) {
      for (let index in pageInstance.list_compids_params) {
        if (pageInstance.list_compids_params[index].compid === compid) {
          param = pageInstance.list_compids_params[index].param;
          break;
        }
      }
    }
    param.form = customFeature.form;
    param.need_column_arr = compData.need_column_arr;

    if (pageInstance.dynamicClassifyGroupidsParams.length != 0) {
      for (let index in pageInstance.dynamicClassifyGroupidsParams) {
        if (pageInstance.dynamicClassifyGroupidsParams[index].compid === compid) {
          let len = compData.currentCategory.length;
          let cate = compData.currentCategory[len - 1];
          if(len == 2){
            let firstCate = compData.currentCategory[0];
            for (let j = 0; j < compData.classifyData.length; j++){
              let classify = compData.classifyData[j];
              if (classify.category_id == firstCate && classify.subclass.length == 0){
                cate = firstCate;
                break;
              }
            }
          }
          param = {
            form: compData.classifyGroupForm,
            page_size: compData.customFeature.loadingNum || 15,
            idx_arr: {
              idx: 'category',
              idx_value: cate
            },
            sort_key: compData.sort_key === undefined ? '' : compData.sort_key,
            sort_direction: compData.sort_direction === undefined ? '' : compData.sort_direction
          }
          break;
        }
      }
    }
    if (customFeature.form == 'group_buy') {
      url = "/index.php?r=AppGroupBuy/GetGroupBuyGoodsList";
      param.current_status = 0;
    }

    if(customFeature.source && customFeature.source !== 'none'){
      param.idx_arr = {
        idx: 'category',
        idx_value: customFeature.source
      }
    }

    param.page_size = customFeature.loadingNum || 10;
    param.page = curpage;

    _this.sendRequest({
      url: url,
      data: param,
      method: 'post',
      hideLoading: true,
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        newdata = {};
        let len = compData.list_data ? compData.list_data.length : 0;

        for (let j in res.data) {
          if (customFeature.form == 'group_buy') {
            res.data[j] = {
              form_data: Object.assign({}, res.data[j])
            }
          }
          for (let k in res.data[j].form_data) {
            if (k == 'category') {
              continue;
            }
            if(/region/.test(k)){
              continue;
            }
            if(k == 'goods_model') {
              res.data[j].form_data.virtual_price = _this.formVirtualPrice(res.data[j].form_data);
            }

            let description = res.data[j].form_data[k];

            if (compData.listField && compData.listField.indexOf(k) < 0 && /<("[^"]*"|'[^']*'|[^'">])*>/.test(description)) { //没有绑定的字段的富文本置为空
              res.data[j].form_data[k] = '';
            } else if (_this.needParseRichText(description)) {
              res.data[j].form_data[k] = _this.getWxParseResult(description);
            }
          }

          newdata[compid + '.list_data[' + (+j + len) + ']'] = res.data[j];
        }

        // newdata[compid + '.list_data'] = compData.list_data.concat(res.data);
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;

        pageInstance.setData(newdata);
      },
      fail: function(){
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  dynamicVesselScrollFunc: function (event) {
    let pageInstance  = this.getAppCurrentPage();
    let compid        = event.target.dataset.compid;
    let compData      = pageInstance.data[compid];
    let curpage       = compData.curpage + 1;
    let newdata       = {};
    let param         = {};
    let _this         = this;

    if (pageInstance.requesting || !compData.is_more) {
      return;
    }
    pageInstance.requesting = true;
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);

    if (pageInstance.dynamicVesselComps) {
      for (let index in pageInstance.dynamicVesselComps) {
        if (pageInstance.dynamicVesselComps[index].compid === compid) {
          param = pageInstance.dynamicVesselComps[index].param;
          break;
        }
      }
    }
    if (param.param_segment === 'id') {
      param.idx = param.search_segment;
      param.idx_value = pageInstance.dataId;
    } else if (!!pageInstance.data.detail_data[param.param_segment]) {
      param.idx = param.search_segment;
      param.idx_value = pageInstance.data.detail_data[param.param_segment];
    }

    _this.sendRequest({
      url: '/index.php?r=AppData/getFormDataList',
      data: {
        form: param.form,
        page: curpage,
        idx_arr: {
          idx: param.idx,
          idx_value: param.idx_value
        }
      },
      method: 'post',
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        newdata = {};
        for (let j in res.data) {
          for (let k in res.data[j].form_data) {
            if (k == 'category') {
              continue;
            }
            if(/region/.test(k)){
              continue;
            }
            if(k == 'goods_model') {
              res.data[j].form_data.virtual_price = _this.formVirtualPrice(res.data[j].form_data);
            }

            let description = res.data[j].form_data[k];

            // 判断字段是否需要进行富文本解析
            if (_this.needParseRichText(description)) {
              res.data[j].form_data[k] = _this.getWxParseResult(description);
            }
          }
        }
        newdata[compid + '.list_data'] = compData.list_data.concat(res.data);
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;

        pageInstance.setData(newdata);
      },
      fail: function () {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  goodsScrollFunc : function(event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];
    let that         = this;
    if(compData.is_search){
      customComponent["search"].searchList( compData.searchEle ,compData.compId, event);
    }else{
      this._goodsScrollFunc(event);
    }
  },
  _goodsScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];
    let curpage      = compData.curpage + 1;
    let customFeature = compData.customFeature;
    let newdata      = {};
    let param        = {};

    if(!compData.is_more && typeof event == 'object' && event.type == 'tap'){
      this.showModal({
        content: '已经加载到最后了'
      });
    }
    if (pageInstance.requesting || !compData.is_more) {
      return;
    }
    pageInstance.requesting = true;
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);

    if (pageInstance.goods_compids_params) {
      for (let index in pageInstance.goods_compids_params) {
        if (pageInstance.goods_compids_params[index].compid === compid) {
          param = pageInstance.goods_compids_params[index].param;
          break;
        }
      }
    }
    if (customFeature.controlCheck) {
      param.is_integral = 3
    } else {
      if (customFeature.isIntegral) {
        param.is_integral = 1
      } else {
        param.is_integral = 5
      }
    }
    //行业预约  模板为空兼容
    if(param.form == 'new_appointment' && !param.tpl_id){
      let noAppointTpl = {};
      noAppointTpl[compid +'.goods_data'] = [];
      noAppointTpl[compid + '.is_more'] = 0;
      pageInstance.setData(noAppointTpl)
      return
    }

    param.page_size = customFeature.loadingNum || 10;
    param.page = curpage;
    this.sendRequest({
      url: '/index.php?r=AppShop/GetGoodsList',
      hideLoading: true,
      data: param,
      method: 'post',
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        let newdata = {};
        for (let i in res.data) {
          if (res.data[i].form_data.goods_model) {
            let minPrice = res.data[i].form_data.goods_model[0].price;
            let virtualMinPrice;
            res.data[i].form_data.goods_model.map((goods) => {
              if (+minPrice >= +goods.price){
                minPrice = goods.price;
                virtualMinPrice = goods.virtual_price;
              }
            })
            res.data[i].form_data.virtual_price = virtualMinPrice;
            res.data[i].form_data.price = minPrice;
          }
          res.data[i].form_data.discount = (res.data[i].form_data.price * 10 / res.data[i].form_data.virtual_price).toFixed(2);
          delete res.data[i].form_data.description;
          res.data[i].form_data.goods_model && delete res.data[i].form_data.goods_model;
        }
        if (res.current_page == 1){
          compData.goods_data = [];
        }
        newdata[compid + '.goods_data'] = compData.goods_data.concat(res.data);
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;
        newdata[compid + '.loading'] = false;

        pageInstance.setData(newdata);
      },
      fail: function () {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  franchiseeScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];
    let curpage      = compData.curpage + 1;
    let newdata      = {};
    let param = compData.param;

    if (pageInstance.requesting || !compData.is_more || compData.isNewClassify) { //isNewClassify 表示点击分类的时候触发的这个事件
      return;
    }
    pageInstance.requesting = true;
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);

    param.page = curpage;
    this.sendRequest({
      url: '/index.php?r=AppShop/GetAppShopByPage',
      data: param,
      method: 'post',
      hideLoading: true,
      success: function (res) {
        for(let index in res.data){
          let distance = res.data[index].distance;
          res.data[index].distance = util.formatDistance(distance);
        }
        newdata = {};
        newdata[compid + '.franchisee_data'] = pageInstance.data[compid].franchisee_data.concat(res.data);
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;
        newdata[compid + '.loadingFail'] = false;
        newdata[compid + '.loading'] = false;

        pageInstance.setData(newdata);
      },
      fail: function () {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },

  exchangeCouponScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];
    let curpage      = compData.curpage + 1;
    let customFeature = compData.customFeature;
    let _this        = this;
    let newdata      = {};
    let param        = {};
    if(!compData.is_more && typeof event == 'object' && event.type == 'tap'){
      _this.showModal({
        content: '已经加载到最后了'
      });
    }
    if (pageInstance.requesting || !compData.is_more) {
      return;
    }
    pageInstance.requesting = true;
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);

    param = compData.param;
    param.page_size = +customFeature.loadingNum || 10;

    param.page = curpage;
    _this.sendRequest({
      url: '/index.php?r=AppShop/getCoupons',
      data: param,
      method: 'post',
      hideLoading: true,
      success: function (res) {
        newdata = {};
        let rdata = res.data,
            downcountArr = pageInstance.downcountArr || [];

        for (let i = 0; i < rdata.length; i++) {
          let f = rdata[i],
              dc ,
              idx = (curpage-1) * param.page_size + i;

          f.downCount = {
            hours : '00' ,
            minutes : '00' ,
            seconds : '00'
          };
          if(f.seckill_start_state == 0){
            dc = _this.beforeSeckillDownCount(f , pageInstance , compid + '.list_data[' + idx + ']');
          }else if(f.seckill_start_state == 1){
            dc = _this.duringSeckillDownCount(f , pageInstance , compid + '.list_data[' + idx + ']');
          }
          dc && downcountArr.push(dc);
        }
        newdata[compid + '.list_data'] = compData.list_data.concat(res.data);
        newdata[compid + '.is_more']    = res.is_more;
        newdata[compid + '.curpage']    = res.current_page;
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;
        pageInstance.downcountArr = downcountArr;

        pageInstance.setData(newdata);
      },
      fail: function () {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  turnToexchangeCouponDetail: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData = pageInstance.data[compid];
    this.globalData.exchangeCouponStyle = compData
    let dataset   = event.currentTarget.dataset;
    let id        = dataset.id;
    let recv_status = dataset.status;
    // if (recv_status == 0) {
    //   this.showModal({content: '超过可兑换次数'});
    //   return
    // }
    this.turnToPage('/exchangeCoupon/pages/exchangeCouponDetail/exchangeCouponDetail?id=' + id);
  },

  getexchangeCoupon: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData = pageInstance.data[compid];
    this.globalData.exchangeCouponStyle = compData
    let dataset = event.currentTarget.dataset;
    let coinid = dataset.coinid;
    let id = dataset.id;
    let index = dataset.index;
    let recv_status = dataset.status;
    let money = dataset.money ? + dataset.money : 0;
    let limitNum = dataset.limitnum ? + dataset.limitnum : 0;
    let userRecvNum = dataset.userrecvnum ? + dataset.userrecvnum : 0;
    let that = this
    if (recv_status == 0) {
      this.showModal({content: '超过可兑换次数'});
      return
    }
    if (money && money > 0) {
      this.turnToPage('/exchangeCoupon/pages/exchangeCouponDetailOrder/exchangeCouponDetailOrder?id=' + coinid);
      return;
    }
    that.showModal({
      title: '是否确认兑换？',
      content: '注：兑换成功后不支持退换',
      showCancel: true,
      cancelText: "否",
      confirmText: "是",
      confirm: function () {
        that.checkexchangeCoupon(coinid, compid, index, limitNum, userRecvNum)
      }
    })
  },
  checkexchangeCoupon: function (coinid, compid, index, limitNum, userRecvNum) {
    let that = this
    let pageInstance = this.getAppCurrentPage();
    let compdata = pageInstance.data[compid];
    that.sendRequest({
      url: '/index.php?r=appCoupon/addCouponOrder',
      data: {
        'app_id': that.getAppId(),
        'id': coinid
      },
      method: 'post',
      hideLoading: true,
      success: function(res) {
        that.showToast({
          title: '兑换成功',
          icon: 'none',
          duration: 1000
        })
        if (limitNum >= userRecvNum + 1) {
          let newdata = {};
          newdata[compid+'.list_data[' + index + '].user_recv_num'] = userRecvNum + 1
          pageInstance.setData(newdata);
        } else {
          let newdata = {};
          newdata[compid+'.list_data[' + index + '].recv_status'] = 0
          pageInstance.setData(newdata);
        }
      },
      complete: function (res) {
        // if (res.status === 0) {
        //   return
        // }
        // let newdata = {};
        // newdata[id+'.list_data[' + index + '].recv_status'] = 0
        // pageInstance.setData(newdata);
      }
    })
  },

  // 点赞 取消点赞
  changeCountRequert : {},
  changeCount: function (event) {
    let dataset      = event.currentTarget.dataset;
    let that         = this;
    let pageInstance = this.getAppCurrentPage();
    let newdata      = {};
    let counted      = dataset.counted;
    let compid       = dataset.compid;
    let objrel       = dataset.objrel;
    let form         = dataset.form;
    let dataIndex    = dataset.index;
    let parentcompid = dataset.parentcompid;
    let parentType   = dataset.parenttype;
    let url;
    let objIndex     = compid + '_' + objrel;

    if(counted == 1){
      url = '/index.php?r=AppData/delCount';
    } else {
      url = '/index.php?r=AppData/addCount';
    }

    if(that.changeCountRequert[objIndex]){
      return ;
    }
    that.changeCountRequert[objIndex] = true;

    that.sendRequest({
      url: url,
      data: { obj_rel: objrel },
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        newdata = {};

        if (parentcompid) {
          if (parentcompid.indexOf('list_vessel') === 0) {
            newdata[parentcompid + '.list_data[' + dataIndex + '].count_num'] = counted == 1
              ? parseInt(pageInstance.data[parentcompid].list_data[dataIndex].count_num) - 1
              : parseInt(res.data.count_num);
            newdata[parentcompid + '.list_data[' + dataIndex + '].has_count'] = counted == 1
              ? 0 : parseInt(res.data.has_count);
          } else if (parentcompid.indexOf('bbs') === 0) {
            newdata[parentcompid + '.content.data[' + dataIndex + '].count_num'] = counted == 1
              ? parseInt(pageInstance.data[parentcompid].content.data[dataIndex].count_num) - 1
              : parseInt(res.data.count_num);
            newdata[parentcompid + '.content.data[' + dataIndex + '].has_count'] = counted == 1
              ? 0 : parseInt(res.data.has_count);
          } else if (parentcompid.indexOf('free_vessel') === 0 || parentcompid.indexOf('popup_window') === 0 || parentcompid.indexOf('dynamic_vessel') === 0) {
            let path = compid
            if (compid.search('data.') !== -1) {
              path = compid.substr(5);
            }
            path = parentcompid + '.' + path;
            newdata[path + '.count_data.count_num'] = parseInt(res.data.count_num);
            newdata[path + '.count_data.has_count'] = parseInt(res.data.has_count);
          } else if (parentType && parentType.indexOf('list_vessel') === 0) {
            newdata[parentType + '.list_data[' + dataIndex + '].count_num'] = parseInt(res.data.count_num);
            newdata[parentType + '.list_data[' + dataIndex + '].has_count'] = parseInt(res.data.has_count);
          }
        } else {
          if (parentcompid != '' && parentcompid != null) {
            if (compid.search('data.') !== -1) {
              compid = compid.substr(5);
            }
            compid = parentcompid + '.' + compid;
          }
          newdata[compid + '.count_data.count_num'] = parseInt(res.data.count_num);
          newdata[compid + '.count_data.has_count'] = parseInt(res.data.has_count);
          pageInstance.setData(newdata);
        }

        pageInstance.setData(newdata);
        that.changeCountRequert[objIndex] = false;
      },
      complete : function () {
        that.changeCountRequert[objIndex] = false;
      }
    });
  },
  tapMapDetail: function (event) {
    let dataset = event.currentTarget.dataset;
    let params  = dataset.eventParams;
    if(!params) return;

    params = JSON.parse(params)[0];
    this.openLocation({
      latitude: +params.latitude,
      longitude: +params.longitude,
      name: params.desc || '',
      address: params.name || ''
    });
  },
  listVesselTurnToPage: function (event) {
    let that         = this;
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let data_id      = dataset.dataid;
    let router       = dataset.router;
    let isseckill    = dataset.isseckill; // 是否是商品秒杀
    let compid       = dataset.compid;
    let index        = dataset.index;
    let compData     = pageInstance.data[compid];
    let list         = compData.list_data[index];
    let form_data    = list.form_data || list;

    if (this.isTurnToListVesselDetail) { // 防止重复点击
      this.showToast({
        title: '正在跳转，请勿重复点击',
        icon: 'none'
      })
      return;
    }
    this.isTurnToListVesselDetail = true;

    if (compData.haveViewCountEle) { // 动态列表有添加浏览计数
      let objId = compData.form;
      let contentPath = compid + '.list_data[' + index +'].count_info.view_info';
      let param = {
        count_type: 2,
        support_cancel: 0,
        effect: 2,
        total_times: 1,
        obj_id: objId,
        data_id: data_id
      }
      customComponent["new-count"].newCountAddCount(param, function (res) {
        customComponent["new-count"].newCountSetNewData(pageInstance, contentPath, res, function () {
          that.isTurnToListVesselDetail = false;
          that.globalData.listVesselHaveViewCountEle = true;
          that.listVesselTurnToPageAct(router, form_data, data_id, isseckill);
        });
      })
      return;
    }

    this.isTurnToListVesselDetail = false;
    this.listVesselTurnToPageAct(router, form_data, data_id, isseckill);
  },
  listVesselTurnToPageAct: function (router, form_data, data_id, isseckill) {
    if (router == '' || router == -1 || router == '-1') {
      return;
    }
    let franchisee = this.getPageFranchiseeId();
    let chainParam = franchisee ? '&franchisee=' + franchisee : '';
    if(router == 'tostoreDetail'){
      this.turnToPage('/pages/toStoreDetail/toStoreDetail?detail=' + data_id + chainParam);
    }else if (router == 'goodsDetail') {
      if(isseckill == 1){
        let seckillType = form_data.is_seckill_activity?form_data.is_seckill_activity[0].text:'';
        let seckill_activity_id = form_data.seckill_activity_id ? form_data.seckill_activity_id[0].text:'';
        let seckill_activity_time_id = form_data.seckill_activity_time_id ? form_data.seckill_activity_time_id[0].text :'';
        this.turnToPage('/seckill/pages/seckillDetail/seckillDetail?id=' + data_id + '&seckill_activity_id=' + seckill_activity_id + '&seckill_activity_time_id=' + seckill_activity_time_id + '&seckillType=' + seckillType);
      }else if(form_data.is_group_buy && form_data.is_group_buy[0].text == 1){
        data_id = form_data.goods_id[0].text; //模板上不存在goodsId，需要通过页面数据获取
        let group_activity_id = form_data.activity_id[0].text || '';
        this.turnToPage('/group/pages/gpgoodsDetail/gpgoodsDetail?goods_id=' + data_id + '&activity_id=' + group_activity_id + chainParam);
      }else{
        this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + data_id + chainParam);
      }
    }else if (router == 'videoDetail') {
      this.turnToPage('/video/pages/videoDetail/videoDetail?detail=' + data_id + chainParam);
    } else if (router == 'groupGoodsDetail') {
      data_id = form_data.goods_id[0].text;//模板上不存在goodsId，需要通过页面数据获取
      let group_activity_id = form_data.activity_id[0].text || '';
      this.turnToPage('/group/pages/gpgoodsDetail/gpgoodsDetail?goods_id=' + data_id + '&activity_id=' + group_activity_id + chainParam);
    }else if (router == 'franchiseeDetail') {
      let mode = form_data.mode_id[0].text;
      this.goToFranchisee(mode, {
        detail: data_id
      });
    }else{
      this.turnToPage('/pages/' + router + '/' + router + '?detail=' + data_id);
    }
  },
  dynamicVesselTurnToPage: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let data_id      = dataset.dataid;
    let router       = dataset.router;
    let page_form    = pageInstance.page_form;
    let isGroup      = dataset.isGroup;
    let isSeckill    = dataset.isSeckill;
    let compid       = dataset.compid;
    let index        = dataset.index;
    let list         = pageInstance.data[compid].list_data[index];
    let form_data    = list.form_data || list;

    if (router == '' || router == -1 || router == '-1') {
      return;
    }

    let franchisee = this.getPageFranchiseeId();
    let chainParam = franchisee ? '&franchisee=' + franchisee : '';
    if (isGroup && isGroup == 1) {
      this.turnToPage('/pages/groupGoodsDetail/groupGoodsDetail?detail=' + data_id + chainParam);
      return;
    }
    if (isSeckill && isSeckill == 1) {
      this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + data_id +'&goodsType=seckill' + chainParam);
      return;
    }
    if (page_form != '') {
      if(router == 'tostoreDetail'){
        this.turnToPage('/pages/toStoreDetail/toStoreDetail?detail=' + data_id + chainParam);
      }else if (router == 'goodsDetail'){
        this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + data_id + chainParam);
      }else if (router == 'videoDetail') {
        this.turnToPage('/video/pages/videoDetail/videoDetail?detail=' + data_id + chainParam);
      } else if (router == 'franchiseeDetail') {
        let mode = form_data.mode_id[0].text;
        this.goToFranchisee(mode, {
          detail: data_id
        });
      }else{
        this.turnToPage('/pages/' + router + '/' + router + '?detail=' + data_id);
      }
    }
  },
  userCenterTurnToPage: function (event) {
    let that = this;
    if (this.isLogin()) {
      this._userCenterToPage(event);
    } else {
      this.goLogin({
        success: function () {
          that._userCenterToPage(event);
        }
      });
    }
  },
  _userCenterToPage: function (event) {
    let dataset         = event.currentTarget.dataset;
    let router          = dataset.router;
    let openVerifyPhone = dataset.openVerifyPhone;
    let that            = this;
    let param           = dataset.eventParams;
    let goodsType       = dataset.goodsType;
    let currentIndex    = event.target.dataset.index;

    if (router === '/pages/userCenter/userCenter' && this.isLogin() !== true) {
      this.goLogin({
        success: function () {
          that.turnToPage('/pages/userCenter/userCenter?from=userCenterEle');
        }
      })
      return;
    }
    if (router === 'newsPocketsBalance') {
      if (this.isLogin()) {
        that.turnToPage('/userCenter/pages/newsPocketsBalance/newsPocketsBalance');
      }else {
        this.goLogin({
          success: function () {
            that.turnToPage('/userCenter/pages/newsPocketsBalance/newsPocketsBalance');
          }
        });
      }
      return;
    }
    if (openVerifyPhone) {
      if (!this.getUserInfo().phone) {
        this.turnToPage('/default/pages/bindCellphone/bindCellphone?r='+this.getAppCurrentPage().page_router, 1);
      } else {
        if (router === '/promotion/pages/promotionMyPromotion/promotionMyPromotion' || router === 'myPromotion' || router === 'promotionMyPromotion') {
          that._isOpenPromotion();
          return;
        }
        if ((router === 'myOrder' || router === '/eCommerce/pages/myOrder/') && goodsType != undefined) {
          this.turnToPage('/eCommerce/pages/myOrder/?from=userCenterEle&goodsType=' + goodsType + '&currentIndex=' + currentIndex);
          return;
        } else if ((router === '/eCommerce/pages/vipCard/vipCard' || router === "vipCard") && this.globalData.hasFranchiseeList){
          if (dataset['needCollectInfo'] == 1) {
            let chainParam = this.globalData.chainAppId ? '&franchisee=' + this.globalData.chainAppId : '';
            this.turnToPage('/pages/userCenter/userCenter?is_member=1' + chainParam)
            return;
          }
          router = this.returnSubPackageRouter('vipCardList');
        } else if (router.indexOf('/') !== 0) {
          router = this.returnSubPackageRouter(router) + '?from=userCenterEle&' + (param || '');
        }
        this.turnToPage(router + '?from=userCenterEle');
      }
    } else {
      if (router === 'promotionMyPromotion' || router === 'myPromotion') {
        that._isOpenPromotion();
        return;
      }
      if ((router === 'myOrder' || router === '/eCommerce/pages/myOrder/') && goodsType != undefined) {
        this.turnToPage(this.returnSubPackageRouter('myOrder') + '?from=userCenterEle&goodsType=' + goodsType + '&currentIndex=' + currentIndex);
        return;
      } else if ((router === 'vipCardList' || router === '/userCenter/pages/vipCardList/vipCardList') && this.globalData.hasFranchiseeList){
        if (dataset['needCollectInfo'] == 1) {
          let chainParam = this.globalData.chainAppId ? '&franchisee=' + this.globalData.chainAppId : '';
          this.turnToPage('/pages/userCenter/userCenter?is_member=1' + chainParam)
          return;
        }
        router = this.returnSubPackageRouter('vipCardList');
      } else if (router.indexOf('/') !== 0) {
        router = this.returnSubPackageRouter(router) + '?from=userCenterEle&' + (param || '');
      }
      this.turnToPage(router+'?from=userCenterEle');
    }
  },
  turnToGoodsDetail: function (event) {
    let dataset   = event.currentTarget.dataset;
    let id        = dataset.id;
    let contact   = dataset.contact;
    let goodsType = dataset.goodsType;
    let group     = dataset.group;
    let hidestock = dataset.hidestock;
    let isShowVirtualPrice = dataset.isshowvirtualprice;
    let unit      = dataset.unit;

    let franchisee = this.getPageFranchiseeId();
    let chainParam = franchisee ? '&franchisee=' + franchisee : '';
    if (group && group == 1) {
      this.turnToPage('/group/pages/gpgoodsDetail/gpgoodsDetail?goods_id=' + id + '&activity_id=' + dataset.groupid + '&contact=' + contact + chainParam);
      return;
    }
    switch (+goodsType) {
      case 0: this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + id + '&contact=' + contact + '&hidestock=' + hidestock + '&isShowVirtualPrice=' + isShowVirtualPrice + chainParam);
        break;
      case 1: this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + id +'&contact=' + contact +'&hidestock=' + hidestock + chainParam);
        break;
      case 3: this.turnToPage('/pages/toStoreDetail/toStoreDetail?detail=' + id + chainParam);
        break;
      case 10:
        if (unit){
          this.turnToPage('/newAppointment/pages/hotel/hotel?contact=' + contact + '&hidestock=' + hidestock + chainParam);
        }else{
          this.turnToPage('/newAppointment/pages/newAppointmentDetail/newAppointmentDetail?detail=' + id+'&contact=' + contact +'&hidestock=' + hidestock + chainParam);
        }
        break;
    }
  },
  goToFranchisee: function (mode, param = {}, is_redirect = false){
    let r = '';
    let rArr = [];
    for(let i in param){
      if (param[i]){
        rArr.push( i + '=' + param[i]);
      }
    }
    if (rArr.length > 0){
      r = '?' + rArr.join('&');
    }
    if (mode == 1) {
      this.turnToPage('/franchisee/pages/franchiseeWaimai/franchiseeWaimai' + r, is_redirect);
    } else if (mode == 3) {
      this.turnToPage('/franchisee/pages/franchiseeTostore/franchiseeTostore' + r, is_redirect);
    } else if (mode == 2){
      this.turnToPage('/franchisee/pages/franchiseeDetail4/franchiseeDetail4' + r, is_redirect);
    }else {
      this.turnToPage('/franchisee/pages/franchiseeDetail/franchiseeDetail' + r,  is_redirect);
    }
  },
  turnToSeckillDetail: function (event) {
    let id      = event.currentTarget.dataset.id;
    let contact = event.currentTarget.dataset.contact;
    let franchisee = this.getPageFranchiseeId();
    let chainParam = franchisee ? '&franchisee=' + franchisee : '';
    this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + id +'&goodsType=seckill&contact=' + contact + chainParam);
  },
  turnToNewsDetail: function (event) {
    if (event.currentTarget.dataset.articleType == 3) {
      let form = event.currentTarget.dataset.eventParams;
      let action = form.action;
      customEvent.clickEventHandler[action] && customEvent.clickEventHandler[action](form);
      return;
    }
    let id = event.currentTarget.dataset.id;
    let franchisee = this.getPageFranchiseeId();
    let chainParam = franchisee ? '&franchisee=' + franchisee : '';
    this.turnToPage('/informationManagement/pages/newsDetail/newsDetail?detail=' + id + chainParam);
  },
  sortListFunc: function (event) {
    let dataset       = event.currentTarget.dataset;
    let pageInstance  = this.getAppCurrentPage();
    let listid        = dataset.listid;
    let idx           = dataset.idx;
    let listParams    = {
      'list-vessel': pageInstance.list_compids_params,
      'goods-list': pageInstance.goods_compids_params,
      'group-buy-list': pageInstance.groupBuyListComps,
      'franchisee-list': pageInstance.franchiseeComps,
      'video-list' : pageInstance.videoListComps,
      'dynamic-classify': pageInstance.dynamicClassifyGroupidsParams
    };
    let component_params, listType,new_component_params='';

    for (let key in listParams) {
      if(listType !== undefined) break;
      component_params = listParams[key];
      if(component_params.length){
        for (let j = 0; j < component_params.length; j++) {
          if (key == 'dynamic-classify') {
            let dyCompid = component_params[j].compid,
              dyCompData = pageInstance.data[dyCompid];
            if (dyCompData.customFeature.id === listid) {
              listType = 'dynamic-classify';
              new_component_params = {
                param :{
                  form: dyCompData.customFeature.form,
                  id: dyCompData.customFeature.id,
                  idx_arr: {
                    idx: 'category',
                    idx_value: dyCompData.currentCategory.slice(-1).pop() || ''
                  },
                  page: 1,
                  page_size: 10,
                  is_count: 0
                },
                compid: dyCompid
              }
              break;
            }
            continue;
          }
           if (key == 'group-buy-list') {
             let groupCompid = component_params[j].compid,
               groupCompData = pageInstance.data[groupCompid],
               listType = 'group-buy-list';

             if (groupCompData && groupCompData.customFeature.id === listid) {
               new_component_params = {
                   param: {
                     form: groupCompData.customFeature.form,
                     page: 1,
                     status: groupCompData.selectNum || 0
                   },
                   compid: groupCompid
                 };
               break;
             }
             continue;
           }
          if (component_params[j].param.id === listid) {
            listType = key;
            new_component_params = component_params[j];
            break;
          }
        }
      }
    }

    if(!new_component_params) return;
    new_component_params.param.page = 1;

    if (idx != 0) {
      new_component_params.param.sort_key       = dataset.sortkey;
      new_component_params.param.sort_direction = dataset.sortdirection;
    } else {
      new_component_params.param.sort_key       = '';
      new_component_params.param.sort_direction = 0;
    }
    let compid = new_component_params.compid;
    let customFeature = pageInstance.data[compid].customFeature;
    if(customFeature.source && customFeature.source !== 'none'){
      new_component_params.param.idx_arr = {
        idx: 'category',
        idx_value: customFeature.source
      }
    }
    this._updateSortStatus(dataset);

    switch (listType) {
      case 'dynamic-classify':
      case 'list-vessel': this._sortListVessel(new_component_params, dataset); break;
      case 'group-buy-list': customComponent["group-buy-list"].getGroupBuyList(new_component_params.compid, new_component_params, dataset);
      break;
      case 'goods-list': this._sortGoodsList(new_component_params, dataset); break;
      case 'franchisee-list': this._sortFranchiseeList(new_component_params, dataset); break;
      case 'video-list': this._sortVideoList(new_component_params, dataset); break;
    }
  },
  _sortListVessel: function (component_params) {
    let that = this;
    let pageInstance  = this.getAppCurrentPage();
    let compid  = component_params['compid'];
    let newdata = {};
    let needColumnArr = pageInstance.data[compid].need_column_arr || [];

    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    newdata[compid + '.is_more'] = 1;
    newdata[compid + '.list_data'] = [];
    pageInstance.setData(newdata);

    if (needColumnArr.length) {
      component_params.param.need_column_arr = needColumnArr;
    }

    this.sendRequest({
      url: '/index.php?r=AppData/getFormDataList',
      data: component_params.param,
      method: 'post',
      hideLoading: true,
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        let newdata = {};
        let listField = pageInstance.data[compid].listField;

        for (let j in res.data) {
          for (let k in res.data[j].form_data) {
            if (k == 'category') continue;

            if(/region/.test(k)){
              continue;
            }
            if(k == 'goods_model') {
              res.data[j].form_data.virtual_price = that.formVirtualPrice(res.data[j].form_data);
            }

            let description = res.data[j].form_data[k];
            if (listField.indexOf(k) < 0 && /<("[^"]*"|'[^']*'|[^'">])*>/.test(description)) { //没有绑定的字段的富文本置为空
              res.data[j].form_data[k] = '';
            } else if (that.needParseRichText(description)) {
              res.data[j].form_data[k] = that.getWxParseResult(description);
            }
          }
        }

        newdata[compid + '.list_data'] = res.data;
        newdata[compid + '.is_more']   = res.is_more;
        newdata[compid + '.curpage']   = 1;
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;

        if (/^dynamic\_classify\d+$/.test(component_params.compid)) {
          newdata[compid + '.sort_key'] = component_params.param.sort_key || '';
          newdata[compid + '.sort_direction'] = component_params.param.sort_direction;
        }

        pageInstance.setData(newdata);
      },
      fail: function (res) {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    });
  },
  _sortGoodsList: function (component_params) {
    let that = this;
    let pageInstance  = this.getAppCurrentPage();
    let compid = component_params['compid'];
    let newdata = {};

    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    newdata[compid + '.is_more'] = 1;
    newdata[compid + '.goods_data'] = [];
    pageInstance.setData(newdata);

    this.sendRequest({
      url: '/index.php?r=AppShop/GetGoodsList',
      data: component_params.param,
      method: 'post',
      hideLoading: true,
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        if (res.status == 0) {
          newdata[compid + '.goods_data'] = res.data;
          newdata[compid + '.is_more'] = res.is_more;
          newdata[compid + '.curpage'] = 1;
          newdata[compid + '.loading'] = false;
          newdata[compid + '.loadingFail'] = false;

          pageInstance.setData(newdata);
        }
      },
      fail: function (res) {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    });
  },
  _sortFranchiseeList: function (component_params) {
    let that = this;
    let pageInstance  = this.getAppCurrentPage();
    let compid = component_params['compid'];
    let newdata = {};
    let compData = pageInstance.data[compid];

    component_params.param.latitude = compData.param.latitude;
    component_params.param.longitude = compData.param.longitude;

    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    newdata[compid + '.is_more'] = 1;
    newdata[compid + '.curpage'] = 0;
    newdata[compid + '.franchisee_data'] = [];
    newdata[compid + '.param'] = component_params.param;
    pageInstance.setData(newdata);

    this.sendRequest({
      url: '/index.php?r=AppShop/GetAppShopByPage',
      data: component_params.param,
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          let newdata = {};

          for(let index in res.data){
            let distance = res.data[index].distance;
            res.data[index].distance = util.formatDistance(distance);
          }
          newdata[compid + '.franchisee_data'] = res.data;
          newdata[compid + '.is_more'] = res.is_more;
          newdata[compid + '.curpage'] = 1;
          newdata[compid + '.loading'] = false;
          newdata[compid + '.loadingFail'] = false;

          pageInstance.setData(newdata);
        }
      },
      fail: function (res) {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    });
  },
  _sortVideoList : function(component_params) {
    let that = this;
    let pageInstance  = this.getAppCurrentPage();
    let compid = component_params['compid'];

    let newdata = {};
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    newdata[compid + '.is_more'] = 1;
    newdata[compid + '.video_data'] = [];
    newdata[compid + '.param'] = component_params.param;
    pageInstance.setData(newdata);

    this.sendRequest({
      url: '/index.php?r=AppVideo/GetVideoList',
      data: component_params.param,
      method: 'post',
      hideLoading: true,
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        let rdata = res.data;
        let newdata = {};

        for (let i = 0; i < rdata.length; i++) {
          rdata[i].video_view = that.handlingNumber(rdata[i].video_view);
        }

        newdata[compid + '.video_data'] = rdata;
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;

        pageInstance.setData(newdata);
      },
      fail: function (res) {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    });
  },
  _updateSortStatus: function (dataset) {
    let pageInstance  = this.getAppCurrentPage();
    let sortCompid = dataset.compid;
    let selectSortIndex = dataset.idx;
    let newdata = {};

    newdata[sortCompid + '.customFeature.selected'] = selectSortIndex;
    if (selectSortIndex != 0 && dataset.sortdirection == 1) {
      newdata[sortCompid + '.content[' + selectSortIndex + '].customFeature.sort_direction'] = 0;
    } else if (selectSortIndex != 0) {
      newdata[sortCompid + '.content[' + selectSortIndex + '].customFeature.sort_direction'] = 1;
    } else if (selectSortIndex == 0) {
      newdata[sortCompid + '.content[' + selectSortIndex + '].customFeature.sort_direction'] = 0;
    }

    pageInstance.setData(newdata);
  },
  selectLocal: function (event) {
    let id           = event.currentTarget.dataset.id;
    let pageInstance = this.getAppCurrentPage();
    let compdata = pageInstance.data[id];
    let newdata      = {};

    newdata[id + '.citylocationHidden'] = typeof (compdata.citylocationHidden) == undefined ? false : !compdata.citylocationHidden;
    newdata[id + '.newlocal'] = '';
    if (!compdata.hasIntial){
      newdata[id + '.provinces'] = ['请选择'];
      newdata[id + '.citys'] =['请选择'];
      newdata[id + '.districts'] = ['请选择']
      newdata[id + '.provinces_ids'] =[null];
      newdata[id + '.city_ids'] =[null];
      newdata[id + '.district_ids'] = [null];
      for (let i in compdata.areaList){
        newdata[id + '.provinces'].push(compdata.areaList[i].name);
        newdata[id + '.provinces_ids'].push(compdata.areaList[i].region_id);
      }
      newdata[id + '.hasIntial'] = true;
    }
    pageInstance.setData(newdata);
  },
  cancelCity: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let id           = event.currentTarget.dataset.id;
    let compdata = pageInstance.data[id];
    let newdata      = {};
    newdata[id + '.citylocationHidden'] = !compdata.citylocationHidden;
    newdata[id + '.province'] = '';
    newdata[id + '.city'] = '';
    newdata[id + '.district'] = '';
    pageInstance.setData(newdata);
  },
  bindCityChange: function (event) {
    let val          = event.detail.value;
    let id           = event.currentTarget.dataset.id;
    let pageInstance = this.getAppCurrentPage();
    let compdata      = pageInstance.data[id];
    let newdata      = {};
    let cityList = compdata.areaList;
    if (!compdata.newlocal){
      if (compdata.value && (compdata.value[0] == val[0])){
        let province = compdata.provinces[val[0]] == '请选择' ? '' : compdata.provinces[val[0]];
        newdata[id + '.province'] = province;
        newdata[id + '.citys'] = province == '' ? ['请选择'] : this._getCityList(cityList[val[0] - 1].cities);
        newdata[id + '.city_ids'] = province == '' ? [null] : this._getCityList(cityList[val[0] - 1].cities, 1);
        let city = province == '' ? '' : newdata[id + '.citys'][val[1]];
        newdata[id + '.city'] = city
        newdata[id + '.districts'] = city == '' ? ['请选择'] : this._getCityList(cityList[val[0] - 1].cities[val[1]].towns);
        newdata[id + '.district_ids'] = city == '' ? [null] : this._getCityList(cityList[val[0] - 1].cities[val[1]].towns, 1);
        newdata[id + '.region_id'] = newdata[id + '.district_ids'][val[2]];
        newdata[id + '.district'] = city == '' ? '' : newdata[id + '.districts'][val[2]];
        newdata[id + '.value'] = val;
      }else{
        let province = compdata.provinces[val[0]] == '请选择' ? '' : compdata.provinces[val[0]];
        newdata[id + '.province'] = province;
        newdata[id + '.citys'] = province == '' ? ['请选择'] : this._getCityList(cityList[val[0] - 1].cities);
        newdata[id + '.city_ids'] = province == '' ? [null] : this._getCityList(cityList[val[0] - 1].cities, 1);
        let city = province == '' ? '' : newdata[id + '.citys'][0];
        newdata[id + '.city'] = city
        newdata[id + '.districts'] = city == '' ? ['请选择'] : this._getCityList(cityList[val[0] - 1].cities[val[1]].towns);
        newdata[id + '.district_ids'] = city == '' ? [null] : this._getCityList(cityList[val[0] - 1].cities[val[1]].towns, 1);
        newdata[id + '.region_id'] = newdata[id + '.district_ids'][val[2]];
        newdata[id + '.district'] = city == '' ? '' : newdata[id + '.districts'][val[2]];
        newdata[id + '.value'] = val;
      }
      pageInstance.setData(newdata)
    }
  },
  _getCityList:function (province, id) {
    let cityList = [];
    let cityList_id = [];
    for(let i in province){
      if(typeof(province[i]) == 'object'){
        cityList.push(province[i].name)
        cityList_id.push(province[i].region_id);
      }else{
        cityList[1] = province.name;
        cityList_id[1]=province.region_id;
      }
    }
    if(id){
      return cityList_id;
    }else{
      return cityList;
    }
  },
  submitCity: function (event) {
    let id = event.currentTarget.dataset.id;
    let pageInstance = this.getAppCurrentPage();
    let compdata = pageInstance.data[id];
    let newdata = {};
    if (!compdata.districts) {
      this.showModal({content: '您未选择城市!'});
      newdata[id + '.province'] = '';
      newdata[id + '.city'] = '';
      newdata[id + '.district'] = '';
    } else {
      newdata[id + '.citylocationHidden'] = !compdata.citylocationHidden;
      newdata[id + '.newlocal'] = compdata.province + ' ' + compdata.city + ' ' + compdata.district;
      // newdata[id + '.value'] = [0,0,0];
      this._citylocationList(event.currentTarget.dataset, compdata.region_id);
    }
    pageInstance.setData(newdata);
  },
  _citylocationList: function (dataset, region_id) {
    let compid       = dataset.id;
    let listid       = dataset.listid;
    let listType     = dataset.listtype;
    let form         = dataset.form;
    let index        = '';
    let targetList   = '';
    let targetCompid = '';
    let that         = this;
    let pageInstance = this.getAppCurrentPage();
    let newdata = {};
    let needColumnArr = [];

    if (listType == 'group-buy-list') {
      let component_params = {};
      for (index in pageInstance.groupBuyListComps) {
         let groupCompid = pageInstance.groupBuyListComps[index].compid;
         let groupCompData = pageInstance.data[groupCompid];
         if (groupCompData.customFeature.id === listid) {
           component_params = {
             param: {
               page: 1,
               status: groupCompData.selectNum,
               region_id: region_id
             }
           }
           customComponent["group-buy-list"].getGroupBuyList(groupCompid, component_params)
           break;
          }
      }
      return;
    }
    if (listType === 'list-vessel') {
        for (index in pageInstance.list_compids_params) {
          if (pageInstance.list_compids_params[index].param.id === listid) {
            pageInstance.list_compids_params[index].param.page = 1;
            targetList = pageInstance.list_compids_params[index];
            newdata[targetList.compid + '.list_data'] = [];
            needColumnArr = pageInstance.data[targetList.compid].need_column_arr || [];
            break;
          }
        }
      }

      if (listType === 'goods-list') {
        for (index in pageInstance.goods_compids_params) {
          let goodsCompid = pageInstance.goods_compids_params[index].compid;
          if (pageInstance.data[goodsCompid].customFeature.id === listid) {
            pageInstance.goods_compids_params[index].param.page = 1;
            targetList = pageInstance.goods_compids_params[index];
            newdata[goodsCompid + '.goods_data'] = [];
            break;
          }
        }
      }

      if (listType === 'franchisee-list') {
        for (index in pageInstance.franchiseeComps) {
          if (pageInstance.franchiseeComps[index].param.id === listid) {
            pageInstance.franchiseeComps[index].param.page = 1;
            targetList = pageInstance.franchiseeComps[index];
            newdata[targetList.compid + '.franchisee_data'] = [];
            break;
          }
        }
      }

      targetCompid = targetList && targetList.compid || '';

      if (listType === 'dynamic-classify') {
        for (let index in pageInstance.dynamicClassifyGroupidsParams) {
          let dyCompid = pageInstance.dynamicClassifyGroupidsParams[index].compid,
            dyCompData = pageInstance.data[dyCompid];
          if (dyCompData.customFeature.id === listid) {
            targetCompid = dyCompid;
            form = dyCompData.customFeature.form;
            newdata[dyCompid + '.list_data'] = [];
            break;
          }
        }
      }

    newdata[targetCompid + '.loading'] = true;
    newdata[targetCompid + '.loadingFail'] = false;
    newdata[targetCompid + '.is_more'] = 1;
    pageInstance.setData(newdata);

    let url = '/index.php?r=AppData/GetFormDataList&idx_arr[idx]=region_id&idx_arr[idx_value]='+region_id+'&extra_cond_arr[latitude]='+this.globalData.locationInfo.latitude+'&extra_cond_arr[longitude]='+this.globalData.locationInfo.longitude + '&extra_cond_arr[county_id]='+region_id,
        param = {'form':form};
    if (needColumnArr.length) { // 优化请求
      param.need_column_arr = needColumnArr;
    }
    this.sendRequest({
      url: url,
      data: param,
      method: 'post',
      hideLoading: true,
      chain: listType === 'franchisee-list' ? true : '',
      success: function (res) {
        if(res.data.length == 0){
          setTimeout(function () {
            that.showModal({
              content: '没有找到与所选区域的相关的内容'
            });
          },0)
        }
        if (res.status == 0) {
          let newdata = {};

          if (listType === "goods-list") {
            newdata[targetCompid + '.goods_data'] = res.data;
          } else if (listType === 'list-vessel') {
            if(param.form !== 'form'){
              let listField = pageInstance.data[targetCompid].listField;
              for (let j in res.data) {
                for (let k in res.data[j].form_data) {
                  if (k == 'category') {
                    continue;
                  }
                  if(/region/.test(k)){
                    continue;
                  }
                  if(k == 'goods_model') {
                    res.data[j].form_data.virtual_price = that.formVirtualPrice(res.data[j].form_data);
                  }

                  let description = res.data[j].form_data[k];
                  if (listField.indexOf(k) < 0 && /<("[^"]*"|'[^']*'|[^'">])*>/.test(description)) { //没有绑定的字段的富文本置为空
                    res.data[j].form_data[k] = '';
                  } else if (that.needParseRichText(description)) {
                    res.data[j].form_data[k] = that.getWxParseResult(description);
                  }
                }
              }
            }
            newdata[targetCompid+ '.list_data'] = res.data;
          } else if (listType === 'franchisee-list') {
            for(let index in res.data){
              let distance = res.data[index].distance;
              res.data[index].distance = util.formatDistance(distance);
            }
            newdata[targetCompid + '.franchisee_data'] = res.data;
          } else if (listType === 'dynamic-classify') {
            newdata[targetCompid + '.list_data'] = res.data;
          }

          newdata[targetCompid + '.is_more']   = res.is_more;
          newdata[targetCompid + '.curpage']   = 1;
          newdata[targetCompid + '.loading'] = false;
          newdata[targetCompid + '.loadingFail'] = false;

          pageInstance.setData(newdata);
        }
      },
      fail: function (res) {
        let newdata = {};
        newdata[targetCompid + '.loadingFail'] = true;
        newdata[targetCompid + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    })
  },
  callPhone: function (event) {
    let phone = event.currentTarget.dataset.phone;
    this.makePhoneCall(phone);
  },
  _changeOrderCount: function (id, num, modelid, callback, failCallback) {
    let that = this;
    let pageInstance = this.getAppCurrentPage();
    if (num == 0) {
      return;
    }
    this.sendRequest({
      url: '/index.php?r=AppShop/addCart',
      data: {
        goods_id: id.toString().replace('goods', ''),
        num: num,
        model_id: modelid || 0,
        sub_shop_app_id: pageInstance.franchiseeId || that.getChainId() || ''
      },
      hideLoading: true,
      success: function (res) {
        callback && callback(res.data);
      },
      fail: function (res) {
        failCallback && failCallback();
        that.showModal({
          content: res.data
        })
      }
    });
  },
  //获取国家列表
  getNationList: function (compid) {
    var _this = this;
    let pageInstance = this.getAppCurrentPage();
    let newdata = {};
    _this.sendRequest({
      url: '/index.php?r=Region/getNationList',
      data: {
        page: 1,
        page_size: 10
      },
      success: function (res) {
        newdata[compid + '.nationList'] = res.data.reverse();
        pageInstance.setData(newdata);
      }
    })
  },
  tapVideoPlayHandler:function(event){
    let pageInstance  = this.getAppCurrentPage(),
        video = JSON.parse(event.currentTarget.dataset.eventParams),
        compid = video.compid,
        video_id = video['video_id'];
    this.sendRequest({
      url: '/index.php?r=AppVideo/GetVideoLibURL',
      method: 'get',
      data: {id:video_id},
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        let newdata ={}
        newdata[compid +'.videoUrl'] = res.data;
        pageInstance.setData(newdata);
      }
    })
  },
  tapToPluginHandler: function (event) {
    let param = event.currentTarget.dataset.eventParams;
    if (param) {
      param = JSON.parse(param);
      let url = param.plugin_page;
      if (url) {
        let is_redirect = param.is_redirect == 1 ? true : false;
        this.turnToPage(url, is_redirect);
      }
    }
  },
  tapRefreshListHandler: function (event, params) {
    let pageInstance  = this.getAppCurrentPage();
    let eventParams   = params || JSON.parse(event.currentTarget.dataset.eventParams);
    let refreshObject = eventParams.refresh_object;
    let compids_params;
    if (eventParams.parent_type == 'classify') {
      var classify_selected_index = {};
      classify_selected_index[eventParams.parent_comp_id + '.customFeature.selected'] = eventParams.item_index;
      pageInstance.setData(classify_selected_index);
    }

    if ((compids_params = pageInstance.goods_compids_params).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          this._refreshPageList('goods-list', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
    if ((compids_params = pageInstance.list_compids_params).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          this._refreshPageList('list-vessel', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
    if ((compids_params = pageInstance.franchiseeComps).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          this._refreshPageList('franchisee-list', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
    if ((compids_params = pageInstance.topicComps).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          eventParams.index_segment = pageInstance.data[eventParams.comp_id].customFeature.plateId;
          this._refreshPageList('topic-list', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
    if ((compids_params = pageInstance.newsComps).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          this._refreshPageList('news-list', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
    if ((compids_params = pageInstance.videoListComps).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          this._refreshPageList('video-list', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
    if ((compids_params = pageInstance.groupBuyListComps).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          this._refreshPageList('group-buy-list', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
  },
  _refreshPageList: function (eleType, eventParams, compids_params, pageInstance) {
    let index_value = eventParams.index_value == -1 ? '' : eventParams.index_value;
    let requestData = {
      page: 1,
      form: compids_params.param.form,
      is_integral: compids_params.param.is_integral,
      is_count: compids_params.param.form && compids_params.param.is_count ? 1 : 0,
      idx_arr: {
        idx: eventParams.index_segment,
        idx_value: index_value
      }
    };
    let newdata = {};
    newdata[compids_params['compid'] + '.is_search'] = false;
    pageInstance.setData(newdata);

    compids_params.param.idx_arr = requestData.idx_arr;

    if (eleType === 'goods-list' || eleType === 'list-vessel' || eleType === 'topic-list' || eleType == 'group-buy-list') {
      let customFeature = pageInstance.data[compids_params.compid].customFeature;
      requestData.page_size = customFeature.loadingNum || 10;
      if(eleType === 'goods-list' && customFeature.isShowGroupBuyGoods){
        requestData.is_group_buy = 1;
      }

      //行业预约  模板为空兼容
      requestData.tpl_id = compids_params.param.tpl_id;
      if(requestData.form == 'new_appointment' && !requestData.tpl_id){
        let noAppointTpl = {};
        noAppointTpl[compid +'.goods_data'] = [];
        noAppointTpl[compid + '.is_more'] = 0;
        pageInstance.setData(noAppointTpl)
        return
      }
    }
    switch (eleType) {
      case 'goods-list': this._refreshGoodsList(compids_params['compid'], requestData, pageInstance); break;
      case 'list-vessel': this._refreshListVessel(compids_params['compid'], requestData, pageInstance); break;
      case 'franchisee-list': this._refreshFranchiseeList(compids_params['compid'], requestData, pageInstance); break;
      case 'topic-list': this._refreshTopicList(compids_params['compid'], requestData, pageInstance); break;
      case 'news-list': this._refreshNewsList(compids_params['compid'], requestData, pageInstance); break;
      case 'video-list': this._refreshVideoList(compids_params['compid'], requestData, pageInstance); break;
      case 'group-buy-list': this._refreshGroupBuyList(compids_params['compid'], requestData, pageInstance); break;
    }
  },
  _refreshGoodsList: function (targetCompId, requestData, pageInstance) {
    let _this = this;
    let customFeature = pageInstance.data[targetCompId].customFeature;
    let newData = {};

    newData[targetCompId + '.loading'] = true;
    newData[targetCompId + '.loadingFail'] = false;
    newData[targetCompId + '.is_more'] = 1;
    newData[targetCompId + '.goods_data'] = [];
    pageInstance.setData(newData);

    requestData.page_size = customFeature.loadingNum || 10;

    this.sendRequest({
      url: '/index.php?r=AppShop/GetGoodsList',
      method: 'post',
      hideLoading: true,
      data: requestData,
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function(res){
        let newData = {};
        for (let i in res.data) {
          if (res.data[i].form_data.goods_model) {
            let minPrice = res.data[i].form_data.goods_model[0].price;
            let virtualMinPrice;
            res.data[i].form_data.goods_model.map((goods) => {
              if (+minPrice >= +goods.price){
                minPrice = goods.price;
                virtualMinPrice = goods.virtual_price;
              }
            })
            res.data[i].form_data.virtual_price = virtualMinPrice;
            res.data[i].form_data.price = minPrice;
          }
          res.data[i].form_data.discount = (res.data[i].form_data.price * 10 / res.data[i].form_data.virtual_price).toFixed(2);
          res.data[i].form_data.goods_model && delete res.data[i].form_data.goods_model;
        }
        newData[targetCompId + '.goods_data'] = res.data;
        newData[targetCompId + '.is_more'] = res.is_more;
        newData[targetCompId + '.curpage'] = 1;
        newData[targetCompId + '.scrollTop'] = 0;
        newData[targetCompId + '.loading'] = false;
        newData[targetCompId + '.loadingFail'] = false;
        pageInstance.setData(newData);
      },
      fail: function (res) {
        let newData = {};
        newData[targetCompId + '.loadingFail'] = true;
        newData[targetCompId + '.loading'] = false;
        pageInstance.setData(newData);
      }
    })
  },
  _refreshListVessel: function (targetCompId, requestData, pageInstance) {
    let _this = this;
    let customFeature = pageInstance.data[targetCompId].customFeature;
    requestData.page_size = customFeature.loadingNum || 10;
    let needColumnArr = pageInstance.data[targetCompId].need_column_arr || [];

    let newdata = {};
    newdata[targetCompId + '.loading'] = true;
    newdata[targetCompId + '.loadingFail'] = false;
    newdata[targetCompId + '.list_data'] = [];
    newdata[targetCompId + '.is_more'] = 1;
    pageInstance.setData(newdata);

    if (needColumnArr.length) { // 优化请求速度
      requestData.need_column_arr = needColumnArr;
    }
    requestData.form = customFeature.form;

    this.sendRequest({
      url: '/index.php?r=AppData/getFormDataList',
      method: 'post',
      data: requestData,
      hideLoading: true,
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        let newData = {};
        let listField = pageInstance.data[targetCompId].listField;
        for (let j in res.data) {
          for (let k in res.data[j].form_data) {
            if (k == 'category') {
              continue;
            }
            if(/region/.test(k)){
              continue;
            }
            if(k == 'goods_model') {
              res.data[j].form_data.virtual_price = _this.formVirtualPrice(res.data[j].form_data);
            }

            let description = res.data[j].form_data[k];
            if (listField.indexOf(k) < 0 && /<("[^"]*"|'[^']*'|[^'">])*>/.test(description)) { //没有绑定的字段的富文本置为空
              res.data[j].form_data[k] = '';
            }else if(_this.needParseRichText(description)) {
              res.data[j].form_data[k] = _this.getWxParseResult(description);
            }

          }
        }
        newData[targetCompId + '.list_data'] = res.data;
        newData[targetCompId + '.is_more'] = res.is_more;
        newData[targetCompId + '.curpage'] = 1;
        newData[targetCompId + '.scrollTop'] = 0;
        newData[targetCompId + '.loading'] = false;
        newData[targetCompId + '.loadingFail'] = false;
        pageInstance.setData(newData);
      },
      fail: function (res) {
        let newdata = {};
        newdata[targetCompId + '.loadingFail'] = true;
        newdata[targetCompId + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    })
  },
  _refreshFranchiseeList: function (targetCompId, requestData, pageInstance) {
    let _this = this;
    let newdata = {};
    newdata[targetCompId + '.loading'] = true;
    newdata[targetCompId + '.loadingFail'] = false;
    newdata[targetCompId + '.franchisee_data'] = [];
    newdata[targetCompId + '.is_more'] = 1;
    newdata[targetCompId + '.curpage'] = 0;
    newdata[targetCompId + '.isNewClassify'] = true;
    newdata[targetCompId + '.param'] = requestData;
    pageInstance.setData(newdata);

    requestData.latitude = _this.globalData.locationInfo.latitude;
    requestData.longitude = _this.globalData.locationInfo.longitude;

    this.sendRequest({
      url: '/index.php?r=AppShop/GetAppShopByPage',
      method: 'post',
      data: requestData,
      success: function (res) {
        let newData = {};

        for(let index in res.data){
          let distance = res.data[index].distance;
          res.data[index].distance = util.formatDistance(distance);
        }
        newData[targetCompId + '.franchisee_data'] = res.data;
        newData[targetCompId + '.is_more'] = res.is_more;
        newData[targetCompId + '.curpage'] = 1;
        newData[targetCompId + '.scrollTop'] = 0;
        newData[targetCompId + '.loadingFail'] = false;
        newData[targetCompId + '.loading'] = false;
        newData[targetCompId + '.isNewClassify'] = false;
        pageInstance.setData(newData);
      },
      fail: function (res) {
        let newdata = {};
        newdata[targetCompId + '.loadingFail'] = true;
        newdata[targetCompId + '.loading'] = false;
        newdata[targetCompId + '.isNewClassify'] = false;
        pageInstance.setData(newdata);
      }
    })
  },
  _refreshTopicList: function (targetCompId, requestData, pageInstance) {
    let sectionId = requestData.idx_arr.idx || '',
      categoryId = requestData.idx_arr.idx_value || '';
    pageInstance.setData({
      [targetCompId + '.listStatus']: {
        loading: false,
        isMore: true
      }
    });
    customComponent['topic'].getTopListData(pageInstance, { page: 1, section_id: sectionId, category_id: categoryId }, targetCompId);
  },
  _refreshNewsList: function (targetCompId, requestData, pageInstance) {
    pageInstance.setData({
      [targetCompId + '.pageObj']: {
        isLoading: false,
        noMore: false,
        page: 1
      },
      [targetCompId + '.selectedCateId']: requestData.idx_arr.idx_value
    });
    customComponent['news'].getNewsList({page: 1, compid: targetCompId, category_id: requestData.idx_arr.idx_value});
  },
  _refreshVideoList: function (targetCompId, requestData, pageInstance) {
    let _this = this;

    requestData.page_size = requestData.page_size || pageInstance.data[targetCompId].customFeature.loadingNum || 10;
    if (requestData.idx_arr['idx'] === 'category') {
      requestData.cate_id = requestData.idx_arr['idx_value'];
    }

    let newdata = {};
    newdata[targetCompId + '.loading'] = true;
    newdata[targetCompId + '.loadingFail'] = false;
    newdata[targetCompId + '.video_data'] = [];
    newdata[targetCompId + '.is_more'] = 1;
    newdata[targetCompId + '.curpage'] = 0;
    newdata[targetCompId + '.param'] = requestData;
    pageInstance.setData(newdata);

    _this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppVideo/GetVideoList',
      data: requestData,
      method: 'post',
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        if (res.status == 0) {
          let rdata = res.data,
            newdata = {};

          for (let i = 0; i < rdata.length; i++) {
            rdata[i].video_view = _this.handlingNumber(rdata[i].video_view);
          }

          newdata[targetCompId + '.video_data'] = rdata;

          newdata[targetCompId + '.is_more'] = res.is_more;
          newdata[targetCompId + '.curpage'] = 1;
          newdata[targetCompId + '.loading'] = false;
          newdata[targetCompId + '.loadingFail'] = false;

          pageInstance.setData(newdata);
        }
      },
      fail: function (res) {
        let newdata = {};
        newdata[targetCompId + '.loadingFail'] = true;
        newdata[targetCompId + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    });
  },
  _refreshGroupBuyList: function (targetCompId, requestData, pageInstance) {
    let _this = this;
    let compdata = pageInstance.data[targetCompId];
    let customFeature = compdata.customFeature;
    let newData = {};

    newData[targetCompId + '.loading'] = true;
    newData[targetCompId + '.loadingFail'] = false;
    newData[targetCompId + '.is_more'] = 1;
    newData[targetCompId + '.goods_data'] = [];
    pageInstance.setData(newData);

    requestData.page_size = customFeature.loadingNum || 10;
    requestData.status = compdata.selectNum || 0;
    if (customFeature.source && customFeature.source != 'none') {
      requestData.idx_arr = {
        idx: 'category',
        idx_value: customFeature.source
      }
    }

    //清除定时器
    if (pageInstance.downcountObject && pageInstance.downcountObject[targetCompId]) {
      let downcountArr = pageInstance.downcountObject[targetCompId];
      if (downcountArr && downcountArr.length) {
        for (let i = 0; i < downcountArr.length; i++) {
          downcountArr[i] && downcountArr[i].clear();
        }
      }
    }

    this.sendRequest({
      url: '/index.php?r=appGroupBuy/goodsList',
      method: 'post',
      hideLoading: true,
      data: requestData,
      chain: true,
      success: function (res) {
        let rdata = res.data,
          newdata = {},
          downcountArr = [];

        for (let i = 0; i < rdata.length; i++) {
          let f = rdata[i],
            dc;
          f.description = '';
          f.downCount = {
            hours: '00',
            minutes: '00',
            seconds: '00'
          };
          f.original_price = f.virtual_price == '0.00' ? f.original_price : f.virtual_price;
          f.server_time = res.current_time || (Date.parse(new Date()) / 1000);
          f.seckill_end_time = f.end_date;
          f.seckill_start_time = f.start_date;
          if (f.status == 0 || f.status == 1 || f.status == 2) {
            dc = _this.beforeGroupDownCount(f, pageInstance, targetCompId + '.goods_data[' + i + ']');
          } else if (f.status == 3) {
            if (f.end_date != '-1') {
              dc = _this.duringGroupDownCount(f, pageInstance, targetCompId + '.goods_data[' + i + ']');
            }
          }
          dc && downcountArr.push(dc);
        }

        newdata[targetCompId + '.goods_data'] = rdata;
        newdata[targetCompId + '.is_more'] = res.is_more;
        newdata[targetCompId + '.curpage'] = res.current_page;
        newdata[targetCompId + '.loading'] = false;
        newdata[targetCompId + '.loadingFail'] = false;
        pageInstance.downcountObject[targetCompId] = downcountArr;
        pageInstance.setData(newdata);
      },
      fail: function (res) {
        let newData = {};
        newData[targetCompId + '.loadingFail'] = true;
        newData[targetCompId + '.loading'] = false;
        pageInstance.setData(newData);
      }
    })
  },
  tapToCouponListHandler: function (event) {
    this.turnToPage('/eCommerce/pages/couponList/couponList');
  },
  turnToCommunityPage: function (event) {
    let id = event.currentTarget.dataset.id;
    let franchisee = this.getPageFranchiseeId();
    let chainParam = franchisee ? '&franchisee=' + franchisee : '';
    this.turnToPage('/informationManagement/pages/communityPage/communityPage?detail=' + id + chainParam);
  },
  tapToTransferPageHandler: function () {
    let franchisee = this.getPageFranchiseeId();
    let chainParam = franchisee ? '&franchisee=' + franchisee : '';
    this.turnToPage('/eCommerce/pages/transferPage/transferPage' + chainParam);
  },
  _isOpenPromotion: function () {
    let that = this;
    this.sendRequest({
      url: '/index.php?r=AppDistribution/getDistributionInfo',
      success: function (res) {
        if(res.data){
          that._isPromotionPerson(true);
          that.globalData.getDistributionInfo = res.data;
        }else{
          that.showModal({
            content: '暂未开启推广'
          })
        }
      }
    })
  },
  _isPromotionPerson: function (clickPage) {
    let that = this;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppDistribution/getDistributorInfo',
      success: function (res) {
        if(clickPage){
          if (res.data && res.data.is_audit == 1){
            that.turnToPage('/promotion/pages/promotionUserCenter/promotionUserCenter');
            that.globalData.getDistributorInfo = res.data;
          }else{
            that.turnToPage('/promotion/pages/promotionApply/promotionApply?isAudit=' + (res.data && res.data.is_audit) || '');
          }
        }else{
          if (res.data) {
            that.globalData.p_id = res.data.id;
            that.globalData.PromotionUserToken = res.data.user_token;
          }
        }
      }
    })
  },
  _hasSelfCard: function(){
    let that = this;
    if(!this.globalData.isVcardInTabbar) return
    this.sendRequest({
      hideLoading: true,
      url: '/x70bSwxB/UserCard/getMyCardBySessionKey',
      success: function (res) {
        if(res.data&&res.data.user_id){
          that.globalData.HasCardToShareUserId = res.data.user_id;
        }
      }
    })
  },
  showGoodsShoppingcart: function(event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset = event.currentTarget.dataset;
    let goodsId = dataset.id;
    let buynow = dataset.buynow;
    let showVirtualPrice = dataset.isshowvirtualprice || '';
    let newData = {
      goodsId: goodsId,
      showBuynow: buynow,
      showVirtualPrice: showVirtualPrice,
      franchisee: pageInstance.franchiseeId || this.getChainId()
    }
    pageInstance.selectComponent('#component-goodsShoppingCart').showDialog(newData);
  },
  showAddShoppingcart: function (event) {
    let _this = this;
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let goods_id     = dataset.id;
    this.sendRequest({
      url: '/index.php?r=AppShop/getGoods',
      data: {
        data_id: goods_id
      },
      method: 'post',
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        if (res.status == 0) {
          let goods         = res.data[0].form_data;
          let defaultSelect = goods.model_items[0];
          let goodsModel    = [];
          let selectModels  = [];
          let goodprice     = 0;
          let goodstock     = 0;
          let goodid;
          let selectText    = '';
          let goodimgurl    = '';
          if (goods.model_items.length) {
            goodprice = defaultSelect.price;
            goodstock = defaultSelect.stock;
            goodid = defaultSelect.id;
            goodimgurl = defaultSelect.img_url;
          } else {
            goodprice = goods.price;
            goodstock = goods.stock;
            goodimgurl = goods.cover;
          }
          for (let key in goods.model) {
            if (key) {
              let model = goods.model[key];
              goodsModel.push(model);
              selectModels.push(model.subModelId[0]);
              selectText += '“' + model.subModelName[0] + '” ';
            }
          }
          goods.model = goodsModel;
          if (goods.goods_type == 3) {
            let businesssTimeString = '';
            if (goods.business_time && goods.business_time.business_time) {
              let goodBusinesssTime = goods.business_time.business_time;
              for (let i = 0; i < goodBusinesssTime.length; i++) {
                businesssTimeString += goodBusinesssTime[i].start_time.substring(0, 2) + ':' + goodBusinesssTime[i].start_time.substring(2, 4) + '-' + goodBusinesssTime[i].end_time.substring(0, 2) + ':' + goodBusinesssTime[i].end_time.substring(2, 4) + '/';
              }
              businesssTimeString = '出售时间：' + businesssTimeString.substring(0, businesssTimeString.length - 1);
              pageInstance.setData({

              })
            }
            _this.getTostoreCartList();
            pageInstance.setData({
              'addTostoreShoppingCartShow': true,
              businesssTimeString: businesssTimeString
            })
          }
          pageInstance.setData({
            goodsInfo: goods ,
            'selectGoodsModelInfo.price': goodprice,
            'selectGoodsModelInfo.stock': goodstock,
            'selectGoodsModelInfo.buyTostoreCount': 0,
            'selectGoodsModelInfo.cart_id':'',
            'selectGoodsModelInfo.models': selectModels,
            'selectGoodsModelInfo.modelId': goodid || '',
            'selectGoodsModelInfo.models_text' : selectText,
            'selectGoodsModelInfo.imgurl' : goodimgurl
          });
        }
      }
    });
  },
  hideAddShoppingcart: function () {
    let pageInstance = this.getAppCurrentPage();
    pageInstance.setData({
      addShoppingCartShow: false,
      addTostoreShoppingCartShow:false
    });
  },
  selectGoodsSubModel: function (event) {
    let pageInstance  = this.getAppCurrentPage();
    let dataset       = event.target.dataset;
    let modelIndex    = dataset.modelIndex;
    let submodelIndex = dataset.submodelIndex;
    let data          = {};
    let selectModels  = pageInstance.data.selectGoodsModelInfo.models;
    let model         = pageInstance.data.goodsInfo.model;
    let text          = '';

    selectModels[modelIndex] = model[modelIndex].subModelId[submodelIndex];

    for (let i = 0; i < selectModels.length; i++) {
      let selectSubModelId = model[i].subModelId;
      for (let j = 0; j < selectSubModelId.length; j++) {
        if( selectModels[i] == selectSubModelId[j] ){
          text += '“' + model[i].subModelName[j] + '” ';
        }
      }
    }
    data['selectGoodsModelInfo.models'] = selectModels;
    data['selectGoodsModelInfo.models_text'] = text;

    pageInstance.setData(data);
    pageInstance.resetSelectCountPrice();
  },
  resetSelectCountPrice: function () {
    let pageInstance   = this.getAppCurrentPage();
    let selectModelIds = pageInstance.data.selectGoodsModelInfo.models.join(',');
    let modelItems     = pageInstance.data.goodsInfo.model_items;
    let data           = {};
    let cover          = pageInstance.data.goodsInfo.cover;

    data['selectGoodsModelInfo.buyCount'] = 1;
    data['selectGoodsModelInfo.buyTostoreCount'] = 0;
    for (let i = modelItems.length - 1; i >= 0; i--) {
      if(modelItems[i].model == selectModelIds){
        data['selectGoodsModelInfo.stock'] = modelItems[i].stock;
        data['selectGoodsModelInfo.price'] = modelItems[i].price;
        data['selectGoodsModelInfo.modelId'] = modelItems[i].id || '';
        data['selectGoodsModelInfo.imgurl'] = modelItems[i].img_url || cover;
        data['selectGoodsModelInfo.virtual_price'] = modelItems[i].virtual_price
        break;
      }
    }
    pageInstance.setData(data);
  },
  //到店弹窗
  clickTostoreMinusButton: function () {
    let pageInstance = this.getAppCurrentPage();
    let _this = this;
    let count        = pageInstance.data.selectGoodsModelInfo.buyTostoreCount;
    if (count <= 0) {
      return;
    }
    if (count <= 1) {
      this.sendRequest({
        hideLoading: true,
        url: '/index.php?r=AppShop/deleteCart',
        method: 'post',
        data: {
          cart_id_arr: [pageInstance.data.selectGoodsModelInfo.cart_id],
          sub_shop_app_id: pageInstance.franchiseeId || _this.getChainId() || ''
        }
      });
      pageInstance.setData({
        'selectGoodsModelInfo.buyTostoreCount': count - 1
      });
      this.getTostoreCartList();
      return;
    }
    pageInstance.setData({
      'selectGoodsModelInfo.buyTostoreCount': count
    });
    this._sureAddTostoreShoppingCart('mins');
  },
  clickTostorePlusButton: function () {
    let pageInstance         = this.getAppCurrentPage();
    let selectGoodsModelInfo = pageInstance.data.selectGoodsModelInfo;
    let count                = selectGoodsModelInfo.buyTostoreCount;
    let stock                = selectGoodsModelInfo.stock;

    if (count >= stock) {
      this.showModal({
        content: '库存不足'
      });
      return;
    }
    pageInstance.setData({
      'selectGoodsModelInfo.buyTostoreCount': count
    });
    this._sureAddTostoreShoppingCart('plus');
  },
  _sureAddTostoreShoppingCart: function (type) {
    let pageInstance = this.getAppCurrentPage();
    let that         = this;
    let goodsNum     = pageInstance.data.selectGoodsModelInfo.buyTostoreCount;
    if (type == 'plus') {
      goodsNum = goodsNum + 1;
    } else {
      goodsNum = goodsNum - 1;
    }
    let franchiseeId = pageInstance.franchiseeId || this.getChainId();
    let param = {
      goods_id: pageInstance.data.goodsInfo.id,
      model_id: pageInstance.data.selectGoodsModelInfo.modelId || '',
      num: goodsNum,
      sub_shop_app_id: franchiseeId || ''
    };

    that.sendRequest({
      url: '/index.php?r=AppShop/addCart',
      data: param,
      success: function (res) {
        let data = res.data;
        pageInstance.setData({
          'selectGoodsModelInfo.cart_id': data,
          'selectGoodsModelInfo.buyTostoreCount': goodsNum
        });
        that.getTostoreCartList();
      },
      successStatusAbnormal: function (res) {
        pageInstance.setData({
          'selectGoodsModelInfo.buyTostoreCount': 0
        });
        that.showModal({
          content: res.data
        })
      }
    })
  },
  readyToTostorePay: function () {
    let pageInstance = this.getAppCurrentPage();
    let franchiseeId = pageInstance.franchiseeId || this.getChainId();
    let pagePath = '/orderMeal/pages/previewOrderDetail/previewOrderDetail' + (franchiseeId ? '?franchisee=' + franchiseeId : '');
    if (pageInstance.data.cartGoodsNum <= 0 || !pageInstance.data.tostoreTypeFlag) {
      return;
    }
    this.turnToPage(pagePath);
    pageInstance.hideAddShoppingcart();
  },
  getValidateTostore: function () {
    let that         = this;
    let pageInstance = this.getAppCurrentPage();
    let franchiseeId = pageInstance.franchiseeId || that.getChainId();
    this.sendRequest({
      url: '/index.php?r=AppShop/precheckShoppingCart',
      data: {
        sub_shop_app_id: franchiseeId || '',
        parent_shop_app_id: franchiseeId ? that.getAppId() : ''
      },
      success: function (res) {
        that.readyToTostorePay();
      },
      successStatusAbnormal: function (res) {
        that.showModal({
          content: res.data,
          confirm: function () {
            res.status === 1 && that.goToShoppingCart();
          }
        })
      }
    })
  },
  goToShoppingCart: function () {
    let pageInstance = this.getAppCurrentPage();
    let franchiseeId = pageInstance.franchiseeId || this.getChainId();
    let pagePath = '/eCommerce/pages/shoppingCart/shoppingCart' + (franchiseeId ? '?franchisee=' + franchiseeId : '');
    pageInstance.hideAddShoppingcart();
    this.turnToPage(pagePath);
  },
  getTostoreCartList: function () {
    let pageInstance = this.getAppCurrentPage();
    let franchiseeId =  pageInstance.franchiseeId || this.getChainId();
    this.sendRequest({
      url: '/index.php?r=AppShop/cartList',
      data: {
        page: 1,
        page_size: 100,
        sub_shop_app_id: franchiseeId || '',
        parent_shop_app_id: franchiseeId ? this.getAppId() : ''
      },
      success: function (res) {
        let price = 0,
          num = 0,
          addToShoppingCartCount = 0,
          tostoreTypeFlag = false;

        for (let i = res.data.length - 1; i >= 0; i--) {
          let data = res.data[i];
          if (data.goods_type == 3) {
            tostoreTypeFlag = true;
            price += +data.num * +data.price;
            num += +data.num;
          }
          if (pageInstance.goodsId == data.goods_id) {
            addToShoppingCartCount = data.num;
            pageInstance.cart_id = data.id;
          }
        }
        pageInstance.setData({
          tostoreTypeFlag: tostoreTypeFlag,
          cartGoodsNum: num,
          cartGoodsTotalPrice: price.toFixed(2),
          addToShoppingCartCount: addToShoppingCartCount,

        });
      }
    })
  },
  turnToSearchPage: function (event) {
    let listid = event.target.dataset.listid;
    let param = '';
    let goodsListId = '';
    let integral = '';
    let pageInstance = this.getAppCurrentPage();
    if (listid) {
      let goodsCompids = pageInstance.goods_compids_params;
      for(let i in goodsCompids){
        if (listid == goodsCompids[i].param.id){
          goodsListId = goodsCompids[i].compid;
          break;
        }
      }
      let customFeature = pageInstance.data[goodsListId].customFeature;
      if (customFeature.controlCheck) {
        integral = 3
      } else {
        if (customFeature.isIntegral) {
          integral = 1
        } else {
          integral = 5
        }
      }
      param = '&isHideStock=' + customFeature.isHideStock + '&isHideSales=' + customFeature.isHideSales + '&isShowVirtualPrice=' + customFeature.isShowVirtualPrice + '&isShoppingCart=' + customFeature.isShoppingCart + '&isBuyNow=' + customFeature.isBuyNow;
      if (customFeature.source && customFeature.source !== 'none'){
        param += '&category=' + customFeature.source;
      }
      if (integral) {
        param += '&integral=' + integral;
      }
    }
    if (event.target.dataset.param) {
      this.turnToPage('/default/pages/advanceSearch/advanceSearch?param=' + event.target.dataset.param + param);
    } else {
      this.turnToPage('/default/pages/advanceSearch/advanceSearch?form=' + event.target.dataset.form + param);
    }
  },
  suspensionTurnToPage: function (event) {
    let router = event.currentTarget.dataset.router,
      pageRoot = {
        'groupCenter': '/eCommerce/pages/groupCenter/groupCenter',
        'shoppingCart': '/eCommerce/pages/shoppingCart/shoppingCart',
        'myOrder': '/eCommerce/pages/myOrder/myOrder',
      };
    this.turnToPage(pageRoot[router] || '/pages/' + router + '/' + router + '?from=suspension');
  },
  // 跳转会员权益
  tapToVipInterestsHandlerfunction (event) {
    this.turnToPage('/eCommerce/pages/vipBenefits/vipBenefits');
  },
  // 动态分类: 点击不同分类对应的数据
  tapDynamicClassifyFunc: function (event) {
    let _this = this;
    let pageInstance = this.getAppCurrentPage();
    let compId = event.currentTarget.dataset.compid;
    let level = event.currentTarget.dataset.level;
    let categoryId = event.currentTarget.dataset.categoryId;
    let hideSubclass = event.currentTarget.dataset.hideSubclass;
    let hasSubclass = event.currentTarget.dataset.hasSubclass;
    let cateIndex = event.currentTarget.dataset.index;
    let compData = pageInstance.data[compId];
    let currentClassifyLevel = compData.classifyType.charAt(5);
    let showClassifySelect = compData.showClassifySelect;
    let sortKey = compData.sort_key === undefined ? '' : compData.sort_key;
    let sortDirection = compData.sort_direction === undefined ? '' : compData.sort_direction;
    let newData = {};
    if (showClassifySelect) {
      newData[compId + '.showClassifySelect'] = false;
    }
    if (hideSubclass == 1) {
      newData[compId + '.classifyAreaLevel2Show'] = false;
      pageInstance.setData(newData);
      return;
    }
    if (currentClassifyLevel == 2) {
      if (categoryId == '') {
        compData.currentCategory[0] = categoryId;
        newData[compId + '.classifyAreaLevel2Show'] = false;
      } else if (compData.currentCategory[level - 1] == categoryId) {
        newData[compId + '.classifyAreaLevel2Show'] = hasSubclass ? !compData['classifyAreaLevel2Show'] : false;;
      } else if(level == 1) {
        newData[compId + '.classifyAreaLevel2Show'] = hasSubclass ? true : false;
      } else if (level == 2) {
        newData[compId + '.classifyAreaLevel2Show'] = false;
      }
    }
    compData.currentCategory[level - 1] = categoryId;
    newData[compId + '.currentCategory'] = compData.currentCategory;
    pageInstance.setData(newData);
    if(compData.classifyType == 'level1-vertical-withpic'){
      _this.turnToPage('/pages/classifyGoodsListPage/classifyGoodsListPage?form=' + compData.classifyGroupForm + '&category_id=' + categoryId, false);
      return;
    }
    if(compData.classifyType == 'level2-vertical-withpic'){
      if(level == 2){
        _this.turnToPage('/pages/classifyGoodsListPage/classifyGoodsListPage?form=' + compData.classifyGroupForm + '&category_id=' + categoryId, false);
      }
      if (level == 1) {
        let SCILOffsetTopArr = compData.SCILOffsetTopArr;
        pageInstance.setData({
          [compId + '.SCAScrollTop']: SCILOffsetTopArr[cateIndex],
          [compId + '.isSCATap']: true
        });
      }
      return;
    }
    if (currentClassifyLevel != level && hasSubclass) { // 点击非最后一级的分类不请求新数据
      return;
    }

    newData = {};
    if (compData.classifyType == 'level1-horizontal' && compData.classifyStyle.mode == 2) {
      if (cateIndex && cateIndex > 3) {
        newData[compId + '.CAScrollLeft'] = 150 * (cateIndex - 3) + 'rpx';
      }else {
        newData[compId + '.CAScrollLeft'] = 0;
      }
    }
    newData[compId + '.loading'] = true;
    newData[compId + '.loadingFail'] = false;
    newData[compId + '.list_data'] = [];
    newData[compId + '.is_more'] = 1;
    pageInstance.setData(newData);

    // 根据groupId请求第一个分类绑定的数据
    let param = {
      page: 1,
      page_size: 10,
      form: compData.classifyGroupForm,
      idx_arr: {
        idx: 'category',
        idx_value: categoryId == -1 ? '' : categoryId
      },
      sort_key: sortKey,
      sort_direction: sortDirection
    };
    param.page_size = compData.customFeature.loadingNum || 10;
    _this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppData/getFormDataList',
      data: param,
      method: 'post',
      chain: true,
      subshop: pageInstance.franchiseeId || '',
      success: function (res) {
        let newdata = {};
        if (param.form !== 'form') { // 动态列表绑定表单则不调用富文本解析
          for (let j in res.data) {
            for (let k in res.data[j].form_data) {
              if (k == 'category') {
                continue;
              }
              if(/region/.test(k)){
                continue;
              }
              if(k == 'goods_model') {
                res.data[j].form_data.virtual_price = _this.formVirtualPrice(res.data[j].form_data);
              }

              let description = res.data[j].form_data[k];
              let listField = compData.listField;
              if (listField && listField.indexOf(k) < 0 && /<("[^"]*"|'[^']*'|[^'">])*>/.test(description)) { //没有绑定的字段的富文本置为空
                res.data[j].form_data[k] = '';
              } else if (_this.needParseRichText(description)) {
                res.data[j].form_data[k] = _this.getWxParseResult(description);
              }
            }
          }
        }
        newdata[compId + '.list_data'] = res.data;
        newdata[compId + '.is_more'] = res.is_more;
        newdata[compId + '.curpage'] = 1;
        newdata[compId + '.loading'] = false;
        newdata[compId + '.loadingFail'] = false;
        pageInstance.setData(newdata);
      },
      fail: function () {
        let newdata = {};
        newdata[compId + '.loadingFail'] = true;
        newdata[compId + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    });
  },
  // 动态分类：点击下拉选择
  tapDynamicShowAllClassify: function (event) {
    let dataset = event.currentTarget.dataset,
      compId = dataset.compid,
      pageInstance = this.getAppCurrentPage(),
      compData = pageInstance.data[compId],
      showClassifyAll = compData.showClassifySelect;

    pageInstance.setData({
      [compId + '.showClassifySelect']: !showClassifyAll
    });
  },
  // 动态分类二级分类列表的滚动事件
  dynamicSubClassifyAreaScrollEvent: function (event) {
    let pageInstance = this.getAppCurrentPage(),
      { compid, offsetTopArr } = event.currentTarget.dataset,
      { scrollTop } = event.detail;

    if (pageInstance.data[compid].isSCATap) {
      pageInstance.setData({
        [compid + '.isSCATap']: false
      });
      return;
    }

    for (let i = 0, l = offsetTopArr.length; i < l; i++) {
      if (Math.abs(scrollTop - offsetTopArr[i]) < 50) {
        let classifyData = pageInstance.data[compid].classifyData;
        pageInstance.setData({
          [compid + '.currentCategory[0]']: classifyData[i].category_id
        });
        return;
      }
    }

  },
  // 获取节点的信息
  getBoundingClientRect: function (selector, callback) {
    wx.createSelectorQuery().selectAll(selector).boundingClientRect(function(rects){
      typeof callback === 'function' && callback(rects);
    }).exec()
  },
  // 滑动面板滚动事件
  slidePanelScrollEvent: function (event, clear) {
    let that = this,
      pageInstance = this.getAppCurrentPage(),
      { compid, activeIndex, offsetLeftArr, containerOffsetWidth } = event.currentTarget.dataset,
      { scrollLeft, scrollWidth } = event.detail,
      compData = pageInstance.data[compid],
      reference = +compData.reference,
      timeoutId = null,
      newData = {},
      targetIndex = 0,
      i = activeIndex,
      l = offsetLeftArr.length,
      flagOffset = containerOffsetWidth * reference + scrollLeft;

    if (scrollLeft < 20) {
      targetIndex = 0;
    } else if (scrollWidth - scrollLeft - containerOffsetWidth < 20) {
      targetIndex = l - 1;
    } else {
      if (flagOffset < offsetLeftArr[i]) {
        if (flagOffset < offsetLeftArr[i - 1]) {
          targetIndex = i - 1;
        }else {
          targetIndex = i;
        }
      } else {
        targetIndex = i + 1;
      }
    }

    if (activeIndex != targetIndex) {
      newData[compid + '.activeIndex'] = targetIndex;
    }

    if (!clear) {
      compData.timeoutId && clearTimeout(compData.timeoutId);
      timeoutId = setTimeout(function () {
        that.slidePanelScrollEvent(event, true);
      }, 140);
    }
    newData[compid + '.timeoutId'] = timeoutId;
    pageInstance.setData(newData);
  },
  beforeSeckillDownCount: function (formData, page, path) {
    let _this = this,
        downcount ;
    downcount = _this.seckillDownCount({
      startTime : formData.server_time,
      endTime : formData.seckill_start_time,
      callback : function () {
        let newData = {};
        newData[path+'.seckill_start_state'] = 1;
        newData[path+'.server_time'] = formData.seckill_start_time;
        page.setData(newData);
        formData.server_time = formData.seckill_start_time;
        _this.duringSeckillDownCount(formData , page ,path);
      }
    } , page , path + '.downCount');

    return downcount;
  },
  duringSeckillDownCount: function (formData, page, path) {
    let _this = this,
        downcount;
    downcount = _this.seckillDownCount({
      startTime : formData.server_time,
      endTime : formData.seckill_end_time ,
      callback : function () {
        let newData = {};
        newData[path+'.seckill_start_state'] = 2;
        page.setData(newData);
      }
    } , page , path + '.downCount');

    return downcount;
  },
  beforeGroupDownCount:function(formData, page, path) {
    let _this = this,
      downcount;
    downcount = _this.seckillDownCount({
      startTime: formData.server_time,
      endTime: formData.seckill_start_time,
      callback: function () {
        let newData = {};
        newData[path + '.status'] = 3;
        newData[path + '.current_status'] = 3;
        newData[path + '.server_time'] = formData.seckill_start_time;
        page.setData(newData);
        formData.server_time = formData.seckill_start_time;
        let dc = '';
        let compid = path.split('.')[0];
        dc = _this.duringGroupDownCount(formData, page, path);
        page.downcountObject[compid].push(dc);
      }
    }, page, path + '.downCount');

    return downcount;
  },
  duringGroupDownCount: function(formData, page, path) {
    let _this = this,
      downcount;
    downcount = _this.seckillDownCount({
      startTime: formData.server_time,
      endTime: formData.seckill_end_time,
      callback: function () {
        let newData = {};
        newData[path + '.status'] = 4;
        newData[path + '.current_status'] = 4;
        page.setData(newData);
        if (path == "myTeams") {
          page.loadMyTeams();
        }
      }
    }, page, path + '.downCount');

    return downcount;
  },
  seckillFunc: {},
  seckillInterval: '',
  seckillDownCount: function(opts, page, path){
    let that = this;
    let opt = {
      startTime: opts.startTime || null,
      endTime: opts.endTime || null,
      callback: opts.callback
    };
    let systemInfo = this.getSystemInfoData().system;
    let isiphone = systemInfo.indexOf('iOS') != -1;

    if (isiphone && /\-/g.test(opt.endTime)) {
      opt.endTime = opt.endTime.replace(/\-/g, '/');
    }
    if (isiphone && /\-/g.test(opt.startTime)) {
      opt.startTime = opt.startTime.replace(/\-/g, '/');
    }
    if (/^\d+$/.test(opt.endTime)) {
      opt.endTime = opt.endTime * 1000;
    }
    if (/^\d+$/.test(opt.startTime)) {
      opt.startTime = opt.startTime * 1000;
    }

    let target_date = new Date(opt.endTime);
    let current_date = new Date(opt.startTime);
    let interval;
    let difference = target_date - current_date;
    let data = {};
    let len = 'sk' + parseInt(Math.random() * 100000000);
    data = {
      opts: opts,
      page: page,
      path: path,
      difference: difference,
      index: len
    }
    that.seckillFunc[len] = data;

    if(!that.seckillInterval){
      that.seckillInterval = setInterval(function(){
        let newdata = {};
        let func = that.seckillFunc;
        for (let i in func) {
          let f = func[i];
          let difference = f.difference;
          let _path = f.path;
          let _page = f.page;
          let router = _page.__wxExparserNodeId__;

          if (!newdata[router]){
            newdata[router] = {
              page: _page,
              data: {}
            }
          }
          if (difference < 0){
            let callback = func[i].opts.callback;
            if (callback && typeof callback === 'function') { callback(); };
            delete that.seckillFunc[i];
            continue;
          }
          let time = that.seckillCountTime(difference);
          newdata[router].data[_path + '.hours'] = time[0];
          newdata[router].data[_path + '.minutes'] = time[1];
          newdata[router].data[_path + '.seconds'] = time[2];

          that.seckillFunc[i].difference -= 1000;
        }
        for(let j in newdata){

          newdata[j].page.setData(newdata[j].data);
        }
      }, 1000);
    }

    return {
      isClear: false,
      clear: function () {
        if (this.isClear){
          return;
        }
        this.isClear = true;
        delete that.seckillFunc[len];
        if ( util.isPlainObject(that.seckillFunc) ){
          clearInterval(that.seckillInterval);
          that.seckillInterval = '';
        }
      }
    };
  },
  seckillCountTime: function (difference){
    if (difference < 0) {
      return ['00', '00', '00'];
    }

    let _second = 1000,
      _minute = _second * 60,
      _hour = _minute * 60,
      time = [];

    let hours = Math.floor(difference / _hour),
      minutes = Math.floor((difference % _hour) / _minute),
      seconds = Math.floor((difference % _minute) / _second);

    hours = (String(hours).length >= 2) ? hours : '0' + hours;
    minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
    seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;

    time[0] = hours;
    time[1] = minutes;
    time[2] = seconds;

    return time;
  },
  getAssessList: function (param) {
    param.url = '/index.php?r=AppShop/GetAssessList';
    this.sendRequest(param);
  },
  getOrderDetail: function (param) {
    param.url = '/index.php?r=AppShop/getOrder';
    this.sendRequest(param);
  },
  showUpdateTip: function () {
    this.showModal({
      title: '提示',
      content: '您的微信版本不支持该功能，请升级更新后重试'
    });
  },
  // 文字组件跳到地图
  textToMap: function (event) {
    let dataset = event.currentTarget.dataset;
    let latitude  = +dataset.latitude;
    let longitude = +dataset.longitude;
    let address = dataset.address;

    if(!latitude || !longitude){
      return ;
    }

    this.openLocation({
      latitude: latitude,
      longitude: longitude,
      address: address
    });
  },
  // 跳转到视频详情
  turnToVideoDetail : function(event) {
    let id = event.currentTarget.dataset.id;
    let franchisee = this.getPageFranchiseeId();
    let chainParam = franchisee ? '&franchisee=' + franchisee : '';
    this.turnToPage('/video/pages/videoDetail/videoDetail?detail=' + id + chainParam);
  },
  // 处理数字
  handlingNumber : function(num) {
    num = +num;
    if(num > 1000000){ //大于百万直接用万表示
      return Math.floor(num / 10000) + '万';
    }else if(num > 10000){ //大于一万小于百万的保留一位小数
      return (num / 10000).toString().replace(/([0-9]+.[0-9]{1})[0-9]*/,"$1") + '万';
    }else{
      return num;
    }
  },
  needParseRichText: function(data) {
    if (typeof data == 'number') {
      return true;
    }
    if (typeof data == 'string') {
      if (!data) {
        return false;
      }
      if (!/^https?:\/\/(.*)\.(jpg|jpeg|png|gif|bmp|svg|swf)/g.test(data)) {
        return true;
      }
    }
    return false;
  },
  calculationDistanceByLatLng: function(lat1, lng1, lat2, lng2){
    const EARTH_RADIUS = 6378137.0;
    const PI = Math.PI;
    let a = (lat1 - lat2) * PI / 180.0;
    let b = (lng1 - lng2) * PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(lat1 * PI / 180.0) * Math.cos(lat2 * PI / 180.0) * Math.pow(Math.sin(b / 2), 2)));
    s  =  s * EARTH_RADIUS;
    s  =  Math.round(s * 10000) / 10000.0;
    return s;
  },
  // 判断是否需要弹窗
  isNeedRewardModal: function () {
    let that = this;
    that.sendRequest({
      hideLoading: true,
      url: '/index.php?r=appShop/isNeedLogin',
      data: {},
      success: function (res) {
        if (res.status == 0 && res.data == 1) {
          that.goLogin({});
        }
      }
    });
  },
  loginForRewardPoint: function (addTime) {
    let that = this;
    that.sendRequest({
      hideLoading: true,
      url: '/index.php?r=appShop/getIntegralLog',
      data: { add_time: addTime, login: 1 },
      success: function (res) {
        if (res.status == 0) {
          let vipLevel = res.vip_level,
            rewardCount = res.data,
            pageInstance = that.getAppCurrentPage(),
            newData = {};

          if (!pageInstance) { // 确保能获取到当前页实例
            return;
          }

          if (rewardCount > 0 && vipLevel > 0) {
            newData.rewardPointObj = {
              showModal: true,
              count: rewardCount,
              callback: (vipLevel > 1 ? 'showVipUp' : 'showVip')
            }
            pageInstance.setData(newData);
          } else {
            if (rewardCount > 0) {
              newData.rewardPointObj = {
                showModal: true,
                count: rewardCount,
                callback: ''
              }
            }
            if (vipLevel > 0) {
              newData.shopVipModal = {
                showModal: true,
                isUp: vipLevel > 1
              }
            }
            pageInstance.setData(newData);
          }
        }
      }
    });
  },
  // 积分弹窗回调
  rewardPointCB: function (cbTy) {
    let that = this,
        pageInstance = that.getAppCurrentPage();
        pageInstance.setData({
          'rewardPointObj.showModal': false
        });
    if(typeof(cbTy) == 'function'){
      cbTy();
      return;
    }
    switch (cbTy) {
      case 'turnBack'://回到上一个页面
        that.turnBack();
      break;
      case 'showVip'://成为会员
        pageInstance.setData({
          'shopVipModal': {
            showModal: true,
            isUp: false
          }
        });
      break;
      case 'showVipUp'://会员升级
        pageInstance.setData({
          'shopVipModal': {
            showModal: true,
            isUp: true
          }
        });
      break;
      default:
      break;
    }
  },
  shopVipModalCB(cbTy) {
    let that = this,
        pageInstance = that.getAppCurrentPage();
        pageInstance.setData({
          'shopVipModal.showModal': false
        });
  },

  // 筛选组件 综合排序tab = 0
  sortByDefault: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newdata = {};
    let goods_compids = pageInstance.goods_compids_params;
    let goods_compid = '';
    let param = {};
    let addGroup_object = pageInstance.data[compid].customFeature.addGroup_object;

    for(let i in goods_compids){
      if(goods_compids[i].param.id == addGroup_object){
        goods_compid = goods_compids[i].compid;
        param = goods_compids[i].param;
      }
    }

    newdata[compid + '.tab'] = 0;
    newdata[compid + '.sortKey'] = '';
    newdata[compid + '.sortDirection'] = '';
    newdata[goods_compid + '.curpage'] = 0;
    newdata[goods_compid + '.is_more'] = 1;
    newdata[goods_compid + '.goods_data'] = [];
    param.sort_key = '';
    param.sort_direction = '';

    pageInstance.setData(newdata);

    if(goods_compid == ''){
      this.showModal({
        content: '找不到关联的列表'
      });
      return;
    }

    this._goodsScrollFunc(goods_compid);

  },
  // 筛选组件 按销量排序 tab = 1
  sortBySales: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newdata = {};
    let goods_compids = pageInstance.goods_compids_params;
    let goods_compid = '';
    let param = {};
    let addGroup_object = pageInstance.data[compid].customFeature.addGroup_object;

    for(let i in goods_compids){
      if(goods_compids[i].param.id == addGroup_object){
        goods_compid = goods_compids[i].compid;
        param = goods_compids[i].param;
      }
    }

    newdata[compid + '.tab'] = 1;
    newdata[compid + '.sortKey'] = 'sales';
    newdata[compid + '.sortDirection'] = 0;
    newdata[goods_compid + '.curpage'] = 0;
    newdata[goods_compid + '.is_more'] = 1;
    newdata[goods_compid + '.goods_data'] = [];
    param.sort_key = 'sales';
    param.sort_direction = 0;

    pageInstance.setData(newdata);

    if(goods_compid == ''){
      this.showModal({
        content: '找不到关联的列表'
      })
      return;
    }

    this._goodsScrollFunc(goods_compid);
  },
  // 筛选组件 按价格排序 tab = 2
  sortByPrice: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newdata = {};
    let sd = pageInstance.data[compid].sortDirection;
    let goods_compids = pageInstance.goods_compids_params;
    let goods_compid = '';
    let param = {};
    let addGroup_object = pageInstance.data[compid].customFeature.addGroup_object;

    for(let i in goods_compids){
      if(goods_compids[i].param.id == addGroup_object){
        goods_compid = goods_compids[i].compid;
        param = goods_compids[i].param;
      }
    }

    sd = (!sd || sd == 0) ? 1 : 0

    newdata[compid + '.tab'] = 2;
    newdata[compid + '.sortKey'] = 'price';
    newdata[compid + '.sortDirection'] = sd;
    newdata[goods_compid + '.curpage'] = 0;
    newdata[goods_compid + '.is_more'] = 1;
    newdata[goods_compid + '.goods_data'] = [];
    param.sort_key = 'price';
    param.sort_direction = sd;

    pageInstance.setData(newdata);

    if(goods_compid == ''){
      this.showModal({
        content: '找不到关联的列表'
      })
      return;
    }

    this._goodsScrollFunc(goods_compid);
  },
  // 筛选组件 按取货排序 tab = 3
  pickUpStyle: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newdata = {};
    if (pageInstance.data[compid].showPickUpBox){
      newdata[compid + '.pickUpObj'] = pageInstance.data[compid].initPickUpObj;
      newdata[compid + '.showPickUpBox'] = false;
      pageInstance.setData(newdata);
      return;
    }
    let pickUpObj = pageInstance.data[compid].pickUpObj || { '1': 1, '2': 2, '3': 3 };
    let initPickUpObj = JSON.parse(JSON.stringify(pickUpObj));
    this.getAppECStoreConfig((res) => {
      newdata[compid + '.tabExpress'] = res.express;
      newdata[compid + '.tabIntraCity'] = res.intra_city;
      newdata[compid + '.tabDelivery'] = res.is_self_delivery;
    });
    newdata[compid + '.initPickUpObj'] = initPickUpObj;
    newdata[compid + '.pickUpObj'] = pickUpObj;
    newdata[compid + '.tab'] = 3;
    newdata[compid + '.showPickUpBox'] = true;

    pageInstance.setData(newdata);
  },
  selectPickUp: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newdata = {};
    let pickType = e.currentTarget.dataset.type;
    let pickUpObj = pageInstance.data[compid].pickUpObj;
    pickUpObj[pickType] = pickUpObj[pickType] ? '' : pickType;

    newdata[compid + '.pickUpObj'] = pickUpObj;

    pageInstance.setData(newdata);
  },
  surePickBtn: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newdata = {};
    let goods_compids = pageInstance.goods_compids_params;
    let goods_compid = '';
    let param = {};
    let addGroup_object = pageInstance.data[compid].customFeature.addGroup_object;
    let pickType = pageInstance.data[compid].pickUpObj;
    let pickUpArr = [];

    for (let i in goods_compids) {
      if (goods_compids[i].param.id == addGroup_object) {
        goods_compid = goods_compids[i].compid;
        param = goods_compids[i].param;
      }
    }

    for (let i in pickType){
      pickType[i] &&  pickUpArr.push(pickType[i]);
    }

    newdata[compid + '.showPickUpBox'] = false;
    newdata[goods_compid + '.curpage'] = 0;
    newdata[goods_compid + '.is_more'] = 1;
    newdata[goods_compid + '.goods_data'] = [];
    param.pick_up_type = pickUpArr;

    pageInstance.setData(newdata);

    if (goods_compid == '') {
      this.showModal({
        content: '找不到关联的列表'
      })
      return;
    }

    this._goodsScrollFunc(goods_compid);
  },
  resetPickBtn: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newdata = {};
    let pickUpObj = { '1': 1, '2': 2, '3': 3 };

    newdata[compid + '.pickUpObj'] = pickUpObj;

    pageInstance.setData(newdata);
  },
  hideFilterPickUpBox: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newdata = {};
    newdata[compid + '.pickUpObj'] = pageInstance.data[compid].initPickUpObj;
    newdata[compid + '.showPickUpBox'] = false;
    pageInstance.setData(newdata);
  },
  // 筛选组件 展示侧边筛选
  filterList: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    pageInstance.setData({
      filterShow: true,
      filterCompid: compid
    });
  },
  // 筛选侧栏确定
  filterConfirm: function(e){
    let detail = e.detail;
    let hasFilter = (detail.leastPrice || detail.mostPrice || detail.chooseCateId || detail.currentRegionId) ?  true : false;
    let pageInstance = this.getAppCurrentPage();
    let compid = pageInstance.data.filterCompid;
    let newdata = {};
    let goods_compids = pageInstance.goods_compids_params;
    let goods_compid = '';
    let param = {};
    let addGroup_object = pageInstance.data[compid].customFeature.addGroup_object;

    for (let i in goods_compids) {
      if (goods_compids[i].param.id == addGroup_object) {
        goods_compid = goods_compids[i].compid;
        param = goods_compids[i].param;
      }
    }
    let idx = detail.chooseCateId ? {
      idx: 'category',
      idx_value: detail.chooseCateId
    } : '';

    newdata[compid + '.hasFilter'] = hasFilter;
    newdata[goods_compid + '.curpage'] = 0;
    newdata[goods_compid + '.is_more'] = 1;
    newdata[goods_compid + '.goods_data'] = [];
    param.least_price = detail.leastPrice || '';
    param.most_price = detail.mostPrice || '';
    param.region_id = detail.currentRegionId || '';
    param.idx_arr = idx;

    pageInstance.setData(newdata);
    if(goods_compid == ''){
      this.showModal({
        content: '找不到关联的列表'
      })
      return;
    }
    this._goodsScrollFunc(goods_compid);
  },
  animationEnd: function(e){
    let pageInstance = this.getAppCurrentPage();
    if (/^disappear_/g.test(e.detail.animationName)){
      let compid = e.target.dataset.compid;
      let data = {};

      data[compid+'.hidden'] = true;
      pageInstance.setData(data);
    }
  },
  checkCanUse: function(attr, dataName, compNameArr){
    let pageInstance = this.getAppCurrentPage();
    // let use = wx.canIUse(attr);
    let nowVersion = this.getSystemInfoData().SDKVersion || '2.0.7';
    let use = this.compareVersion(nowVersion, '2.0.7') > -1 ;
    let data = pageInstance.data;
    let canUseCompPath = [];
    let newdata = {};

    canUseCompPath = this.isCanUse(data, compNameArr, '');

    for(let i = 0; i < canUseCompPath.length; i++){
      newdata[canUseCompPath[i] + '.' + dataName] = use;
    }

    pageInstance.setData(newdata);
  },
  isCanUse: function(comp, compNameArr, path){
    let that = this;
    let canUseCompPath = [];
    for (let i in comp) {
      let cp = comp[i];
      let p = path == '' ? i : (path + '[' + i + ']');
      if (Object.prototype.toString.call(cp.content) == "[object Array]"){
        let r = that.isCanUse(cp.content, compNameArr, p + '.content');
        canUseCompPath = canUseCompPath.concat(r);
      } else if (Object.prototype.toString.call(cp.content) == "[object Object]"){
        for(let j in cp.content){
          let cpj = cp.content[j];
          let r = that.isCanUse(cpj, compNameArr, p + '.content.' + j );
          canUseCompPath = canUseCompPath.concat(r);
        }
      }
      if (compNameArr.indexOf(cp.type) > -1) {
        canUseCompPath.push(p);
      }
    }
    return canUseCompPath;
  },
  compareVersion: function(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    var len = Math.max(v1.length, v2.length)
    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }
    for (var i = 0; i < len; i++) {
      var num1 = parseInt(v1[i])
      var num2 = parseInt(v2[i])
      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
    return 0
  },
  // 排号
  isOpenRowNumber: function (pageInstance){
    let _this = this;
    for (let rowNumber of pageInstance.rowNumComps) {
      let newData = {};
      let compId = rowNumber.compid;
      this.sendRequest({
        url: '/index.php?r=AppTostore/getTostoreLineUpSetting',
        data: {
          sub_app_id:  pageInstance.franchiseeId || _this.getChainId()
        },
        success: function (res) {
          if(res.status == 0){
            newData[compId + '.numbertypeData'] = res.data;
            pageInstance.setData(newData);
            _this.rowNumber(pageInstance, compId);
          }
        }
      });
    }
  },
  rowNumber: function (pageInstance, compId) {
    let _this = this;
    let newData = {};
    this.sendRequest({
      url: '/index.php?r=AppTostore/getLiningUpQueueByUserToken',
      data: {
        sub_app_id:  pageInstance.franchiseeId || _this.getChainId()
      },
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          newData[compId + '.currentRowNumberData'] = res.data;
          pageInstance.setData(newData);
        }
      }
    })
  },
  showTakeNumberWindow: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    newData[compid + '.selectRowNumberTypeId'] = '';
    newData[compid + '.isShowTakeNumberWindow'] = true;
    pageInstance.setData(newData);
  },
  hideTakeNumberWindow: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    newData[compid + '.isShowTakeNumberWindow'] = false;
    pageInstance.setData(newData);
  },
  goToPreviewRowNumberOrder: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let id = pageInstance.data[compid].selectRowNumberTypeId;
    let franchiseeId =  pageInstance.franchiseeId || this.getChainId();
    let newData = {};
    if (!id) {
      this.showToast({
        title: '请选择排号类型',
        icon: 'none'
      })
      return;
    }
    newData[compid + '.isShowTakeNumberWindow'] = false;
    pageInstance.setData(newData);
    this.turnToPage('/orderMeal/pages/previewRowNumberOrder/previewRowNumberOrder?detail=' + id + (franchiseeId ? '&franchisee=' + franchiseeId : ''));
  },
  selectRowNumberType: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    newData[compid + '.selectRowNumberTypeId'] = e.currentTarget.dataset.id;
    pageInstance.setData(newData);
  },
  sureTakeNumber: function(e){
    let that = this;
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    let id = pageInstance.data[compid].selectRowNumberTypeId;
    if(!id){
      this.showToast({
        title: '请选择排号类型',
        icon: 'none'
      })
      return;
    }
    if (pageInstance.data[compid].isClick){return}
    newData[compid + '.isClick'] = true;
    pageInstance.setData(newData);
    this.sendRequest({
      url: '/index.php?r=AppTostore/addLineUpOrder',
      data: {
        line_up_type_id: id,
        formId: e.detail.formId,
        total_price: 0,
        sub_app_id:  pageInstance.franchiseeId || that.getChainId()
      },
      method: 'post',
      success: function (res) {
        that.sendRequest({
          url: '/index.php?r=AppShop/paygoods',
          data: {
            order_id: res.data,
            total_price: 0
          },
          success: function (res) {
            newData[compid + '.isClick'] = false;
            newData[compid + '.isShowTakeNumberWindow'] = false;
            pageInstance.setData(newData);
            that.isOpenRowNumber(pageInstance);
            that.showToast({
              title: '取号成功，请耐心等待',
              icon: 'none'
            })
          }
        });
      }
    });
  },
  goToCheckRowNunberDetail: function(e){
    let pageInstance = this.getAppCurrentPage();
    let orderId = e.currentTarget.dataset.orderId;
    let franchiseeId =  pageInstance.franchiseeId || this.getChainId();
    this.turnToPage('/orderMeal/pages/checkRowNumberDetail/checkRowNumberDetail?orderId=' + orderId + (franchiseeId ? '&franchisee=' + franchiseeId : ''));
  },
  cancelCheckRowNunber: function(e){
    let that = this;
    let orderId = e.currentTarget.dataset.orderId;
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    this.sendRequest({
      url: '/index.php?r=AppTostore/lineUpOrderRefund',
      method: 'post',
      data: {
        order_id: orderId,
        sub_app_id:  pageInstance.franchiseeId || that.getChainId()
      },
      success: function (res) {
        that.isOpenRowNumber(pageInstance);
        newData[compid + '.isShowCancelWindow'] = false;
        pageInstance.setData(newData);
      }
    });
  },
  rowNumberRefresh: function(){
    let pageInstance = this.getAppCurrentPage();
    this.isOpenRowNumber(pageInstance);
  },
  showCancelWindow: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    newData[compid + '.isShowCancelWindow'] = true;
    pageInstance.setData(newData);
  },
  hideCancelWindow: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    newData[compid + '.isShowCancelWindow'] = false;
    pageInstance.setData(newData);
  },
  getAppECStoreConfig: function (callback, franchiseeId) {
    let _this = this;
    let pageInstance = this.getAppCurrentPage();
    if (this.globalData.goodsStoreConfig && !franchiseeId){
      callback(this.globalData.goodsStoreConfig);
      return;
    }
    if (this.globalData.goodsfranchiseeStoreConfig && franchiseeId) {
      callback(this.globalData.goodsfranchiseeStoreConfig);
      return;
    }
    franchiseeId = franchiseeId || this.getPageFranchiseeId();
    this.sendRequest({
      url: '/index.php?r=AppEcommerce/getAppBECStoreConfig',
      data: {
        sub_shop_app_id: franchiseeId ||''
      },
      success: function (res) {
        if (franchiseeId){
          _this.globalData.goodsfranchiseeStoreConfig = res.data;
        }else{
          _this.globalData.goodsStoreConfig = res.data;
        }
        callback && callback(res.data)
      }
    })
  },

  // 日志
  addLog: function(){
    this.saveLog('log', arguments);
  },
  addDebug: function(){
    this.saveLog('debug', arguments);
  },
  addInfo: function(){
    this.saveLog('info', arguments);
  },
  addWarn: function(){
    this.saveLog('warn', arguments);
  },
  addError: function(){
    this.saveLog('error', arguments);
  },
  saveLog: function(tp, argu){
    let that = this;
    let time = util.formatTime();
    let manager = [];
    for(let i = 0; i < argu.length; i++){
      manager.push(argu[i]);
    }
    let info = {
      "type": tp, //可能值：log,debug,info,warn,error,
      "time": time, //时间
      "manager": manager //日志信息， 数组的值是any类型
    }
    this.getStorage({
      key: 'logManager',
      success: function(res){
        let lm = res.data.log_info;
        lm.push(info);
        that.setStorage({
          key: 'logManager',
          data: {
            log_info: lm
          }
        })
      },
      fail: function(){
        let lm = [];
        lm.push(info);
        that.setStorage({
          key: 'logManager',
          data: {
            log_info: lm
          }
        })
      }
    })
  },
  sendLog: function(){
    let that = this;
    let logManager = wx.getStorageSync('logManager');
    if(!logManager || logManager.length == 0){
      return;
    }
    logManager = logManager.log_info;
    let phone = this.getUserInfo('phone');
    let token = this.getUserInfo('user_token');
    let sys = this.getSystemInfoData();
    this.sendRequest({
      url: '/index.php?r=AppData/AddErrorLog',
      data: {
        user_phone: phone,
        user_token: token,
        system_info: JSON.stringify(sys),
        log_info: JSON.stringify(logManager)
      },
      method: 'post',
      success: function(){
        that.removeStorage({
          key: 'logManager'
        });
      }
    });
  },

  // 新增缩放悬浮窗
  createAnimationnewSuspension: function (compData) {
      let animation = wx.createAnimation({
        duration: 1000,
        delay: 0,
        timingFunction: 'linear'
      })
      let result = {};
      result.animation = animation;
      return result;
    },
  newSuspension_unfoldSus: function (compId, tapType) {
      let pageInstance = this.getAppCurrentPage();
      let compData = pageInstance.data[compId];
      let data = compData.customFeature;
      let res = this.createAnimationnewSuspension(compData);
      let newData = {};
      let ration = (this.getSystemInfoData().windowWidth || 375) / 750;
      let picHeight = Number(data['icon-size'].split('px')[0]) || 70 ;
      let fontSize = compData.style.match(/font\-size:([\d]+\.[\d]*)rpx/)[1] * 1.2 || 24 * 1.2 ;
      let marginBtm = '';
      let marginRight = '';
      if (data['margin-bottom'] && data['margin-bottom'] !== 'undefinedpx'){
        marginBtm = Number(data['margin-bottom'].split('px')[0]);
      }else {
        marginBtm = 0;
      }
      if (data['margin-right'] && data['margin-right'] !== 'undefinedpx'){
        marginRight = Number(data['margin-right'].split('px')[0]);
      }else {
        marginRight = 0;
      }
      let h = '';
      let w = '';
      let picHeightSum = '';
      let fontSizeSum = '';

      // 上下结构，在里面
      if (data.pickUpType == 1 && data.structure == 1 ) {
        let len = data.suspensionShowList.length;
        picHeightSum = len * ((picHeight + marginBtm *2) / ration + fontSize) ;
        fontSizeSum = len * (fontSize + marginRight);
        h = picHeightSum+ 140;
      // 上下结构，在外面
      }else if(data.pickUpType == 2 && data.structure == 1) {
        let len = data.suspensionShowList[0].length;
        picHeightSum = len * (picHeight + marginRight * 2) / ration;
        fontSizeSum = len * (80 + marginRight * 2 + 10);
        if (picHeightSum > fontSizeSum) {
          w = picHeightSum + 40;
        }else {
          w = fontSizeSum + 40;
        }
      // 左右结构，在里面
      }else if(data.pickUpType == 1 && data.structure ==2) {
        let len = data.suspensionShowList.length;
        picHeightSum = len * (picHeight + marginBtm * 2) / ration;
        fontSizeSum = len * (fontSize + marginBtm);
        h = picHeightSum + 116;
      // 左右结构，在外面
      }else {
        let len = data.suspensionShowList[0].length;
        picHeightSum = len * ((picHeight + marginRight * 2) / ration + 80 + 10);
        w = picHeightSum + 40;
      }
      switch (tapType) {
        case 'heightSus':
        if(compData.customFeature.pickUpType == 1){
          res.animation.height(h+'rpx').step({ duration: 600 });
        }else{
          res.animation.width(w+'rpx').step({ duration: 600 });
        }
          newData[compId + '.customFeature.animations.unfoldSus'] = res.animation.export();
          newData[compId + '.customFeature.buttonHidden'] = true;
          pageInstance.setData(newData);
          break;
        case 'foldSus':
          if (compData.customFeature.pickUpType == 1) {
            res.animation.height(0).step({ duration: 600 });
          } else {
            res.animation.width(0).step({ duration: 600 });
          }
          newData[compId + '.customFeature.animations.unfoldSus'] = res.animation.export();
          pageInstance.setData(newData);
          setTimeout(() => {
            newData[compId + '.customFeature.buttonHidden'] = false;
            pageInstance.setData(newData)
          }, 600);
          break;
        default:
          break;
      }
    },
  getChainStoreInfo: function() {
    let that = this;
    that.sendRequest({
      url: '/index.php?r=AppShop/GetAppShopByPage',
      data: {
        is_show_chain: 1,
        sub_shop_app_id: that.globalData.chainAppId,
        page: 1,
        page_size: 1
      },
      success: function (res) {
        customComponent['franchisee-chain'] && customComponent['franchisee-chain'].setChainInfo(res);
      },
      fail: function () {
        let pageInstance = that.getAppCurrentPage();
        that.globalData.chainAppId = '';
        that.globalData.chainHistoryDataId = '';
        if (pageInstance && pageInstance.page_router && that.globalData.chainNotLoading) {
          pageInstance.dataInitial();
        }
        that.globalData.chainNotLoading = false;
      }
    });
  },
  businessTimeCompare: function (time) {
    let now = new Date();
    let min = now.getMinutes().toString();
    if (min.length <= 1) {
      min = '0' + min;
    }
    let current = +(now.getHours().toString() + min);
    let business = false;
    for (let i = 0; i < time.length; i++) {
      if (current > +time[i].start_time_str && current < +time[i].end_time_str) {
        business = true;
      }
    }
    return business;
  },
  clearChainInfo: function(){
    this.globalData.chainAppId = '';
    this.globalData.chainHistoryDataId = '';
    this.globalData.indexPageRefresh = true;
    this.globalData.p_u = '';
    wx.removeStorageSync('chainStore');
  },
  getPageFranchiseeId: function(){
    let pageInstance = this.getAppCurrentPage();
    return pageInstance.franchiseeId || this.getChainId();
  },

  // 滚动加载更多周边社区团购活动
  communityGroupScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData = pageInstance.data[compid];
    let curpage = compData.curpage + 1;
    let newdata = {};
    let param = {
      latitude: compData.param.latitude,
      longitude: compData.param.longitude,
      page_size: compData.param.page_size,
      page: curpage,
      leader_token: this.getNowGommunityToken()
    };

    if (pageInstance.requesting || !pageInstance.data[compid].is_more) {
      return;
    }
    pageInstance.requesting = true;
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);

    this.sendRequest({
      url: '/index.php?r=AppDistributionExt/GetGroupsByDistance',
      data: param,
      method: 'post',
      hideLoading: true,
      success: function (res) {
        for (let item of res.data) {
          item.group_info.start_date = item.group_info.start_date.replace(/\-/g, '.');
          item.group_info.end_date = item.group_info.end_date.replace(/\-/g, '.');
          item.group_info.illustration = item.group_info.illustration.replace(/[\\n|\<br\/\>]/ig,"");
        }
        newdata[compid + '.communityGroup_data'] = [...pageInstance.data[compid].communityGroup_data, ...res.data];
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;
        newdata[compid + '.loadingFail'] = false;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      fail: function () {
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  // 切换小区
  chengeCommunityGroup(e) {
    let token = e.currentTarget.dataset.userToken;
    let router = this.returnSubPackageRouter("communityGroupSearchVillage");
    this.turnToPage(router + '?token=' + token);
  },
  // 社区活动详情
  toCommunityGroup(e) {
    let id = e.currentTarget.dataset.id;
    let leader_token = e.currentTarget.dataset.leaderToken;
    let isOnlineTime = e.currentTarget.dataset.status;
    let latitude = e.currentTarget.dataset.latitude;
    let longitude = e.currentTarget.dataset.longitude;
    let router = this.returnSubPackageRouter("communityGroupGoodDetail") + `?id=${id}&leader_token=${leader_token}&latitude=${latitude}&longitude=${longitude}`;
    if (!isOnlineTime) {
      this.turnToPage(router);
    }else {
      this.showModal({
        content: '活动已结束'
      })
    }
  },
  setCommunityGroupRefresh() {
    this.globalData.communityGroupRefresh = true;
  },
  setNowGommunityToken(token) {
    this.setStorage({
      key: 'nowGommunityToken',
      data: token
    })
  },
  getNowGommunityToken() {
    return wx.getStorageSync('nowGommunityToken');
  },
  getCommunityActiveMessage() {
    let role_setting = this.globalData.getDistributionInfo.role_setting;
    let message = '';
    for (let key in role_setting) {
      if (key == '6') {
        message = role_setting[key].illustration.split('\n');
        break
      }
    }
    return message;
  },




  /**
   *  全局参数get、set部分 start
   *
   */

  // 获取首页router
  getHomepageRouter: function () {
    return this.globalData.homepageRouter;
  },
  getAppId: function () {
    return this.globalData.appId;
  },
  getChainAppId: function () {
    return this.globalData.chainAppId || this.globalData.appId;
  },
  getChainId: function () {
    return this.globalData.chainAppId || '';
  },
  getPageRouter: function () {
    let pageInstance = this.getAppCurrentPage();
    if (pageInstance) {
      return pageInstance.page_router;
    }
    return this.globalData.pageRouter;
  },
  setPageRouter: function (url) { // 设置页面pageRouter
    let urlMatch = url.match(/.*\/(\w+)\??$/);
    if (urlMatch) {
      this.globalData.pageRouter = urlMatch[1];
    }
  },
  getLastPageRouter: function () {
    let lastPage = getCurrentPages().slice(-2).shift();
    return lastPage && lastPage.page_router;
  },
  getDefaultPhoto: function () {
    return this.globalData.defaultPhoto;
  },
  getSessionKey: function () {
    return this.globalData.sessionKey;
  },
  setSessionKey: function (session_key) {
    this.globalData.sessionKey = session_key;
    this.setStorage({
      key: 'session_key',
      data: session_key
    })
  },
  getUserInfo: function (key) {
    return key ? this.globalData.userInfo[key] : this.globalData.userInfo;
  },
  setUserInfoStorage: function (info) {
    for (let key in info) {
      this.globalData.userInfo[key] = info[key];
    }
    this.setStorage({
      key: 'userInfo',
      data: this.globalData.userInfo
    })
  },
  setPageUserInfo: function () {
    let currentPage = this.getAppCurrentPage();
    let newdata     = {};

    newdata['userInfo'] = this.getUserInfo();
    currentPage.setData(newdata);
  },
  getAppCurrentPage: function () {
    let pages = getCurrentPages();
    return pages[pages.length - 1];
  },
  getTabPagePathArr: function () {
    return JSON.parse(this.globalData.tabBarPagePathArr);
  },
  getWxParseOldPattern: function () {
    return this.globalData.wxParseOldPattern;
  },
  getWxParseResult: function (data, setDataKey) {
    let page = this.getAppCurrentPage();
    data = typeof data == 'number' ? ''+data : data.replace(/\u00A0|\u2028|\u2029|\uFEFF/g, '');
    return WxParse.wxParse(setDataKey || this.getWxParseOldPattern(),'html', data, page);
  },
  getAppTitle: function () {
    return this.globalData.appTitle;
  },
  getAppDescription: function () {
    return this.globalData.appDescription;
  },
  setLocationInfo: function (info) {
    this.globalData.locationInfo = info;
  },
  getLocationInfo: function () {
    return this.globalData.locationInfo;
  },
  getSiteBaseUrl: function () {
    return this.globalData.siteBaseUrl;
  },
  getCdnUrl: function () {
    return this.globalData.cdnUrl;
  },
  getUrlLocationId: function () {
    return this.globalData.urlLocationId;
  },
  getPreviewGoodsInfo: function () {
    return this.globalData.previewGoodsOrderGoodsInfo;
  },
  setPreviewGoodsInfo: function (goodsInfoArr) {
    this.globalData.previewGoodsOrderGoodsInfo = goodsInfoArr;
  },
  getGoodsAdditionalInfo: function () {
    return this.globalData.goodsAdditionalInfo;
  },
  setGoodsAdditionalInfo: function (additionalInfo) {
    this.globalData.goodsAdditionalInfo = additionalInfo;
  },
  vipCardTurnToPage:function(e){
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    let chainParam = this.globalData.chainAppId ? '&franchisee=' + this.globalData.chainAppId : '';
    if(type=='get-vip'){
      this.turnToPage('/pages/userCenter/userCenter?is_member=1' + chainParam)
    } else if (type =='buy-vip'){
      this.turnToPage('/eCommerce/pages/vipBenefits/vipBenefits?is_paid_card=1')
    } else if (type =='renewal-vip'){
      this.turnToPage('/eCommerce/pages/vipBenefits/vipBenefits?is_paid_card=1&id='+id);
    } else if (type == 'ordinary-vip') {
      this.turnToPage('/eCommerce/pages/vipBenefits/vipBenefits?id=' + id);
    }else if (type =='average-user'){
      if (e.currentTarget.dataset.isturnto =='true'){
        if (e.currentTarget.dataset.needcollectinfo == 1){
          this.turnToPage('/pages/userCenter/userCenter?is_member=1' + chainParam)
        }else{
          this.turnToPage('/eCommerce/pages/vipBenefits/vipBenefits');
        }
      }
    }else if (type == 'differential-mall') {
      this.turnToPage('/differentialMall/pages/dMWebView/dMWebView');
    }
  },
  showQRRemark:function(e){
    let compid = e.currentTarget.dataset.compid;
    let data={}
    let isShow = e.currentTarget.dataset.isshow;
    let pageInstance = this.getAppCurrentPage();
    if (isShow == 'true'){
      data[compid + '.userData.qrRemarkShow'] = true;
      pageInstance.setData(data);
      let url2 = '/index.php?r=appVipCard/getVipQRCode';
      let id = e.currentTarget.dataset.id;
      let is_paid_vip = e.currentTarget.dataset.type;
      this.sendRequest({
        url: url2,
        data: {
          id: id,
          is_paid_vip: is_paid_vip
        },
        chain: true,
        subshop: pageInstance.franchiseeId || '',
        success: function (res) {
          let qrData = {};
          qrData[compid + '.qrData'] = res.data;
          pageInstance.setData(qrData);
        }
      })
    }else{
      data[compid + '.userData.qrRemarkShow'] = false;
      pageInstance.setData(data);
    }
  },
  getIsLogin: function () {
    return this.globalData.isLogin;
  },
  setIsLogin: function (isLogin) {
    this.globalData.isLogin = isLogin;
  },
  getSystemInfoData: function () {
    let res;
    if (this.globalData.systemInfo) {
      return this.globalData.systemInfo;
    }
    try {
      res = this.getSystemInfoSync();
      this.setSystemInfoData(res);
    } catch (e) {
      this.showModal({
        content: '获取系统信息失败 请稍后再试'
      })
    }
    return res || {};
  },
  setSystemInfoData: function (res) {
    this.globalData.systemInfo = res;
  },
    globalData:{
    appId: 'ipFJ2220Op',
    historyDataId: '20697',
        tabBarPagePathArr: '["/pages/page10000/page10000","/pages/page10001/page10001","/pages/page10004/page10004","/pages/page10002/page10002"]',
        homepageRouter: 'page10000',
    formData: null,
    userInfo: {},
    systemInfo: null,
    sessionKey: '',
    notBindXcxAppId: false,
    waimaiTotalNum: 0,
    waimaiTotalPrice: 0,
    takeoutLocate:{},
    takeoutRefresh : false,
    communityGroupRefresh: false,
    isLogin: false,
    locationInfo: {
      latitude: '',
      longitude: '',
      address: '',
      info: {}
    },
    getDistributionInfo: '',
    getDistributorInfo: '',
    PromotionUserToken: '',
    previewGoodsOrderGoodsInfo: [],
    goodsAdditionalInfo: {},
    urlLocationId:'',
    turnToPageFlag: false,
    wxParseOldPattern: '_listVesselRichText_',
    cdnUrl: 'http://cdn.jisuapp.cn',
    defaultPhoto: 'http://cdn.jisuapp.cn/zhichi_frontend/static/webapp/images/default_photo.png',
    siteBaseUrl: 'https://jisuapp.zhichiweiye.cn', //这里不要写死
    userDomain: 'https://u2837768.jisuwebapp.com', // 用户子域名
    appTitle: '内测1.1.2',
    appDescription: '我的应用',
    appLogo: 'http://cdn.jisuapp.cn/zhichi_frontend/static/invitation/images/logo.png',
    p_u: '', //扫描二维码进入小程序所带参数代理商的user-token
    hasFranchiseeList: '0' == '1' ? true : false, //是否有多商家列表
    canIUseOfficialAccount: wx.canIUse('official-account'),//微信基础库是否能使用关注公众号组件
    hasTopicCom: false,
    pageScrollTop: 0,
    topicRefresh: false,
    kbHeight: '',
    goodsStoreConfig: '',
    goodsfranchiseeStoreConfig: '',
    susTopicsMap: {}, // 有悬浮窗话题列表地图
    needRefreshPages: [], // 需要刷新的页面
    newCountDataOnPage: {}, // 页面计数数据
  },
    })



var componentArr = ["carousel","sliding-panel","form-vessel"];
var customComponent = {
}
componentArr.forEach(function(val, index){
  let rq = require('segments/' + val + '/' + val + '.js');
  customComponent[val] = rq;
});
