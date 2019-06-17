var app = getApp()

Component({
  properties: {
    // 这里定义了传进来的对象属性，属性值可以在组件使用时指定
    pageQRCodeData: {
      type: Object,
      value: {
        shareDialogShow: "100%",
        shareMenuShow: false,
      }
    }
  },
  data: {
    // 这里是一些组件内部数据
    pageQRCodeShow: false,
    pageQRCodeData: {
      shareDialogShow: "100%",
      shareMenuShow: false
    },
    showShare: false,
    siteBaseUrl: getApp().globalData.siteBaseUrl,
  },
  ready: function () {
    this.getShareToMomentsSwitch();
  },
  methods: {
    drawing: function(){
      let _this = this;
      const ctx = wx.createCanvasContext('goodsImage',this);
      _this.setDrawImage(ctx, _this.data.pageQRCodeData.goodsInfo.goods_img, 10, 10, 260, 260,1);     
      _this.setDrawImage(ctx, _this.data.pageQRCodeData.goodsInfo.qrcode_img_url, 190, 280, 70, 70,0);
      ctx.setFillStyle('#ffffff')
      ctx.fillRect(0, 0, 280, 390)
      ctx.draw(true)
      _this.setFillText(ctx, _this.data.pageQRCodeData.goodsInfo.text, '#333333',300);
      ctx.draw(true)
    },
    setFillText: function (ctx, text, color, y){
      let textString;
      if (text.length > 36){
        textString = text.substr(0,33) + '...';
      }else{
        textString = text;
      }
      let textRowArr = [];
      for (let tmp = 0; tmp < textString.length;) {
        textRowArr.push(textString.substr(tmp, 12))
        tmp += 12
      }
      for (let item of textRowArr) {
        ctx.setFontSize(13);
        ctx.setFillStyle(color);
        ctx.fillText(item, 10, y);
        y += 20;
        
      }
      let goodsInfo = this.data.pageQRCodeData.goodsInfo;
      if (goodsInfo.isSeckill && goodsInfo.isSeckill == 1){
        goodsInfo.virtual_price = goodsInfo.price;
        goodsInfo.price = goodsInfo.seckill_price ? goodsInfo.seckill_price:'';
      }
      if (goodsInfo.price){
        ctx.setFontSize(16);
        ctx.setFillStyle('#FF3600');
        if (goodsInfo.integral == '2') {
          if (goodsInfo.price == '0.00') {
            ctx.fillText(goodsInfo.max_can_use_integral + '积分', 10, y+10)
          } else {
            ctx.fillText('￥' + goodsInfo.price + '+' + goodsInfo.max_can_use_integral + '积分', 10, y+10);
          }
        } else {
          ctx.fillText('￥' + goodsInfo.price, 10, y+10);
        }
      }
      let virtual_price = goodsInfo.virtual_price;
      if (virtual_price) {
        let vx = (String(goodsInfo.price).length + 1) * 9 + 20;
        ctx.setFontSize(12);
        ctx.setFillStyle('#999');
        ctx.fillText('￥' + virtual_price, vx , y + 10);
        ctx.beginPath();
        ctx.setStrokeStyle('#999');
        ctx.moveTo(vx , y + 6);
        ctx.lineTo(vx + (String(virtual_price).length + 1) * 6 + 12, y + 6);
        ctx.stroke();
      }

      ctx.setFontSize(10);
      ctx.setFillStyle('#666666');
      ctx.fillText('长按识别二维码',190,365)
  
      ctx.beginPath()
      ctx.setLineWidth(1)
      ctx.setLineJoin('miter')
      ctx.moveTo(260, 280)
      ctx.lineTo(270, 280)
      ctx.lineTo(270, 290)

      ctx.moveTo(260, 375)
      ctx.lineTo(270, 375)
      ctx.lineTo(270, 365)

      ctx.moveTo(190, 280)
      ctx.lineTo(180, 280)
      ctx.lineTo(180, 290)

      ctx.moveTo(190, 375)
      ctx.lineTo(180, 375)
      ctx.lineTo(180, 365)

      ctx.setStrokeStyle('#FF3600');
      ctx.stroke()

    },
    setDrawImage: function(ctx,src,x,y,w,h,index){
      let _this = this;
      wx.getImageInfo({
        src: app.getSiteBaseUrl() + '/index.php?r=Download/DownloadResourceFromUrl&url=' + src,
        success: function (res) {
          ctx.drawImage(res.path, x, y, w, h);
          ctx.draw(true);
          if (index == 1 && _this.data.pageQRCodeData.goodsInfo.isSeckill){
            _this.setDrawImage(ctx, 'http://test2.zhichiwangluo.com/static/webapp/images/seckill-share-icon.png', 10, 252, 62, 18,0);
          }
        }
      })
    },
    // 获取是否显示转发朋友圈
    getShareToMomentsSwitch: function () {
      let that = this;
      app.sendRequest({
        url: '/index.php?r=AppData/GetShareToMomentsSwitch',
        data: {
        },
        success: function (res) {
          that.setData({
            showShare: res.data
          });
        }
      });
    },
    // 这里是一个自定义方法
    // 隐藏分享组件
    hideShareDialog: function () {
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: "ease"
      })
      this.animation = animation;
      animation.bottom("-320rpx").step()
      this.setData({
        "pageQRCodeData.shareDialogShow": "100%",
        "pageQRCodeData.shareMenuShow": false,
        "pageQRCodeData.animation": animation.export(),
        "pageQRCodeShow": false
      })
    },
    // 转发到朋友圈
    showPageCode: function () {
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: "ease"
      })
      this.animation = animation;
      animation.bottom("-320rpx").step()
      this.setData({
        "pageQRCodeData.shareMenuShow": false,
        "pageQRCodeData.animation": animation.export(),
        pageQRCodeShow: true
      },()=>{
        this.drawing();
        console.log(666)
      });
      
    },
    stopPropagation: function () {
    },
    savePageCode: function(){
      let _this = this;
      wx.canvasToTempFilePath({
        canvasId: 'goodsImage',
        success(res) {
          _this.pageCode(res.tempFilePath);
        }
      },this)
    },
    pageCode: function (url) {
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: "ease"
      })
      this.animation = animation;
      animation.bottom("-320rpx").step()
      let that = this;
      wx.showLoading({mask: true})
      wx.saveImageToPhotosAlbum({
        filePath: url,
        success: function (data) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 4000
          })
          that.animation = animation;
          that.animation.bottom("-320rpx").step();
          that.setData({
            "pageQRCodeData.shareDialogShow": "100%",
            "pageQRCodeData.shareMenuShow": false,
            "pageQRCodeData.animation": that.animation.export(),
            "pageQRCodeShow": false
          })
        },
        fail: function (res) {
          if (res && (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail:auth denied")) {
            wx.showModal({
              title: '提示',
              content: '您已经拒绝授权保存图片到您的相册，这将影响您使用小程序，您可以点击右上角的菜单按钮，选择关于。进入之后再点击右上角的菜单按钮，选择设置，然后将保存到相册按钮打开，返回之后再重试。',
              showCancel: false,
              confirmText: "确定",
              success: function (res) {
              }
            })
          }
        }
      })
    },
  }
})