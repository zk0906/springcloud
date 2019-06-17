var Element = require('../../utils/element.js');
var app = getApp();

var slidingPanel = new Element({
  events: {

  },
  methods: {
    init: function(compid, pageInstance){
      let compData = pageInstance.data[compid];
      if(compid){
        clearInterval(compData.slideInterval);
        if (compData.customFeature.autoplay && compData.customFeature.interval){
          this.slideSwiper({
            pageInstance: pageInstance,
            compid: compid
          })
        }
        if (compData.customFeature.vesselMode === 2) { // 滑动面板
          let customFeature = compData.customFeature,
            secStyle = [
              'font-size:' + customFeature.secFontSize,
              'font-weight:' + customFeature.secFontWeight || 'normal',
              'font-style:' + customFeature.secFontStyle || 'normal',
              'text-decoration:' + customFeature.secTextDecoration || 'none',
              'color:' + customFeature.secColor,
              'text-align:' + customFeature.secTextAlign
            ].join(';'),
            activeIndex = 0,
            scaleDegree = 1;
            customFeature.proportion > 1 && (scaleDegree = Math.round(100 / customFeature.proportion) / 100);
          pageInstance.setData({
            [compid + '.activeIndex']: activeIndex,
            [compid + '.secStyle']: secStyle,
            [compid + '.scaleDegree']: scaleDegree,
            [compid + '.reference']: customFeature.reference || 0.618
          });
          this.slidePanelSetBoundingClientRectInfo(pageInstance, compid);
        }
      }
    },
    slideSwiper: function(options) {
      let compData = options.pageInstance.data[options.compid];
      options.pageInstance.data[options.compid].slideInterval = setInterval(() =>{
        let index = compData.customFeature.slideIndex;
        let direction = '_interval'
        if (index >= compData.content.length ){
          index = 0;
        }else {
          index += 1;
        }
        app.slideAnimation({
          compid: options.compid,
          num: index,
          pageInstance: options.pageInstance,
          direction: direction
        })
      }, compData.customFeature.interval*1000)
    },
    // 滑动面板设置节点信息
    slidePanelSetBoundingClientRectInfo: function(pageIns, compid, n) {
      if (!compid) {
        return;
      }
      let that = this,
        pageInstance = pageIns || app.getAppCurrentPage(),
        newData = {},
        containerSelector = '#' + compid,
        selector = containerSelector + ' .sildeItem';
      app.getBoundingClientRect(containerSelector, function (areaRect) {
        if (!areaRect.length) {
          if (isNaN(n)) {
            n = 0;
          }
          if (n < 10) {
            setTimeout(function () {
              that.slidePanelSetBoundingClientRectInfo(pageInstance, compid, ++n);
            }, 300);
          }
          return;
        }
        let containerOffsetWidth = areaRect.shift().width;
        newData[compid + '.containerOffsetWidth'] = containerOffsetWidth;
        app.getBoundingClientRect(selector, function (itemRects) {
          let offsetArr = [],
            itemWidth = itemRects.length && itemRects[0].width || 0;
          if ((containerOffsetWidth == 0 || itemWidth == 0) && (isNaN(n) || n < 10)) {
            if (isNaN(n)) {
              n = 0;
            }
            setTimeout(function () {
              that.slidePanelSetBoundingClientRectInfo(pageInstance, compid, ++n);
            }, 300);
            return;
          }
          offsetArr = itemRects.map((v, k) => itemWidth * (k + 1));
          newData[compid + '.offsetLeftArr'] = offsetArr;
          pageInstance.setData(newData);
        });
      });
    }
  }
});


module.exports = slidingPanel;