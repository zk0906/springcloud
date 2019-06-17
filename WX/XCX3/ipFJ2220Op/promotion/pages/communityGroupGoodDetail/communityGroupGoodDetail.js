var app = getApp();

Page({
  data: {
    showMore: false,            //  标题介绍显示更多内容
    showBtn: true,              //  显示详细按钮
    showCark: true,             //  显示购物车
    showGood: true,             //  显示商品详情
    showModel: true,            //  商品多规格选择
    communityInfo: {},          //  社区团购信息
    communityGoodsList: [],     //  社区团购商品列表
    leaderInfo: {},             //  团长信息
    goodsInfo: {},              //  社区团购单个商品信息
    selectGoodsModelInfo: {},   //  当前选中的多规格商品信息
    userShopCark: [],           //  购物车
    leader_token: '',
    group_id: '',
    orderRecords: [],           //  订单接龙
    previewGoodIndex: '',       //  当前选中的商品索引值
    sold_count: 0,              // 接龙
    shopCarkNumber: 0,
  },
  clickGoodInfo: false,
  onLoad: function (options) {
    this.setData({
      group_id: options.id,
      leader_token: options.leader_token
    })
    app.setNowGommunityToken(options.leader_token);
    this.initData(options.leader_token, options.id);
    this.initRecords(options.leader_token, options.id);
  },
  onShow: function() {
    let _this = this;
    let communityGoodsList = this.data.communityGoodsList;
    let group_id = this.data.group_id;
    let leader_token = this.data.leader_token;
    if(this.clickGoodInfo) {
      this.getLocalStorageShopCark(communityGoodsList, leader_token, group_id, function (res1, res2) {
        _this._fixLocalStorageShopCark(res1, res2);
      });
      this.clickGoodInfo = false;
    }
  },
  onShareAppMessage: function (res) {
    let _this = this;
    let path = `/promotion/pages/communityGroupGoodDetail/communityGroupGoodDetail?id=${_this.data.group_id}&leader_token=${_this.data.leader_token}`;
    _this.addBrowseCount(_this.data.group_id, 2, 1, function () {
      let count = _this.data.communityInfo.share_count || 0;
      _this.setData({
        "communityInfo.share_count": ++count
      })
    });
    return {
      title: _this.data.communityInfo.card_info.title || _this.data.communityInfo.title,
      path: path,
      imageUrl: _this.data.communityInfo.card_info.pic || '',
    }
  },
  /**
   * 初始化社区活动及其商品列表
   * @param leader_token {string} 团长token
   * @param group_id {string} 团id
   */
  initData: function (leader_token, group_id, callBack) {
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
        if(!res.data.length) {
          app.setCommunityGroupRefresh();
          app.showModal({
            content: '该活动已结束，请选择其他团活动！',
            confirm: function() {
              let homepageRouter = app.getHomepageRouter();
              app.reLaunch({
                url: '/pages/' + homepageRouter + '/' + homepageRouter
              })
            }
          })
          return;
        }
        let communityGoodsList = res.data[0].goods_info;
        let communityInfo = res.data[0].group_info;
        let leaderInfo = res.data[0].leader_info;
        let showMore = false;
        communityInfo.start_date = communityInfo.start_date.replace(/\-/g, '.');
        communityInfo.end_date = communityInfo.end_date.replace(/\-/g, '.');
        for (let item of communityGoodsList) {
          if (item.form_data.goods_model) {
            let minPrice = item.form_data.goods_model[0].price;
            let virtualMinPrice;
            item.form_data.goods_model.map((goods) => {
              if (+minPrice >= +goods.price) {
                minPrice = goods.price;
                virtualMinPrice = goods.virtual_price;
              }
            })
            item.virtual_price = virtualMinPrice;
            item.price = minPrice;
          }
        }

        // 是否显示展开详细
        communityInfo.illustration = communityInfo.illustration.replace(/[\\n|\<br\/\>]/ig,""); 
        if (_this._filterString(communityInfo.illustration) > 171) {
          showMore = true;
        }
        _this.getLocalStorageShopCark(communityGoodsList, leader_token, group_id, function (res1, res2) {
          _this._fixLocalStorageShopCark(res1, res2);
        });
        _this.setData({
          communityInfo: communityInfo,
          leaderInfo: leaderInfo,
          showMore: showMore
        })
        if(callBack) {
          callBack();
          return;
        }
        _this.addBrowseCount(group_id, 1, 1, function () {
          let count = communityInfo.view_count;
          _this.setData({
            "communityInfo.view_count": ++count
          })
        });
      }
    })
  },
  /**
   * 获取传入字符串字节长度
   */
  _filterString: function (str) {
    let len = 0;
    for (var i = 0; i < str.length; i++) {
      if (str[i].match(/[^\x00-\xff]/ig) != null) {
        len += 1.75;
      } else { 
        if (str[i].match(/[a-zA-Z]/) != null) {
          len += 0.95;
        }else {
          len += 1;
        }
      };
    }
    return len;
  },
  /**
   * [订单接龙记录]
   * @param leader_token {string} 团长token
   * @param group_id {string} 团id
   */
  initRecords: function (leader_token, group_id) {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/GetDistributionGroupOrderByleader',
      method: 'post',
      data: {
        leader_token: leader_token,
        group_id: group_id
      },
      success: function (res) {
        if(res.data.length == 0) return;
        let data = res.data[0].pay_order_records;
        for(let value of data) {
          let total_sold_number = 0;
          for (let item of value.goods_info) {
            total_sold_number += parseInt(item.num);
            if (item.model_id != 0) {
              let model_new_list = [];
              let model_text = [];
              let chooseModelArr = item.model.split(',');
              for (let i in item.model_list) {
                model_new_list.push(item.model_list[i]);
              }
              for (let i = 0; i < chooseModelArr.length; i++) {
                let index = model_new_list[i].subModelId.findIndex(function (item) {
                  return item == chooseModelArr[i];
                });
                model_text.push(model_new_list[i].subModelName[index])
              }
              item.model = model_text.join(',');
            }
          }
          value.total_sold_number = total_sold_number;
        }
        _this.setData({
          orderRecords: data,
          sold_count: res.data[0].pay_order_num
        })
      }
    })
  },
  /**
   * [统计活动]
   * @param group_id {string} 团id
   * @param count_type {number} 统计类型 0 销售 1 浏览 2分享 3接龙
   * @param count_num {number} 需要增加的数量
   */
  addBrowseCount: function (group_id, count_type, count_num, callBack) {
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/IncreaseCountByType',
      method: 'post',
      hideLoading: true,
      data: {
        group_id,
        count_type,
        count_num
      },
      success: function(res) {
        callBack && callBack();
      }
    })
  },
  addGoods: function (e) {
    let good = e.currentTarget.dataset.param;
    let communityGoodsList = this.data.communityGoodsList;
    let communityIndex = this.findTagIndex(communityGoodsList, good.id);
    if (good.modelId != 0) {
      this.addCark(e, 1);
    } else {
      this.changeGoodsNum(communityIndex, 'plus');
    }
  },
  removeGoods: function (e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let shopCark = this.data.userShopCark;
    let targetNum = shopCark[index].buyCount;
    targetNum = targetNum - 1;

    let goods = this.data.communityGoodsList;
    let communityIndex = this.findTagIndex(goods, shopCark[index].id);

    if (targetNum == 0) {
      app.showModal({
        content: '确定从购物车删除该商品？',
        showCancel: true,
        confirm: function () {
          shopCark.splice(index, 1);
          goods[communityIndex].form_data.number = targetNum;
          _this.resetShopCarkPrice(shopCark);
          _this.setData({
            communityGoodsList: goods
          });
          if (shopCark.length === 0) {
            _this.isShowCark();
          };
        }
      })
      return;
    }
    shopCark[index].buyCount = targetNum;
    goods[communityIndex].form_data.number = targetNum;
    _this.resetShopCarkPrice(shopCark);
    _this.setData({
      communityGoodsList: goods
    });
  },
  clickGoodsMinusButton: function (event) {
    let count = this.data.selectGoodsModelInfo.buyCount;
    if (count <= 1) {
      return;
    }
    this.setData({
      'selectGoodsModelInfo.buyCount': count - 1
    });
  },
  clickGoodsPlusButton: function (event) {
    let selectGoodsModelInfo = this.data.selectGoodsModelInfo;
    let count = selectGoodsModelInfo.buyCount;
    let stock = selectGoodsModelInfo.stock;
    if (count >= stock) {
      return;
    }
    this.setData({
      'selectGoodsModelInfo.buyCount': count + 1
    });
  },
  // 初始化购物车商品价格
  resetShopCarkPrice: function (shopCark) {
    let shopCarkNumber = 0;
    for (let item of shopCark) {
      item.total_price = (item.price * item.buyCount).toFixed(2);
      shopCarkNumber += +item.buyCount;
    }
    this.setLocalStorageShopCark(shopCark, this.data.leader_token, this.data.group_id);
    this.setData({
      userShopCark: shopCark,
      shopCarkNumber: shopCarkNumber
    })
  },
  // 清空购物车
  clearShopCark: function () {
    let _this = this;
    let communityGoodsList = this.data.communityGoodsList;
    let shopCark = this.data.userShopCark;
    let cart_id_arr = [];
    app.showModal({
      content: '确定清空购物车？',
      showCancel: true,
      confirm: function () {
        for (let item of communityGoodsList) {
          item.form_data.number = 0;
        }
        for (let item of shopCark) {
          if (!!item.cart_id) {
            cart_id_arr.push(item.cart_id);
          }
        }
        if (cart_id_arr.length) {
          app.sendRequest({
            url: '/index.php?r=AppShop/deleteCart',
            method: 'post',
            data: {
              cart_id_arr: cart_id_arr
            }
          })
        }
        _this.resetShopCarkPrice([]);
        _this.setData({
          communityGoodsList: communityGoodsList,
          showCark: true
        })
      }
    })
  },
  // 商品详情数量输入
  inputNumber: function (e) {
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index;
    if (value.trim() != '') {
      this.changeGoodsNum(index, value);
    } else {
      this.changeGoodsNum(index, 1);
    }
  },
  stopInputNumber: function (e) {
    let index = e.currentTarget.dataset.index;
    let goods = this.data.communityGoodsList;
    if (!!goods[index].form_data.goods_model) {
      app.showModal({
        content: '多规格商品请在购物车中操作'
      })
      return;
    }
  },

  // 多规格加入购物车
  addCark: function (e, num) {
    let data = e.currentTarget.dataset.param;
    let communityGoodsList = this.data.communityGoodsList;
    let shopCark = this.data.userShopCark;
    let index = this.findTagIndex(communityGoodsList, data.id);
    let isAdd = this.isExistMultiGoods(shopCark, data.id, data.modelId);
    if (!isAdd) {
      if (data.buyCount > data.stock) {
        app.showModal({
          content: "购物车总量超过商品库存"
        });
        return;
      }
      shopCark.push(data);
    } else {
      for (let item of shopCark) {
        if (item.id == data.id && item.modelId == data.modelId) {
          let totalNum = item.buyCount + (num || data.buyCount);
          if (totalNum > item.stock) {
            app.showModal({
              content: "购物车总量超过商品库存"
            });
            break;
          }
          item.buyCount += (num || data.buyCount);
          break;
        }
      }
    }
    this.cumulative(shopCark, communityGoodsList, index);
    this.resetShopCarkPrice(shopCark);
    this.closeGoodModel();
  },
  // 初始化多规格商品
  initSelectGoodsModelInfo: function (goods) {
    goods.form_data.cover = goods.cover;
    goods.form_data.title = goods.title;
    goods.form_data.id = goods.id;
    goods.form_data.goods_type = goods.goods_type;
    goods = goods.form_data;
    let items = goods.goods_model;
    let goodsModel = [];
    let selectModels = [];
    let modifySelectModels = '';
    let selectStock, selectImgurl, selectPrice, selectModelId, matchResult, selectVirtualPrice, selectText = '',
      buyCount = 1;
    for (let key in goods.model) {
      let model = goods.model[key];
      goodsModel.push(model);
      if (model && model.subModelName) {
        selectModels.push(model.subModelId[0]);
        modifySelectModels = selectModels.toString();
        selectText += '“' + model.subModelName[0] + '” ';
      }
    }
    goods.model = goodsModel;
    for (let i = 0; i < items.length; i++) {
      let modifyGoodsmodel = items[i].model;
      if (modifyGoodsmodel == modifySelectModels) {
        selectPrice = items[i].price;
        selectStock = items[i].stock;
        selectModelId = items[i].id;
        selectImgurl = items[i].img_url == "" ? goods.cover : items[i].img_url;
        selectVirtualPrice = items[i].virtual_price;
      }
    }
    this.setData({
      goodsInfo: goods,
      'selectGoodsModelInfo.models': selectModels || '',
      'selectGoodsModelInfo.stock': selectStock || '',
      'selectGoodsModelInfo.price': selectPrice || '',
      'selectGoodsModelInfo.modelId': selectModelId || '',
      'selectGoodsModelInfo.models_text': selectText || '',
      'selectGoodsModelInfo.imgurl': selectImgurl,
      'selectGoodsModelInfo.virtualPrice': selectVirtualPrice || '',
      'selectGoodsModelInfo.buyCount': buyCount,
      'selectGoodsModelInfo.title': goods.title,
      'selectGoodsModelInfo.id': goods.id,
      'selectGoodsModelInfo.goods_type': goods.goods_type,
    })
    // 隐藏商品详情，打开购物车
    this.setData({
      showModel: false,
      showGood: true
    })
  },
  // 切换规格
  selectGoodsSubModel: function (e) {
    let dataset = e.target.dataset;
    let modelIndex = dataset.modelIndex;
    let submodelIndex = dataset.submodelIndex;
    let data = {};
    let selectModels = this.data.selectGoodsModelInfo.models;
    let model = this.data.goodsInfo.model;
    let text = '';
    selectModels[modelIndex] = model[modelIndex].subModelId[submodelIndex];
    //拼已选规格文字
    for (let i = 0; i < selectModels.length; i++) {
      let selectSubModelId = model[i].subModelId;
      for (let j = 0; j < selectSubModelId.length; j++) {
        if (selectModels[i] == selectSubModelId[j]) {
          text += '“' + model[i].subModelName[j] + '”';
        }
      }
    }
    data['selectGoodsModelInfo.models'] = selectModels;
    data['selectGoodsModelInfo.models_text'] = text;
    this.resetSelectCountPrice(data);
  },
  resetSelectCountPrice: function (data) {
    let selectModelIds = this.data.selectGoodsModelInfo.models.join(',');
    let modelItems = this.data.goodsInfo.goods_model;
    let cover = this.data.goodsInfo.cover;
    data['selectGoodsModelInfo.buyCount'] = 1;
    for (let item of modelItems) {
      if (item.model == selectModelIds) {
        data['selectGoodsModelInfo.stock'] = item.stock;
        data['selectGoodsModelInfo.price'] = item.price;
        data['selectGoodsModelInfo.modelId'] = item.id || '';
        data['selectGoodsModelInfo.imgurl'] = item.img_url == "" ? cover : item.img_url;;
        data['selectGoodsModelInfo.virtualPrice'] = item.virtual_price;
        break;
      }
    }
    this.setData(data);
  },
  // 多规格商品累积
  cumulative: function (shopCark, communityGoodsList, index) {
    let number = 0;
    for (let item of shopCark) {
      if (item.id == communityGoodsList[index].id) {
        number += item.buyCount;
      }
    }
    communityGoodsList[index].form_data.number = number;
    this.setData({
      communityGoodsList: communityGoodsList
    })
  },
  // 多规格商品数量输入
  inputBuyCount: function (e) {
    this.setData({
      'selectGoodsModelInfo.buyCount': Number(e.detail.value)
    })
  },
  /**
   * 判断购物车是否存在相同Id和modeId的商品
   * @param shopCark {array}  购物车数据
   * @param id {number}  商品id
   * @param modelId {number}  多规格id
   */
  isExistMultiGoods: function (shopCark, id, modelId) {
    if (shopCark.length == 0) return false;
    let idIndex = shopCark.findIndex(function (item) {
      return item.id == id;
    })
    let modelIdIndex = shopCark.findIndex(function (item) {
      return item.modelId == modelId;
    })
    if (idIndex >= 0 && modelIdIndex >= 0) {
      return true;
    } else {
      return false;
    }
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
  },


  // 查看更多（描述内容）
  isShowMore: function () {
    let showBtn = this.data.showBtn;
    this.setData({
      showBtn: !showBtn
    })
  },
  callPhone: function (e) {
    let phone = e.currentTarget.dataset.phone;
    app.makePhoneCall(phone);
  },
  // 商品详情
  // 获取活动商品评价
  getGoodInfo: function (e) {
    let _this = this;
    let index               = e.currentTarget.dataset.index;
    let leader_token        = this.data.leader_token;
    let group_id            = this.data.group_id;
    let logo                = this.data.leaderInfo.logo;
    let nick_name           = this.data.leaderInfo.nick_name;
    let shopCark            = JSON.stringify(this.data.userShopCark);
    let communityGoodsList  = JSON.stringify(this.data.communityGoodsList[index]);
    wx.navigateTo({
      url: `/promotion/pages/communityGroupGoodsInfo/communityGroupGoodsInfo?communityGoodsList=${encodeURIComponent(communityGoodsList)}&shopCark=${shopCark}&leader_token=${leader_token}&group_id=${group_id}&logo=${encodeURIComponent(logo)}&nick_name=${encodeURIComponent(nick_name)}`,
      success: function(res) {
        _this.clickGoodInfo = true;
      }
    })
  },
  /**
   * [changeGoodsNum 商品数量增减]
   * type {string}  plus or minus or count
   */
  changeGoodsNum: function (index, type) {
    let _this = this;
    let goods = this.data.communityGoodsList;
    let currentNum = goods[index].form_data.number;
    let targetNum = type == 'plus' ? currentNum + 1 : (type == 'minus' ? currentNum - 1 : Number(type));
    let shopCark = this.data.userShopCark;
    let carkIndex = this.findTagIndex(shopCark, goods[index].id);
    //  多规格
    if (!!goods[index].form_data.goods_model && type == 'plus') {
      _this.initSelectGoodsModelInfo(goods[index]);
      return;
    }
    if (!!goods[index].form_data.goods_model) {
      app.showModal({
        content: '多规格商品请在购物车中删除'
      })
      return;
    }
    if (targetNum == 0 && type == 'minus') {
      app.showModal({
        content: '确定从购物车删除该商品？',
        showCancel: true,
        confirm: function () {
          shopCark.splice(carkIndex, 1);
          goods[index].form_data.number = 0;
          _this.resetShopCarkPrice(shopCark);
          _this.setData({
            communityGoodsList: goods
          });
        }
      })
      return;
    }
    if (targetNum > goods[index].stock) {
      targetNum = goods[index].stock;
      app.showModal({
        content: "购物车总量超过商品库存"
      })
    }
    if (carkIndex >= 0) {
      shopCark[carkIndex].buyCount = targetNum;
      goods[index].form_data.number = targetNum;
    } else {
      let data = {
        'price': goods[index].price,
        'title': goods[index].title,
        'modelId': 0,
        'id': goods[index].id,
        'stock': goods[index].stock,
        'buyCount': 1,
        'goods_type': goods[index].goods_type,
        'imgurl': goods[index].cover
      }
      shopCark.push(data);
      goods[index].form_data.number = 1;
    }
    _this.resetShopCarkPrice(shopCark);
    _this.setData({
      communityGoodsList: goods
    })
  },
  /**
   * [setGlobalLocationInfo 根据位置信息修改当前位置]
   * @param latitude {string}  维度
   * @param longitude {string} 纬度
   */
  setGlobalLocationInfo: function (latitude, longitude) {
    let _this = this;
    app.getAddressByLatLng({
      lat: latitude,
      lng: longitude
    }, (data) => {
      app.setLocationInfo({
        latitude: latitude,
        longitude: longitude,
        address: data.data.formatted_addresses.recommend,
        info: data.data
      });
    })
  },

  // 检验登录状态
  isLogin: function (options) {
    let loginStatus = app.getIsLogin();
    let _this = this;
    if (loginStatus) {
      _this._previewPay();
    } else {
      app.goLogin({
        success: function () {
          _this._previewPay();
        }
      });
    }
  },
  // 校验团长状态
  _previewPay: function() {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/CheckIsDistributorGroupLeader',
      method: 'post',
      hideLoading: true,
      data: {
        leader_token: _this.data.leader_token,
      },
      success: function(res) {
        if (res.data == 1) {
          _this._settlement();
        }else {
          app.showModal({
            content: '团长资质审核中，请先在其他团长里购买!'
          })
        }
      }
    })
  },
  // 结算
  _settlement: function () {
    let _this = this;
    let leaderInfo = encodeURIComponent(JSON.stringify(_this.data.leaderInfo));
    let group_id = _this.data.group_id;
    if (!this.data.userShopCark.length) {
      app.showModal({
        content: '购物车暂无商品，请添加商品后再结算~'
      })
      return;
    }
    wx.showToast({
      title: '提交中...',
      icon: 'loading',
      mask: true
    });
    this.initData(this.data.leader_token, this.data.group_id,res => {
      let shop = this.addCarkId(this.data.userShopCark, 0, function (shop) {
        _this.clickGoodInfo = true;
        let cart_arr = encodeURIComponent(JSON.stringify(shop));
        let pagePath = `/promotion/pages/communityGroupOrderSubmit/communityGroupOrderSubmit?cart_arr=${cart_arr}&leaderInfo=${leaderInfo}&group_id=${group_id}`;
        wx.navigateTo({ url: pagePath });
      });
    })
  },
  /**
   * [递归购物车，给所有商品加上购物车id]
   * shopCark {array} 购物车信息
   * index {number} 购物车商品索引 0
   */
  addCarkId: function (shopCark, index, callBack) {
    let _this = this;
    if (index == shopCark.length) {
      wx.hideToast();
      return callBack && callBack(shopCark);
    } else {
      let data = {
        goods_id: shopCark[index].id,
        model_id: shopCark[index].modelId,
        num: shopCark[index].buyCount,
        leader_token: _this.data.leader_token,
        dis_group_id: _this.data.group_id
      }
      app.sendRequest({
        url: '/index.php?r=AppShop/addCart',
        method: 'post',
        hideLoading: true,
        data: data,
        success: function (res) {
          shopCark[index].cart_id = res.data;
          _this.addCarkId(shopCark, ++index, callBack);
        }
      })
    }
  },
  stopPropagation: function () { },
  stopMove: function () { return; },
  // 关闭多规格选择
  closeGoodModel: function () {
    this.setData({
      showModel: true
    })
  },
  // 显示购物车
  isShowCark: function () {
    let showCark = !this.data.showCark
    this.setData({
      showCark: showCark
    })
  },
  goToHomepage: function (data) {
    let router = app.getHomepageRouter();
    app.reLaunch({
      url: '/pages/' + router + '/' + router
    });
  },
  plus: function (e) {
    let index = e.currentTarget.dataset.index;
    this.changeGoodsNum(index, 'plus');
  },
  reduce: function (e) {
    let index = e.currentTarget.dataset.index;
    this.changeGoodsNum(index, 'minus');
  },

  /**
   * [初始化购物车数据]
   * @param shop {array} 购物车列表
   * @param leaderToken {string}  团长Id
   * @param groupId {string}  团Id
   */
  setLocalStorageShopCark: function (shop, leaderToken, groupId) {
    let key = `${leaderToken}Width${groupId}`;
    let data = wx.getStorageSync('communityGoodCark') || {};
    data[key] = shop;
    app.setStorage({
      key: 'communityGoodCark',
      data: data
    })
  },
  /**
   * [初始化所有商品数据]
   * @param communityGoodsList {array} 商品列表
   * @param leaderToken {string}  团长Id
   * @param groupId {string}  团Id
   */
  getLocalStorageShopCark: function (communityGoodsList, leaderToken, groupId, callBack) {
    let key = `${leaderToken}Width${groupId}`;
    let data = wx.getStorageSync('communityGoodCark');
    let shopKey = Object.keys(data).filter(value => {
      return value == key
    })
    callBack && callBack(data[shopKey[0]] || [], communityGoodsList);
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
          }else {
            item.price = communityGoodsList[shopIndex].form_data.goods_model[modelIndex].price;
            item.stock = communityGoodsList[shopIndex].form_data.goods_model[modelIndex].stock;
          }
        }else {
          item.price = communityGoodsList[shopIndex].price;
          item.stock = communityGoodsList[shopIndex].stock;
        }
      }
    });
    for (let item of communityGoodsList) {
      item.form_data.number = 0;
      for (let value of shopCark) {
        if (value.id == item.id) {
          item.form_data.number += value.buyCount;
        }
      }
    };
    this.resetShopCarkPrice(shopCark);
    this.setData({
      communityGoodsList: communityGoodsList
    })
  },
  openLocation: function() {
    let latitude = +this.data.leaderInfo.latitude;
    let longitude = +this.data.leaderInfo.longitude;
    let name = this.data.leaderInfo.address_detail;
    app.openLocation({
      latitude,
      longitude,
      name,
      scale: 18
    })
  }
})