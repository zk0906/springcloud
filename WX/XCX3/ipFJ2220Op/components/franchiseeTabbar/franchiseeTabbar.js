var app = getApp();
var customEvent = require('../../utils/custom_event.js');

Component({
  properties: {
    franchiseeInfo: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal, changedPath) {
        if (newVal && newVal.mode != '') {
          this.setData({
            franchiseeId: newVal.id,
            franchiseeMode: newVal.mode
          });
          this.getAppShopConfig();
        }
      }
    },
  },
  data: {
    franchiseeId: '',
    franchiseeMode: '',
    showTabbar: false,
    tabBar: [{
      "pagePath": "",
      "text": "主页",
      "iconPath": "https://img.zhichiwangluo.com/zcimgdir/album/file_5c6facc640cca.png",
      "selectedIconPath": "https://img.zhichiwangluo.com/zcimgdir/album/file_5c6facc5ab8f3.png"
    },
    {
      "pagePath": "/eCommerce/pages/shoppingCart/shoppingCart",
      "text": "购物车",
      "iconPath": "https://img.zhichiwangluo.com/zcimgdir/album/file_5c6facc748ef7.png",
      "selectedIconPath": "https://img.zhichiwangluo.com/zcimgdir/album/file_5c6facc6b8c7d.png"
    }, {
      "pagePath": "/franchisee/pages/userCenterComponentPage/userCenterComponentPage",
      "text": "我的",
      "iconPath": "https://img.zhichiwangluo.com/zcimgdir/album/file_5c6fa9cdd9c6c.png",
      "selectedIconPath": "https://img.zhichiwangluo.com/zcimgdir/album/file_5c6fa9cd4923e.png"
    }],
  },
  methods: {
    editTabBar: function () {
      let curPage = app.getAppCurrentPage(),
          pagePath = '/' + curPage.__route__,
          tabBar = this.data.tabBar,
          newdata = {};

      for (let i = 0; i < tabBar.length; i++) {
        newdata['tabBar[' + i + '].active'] = false;
        if (tabBar[i].pagePath == pagePath) {
          newdata['tabBar[' + i + '].active'] = true;//根据页面地址设置当前页面状态    
          newdata['showTabbar'] = true;
        }
      }
      this.setData(newdata);
    },
    tabBarTap: function(e){
      let index = e.currentTarget.dataset.index;
      let tab = this.data.tabBar[index];
      let curPage = app.getAppCurrentPage();
      let pagePath = '/' + curPage.__route__;
      if (pagePath == tab.pagePath){
        return;
      }
      if(index == 0){
        app.turnBack();
        // app.turnToPage(tab.pagePath + '?detail=' + this.data.franchiseeId , true);
      }else if (tab.pagePath){
        app.turnToPage(tab.pagePath + '?franchisee=' + this.data.franchiseeId + '&fmode=' + this.data.franchiseeMode, true);
      }else{
        let form = tab.form_data;
        let action = form.action;
        form.is_redirect = true;
        customEvent.clickEventHandler[action] && customEvent.clickEventHandler[action](form, this.data.franchiseeId);
      }
    },
    getAppShopConfig: function () {
      let that = this;
      let mode = that.data.franchiseeMode;
      app.sendRequest({
        url: '/index.php?r=AppShopConfig/GetAppShopConfig',
        data: {
          'sub_app_id': that.data.franchiseeId,
          mode_id: mode
        },
        success: function (res) {
          let data = res.data[0] || {};
          let newdata = {};
          let tabBar = that.data.tabBar;
          if (data.bottom_bar && data.bottom_bar.length){
            let bb = data.bottom_bar;
            let idx = 0;
            for(let i = 0; i < bb.length; i++){
              if (bb[i].is_show == 1){
                let p = '';
                let form = bb[i].form_data;
                if (form && form.action == 'inner-link'){
                  p = '/franchisee/pages/' + form['inner-page-link'] + '/' + form['inner-page-link'];
                }
                idx += 1;
                tabBar.splice(idx, 0 ,{
                  "pagePath": p,
                  "text": bb[i].name,
                  "iconPath": bb[i].photo,
                  "selectedIconPath": bb[i].press_photo,
                  "form_data": bb[i].form_data
                });
              }
            }
            if (mode == 0){
              tabBar[0].pagePath = '/franchisee/pages/franchiseeDetail/franchiseeDetail';
            } else if (mode == 2){
              tabBar[0].pagePath = '/franchisee/pages/franchiseeDetail4/franchiseeDetail4';
            }
            that.setData({
              tabBar: tabBar
            });
          }
          if (data.bottom_bar_type == 1) {
            that.editTabBar();
          }

        },
        complete: function () {

        }
      });
    },
  }
})