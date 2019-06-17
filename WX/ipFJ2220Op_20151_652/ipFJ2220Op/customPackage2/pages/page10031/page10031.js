var app      = getApp();

var pageData = {
  data: {"picture1":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:421.875rpx;margin-left:auto;margin-right:auto;margin-top:0rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5cab117a9e5ab.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.59","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_864525123398","page_form":"","compId":"picture1"},"text2":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u88c5\u4fee\u4e1a\u4e3b\u6700\u5e38\u7528\u5230\u7684\u88c5\u4fee\u65b9\u5f0f\u4e3b\u8981\u5206\u201c\u534a\u5305\u201d\u548c\u201c\u5168\u5305\u201d\u4e24\u79cd\u3002\u6240\u8c13\u201c\u534a\u5305\u201d\uff0c\u4e5f\u88ab\u79f0\u4e3a\u5305\u6e05\u5de5\u8f85\u6599\uff0c\u662f\u6307\u88c5\u4fee\u7528\u7684\u8f85\u6750\u548c\u65bd\u5de5\u7531\u5bb6\u88c5\u516c\u53f8\u63d0\u4f9b\uff0c\u4e3b\u6750\u7531\u4e1a\u4e3b\u81ea\u884c\u8d2d\u4e70\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_728711483659","page_form":"","compId":"text2","markColor":"","mode":0},"text3":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u6240\u8c13\u201c\u5168\u5305\u201d\uff0c\u5c31\u662f\u6240\u6709\u6750\u6599\u7684\u91c7\u8d2d\u548c\u65bd\u5de5\u90fd\u7531\u5bb6\u88c5\u516c\u53f8\u63d0\u4f9b\uff0c\u4e1a\u4e3b\u4ed8\u8d39\u3001\u9a8c\u6536\u5373\u53ef\u3002\u88c5\u4fee\u4e2d\u7684\u4e3b\u6750\u6307\u7684\u662f\u5730\u677f\u3001\u74f7\u7816\u3001\u536b\u6d74\u3001\u6d01\u5177\u7b49\uff0c\u8f85\u6750\u6307\u7684\u662f\u6c34\u6ce5\u3001\u6c99\u5b50\u3001\u6c34\u7ba1\u3001\u7535\u7ebf\u7b49\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_865817872100","page_form":"","compId":"text3","markColor":"","mode":0},"text4":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u5bf9\u4e8e\u8fd9\u4e24\u79cd\u65b9\u5f0f\uff0c\u4e1a\u5185\u5404\u6709\u5404\u7684\u8bf4\u6cd5\u3002\u591a\u6570\u5efa\u6750\u5382\u5546\u4f1a\u5efa\u8bae\u4e1a\u4e3b\u81ea\u5df1\u8d2d\u4e70\u4e3b\u6750\uff0c\u8f85\u6750\u53ef\u4ee5\u5305\u7ed9\u5bb6\u88c5\u516c\u53f8\uff0c\u8fd9\u79cd\u88c5\u4fee\u65b9\u5f0f\u66f4\u5212\u7b97\uff0c\u8d28\u91cf\u4e5f\u66f4\u80fd\u4fdd\u969c\u3002\u800c\u5bb6\u88c5\u516c\u53f8\u5219\u66f4\u4e50\u4e8e\u63d0\u4f9b\u201c\u5168\u5305\u201d\u670d\u52a1\uff0c\u4ed6\u4eec\u6307\u51fa\uff0c\u5168\u90e8\u5305\u7ed9\u5bb6\u88c5\u516c\u53f8\u6027\u4ef7\u6bd4\u66f4\u9ad8\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_470916405159","page_form":"","compId":"text4","markColor":"","mode":0},"picture5":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:58.59375rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5cab12a56ead4.png","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"12.53","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_624021795848","page_form":"","compId":"picture5"},"text6":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u9009\u7528\u201c\u534a\u5305\u201d\u6a21\u5f0f\u9700\u8981\u4e1a\u4e3b\u81ea\u5df1\u8d2d\u4e70\u4e3b\u6750\uff0c\u5176\u4f18\u52bf\u5728\u4e8e\u6d88\u8d39\u8005\u53ef\u4ee5\u81ea\u5df1\u63a7\u5236\u4e3b\u6750\u7684\u8d28\u91cf\u3001\u5916\u89c2\u548c\u4ef7\u683c\u3002\u5728\u5f88\u591a\u6d88\u8d39\u8005\u770b\u6765\uff0c\u8fd9\u79cd\u6a21\u5f0f\u66f4\u7701\u94b1\uff0c\u56e0\u4e3a\u81ea\u5df1\u4e70\u6750\u6599\u65f6\u53ef\u4ee5\u780d\u4ef7\uff0c\u7528\u540c\u6837\u7684\u4ef7\u683c\u53ef\u4ee5\u4e70\u5230\u66f4\u597d\u7684\u54c1\u724c\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_728877639548","page_form":"","compId":"text6","markColor":"","mode":0},"text7":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u201c\u534a\u5305\u201d\u5bf9\u4e1a\u4e3b\u7684\u8981\u6c42\u66f4\u9ad8\uff0c\u9700\u8981\u4e1a\u4e3b\u5bf9\u5efa\u6750\u54c1\u724c\u548c\u8d28\u91cf\u6709\u4e00\u5b9a\u7684\u4e86\u89e3\uff0c\u9664\u975e\u4e1a\u4e3b\u80fd\u591f\u771f\u6b63\u505a\u5230\u8d27\u6bd4\u4e09\u5bb6\uff0c\u5426\u5219\u53cd\u800c\u5bb9\u6613\u5403\u529b\u4e0d\u8ba8\u597d\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_372700096290","page_form":"","compId":"text7","markColor":"","mode":0},"text8":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u4e0e\u201c\u5168\u5305\u201d\u76f8\u6bd4\uff0c\u9009\u62e9\u201c\u534a\u5305\u201d\u65b9\u5f0f\u88c5\u4fee\uff0c\u51fa\u73b0\u5bb6\u88c5\u516c\u53f8\u4e0e\u6750\u6599\u65b9\u76f8\u4e92\u201c\u626f\u76ae\u201d\u60c5\u51b5\u7684\u51e0\u7387\u66f4\u9ad8\u3002\u7531\u4e8e\u201c\u534a\u5305\u201d\u8fc7\u7a0b\u4e2d\uff0c\u4e3b\u6750\u662f\u4e1a\u4e3b\u81ea\u5df1\u8d2d\u4e70\uff0c\u4e00\u65e6\u51fa\u73b0\u95ee\u9898\uff0c\u5f88\u5bb9\u6613\u51fa\u73b0\u5bb6\u88c5\u516c\u53f8\u4e0e\u6750\u6599\u5546\u4e92\u76f8\u63a8\u8bff\u7684\u73b0\u8c61\u3002\u4f8b\u5982\u51fa\u73b0\u74f7\u7816\u5f00\u88c2\uff0c\u5bb6\u88c5\u516c\u53f8\u65b9\u9762\u5f80\u5f80\u6307\u5411\u74f7\u7816\u4ea7\u54c1\u8d28\u91cf\u4e0d\u8fc7\u5173\uff0c\u800c\u74f7\u7816\u5382\u5546\u5219\u4f1a\u6307\u8d23\u65bd\u5de5\u5b58\u5728\u95ee\u9898\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_438877533024","page_form":"","compId":"text8","markColor":"","mode":0},"text9":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u51fa\u73b0\u95ee\u9898\u4e00\u5b9a\u8981\u6743\u8d23\u660e\u786e\uff0c\u5148\u4ed4\u7ec6\u8fa8\u522b\uff0c\u65e0\u6cd5\u8fa8\u522b\u7684\u60c5\u51b5\u4e0b\u5c31\u8981\u8bf7\u4e00\u4e2a\u7b2c\u4e09\u65b9\u76d1\u7406\u6765\u89e3\u51b3\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_106594825387","page_form":"","compId":"text9","markColor":"","mode":0},"text10":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u9009\u62e9\u201c\u534a\u5305\u201d\u65b9\u5f0f\u88c5\u4fee\uff0c\u4e1a\u4e3b\u9700\u8981\u7279\u522b\u6ce8\u610f\u8f85\u6750\u7684\u8d28\u91cf\uff0c\u4ed4\u7ec6\u67e5\u770b\u5408\u540c\uff0c\u786e\u5b9a\u5185\u5bb9\u6240\u6d89\u53ca\u7684\u8f85\u6750\u54c1\u724c\u3001\u6570\u91cf\u3001\u4ef7\u683c\uff0c\u662f\u5426\u4e0e\u4e4b\u524d\u7ea6\u5b9a\u597d\u7684\u76f8\u7b26\uff0c\u800c\u4e14\u8fd8\u8981\u5173\u6ce8\u5408\u540c\u4e2d\u662f\u5426\u63d0\u53ca\uff0c\u5982\u679c\u672a\u80fd\u63d0\u4f9b\u7ea6\u5b9a\u7684\u6750\u6599\uff0c\u5c06\u7528\u4ec0\u4e48\u54c1\u724c\u6765\u4ee3\u66ff\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_75350102200","page_form":"","compId":"text10","markColor":"","mode":0},"text11":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;left:NANrpx;","content":"      \u201c\u534a\u5305\u201d\u9002\u5408\u4e2a\u6027\u5316\u5ba2\u6237\u548c\u5c40\u90e8\u88c5\u4fee\u8005\uff0c\u5bb6\u88c5\u516c\u53f8\u53ea\u8d1f\u8d23\u8f85\u6750\u90e8\u5206\uff0c\u4e3b\u6750\u8fd8\u662f\u5ba2\u6237\u81ea\u5df1\u9009\uff0c\u5982\u679c\u60f3\u4ee3\u8d2d\u6d77\u5916\u4e3b\u6750\uff0c\u6709\u7684\u88c5\u4fee\u516c\u53f8\u4e5f\u53ef\u63d0\u4f9b\u6b64\u9879\u670d\u52a1\u3002\n","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_853562333856","page_form":"","compId":"text11","markColor":"","mode":0},"text12":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;left:NANrpx;","content":"      \u8981\u6c42\u66f4\u9ad8\u7684\u5ba2\u6237\u751a\u81f3\u4f1a\u9009\u62e9\u7eaf\u6e05\u5de5\u65b9\u5f0f\u3002\u8fd9\u79cd\u65b9\u5f0f\u4e2d\uff0c\u6240\u6709\u6750\u6599\u90fd\u8981\u4e1a\u4e3b\u81ea\u5df1\u8d2d\u4e70\u3002\u8fd9\u79cd\u65b9\u5f0f\u867d\u7136\u80fd\u6709\u6548\u907f\u514d\u5077\u5de5\u51cf\u6599\uff0c\u4f46\u662f\u4f1a\u9020\u6210\u6d6a\u8d39\u3002\u6bd4\u5982\u4e70\u4e865\u888b\u817b\u5b50\uff0c\u53ea\u7528\u4e864\u888b\u534a\uff0c\u5269\u4e0b\u7684\u534a\u888b\u5bf9\u4e1a\u4e3b\u6765\u8bf4\u5c31\u6ca1\u6709\u7528\u4e86\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_518756306273","page_form":"","compId":"text12","markColor":"","mode":0},"text13":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u6216\u8005\u88c5\u4fee\u8fc7\u7a0b\u4e2d\u9700\u8981\u51e0\u6839\u9489\u5b50\uff0c\u4f46\u5efa\u6750\u8d85\u5e02\u90fd\u662f\u8bba\u76d2\u5356\uff0c\u4e1a\u4e3b\u53ef\u80fd\u4f1a\u4e0d\u540c\u578b\u53f7\u4e70\u597d\u51e0\u76d2\u3002\u8fd9\u4e9b\u5355\u770b\u8d77\u6765\u5e76\u4e0d\u8d77\u773c\uff0c\u4f46\u5bb6\u88c5\u662f\u4e00\u4e2a\u5de5\u5e8f\u975e\u5e38\u591a\u7684\u8fc7\u7a0b\uff0c\u9010\u9879\u79ef\u6512\u4e0b\u6765\uff0c\u4f1a\u6d6a\u8d39\u5f88\u591a\u8f85\u6599\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_123869211406","page_form":"","compId":"text13","markColor":"","mode":0},"text14":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u591a\u6570\u5c40\u90e8\u88c5\u4fee\u4e1a\u4e3b\u66f4\u504f\u597d\u201c\u534a\u5305\u201d\u5f62\u5f0f\u3002\u8fd9\u90e8\u5206\u6d88\u8d39\u8005\u4e2d\uff0c\u6709\u4e0d\u5c11\u4eba\u8ba4\u4e3a\u5c40\u90e8\u88c5\u4fee\u6ca1\u5fc5\u8981\u627e\u4e13\u4e1a\u5bb6\u88c5\u516c\u53f8\u5168\u6574\u5305\u51fa\u53bb\uff0c\u800c\u662f\u81ea\u5df1\u8d2d\u4e70\u5730\u677f\u548c\u5899\u6f06\u540e\u627e\u5de5\u957f\u65bd\u5de5\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_603073120633","page_form":"","compId":"text14","markColor":"","mode":0},"text15":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u8d8a\u662f\u5c40\u90e8\u88c5\u4fee\u8d8a\u662f\u5e94\u8be5\u627e\u54c1\u724c\u5bb6\u88c5\u516c\u53f8\uff0c\u800c\u975e\u6e38\u51fb\u961f\u3001\u8def\u8fb9\u644a\uff0c\u56e0\u4e3a\u5c40\u90e8\u88c5\u4fee\u65f6\u5bb6\u91cc\u5f80\u5f80\u8fd8\u6709\u4eba\u5458\u5c45\u4f4f\uff0c\u6750\u6599\u7684\u8d28\u91cf\u3001\u65bd\u5de5\u7684\u5b89\u5168\u3001\u5bb6\u4eba\u7684\u4eba\u8eab\u5b89\u5168\u90fd\u8981\u6709\u4fdd\u969c\uff0c\u800c\u6e38\u51fb\u961f\u7f3a\u5c11\u5e73\u53f0\u4fdd\u969c\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_686553497841","page_form":"","compId":"text15","markColor":"","mode":0},"picture16":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:58.59375rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5cab148f817e3.png","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"12.53","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_708985054806","page_form":"","compId":"picture16"},"text17":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u4e0e\u201c\u534a\u5305\u201d\u4e0d\u540c\uff0c\u201c\u5168\u5305\u201d\u65b9\u5f0f\u4e2d\u7684\u6240\u6709\u6750\u6599\u90fd\u662f\u7531\u5bb6\u88c5\u516c\u53f8\u63d0\u4f9b\u3002\u968f\u7740\u65bd\u5de5\u91cf\u9010\u5e74\u589e\u591a\uff0c\u73b0\u5728\u5f88\u591a\u5177\u6709\u4e00\u5b9a\u89c4\u6a21\u7684\u54c1\u724c\u5bb6\u88c5\u516c\u53f8\uff0c\u90fd\u662f\u76f4\u63a5\u4ece\u5de5\u5382\u8fdb\u884c\u6279\u91cf\u5f0f\u5927\u89c4\u6a21\u6750\u6599\u91c7\u8d2d\uff0c\u53bb\u4e2d\u95f4\u73af\u8282\u3001\u91c7\u8d2d\u91cf\u5927\u8ba9\u5bb6\u88c5\u516c\u53f8\u53ef\u4ee5\u62ff\u5230\u76f8\u5bf9\u8f83\u4f4e\u7684\u4ef7\u683c\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_996261854822","page_form":"","compId":"text17","markColor":"","mode":0},"text18":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u4e8b\u5b9e\u4e0a\uff0c\u5373\u4fbf\u81ea\u884c\u8d2d\u4e70\u8f85\u6750\u3001\u4e3b\u6750\uff0c\u6240\u8d2d\u4ea7\u54c1\u7684\u54c1\u8d28\u4e5f\u672a\u5fc5\u5b8c\u5168\u6709\u4fdd\u969c\u3002\u636e\u4e1a\u5185\u4eba\u58eb\u900f\u9732\uff0c\u4e00\u4e9b\u89c4\u6a21\u8f83\u5c0f\u7684\u5efa\u6750\u7ecf\u9500\u5546\u5f80\u5f80\u771f\u5047\u6400\u7740\u5356\uff0c\u4e0d\u6392\u9664\u6d88\u8d39\u8005\u4e70\u5230\u5047\u5192\u4f2a\u52a3\u4ea7\u54c1\u7684\u53ef\u80fd\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_41106548301","page_form":"","compId":"text18","markColor":"","mode":0},"text19":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u7701\u65f6\u3001\u7701\u5fc3\u662f\u201c\u5168\u5305\u201d\u65b9\u5f0f\u7684\u7279\u5f81\u4e4b\u4e00\u3002\u5728\u201c\u5168\u5305\u201d\u65b9\u5f0f\u4e2d\uff0c\u6d88\u8d39\u8005\u4e0d\u7528\u64cd\u5fc3\u6750\u6599\u4e0e\u65bd\u5de5\u7684\u8854\u63a5\u95ee\u9898\uff0c\u5230\u54ea\u4e00\u5de5\u5e8f\u9700\u8981\u54ea\u4e9b\u6750\u6599\u8fdb\u573a\uff0c\u5168\u7531\u5bb6\u88c5\u516c\u53f8\u7684\u5de5\u7a0b\u8d1f\u8d23\u4eba\u5bf9\u63a5\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_860703964648","page_form":"","compId":"text19","markColor":"","mode":0},"text20":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u201c\u5168\u5305\u201d\u4e0d\u9002\u5408\u4e2a\u6027\u5316\u9700\u6c42\u9ad8\u7684\u5ba2\u6237\u7fa4\u4f53\uff0c\u56e0\u4e3a\u6750\u6599\u5957\u9910\u6574\u4f53\u6253\u5305\u5728\u4e00\u8d77\uff0c\u6bcf\u4e2a\u54c1\u7c7b\u80fd\u9009\u62e9\u7684\u4f59\u5730\u4e0d\u5927\uff0c\u4e00\u822c\u53ea\u6709\u4e00\u4e24\u4e2a\u54c1\u724c\u4f9b\u5ba2\u6237\u6311\u9009\uff0c\u6b3e\u5f0f\u53d7\u9650\u5236\uff0c\u4f46\u8fd9\u4e00\u4e24\u4e2a\u54c1\u724c\u662f\u7ecf\u88c5\u4fee\u516c\u53f8\u6311\u9009\u51fa\u6765\u7684\u6027\u4ef7\u6bd4\u5f88\u9ad8\u7684\u4ea7\u54c1\uff0c\u987e\u5ba2\u81ea\u5df1\u53bb\u5efa\u6750\u5e02\u573a\u8d2d\u4e70\u53ef\u80fd\u62ff\u4e0d\u5230\u8fd9\u4e48\u4f4e\u7684\u6298\u6263\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_190749990766","page_form":"","compId":"text20","markColor":"","mode":0},"text21":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u88c5\u4fee\u516c\u53f8\u6bd5\u7adf\u662f\u884c\u5185\u4eba\uff0c\u5bf9\u6750\u6599\u7684\u6311\u9009\u548c\u91c7\u8d2d\u9a7e\u8f7b\u5c31\u719f\uff0c\u800c\u666e\u901a\u6d88\u8d39\u8005\u5bf9\u5bb6\u5c45\u5efa\u6750\u4ea7\u54c1\u77e5\u4e4b\u751a\u5c11\uff0c\u800c\u4e14\u82b1\u65f6\u95f4\u4e70\u5efa\u6750\u76ef\u88c5\u4fee\u662f\u5f88\u8d39\u4f53\u529b\u548c\u7cbe\u529b\u7684\u3002\u9009\u62e9\u201c\u5168\u5305\u201d\u7684\u6d88\u8d39\u8005\u5f80\u5f80\u6ca1\u6709\u65f6\u95f4\uff0c\u4e0d\u613f\u4ed8\u51fa\u76f8\u5bf9\u8f83\u9ad8\u7684\u65f6\u95f4\u6210\u672c\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_564557133252","page_form":"","compId":"text21","markColor":"","mode":0},"text22":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u201c\u5168\u5305\u201d\u6700\u5927\u7684\u5f0a\u7aef\u5728\u4e8e\u4e00\u4e9b\u88c5\u4fee\u516c\u53f8\u4ee5\u6b21\u5145\u597d\uff0c\u4ee5\u52a3\u5145\u4f18\u3002\u7531\u4e8e\u88c5\u4fee\u6750\u6599\u79cd\u7c7b\u591a\uff0c\u4ef7\u683c\u4e0d\u900f\u660e\uff0c\u4e1a\u4e3b\u4e86\u89e3\u5f88\u5c11\uff0c\u5982\u679c\u88c5\u9970\u516c\u53f8\u865a\u62a5\u4ef7\u683c\uff0c\u4e1a\u4e3b\u5f88\u96be\u8bc6\u522b\uff0c\u800c\u4e14\u88c5\u4fee\u4e2d\u5bb9\u6613\u51fa\u73b0\u589e\u9879\uff0c\u6700\u540e\u7684\u8d39\u7528\u5f80\u5f80\u6bd4\u9884\u7b97\u9ad8\u51fa\u8bb8\u591a\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_366829990284","page_form":"","compId":"text22","markColor":"","mode":0},"text23":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u9009\u7528\u201c\u5168\u5305\u201d\u65b9\u5f0f\uff0c\u5728\u7b7e\u8ba2\u5408\u540c\u65f6\u4e00\u5b9a\u8981\u8003\u8651\u5468\u5168\u3002\u9996\u5148\u662f\u8981\u786e\u5b9a\u597d\u88c5\u4fee\u8bbe\u8ba1\u65b9\u6848\uff0c\u5c3d\u91cf\u4e0d\u8981\u5728\u88c5\u4fee\u8fc7\u7a0b\u4e2d\u4fee\u6539\uff0c\u4ee5\u514d\u803d\u8bef\u5de5\u671f\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_6151054012","page_form":"","compId":"text23","markColor":"","mode":0},"text24":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:7.03125rpx;opacity:1;text-align:left;","content":"      \u4e0d\u7ba1\u662f\u201c\u534a\u5305\u201d\u8fd8\u662f\u201c\u5168\u5305\u201d\uff0c\u6c34\u7535\u6539\u9020\u90fd\u662f\u5355\u72ec\u8ba1\u7b97\u9020\u4ef7\u7684\u90e8\u5206\u3002\u6c34\u7535\u6539\u9020\u662f\u5bb6\u5ead\u88c5\u4fee\u4e2d\u6700\u590d\u6742\u7684\u73af\u8282\u3002\u6c34\u7535\u6539\u9020\u5c5e\u4e8e\u9690\u853d\u5de5\u7a0b\uff0c\u88c5\u4fee\u5b8c\u6210\u540e\uff0c\u5355\u51ed\u8089\u773c\u65e0\u6cd5\u8fa8\u522b\u8d28\u91cf\u7684\u597d\u574f\uff0c\u7f3a\u5c11\u76f8\u5173\u7ecf\u9a8c\u548c\u77e5\u8bc6\u7684\u6d88\u8d39\u8005\u4e5f\u5f88\u96be\u5f04\u6e05\u81ea\u5df1\u6709\u6ca1\u6709\u514d\u88ab\u201c\u589e\u9879\u201d\uff0c\u56e0\u6b64\uff0c\u5bf9\u4e8e\u6c34\u7535\u6539\u9020\u73af\u8282\u7684\u9a8c\u6536\uff0c\u9700\u8981\u614e\u4e4b\u53c8\u614e\uff0c\u5728\u6c34\u7535\u7ebf\u8def\u5c01\u69fd\u4e4b\u524d\u4ed4\u7ec6\u68c0\u67e5\uff0c\u6216\u8005\u627e\u4e13\u95e8\u7684\u76d1\u7406\u516c\u53f8\u8fdb\u884c\u6c34\u7535\u9a8c\u6536\u3002\n","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_825895259323","page_form":"","compId":"text24","markColor":"","mode":0},"breakline25":{"type":"breakline","style":"border-width:117.1875rpx;border-bottom-style:solid;margin-top:23.4375rpx;margin-left:0rpx;margin-right:auto;width:750rpx;border-bottom-color:rgba(0, 0, 0, 0);","content":"<div><\/div>","customFeature":{"name":"\u5206\u5272\u7ebf","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_682981906534","page_form":"","compId":"breakline25"},"has_tabbar":0,"page_hidden":true,"page_form":"store_list","top_nav":{"navigationBarBackgroundColor":"#fff","navigationBarTextStyle":"black","navigationBarTitleText":"\u534a\u5305\/\u5168\u5305\u7684\u9009\u62e9"},"dataId":""},
    need_login: false,
      bind_phone: false,
    page_router: 'page10031',
    page_form: 'none',
      dataId: '',
      list_compids_params: [],
      user_center_compids_params: [],
      goods_compids_params: [],
  prevPage:0,
      tostoreComps: [],
      carouselGroupidsParams: [],
      relobj_auto: [],
      bbsCompIds: [],
      dynamicVesselComps: [],
      communityComps: [],
      franchiseeComps: [],
      cityLocationComps: [],
      seckillOnLoadCompidParam: [],
      dynamicClassifyGroupidsParams: [],
      newClassifyGroupidsParams: [],
      videoListComps: [],
      videoProjectComps: [],
      newsComps: [],
      popupWindowComps: [],
        formVesselComps: [],
      searchComponentParam: [],
      topicComps: [],
      topicClassifyComps: [],
      topicSortComps: [],
      rowNumComps: [],
      sidebarComps: [],
      slidePanelComps: [],
      newCountComps: [],
      exchangeCouponComps: [],
      communityGroupComps: [],
      groupBuyStatusComps: [],
      groupBuyListComps: [],
      timelineComps: [],
      signInComps: [],
    returnToVersionFlag: true,
  requesting: false,
  requestNum: 1,
  modelChoose: [],
  modelChooseId: '',
  modelChooseName: [],
  onLoad: function (e) {
    if (e.statisticsType == 11) {
      delete e.statisticsType
      delete e.needStatistics
    }
    if (e.franchisee) {
      this.franchiseeId = e.franchisee;
      this.setData({
        franchiseeInfo: {
          id: e.franchisee,
          mode: e.fmode || ''
        }
      });
    }
    app.onPageLoad(e);
    app.isNeedRewardModal();
  },
  dataInitial: function () {
    app.pageDataInitial();
    if (this.page_router === 'userCenterComponentPage'){
      this.getAppECStoreConfig();
    }
  },
  onPageScroll: function(e) {
    app.onPageScroll(e);
  },
  onShareAppMessage: function (e) {
    if (e.from == 'button') {
      if (e.target.dataset && e.target.dataset.from == 'topicButton') {
        let franchiseeId = app.getPageFranchiseeId();
        let chainParam = franchiseeId ? '&franchisee=' + franchiseeId : '';
        return app.shareAppMessage({
          path: '/informationManagement/pages/communityDetail/communityDetail?detail=' + e.target.dataset.id + chainParam,
          desc: e.target.dataset.desc,
          success: function(addTime) {
            app.getIntegralLog(addTime);
            app.CountSpreadCount(e.target.dataset.id);
          }
        });
      }
    };
    return app.onPageShareAppMessage(e, app.getIntegralLog);
  },
  onShow: function () {
    app.onPageShow();
  },
  onHide: function () {
    app.onPageHide();
  },
  reachBottomFuc: [],
  onReachBottom: function () {
    app.onPageReachBottom( this.reachBottomFuc );
  },
  onUnload: function () {
    app.onPageUnload(this);
  },
  slidePanelStart: function (e) {
    app.slidePanelStart(e);
  },
  slidePanelEnd: function (e) {
    app.slidePanelEnd(e);
  },
  onPullDownRefresh : function(){
    app.onPagePullDownRefresh();
  },
  tapPrevewPictureHandler: function (e) {
    app.tapPrevewPictureHandler(e);
  },
  pageScrollFunc: function (e) {
    app.pageScrollFunc(e);
  },
  dynamicVesselScrollFunc: function (e) {
    app.dynamicVesselScrollFunc(e);
  },
  goodsScrollFunc: function (e) {
    app.goodsScrollFunc(e);
  },
  changeCount: function (e) {
    app.changeCount(e);
  },
  tapMapDetail: function (e) {
    app.tapMapDetail(e);
  },
  listVesselTurnToPage: function (e) {
    app.listVesselTurnToPage(e);
  },
  dynamicVesselTurnToPage: function (e) {
    app.dynamicVesselTurnToPage(e);
  },
  userCenterTurnToPage: function (e) {
    app.userCenterTurnToPage(e);
  },
  turnToGoodsDetail: function (e) {
    app.turnToGoodsDetail(e);
  },
  turnToSeckillDetail: function (e) {
    app.turnToSeckillDetail(e);
  },
  sortListFunc: function (e) {
    app.sortListFunc(e);
  },
  selectLocal: function (e) {
    app.selectLocal(e);
  },
  cancelCity: function (e) {
    app.cancelCity(e);
  },
  bindCityChange: function (e) {
    app.bindCityChange(e);
  },
  submitCity: function (e) {
    app.submitCity(e);
  },
  callPhone: function (e) {
    app.callPhone(e);
  },
  tapVideoPlayHandler: function(e){
    app.tapVideoPlayHandler(e);
  },
  tapToPluginHandler: function (e) {
    app.tapToPluginHandler(e);
  },
  tapRefreshListHandler: function (e) {
    app.tapRefreshListHandler(e);
  },
  turnToCommunityPage: function (e) {
    app.turnToCommunityPage(e);
  },
  tapToTransferPageHandler: function () {
    app.tapToTransferPageHandler();
  },
  showGoodsShoppingcart: function(e){
    app.showGoodsShoppingcart(e);
  },
  showAddShoppingcart: function (e) {
    app.showAddShoppingcart(e);
  },
  hideAddShoppingcart: function () {
    app.hideAddShoppingcart();
  },
  selectGoodsSubModel: function (e) {
    app.selectGoodsSubModel(e);
  },
  resetSelectCountPrice: function () {
    app.resetSelectCountPrice();
  },
  clickTostoreMinusButton: function (e) {
    app.clickTostoreMinusButton(e);
  },
  clickTostorePlusButton: function (e) {
    app.clickTostorePlusButton(e);
  },
  readyToPay: function () {
    app.readyToTostorePay();
  },
  getValidateTostore: function () {
    app.getValidateTostore();
  },
  goToShoppingCart: function () {
    app.goToShoppingCart();
  },
  stopPropagation: function () {
  },
  turnToSearchPage:function (e) {
    app.turnToSearchPage(e);
  },
  previewImage: function (e) {
    var dataset = e.currentTarget.dataset;
    app.previewImage({
      current : dataset.src,
      urls: dataset.imgarr || [dataset.src],
    });
  },
  suspensionTurnToPage: function (e) {
    app.suspensionTurnToPage(e);
  },
  keywordList:{},
  bindSearchTextChange: function (e) {
    this.keywordList[e.currentTarget.dataset.compid] = e.detail.value;
  },
  // 文字组件跳到地图
  textToMap: function(e) {
    app.textToMap(e);
  },
  tapDynamicClassifyFunc: function(e){
    app.tapDynamicClassifyFunc(e);
  },
  // 跳转到资讯详情
  turnToNewsDetail: function (e) {
    app.turnToNewsDetail(e)
  },
  //切换资讯分类
  getNewsCateList: function (e) {
    app.getNewsCateList(e);
  },
  //话题组件
  topicEleScrollFunc: function (e) {
    app.topicEleScrollFunc(e);
  },
  switchTopiclistOrderBy: function (e) {
    app.switchTopiclistOrderBy(e);
  },
  switchTopicCategory: function (e) {
    app.switchTopicCategory(e);
  },
  turnToTopicDetail: function (e) {
    app.turnToTopicDetail(e);
  },
  pageBackTopAct: function (e) {
    app.pageBackTopAct(e);
  },
  turnToTopicPublish: function (e) {
    app.turnToTopicPublish(e);
  },
  showTopicCommentBox: function (e) {
    app.showTopicCommentBox(e);
  },
  showTopicPhoneModal: function (e) {
    app.showTopicPhoneModal(e);
  },
  topicMakePhoneCall: function (e) {
    app.topicMakePhoneCall(e);
  },
  showTopicReplyComment: function (e) {
    app.showTopicReplyComment(e);
  },
  topicCommentReplyInput: function (e) {
    app.topicCommentReplyInput(e);
  },
  topicReplycommentSubmit: function (e) {
    app.topicReplycommentSubmit(e);
  },
  topicPerformLikeAct: function (e) {
    app.topicPerformLikeAct(e);
  },
  topicImgLoad: function (e) {
    app.topicImgLoad(e);
  },
  topicCommentReplyfocus:function (e) {
    app.topicCommentReplyfocus(e);
  },
  topicCommentReplyblur:function (e) {
    app.topicCommentReplyblur(e);
  },

  // 筛选组件 综合排序tab = 0
  sortByDefault: function (e) {
    app.sortByDefault(e);
  },
  // 筛选组件 按销量排序 tab = 1
  sortBySales: function (e) {
    app.sortBySales(e);
  },
  // 筛选组件 按价格排序 tab = 2
  sortByPrice: function (e) {
    app.sortByPrice(e);
  },
  // 筛选组件 按取货排序 tab = 3
  pickUpStyle: function (e) {
    app.pickUpStyle(e);
  },
  hideFilterPickUpBox: function (e){
    app.hideFilterPickUpBox(e);
  },
  selectPickUp: function(e){
    app.selectPickUp(e);
  },
  surePickBtn: function(e){
    app.surePickBtn(e);
  },
  resetPickBtn: function(e){
    app.resetPickBtn(e);
  },
  // 筛选组件 展示侧边筛选
  filterList: function(e){
    app.filterList(e);
  },
  // 筛选侧栏确定
  filterConfirm: function(e){
    app.filterConfirm(e);
  },
  // 动画结束回调函数
  animationEnd: function(e){
    app.animationEnd(e);
  },
  //排号
  showTakeNumberWindow: function(e){
    app.showTakeNumberWindow(e);
  },
  hideTakeNumberWindow: function(e){
    app.hideTakeNumberWindow(e);
  },
  goToPreviewRowNumberOrder: function(e){
    app.goToPreviewRowNumberOrder(e);
  },
  selectRowNumberType: function(e){
    app.selectRowNumberType(e);
  },
  sureTakeNumber: function(e){
    app.sureTakeNumber(e);
  },
  goToCheckRowNunberDetail: function(e){
    app.goToCheckRowNunberDetail(e);
  },
  cancelCheckRowNunber: function(e){
    app.cancelCheckRowNunber(e);
  },
  rowNumberRefresh: function(e){
    app.rowNumberRefresh(e);
  },
  showCancelWindow: function (e) {
    app.showCancelWindow(e)
  },
  hideCancelWindow: function (e) {
    app.hideCancelWindow(e)
  },
  tapEventCommonHandler: function(e){
    app.tapEventCommonHandler(e);
  },
  getCarouselData: function(e) {
    let compid = e.currentTarget.dataset.compid;
    app._initialCarouselData(this, compid );
  },
  getNewsList: function(e) {
    let compid = e.currentTarget.dataset.compid;
    app.getNewsList({ compid: compid });
  },
  getCommunityList: function (e) {
    let compid = e.currentTarget.dataset.compid;
    app.initialCommunityList(compid);
  },
  getexchangeCoupon: function(e) {
    app.getexchangeCoupon(e);
  },
  turnToexchangeCouponDetail: function (e) {
    app.turnToexchangeCouponDetail(e);
  },
  exchangeCouponScrollFunc: function (e) {
    app.exchangeCouponScrollFunc(e);
  },
  vipCardTurnToPage: function (e) {
    app.vipCardTurnToPage(e);
  },
  showQRRemark: function (e) {
    app.showQRRemark(e);
  },
  tapDynamicShowAllClassify: function (e) {
    app.tapDynamicShowAllClassify(e);
  },
  dynamicSubClassifyAreaScrollEvent: function (e) {
    app.dynamicSubClassifyAreaScrollEvent(e);
  },
  slidePanelScrollEvent: function (e) {
    app.slidePanelScrollEvent(e);
  },
  unfoldSus: function(e) {
    let compId = e.currentTarget.dataset.compid;
    let tapType = e.currentTarget.dataset.taptype;
    app.newSuspension_unfoldSus(compId,tapType);
  },
  newCountTapEvent: function (e) {
    app.newCountTapEvent(e);
  },
  chengeCommunityGroup(e) {
    app.chengeCommunityGroup(e);
  },
  toCommunityGroup(e) {
    app.toCommunityGroup(e);
  },
  communityGroupScrollFunc(e) {
    app.communityGroupScrollFunc(e);
  },
  getAppECStoreConfig: function () {
    app.getAppECStoreConfig((res) => {
      this.setData({
        storeStyle: res.color_config
      })
    });
  },

  };
Page(pageData);
