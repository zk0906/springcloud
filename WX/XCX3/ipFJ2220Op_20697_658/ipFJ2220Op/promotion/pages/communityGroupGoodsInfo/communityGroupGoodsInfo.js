var app = getApp();
var WxParse = require('../../../components/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModel: true,
    communityGoodsList: '',
    selectGoodsModelInfo: {},   //  当前选中的多规格商品信息
    evaluateList: {             //  商品评价列表
      data: []
    },
    userShopCark: [],
    nick_name: '',
    logo: ''
  },
  page: 0,
  isMore: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let communityGoodsList  = JSON.parse(decodeURIComponent(options.communityGoodsList));
    let shopCark            = JSON.parse(decodeURIComponent(options.shopCark));
    let nick_name           = decodeURIComponent(options.nick_name);
    let logo                = decodeURIComponent(options.logo);
    let description         = communityGoodsList.form_data.description;
    description             = description ? description.replace(/\u00A0|\u2028|\u2029|\uFEFF/g, '') : description;
    communityGoodsList.form_data.description = description;

    if (!!communityGoodsList.form_data.goods_model) {
      let virtualPrice = Number(communityGoodsList.virtual_price);
      for (let item of communityGoodsList.form_data.goods_model) {
        virtualPrice = Number(virtualPrice) > Number(item.virtual_price) ? virtualPrice : item.virtual_price;
      }
      communityGoodsList.virtual_price = virtualPrice;
      if (communityGoodsList.form_data.min_price == communityGoodsList.form_data.max_price) {
        communityGoodsList.price = communityGoodsList.form_data.goods_price || communityGoodsList.price;
      }else {
        communityGoodsList.price = communityGoodsList.form_data.min_price + '~' + communityGoodsList.form_data.max_price;        
      }
    }
    WxParse.wxParse('wxParseDescription', 'html', description, _this, 10);
    this.setData({
      communityGoodsList: communityGoodsList,
      userShopCark: shopCark,
      group_id: options.group_id,
      leader_token: options.leader_token,
      nick_name: decodeURIComponent(options.nick_name),
      logo: decodeURIComponent(options.logo),
    })
    this.getUserEvalute(1, 1);
  },
  // 关闭多规格选择
  closeGoodModel: function () {
    this.setData({
      showModel: true
    })
  },
  getUserShopCark: function() {
    let shopCark = app.get
  },
  getUserEvalute: function (page, pageSize) {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/GetAssessList',
      data: {
        goods_id: _this.data.communityGoodsList.id,
        idx_arr: {
          idx: 'goods_type',
          idx_value: 0
        },
        page: page,
        page_size: pageSize
      },
      success: function (res) {
        _this.isMore = res.is_more;
        res.data = [..._this.data.evaluateList.data, ...res.data];
        _this.setData({
          showGood: false,
          evaluateList: res
        })
      }
    })
  },
  addMore: function (e) {
    if (!this.isMore) {
      return;
    }
    this.page++;
    if(this.page == 1) {
      this.setData({
        'evaluateList.data': []
      })
    }
    this.getUserEvalute(this.page, 10);
  },
  clickPlusImages: function (e) {
    app.previewImage({
      current: e.currentTarget.dataset.src,
      urls: e.currentTarget.dataset.srcarr
    })
  },
  // 多规格加入购物车
  addCark: function (e, num) {
    let data = e.currentTarget.dataset.param;
    let communityGoodsList = this.data.communityGoodsList;
    let shopCark = this.data.userShopCark;
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
    this.cumulative(shopCark, communityGoodsList);
    this.resetShopCarkPrice(shopCark);
    this.closeGoodModel();
  },
  // 商品详情数量输入
  inputNumber: function (e) {
    let value = e.detail.value;
    if (value.trim() != '') {
      this.changeGoodsNum(value);
    } else {
      this.changeGoodsNum(1);
    }
  },
  stopInputNumber: function (e) {
    let goods = this.data.communityGoodsList;
    if (!!goods.form_data.goods_model) {
      app.showModal({
        content: '多规格商品需要到购物车内操作'
      })
      return;
    }
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
      showModel: false
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
  cumulative: function (shopCark, communityGoodsList) {
    let number = 0;
    for (let item of shopCark) {
      if (item.id == communityGoodsList.id) {
        number += item.buyCount;
      }
    }
    communityGoodsList.form_data.number = number;
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
  plus: function (e) {
    this.changeGoodsNum('plus');
  },
  reduce: function (e) {
    this.changeGoodsNum('minus');
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
  changeGoodsNum: function (type) {
    let _this = this;
    let goods = this.data.communityGoodsList;
    let currentNum = goods.form_data.number;
    let targetNum = type == 'plus' ? currentNum + 1 : (type == 'minus' ? currentNum - 1 : Number(type));
    let shopCark = this.data.userShopCark;
    let carkIndex = this.findTagIndex(shopCark, goods.id);
    //  多规格
    if (!!goods.form_data.goods_model && type == 'plus') {
      _this.initSelectGoodsModelInfo(goods);
      return;
    }
    if (!!goods.form_data.goods_model) {
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
          goods.form_data.number = 0;
          _this.resetShopCarkPrice(shopCark);
          _this.setData({
            communityGoodsList: goods
          });
        }
      })
      return;
    }
    if (targetNum > goods.stock) {
      targetNum = goods.stock;
      app.showModal({
        content: "购物车总量超过商品库存"
      })
    }
    if (carkIndex >= 0) {
      shopCark[carkIndex].buyCount = targetNum;
      goods.form_data.number = targetNum;
    } else {
      let data = {
        'price': goods.price,
        'title': goods.title,
        'modelId': 0,
        'id': goods.id,
        'stock': goods.stock,
        'buyCount': 1,
        'goods_type': goods.goods_type,
        'imgurl': goods.cover
      }
      shopCark.push(data);
      goods.form_data.number = 1;
    }
    _this.resetShopCarkPrice(shopCark);
    _this.setData({
      communityGoodsList: goods
    })
  },
  // 初始化购物车商品价格
  resetShopCarkPrice: function (shopCark) {
    this.setLocalStorageShopCark(shopCark, this.data.leader_token, this.data.group_id);
    this.setData({
      userShopCark: shopCark
    })
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
  stopPropagation: function () { },
  stopMove: function () { return; },
})