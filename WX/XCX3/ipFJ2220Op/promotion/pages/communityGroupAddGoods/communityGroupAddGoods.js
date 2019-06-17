// promotion/pages/communityGroupApply.js
var app = getApp();
Page({
  data: {
    group_id: '',
    goodsArr: [],
    showMore: false,
    showBtn: true, //  显示详细按钮
    agent_goods_ids: [], //  选择商品集合
    title: '',
    card_info: {},
    illustration: '',
    start_date: '',
    end_date: '',
    notice: true
  },
  isMore: 0,
  page: 1,
  onLoad: function (options) {
    let param = JSON.parse(decodeURIComponent(options.param));
    param.illustration = param.illustration.replace(/[\\n|\<br\/\>]/ig,""); 
    if (this._filterString(param.illustration) > 171) {
      param.showMore = true;
    }
    this.setData(param);
    this.setData({
      user_token: options.user_token
    })
    this.goodsList();
    this.getLeaderInfo();
  },
  onReachBottom() {
    if (!this.isMore) {
      return;
    }
    this.page++;
    this.goodsList();
  },
  goodsList: function () {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/GetGoodsListByGroupId',
      method: "post",
      data: {
        group_id: _this.data.group_id,
        page: this.page,
        page_size: 20
      },
      success: function (res) {
        let agent_goods_ids = _this.data.agent_goods_ids;
        let goodsIdArr = [];
        for (let item of res.data) {
          if (_this.findIndexOfTag(agent_goods_ids, item.id) >= 0) {
            item.check = true;
            goodsIdArr.push(item.id);
          } else {
            item.check = false;
          }
          if (item.form_data.goods_model) {
            let minPrice = item.form_data.goods_model[0].price;
            let virtualMinPrice;
            if (item.form_data.min_price == item.form_data.max_price) {
              item.commissionPrice = (+item.commission * +item.price / 100).toFixed(3);
            }else {
              item.commissionPrice = (+item.commission * +item.form_data.min_price / 100).toFixed(3) + '~' + (+item.commission * +item.form_data.max_price / 100).toFixed(3)
            }
            item.form_data.goods_model.map((goods) => {
              if (+minPrice >= +goods.price) {
                minPrice = goods.price;
                virtualMinPrice = goods.virtual_price;
              }
            })
            item.virtual_price = virtualMinPrice;
            item.price = minPrice;
          }else {
            item.commissionPrice = (+item.commission * +item.price / 100).toFixed(3);
          }
        }
        _this.isMore = res.is_more;
        _this.setData({
          goodsArr: [..._this.data.goodsArr, ...res.data],
          agent_goods_ids: goodsIdArr
        })
      }
    })
  },
  findIndexOfTag: function (arr, id) {
    let index = arr.findIndex((value, index) => {
      return value == id;
    })
    return index;
  },
  checkGood: function (e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let list = this.data.goodsArr;
    let agent_goods_ids = this.data.agent_goods_ids;

    list[index].check = !list[index].check;
    if (this.findIndexOfTag(agent_goods_ids, id) >= 0) {
      agent_goods_ids.splice(this.findIndexOfTag(agent_goods_ids, id), 1);
    } else {
      agent_goods_ids.push(id);
    }
    this.setData({
      goodsArr: list,
      agent_goods_ids: agent_goods_ids
    })
  },
  isShowMore: function () {
    let showBtn = !this.data.showBtn
    this.setData({
      showBtn: showBtn
    })
  },
  saveGoods: function (turnBack) {
    let _this = this;
    if (!_this.data.agent_goods_ids.length) {
      app.showToast({
        title: '请勾选需要出售的商品',
        icon: 'none'
      })
      return;
    }
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/BuildGroupLeader',
      method: 'post',
      hideLoading: true,
      data: {
        group_id: _this.data.group_id,
        goods_ids: _this.data.agent_goods_ids
      },
      success: function (res) {
        if (res.status == 0) {
          app.setCommunityGroupRefresh();
          if(turnBack != 'back') {
            app.showToast({
              title: '商品已加入社区团购活动~',
              icon: 'success'
            })
            setTimeout(()=> { app.turnBack(); },1500)
          }
        }
      }
    })
  },
  /**
   * [统计活动]
   * @param {string} roup_id 团id
   * @param {number} count_type 统计类型 0 销售 1 浏览 2分享 3接龙
   * @param {number} count_num 需要增加的数量 默认1
   */
  addBrowseCount: function (group_id, count_type, count_num) {
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/IncreaseCountByType',
      method: 'post',
      hideLoading: true,
      data: {
        group_id,
        count_type,
        count_num
      }
    })
  },
  getLeaderInfo: function () {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistributionExt/GetDistributorExtList',
      method: 'post',
      data: {
        leader_token: _this.data.user_token
      },
      success: function (res) {
        _this.setData({
          leader_token: res.data[0].user_token,
          latitude: res.data[0].latitude,
          longitude: res.data[0].longitude,
        })
      }
    })
  },
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
  onShareAppMessage: function (res) {
    let _this = this;
    _this.saveGoods('back');
    _this.addBrowseCount(_this.data.group_id, 2, 1);
    let path = `/promotion/pages/communityGroupGoodDetail/communityGroupGoodDetail?id=${_this.data.group_id}&leader_token=${_this.data.user_token}`;
    return {
      title: _this.data.card_info.title || _this.data.title,
      path: path,
      imageUrl: _this.data.card_info.pic || '',
    }
  },
  closeNotice: function () {
    this.setData({
      notice: false
    })
  }
})