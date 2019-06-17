
var app = getApp()

Page({
  data: {
    cartType: -1,
    editing: false,
    goodsCount: 0,
    goodsCountToPay: 0,
    priceToPay: 0.00,
    goodsList: [],
    unableData: [],
    selectAll: false,
    notBussinessTimeGoodId: [],
    showDeleteWindow: false,
    goodsList: [],
    currentSelectGoodsType: ''
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
   
  },
  onReady: function(){
  },
  dataInitial: function(){
    this.getShoppingCartData();
    this.getAppECStoreConfig();
  },
  getAppECStoreConfig: function () {
    app.getAppECStoreConfig((res) => {
      this.setData({
        cartConfig: res.cart_config,
        storeStyle: res.color_config
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
        sub_shop_app_id: franchiseeId,
        parent_shop_app_id: franchiseeId ? app.getAppId() : ''
      },
      success: function(res){
        let data = [];
        let tostoreGoosList = [];
        let waimaiGoosList = [];
        for (let i = 0; i < res.data.length; i++) {
          var modelArr = res.data[i].model_value;

          if(modelArr && modelArr.join){
            res.data[i].model_value_str = modelArr.join('；');
          }

          if (res.data[i].goods_type == 2){
            waimaiGoosList.push(res.data[i]);
          } else if (res.data[i].goods_type == 3){
            tostoreGoosList.push(res.data[i]);
          }
        }

        data = [{
            type: 3,
            show: true,
            data: tostoreGoosList
          },
          {
            type: 2,
            show: true,
            data: waimaiGoosList
          }]

        that.setData({
          takeoutInfo: res.take_out_info,
          goodsCount: res.data.length,
          goodsList: data,
          unableData: res.unable_data
        });
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
    let selectAll = this.data.selectAll;
    let goodsList = this.data.goodsList;
    let cartType = this.data.cartType;
    let currentSelectGoodsType = this.data.currentSelectGoodsType;
    let currentGoodsList = [];
    let type;
    if (cartType == -1 && currentSelectGoodsType){
      type = currentSelectGoodsType;
    }else{
      type = cartType;
    }
    
    goodsList.map((item) => {
      if(type != -1){ 
        if (item.type == type) {
          currentGoodsList = item.data;
        }
      }else{
        if (!currentGoodsList.length){
          currentGoodsList = item.data;
          currentSelectGoodsType = item.type;
        }
      }
    })

    if (selectAll){
      currentSelectGoodsType = '';
      currentGoodsList.map((item) => {
        item.selected = false;
      })
    } else {
      currentGoodsList.map((item) => {
        item.selected = true;
      })
    }

    this.setData({
      selectAll: !selectAll,
      goodsList: goodsList,
      currentSelectGoodsType: currentSelectGoodsType
    })
    this.recalculateCountPrice();
  },
  // 想删除
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
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    let list = this.data.goodsList;
    let currentGoodsList;
    let selectAll = true;
    let noSelectAll = true;
    list.map((item) => {
      if (item.type == type) {
        currentGoodsList = item.data;
      }
      
    })

    currentGoodsList[index].selected = !currentGoodsList[index].selected;
    currentGoodsList.map((item) => {
      if(!item.selected){
        selectAll = false;
      }else{
        noSelectAll = false;
      }
    })
    this.setData({
      goodsList: list,
      selectAll: selectAll,
      currentSelectGoodsType: noSelectAll ? '' : type
    })
    this.recalculateCountPrice();
  },
  recalculateCountPrice: function(){
    var goodsList = this.data.goodsList,
        totalCount = 0,
        price = 0;

    goodsList.map((item) => {
      item.data.map((goods) => {
        if (goods.selected) {
          totalCount += +goods.num;
          price += +goods.price * +goods.num;
        }
      })
    })

    this.setData({
      goodsCountToPay: totalCount,
      priceToPay: price.toFixed(2)
    })
  },
  // 需要更改
  goToPay: function(e){
    var payIdArr = [],
        franchiseeId = this.franchiseeId,
        fromUserCenterEle = this.data.isFromUserCenterEle,
        currentSelectGoodsType = this.data.currentSelectGoodsType,
        cartIdArray = [],
        that = this,
        notBusinessTimeFlag = false;
    let currentGoodsList;
    let goodsList = this.data.goodsList;
    goodsList.map((item) => {
      if(item.type == currentSelectGoodsType){
        currentGoodsList = item.data;
      }
    })

    if (!currentGoodsList) {
      app.showModal({
        content: '请选择结算的商品'
      });
      return;
    }

    currentGoodsList.map((item) => {
      if (item.selected) {
        cartIdArray.push(item.id);
        payIdArr.push({
          cart_id: item.id,
          goods_id: item.goods_id,
          model_id: item.model_id,
          model: item.model,
          num: item.num,
          goods_type: item.goods_type,
          is_seckill:item.is_seckill,
          seckill_start_state: item.seckill_start_state ? item.seckill_start_state:'',
        }); 
      }
    })

    // 当购物车勾选商品种类全部相同时 不生成订单而是跳转到预览订单页面
    that.getTostoreNotBusinessTime(payIdArr , function() {
      if(currentSelectGoodsType == 0){
        //全部为电商
        let isSeckill = true;
        let seckill_start_state = true;
          for (let i = 0; i < payIdArr.length;i++){
            if (payIdArr[i].is_seckill != payIdArr[0].is_seckill){
              isSeckill=false;
            }
            //判断是否有已结束的秒杀商品
            if (payIdArr[i].seckill_start_state == 2 || payIdArr[i].seckill_start_state == 0){
              seckill_start_state = false;
            }
          }
          let pagePath = '';
          if (isSeckill && payIdArr[0].is_seckill == 1){
            if (!seckill_start_state){
              app.showModal({
                content: '有未开始或已结束的秒杀商品，请重新选择。'
              });
              return;
            }else{
              pagePath = '/seckill/pages/previewSeckillOrder/previewSeckillOrder?cart_arr=' + encodeURIComponent(cartIdArray);
            }
             //全部为秒杀
          } else if (isSeckill && payIdArr[0].is_seckill != 1){
            pagePath = '/eCommerce/pages/previewGoodsOrder/previewGoodsOrder?cart_arr=' + encodeURIComponent(cartIdArray);
              //全部为电商
          }else{
            app.showModal({
              content: '商品混合，不可下单，请重新选择。'
            });
            return;
          }

        franchiseeId && (pagePath += '&franchisee=' + franchiseeId);
        app.turnToPage(pagePath);
        // return;

      } else if (currentSelectGoodsType == 1) {
        //全部为预约
        var pagePath = '/eCommerce/pages/previewAppointmentOrder/previewAppointmentOrder?cart_arr=' + encodeURIComponent(cartIdArray);

        franchiseeId && (pagePath += '&franchisee=' + franchiseeId);
        app.turnToPage(pagePath);
        // return;
      }else if (currentSelectGoodsType == 3){
        //全部为到店
        var pagePath = '/orderMeal/pages/previewOrderDetail/previewOrderDetail?cart_arr='+encodeURIComponent(cartIdArray);

        franchiseeId && (pagePath += '&franchisee=' + franchiseeId);
        app.turnToPage(pagePath);
        // return;
      } else if (currentSelectGoodsType == 2){
        if(+that.data.takeoutInfo.min_deliver_price > +that.data.priceToPay){
          app.showModal({
            content: '没有达到起送价('+that.data.takeoutInfo.min_deliver_price+'元)'
          });
          return;
        }
        var pagePath = '/orderMeal/pages/previewTakeoutOrder/previewTakeoutOrder?cart_arr=' + encodeURIComponent(cartIdArray);

        franchiseeId && (pagePath += '&franchisee=' + franchiseeId);
        app.turnToPage(pagePath);
      }
    });

  },
  clickMinusButton: function(e){
    let index = e.currentTarget.dataset.index,
        goodsType = e.currentTarget.dataset.type;
    this.changeGoodsNum(goodsType, index, 'minus');
  },
  clickPlusButton: function(e){
    let index = e.currentTarget.dataset.index;
    let goodsType = e.currentTarget.dataset.type;
    this.changeGoodsNum(goodsType, index, 'plus');
  },
  inputGoodsCount: function (e) {
    let goodsType = e.currentTarget.dataset.type;
    let count = e.detail.value;
    let index = e.target.dataset.index;

    if (count == '') {
      return;
    }

    if (count == 0) {
      app.showModal({
        content: '请输入大于0的数字',
      })
      return;
    }

    this.changeGoodsNum(goodsType, index, 'number', count);
  },
  changeGoodsNum: function (goodsType, index, type, numberCount){
    let goodsList = this.data.goodsList;
    let currentGoods;

        goodsList.map((item) => {
          if (item.type == goodsType) {
            currentGoods = item.data[index];
          }
        })

    let currentNum = +currentGoods.num,
        targetNum,
        _this = this,
        param;
    if (type == 'plus'){
      targetNum = currentNum + 1;
    } else if (type == 'minus'){
      targetNum = currentNum - 1;
      if (targetNum <= 0) {
        this.setData({
          singelDeleteId: currentGoods.id
        })
        this.showDeleteWindow('singel');
        return;
      }
    }else {
      targetNum = numberCount
    }

    if (+targetNum > +currentGoods.stock ){
      app.showModal({
        content: '库存不足'
      });
      return;
    }

    param = {
      goods_id: currentGoods.goods_id,
      model_id: currentGoods.model_id || '',
      num: targetNum,
      sub_shop_app_id: this.franchiseeId,
      is_seckill: currentGoods.is_seckill == 1 ? 1 : '',
      message_notice_type: 1 
    };

    app.sendRequest({
      url: '/index.php?r=AppShop/addCart',
      data: param,
      method: 'post',
      success: function (res) {
        currentGoods.num = targetNum;
        _this.setData({
          goodsList: goodsList
        });
        _this.recalculateCountPrice();
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
  sureDeleteGoods: function (e){
    let _this = this;
    let goodsList = this.data.goodsList;
    let deleteArr = [];
    let type = e.currentTarget.dataset.type;
    if (type == 'singel'){
      deleteArr.push(this.data.singelDeleteId);
    }else{
      goodsList.map((item) => {
        item.data.map((goods) => {
          if(goods.selected){
            deleteArr.push(goods.id);
          }
        })
      })
    }
    this.deleteGoods(deleteArr);
  },
  deleteGoods: function (deleteArr){
    let _this = this;
    let fromUserCenterEle = this.data.isFromUserCenterEle;
    app.sendRequest({
      url: '/index.php?r=AppShop/deleteCart',
      method: 'post',
      data: {
        cart_id_arr: deleteArr,
        sub_shop_app_id: fromUserCenterEle ? '' : _this.franchiseeId
      },
      success: function (res) {
        _this.setData({
          showDeleteWindow: false,
          selectAll: false,
          currentSelectGoodsType: ''
        });
        _this.getShoppingCartData();
      }
    });
  },
  deleteUnableGoods: function (event) {
    let index = event.currentTarget.dataset.index;
    let deleteId = this.data.unableData[index].id;
    this.setData({
      singelDeleteId: deleteId
    })
    this.showDeleteWindow('singel');
  },
  stopPropagation: function(){
    
  },
  showGoodsList: function(e){
    let type = e.currentTarget.dataset.type;
    let goodsList = this.data.goodsList;
    let currentGoodsList;
    goodsList.map((item) => {
      if (item.type == type) {
        item.show = !item.show;
      }
    })
    this.setData({
      goodsList: goodsList
    })
  },
  changeCartType: function(e){
    let cartType = e.currentTarget.dataset.type;
    let goodsList = this.data.goodsList;
    goodsList.map((item) => {
      item.data.map((goods) => {
        goods.selected = false;
      })
    })
    this.setData({
      cartType: cartType,
      selectAll: false,
      goodsList: goodsList,
      currentSelectGoodsType: cartType == -1 ? '' : cartType
    })
    this.recalculateCountPrice();
  },
  goCommodityDetail: function(event){
    let franchiseeParam = this.franchiseeId ? '&franchisee=' + this.franchiseeId : '';
    app.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + event.currentTarget.dataset.id + franchiseeParam);
  },
  stopPropagation: function(){
    
  },
  toGoodsShoppingCart: function(){
    let _this = this;
    app.showModal({
      content: '将切换至电商专用购物车,对电商商品进行结算',
      showCancel: true,
      confirm: function(){
        app.turnToPage('/eCommerce/pages/goodsShoppingCart/goodsShoppingCart?franchisee=' + _this.franchiseeId);
      }
    })  
  }
})
