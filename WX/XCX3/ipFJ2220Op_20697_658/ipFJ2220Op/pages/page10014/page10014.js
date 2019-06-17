var app      = getApp();

var pageData = {
  data: {"picture1":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:105.46875rpx;margin-left:auto;margin-right:auto;margin-top:0rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8daf7ebf7c.png","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"6.20","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_704653641598","page_form":"","compId":"picture1"},"text2":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u8bbe\u8ba1\u7406\u5ff5\uff1a\u623f\u5b50\u7684\u5c42\u9ad8\u6709\u4e24\u7c73\u591a\uff0c\u5229\u7528\u5c42\u9ad8\u7684\u4f18\u52bf\u6253\u9020\u4e86\u5145\u6ee1\u5f00\u653e\u5f0f\u5317\u6b27loft\u516c\u5bd3\u3002\u7ecf\u8fc7\u7b80\u5355\u7684\u6539\u9020\u540e\u9694\u6210\u4e86\u4e0a\u4e0b\u4e24\u5c42\u4e4b\u540e\uff0c\u4f1a\u8ba9\u4eba\u89c9\u5f97\u77ac\u95f4\u589e\u52a0\u4e8610\u33a1\u7684\u4f7f\u7528\u7a7a\u95f4\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_468140704236","page_form":"","compId":"text2","markColor":"","mode":0},"picture3":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:58.59375rpx;width:187.5rpx;margin-left:0;margin-right:auto;margin-top:46.875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8b2a6662fd.png","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"2.82","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_190640904441","page_form":"","compId":"picture3"},"picture4":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:398.4375rpx;margin-left:auto;margin-right:auto;margin-top:11.71875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8bc128ef2c.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.83","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_52332355304","page_form":"","compId":"picture4"},"picture5":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:421.875rpx;margin-left:auto;margin-right:auto;margin-top:11.71875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8bc091a753.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.50","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_330578986293","page_form":"","compId":"picture5"},"text6":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u5f00\u653e\u5f0f\u7684\u8bbe\u8ba1\uff0c\u4fdd\u6301\u5ba4\u5185\u5149\u7ebf\u7684\u540c\u65f6\uff0c\u8fd8\u589e\u52a0\u4e86\u7a7a\u95f4\u7684\u7075\u6d3b\u6027\u3002\u9664\u4e86\u6ee1\u8db3\u65e5\u5e38\u7684\u751f\u6d3b\u548c\u6536\u7eb3\u9700\u6c42\u4e4b\u5916\uff0c\u5c0f\u7a7a\u95f4\u8fd8\u585e\u4e0b\u4e86\u5de5\u4f5c\u533a\u548c\u5927\u578b\u8863\u5e3d\u533a\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_869789863101","page_form":"","compId":"text6","markColor":"","mode":0},"text7":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u4e00\u8fdb\u95e8\u5c31\u53ef\u4ee5\u611f\u53d7\u5230\u660e\u4eae\u548c\u6e05\u65b0\uff0c\u7a81\u7834\u7a7a\u95f4\u754c\u9650\u5411\u9ad8\u7a7a\u53d1\u5c55\uff0c\u7cbe\u5fc3\u8bbe\u8ba1\u7684\u5e8a\u3001\u53f0\u3001\u67dc\u4e09\u5408\u4e00\u7684\u591a\u529f\u80fd\u5bb6\u5177\uff0c\u8ba9\u5367\u5ba4\u3001\u4e66\u623f\u3001\u8863\u5e3d\u95f4\u529f\u80fd\u533a\u7684\u5212\u5206\u660e\u663e\u65e0\u91cd\u53e0\u3002\u914d\u8272\u7b80\u5355\u5e72\u51c0\u53c8\u4e0d\u5931\u6e29\u99a8\uff0c\u98ce\u683c\u4e0a\u5c5e\u4e8e\u7a33\u91cd\u5927\u6c14\u7684\u4e00\u7c7b\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_504015689274","page_form":"","compId":"text7","markColor":"","mode":0},"picture8":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:58.59375rpx;width:187.5rpx;margin-left:0;margin-right:auto;margin-top:46.875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8b2a32bbb4.png","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"2.82","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_495905717522","page_form":"","compId":"picture8"},"picture9":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:398.4375rpx;margin-left:auto;margin-right:auto;margin-top:11.71875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8bc08533c1.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.71","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_721274170707","page_form":"","compId":"picture9"},"picture10":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:398.4375rpx;margin-left:auto;margin-right:auto;margin-top:11.71875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8bc128ef2c.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.83","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_521290929591","page_form":"","compId":"picture10"},"text11":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u5ba2\u5385\u9910\u5385\u4e3a\u4e00\u4f53\u5316\uff0c\u9910\u5385\u4e0e\u5ba2\u5385\u7684\u98ce\u683c\u662f\u4e00\u6837\u7684\uff1b\u7531\u4e8e\u7a7a\u95f4\u7684\u9650\u5236\uff0c\u9910\u684c\u6ca1\u6709\u7528\u592a\u8fc7\u534e\u4e3d\u7684\u6b3e\u5f0f\uff0c\u9009\u62e9\u7b80\u5355\u5927\u65b9\u7684\u5373\u53ef\uff0c\u9020\u578b\u522b\u81f4\u7684\u51f3\u5b50\u53ef\u4ee5\u589e\u6dfb\u4e00\u4e1d\u65f6\u5c1a\u611f\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_94171064814","page_form":"","compId":"text11","markColor":"","mode":0},"picture12":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:398.4375rpx;margin-left:auto;margin-right:auto;margin-top:11.71875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8bc0a9c2cc.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.78","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_740507141209","page_form":"","compId":"picture12"},"text13":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u6c99\u53d1\u9876\u90e8\u63d2\u4e86\u4e00\u6839\u6881\uff0c\u201c\u6881\u201d\u5185\u88c5\u7f6e\u7684LED\u706f\u4ee3\u66ff\u4e86\u4f20\u7edf\u7684\u540a\u706f\u6216\u5c04\u706f\uff1b\u4e0d\u4f46\u7ed9\u7a7a\u95f4\u6ce8\u5165\u4e86\u72ec\u7279\u7684\u5efa\u7b51\u5143\u7d20\u8fd8\u5927\u5927\u51cf\u8f7b\u706f\u5177\u53ef\u80fd\u5bf9\u7a7a\u95f4\u9020\u6210\u7684\u91cd\u91cf\u611f\uff0c\u975e\u5e38\u5b9e\u7528\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_535700938042","page_form":"","compId":"text13","markColor":"","mode":0},"picture14":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:58.59375rpx;width:187.5rpx;margin-left:0;margin-right:auto;margin-top:46.875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8b2a73a45c.png","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"2.82","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_934176145569","page_form":"","compId":"picture14"},"picture15":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:398.4375rpx;margin-left:auto;margin-right:auto;margin-top:11.71875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8bc075fe32.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.60","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_480068869511","page_form":"","compId":"picture15"},"text16":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u53a8\u623f\u4e5f\u662f\u8bbe\u7f6e\u5728\u4e00\u8fdb\u95e8\u7684\u5730\u65b9\uff0c\u5730\u9762\u94fa\u8d34\u4e86\u6d45\u8272\u6728\u5730\u677f\u3002\u539f\u6728\u7eb9\u7406\u7684\u6a71\u67dc\u642d\u914d\u957f\u6761\u7684\u767d\u8272\u62c9\u624b\uff0c\u4e0d\u593a\u76ee\u4e0d\u4eae\u773c\uff0c\u5374\u6784\u6210\u4e86\u8fd9\u4e2a\u8212\u9002\u81ea\u5728\u7684\u70f9\u996a\u7a7a\u95f4\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_531515016139","page_form":"","compId":"text16","markColor":"","mode":0},"picture17":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:421.875rpx;margin-left:auto;margin-right:auto;margin-top:11.71875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8bc091a753.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.50","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_741553105011","page_form":"","compId":"picture17"},"text18":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u8fdb\u95e8\u7684\u5de6\u4fa7\u662f\u7384\u5173\u7684\u50a8\u7269\u67dc\uff0c\u548c\u53a8\u623f\u7acb\u67dc\u9020\u578b\u6709\u4e9b\u76f8\u4f3c\u3002\u67dc\u4e2d\u592e\u7684\u58c1\u9f9b\u653e\u7f6e\u5496\u5561\u673a\uff0c\u65b9\u4fbf\u5e73\u65f6\u51b2\u6ce1\u5496\u5561\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_34432082014","page_form":"","compId":"text18","markColor":"","mode":0},"picture19":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:58.59375rpx;width:187.5rpx;margin-left:0;margin-right:auto;margin-top:46.875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8b2ab2aacf.png","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"2.82","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_969739353878","page_form":"","compId":"picture19"},"picture20":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:398.4375rpx;margin-left:auto;margin-right:auto;margin-top:11.71875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8bc0b5b729.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.60","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_437569797310","page_form":"","compId":"picture20"},"text21":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u4e3a\u4e86\u5c3d\u7528\u6bcf\u4e00\u5bf8\u7a7a\u95f4\uff0c\u5229\u7528\u9ad8\u697c\u7684\u4f18\u52bf\u7279\u610f\u9020\u4e86\u4e00\u4ef6\u96c6\u5408\u4e66\u53f0\uff0c\u50a8\u7269\u67dc\u4e0e\u7761\u5e8a\u4e8e\u4e00\u8eab\u7684\u591a\u529f\u80fd\u5bb6\u5177\uff0c\u7279\u522b\u7684\u8010\u7528\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_414293752189","page_form":"","compId":"text21","markColor":"","mode":0},"picture22":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:398.4375rpx;margin-left:auto;margin-right:auto;margin-top:11.71875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8bc066b067.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.59","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_173576022682","page_form":"","compId":"picture22"},"text23":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u5168\u5c4b\u4ee5\u6c34\u767d\u6a61\u6728\u4e3a\u57fa\u8c03\uff0c\u518d\u642d\u914d\u4e00\u7cfb\u5217\u5145\u6ee1\u5317\u6b27\u98ce\u683c\u7684\u5c0f\u5de7\u517c\u5b9e\u7528\u7684\u5bb6\u5177\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_179551174674","page_form":"","compId":"text23","markColor":"","mode":0},"picture24":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:398.4375rpx;margin-left:auto;margin-right:auto;margin-top:11.71875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8bc158b1f4.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.59","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_869486129258","page_form":"","compId":"picture24"},"text25":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u5e8a\u7528\u73bb\u7483\u680f\u56f4\u4f4f\uff0c\u589e\u5f3a\u4e86\u7a7a\u95f4\u7684\u900f\u89c6\u611f\uff0c\u8ba9\u89c6\u91ce\u5f97\u4ee5\u4e92\u901a\uff0c\u540c\u65f6\u8fd8\u51cf\u8f7b\u4e86\u6728\u56f4\u680f\u5bf9\u697c\u5e95\u9020\u6210\u7684\u538b\u8feb\u611f\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_728491291652","page_form":"","compId":"text25","markColor":"","mode":0},"picture26":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:398.4375rpx;margin-left:auto;margin-right:auto;margin-top:11.71875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8bc09d831a.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.60","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_369010612338","page_form":"","compId":"picture26"},"text27":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u662f\u4e0d\u662f\u4ee5\u4e3a\u8fd9\u53ea\u662f\u4e00\u4e2a\u7b80\u5355\u7684\u50a8\u7269\u67dc\u5462\uff1f\u5176\u5b9e\u8fd9\u662f\u4e00\u4e2a\u62bd\u62c9\u5f0f\u7684\u5de5\u4f5c\u53f0\u6216\u5316\u5986\u53f0\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_419007492196","page_form":"","compId":"text27","markColor":"","mode":0},"picture28":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:58.59375rpx;width:187.5rpx;margin-left:0;margin-right:auto;margin-top:46.875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8b2a8e9890.png","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"2.82","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_409161291625","page_form":"","compId":"picture28"},"picture29":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:398.4375rpx;margin-left:auto;margin-right:auto;margin-top:11.71875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8bc0ccb5a3.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.68","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_645162893831","page_form":"","compId":"picture29"},"text30":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u536b\u751f\u95f4\u88c5\u4fee\u98ce\u683c\u8ddf\u968f\u6574\u4f53\u98ce\u683c\uff0c\u4ee5\u539f\u6728\u7eb9\u7406\u7684\u50a8\u7269\u67dc\u4e3a\u4e3b\uff0c\u8d2f\u5f7b\u5168\u5c4b\u7684\u6696\u8272\u4e3b\u9898\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_875777856752","page_form":"","compId":"text30","markColor":"","mode":0},"picture31":{"type":"picture","style":"opacity:1;background-color:transparent;border-color:rgb(34, 34, 34);border-radius:0rpx;border-style:none;border-width:0rpx;height:398.4375rpx;margin-left:auto;margin-right:auto;margin-top:11.71875rpx;","content":"https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5ca8bc0c19026.jpg","customFeature":{"boxShadow":"('#000','0','0','5')","boxColor":"#000","boxX":"0","boxY":"0","boxR":"5","dataObject":false,"phoneNumberSource":"static","phoneDisplayContent":"static","isAuto":false,"photoRatio":"1.58","name":"\u56fe\u7247","backgroundType":false,"isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_614896040618","page_form":"","compId":"picture31"},"text32":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:28.125rpx;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u6697\u536b\u6ca1\u6709\u7a97\u6237\uff0c\u91c7\u5149\u4e5f\u5c31\u4e0d\u592a\u597d\u3002\u6240\u4ee5\u5728\u5e72\u533a\u548c\u6e7f\u533a\u7279\u5730\u8bbe\u7f6e\u4e86\u5149\u6e90\uff0c\u66f4\u597d\u7684\u5f25\u8865\u5149\u7ebf\u7684\u4e0d\u8db3\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_882641507633","page_form":"","compId":"text32","markColor":"","mode":0},"breakline33":{"type":"breakline","style":"border-width:23.4375rpx;border-bottom-style:solid;margin-top:11.71875rpx;margin-left:0;margin-right:auto;width:750rpx;border-bottom-color:rgba(0, 0, 0, 0);","content":"<div><\/div>","customFeature":{"name":"\u5206\u5272\u7ebf","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_273039963782","page_form":"","compId":"breakline33"},"text34":{"type":"text","style":"background-color:rgba(0, 0, 0, 0);border-color:rgb(34, 34, 34);border-style:none;border-width:4.6875rpx;color:rgb(0, 0, 0);font-size:32.8125rpx;font-weight:bold;height:58.59375rpx;line-height:58.59375rpx;margin-left:auto;margin-right:auto;margin-top:0;opacity:1;text-align:left;","content":"      \u73b0\u5728\u7684\u623f\u5b50\u4e0d\u9700\u8981\u8fc7\u591a\u7684\u590d\u6742\u88c5\u9970\uff0c\u53ea\u8981\u60a8\u80af\u82b1\u5fc3\u601d\u3002\u5bb6\u4e5f\u53ef\u4ee5\u6070\u5f53\u5730\u6210\u4e3a\u6e29\u6696\u7684\u6e2f\u6e7e\u3002","customFeature":{"boxColor":"rgb(0, 0, 0)","boxR":"5","boxStyle":false,"boxX":"0","boxY":"0","textColor":"rgb(0, 0, 0)","textStyle":false,"textX":"0","textY":"0","textR":"5","isWordWrap":0,"dataObject":false,"word-wrap":2,"phoneNumberSource":"static","phoneDisplayContent":"static","name":"\u6587\u672c","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_14023381995","page_form":"","compId":"text34","markColor":"","mode":0},"breakline35":{"type":"breakline","style":"border-width:117.1875rpx;border-bottom-style:solid;margin-top:23.4375rpx;margin-left:0rpx;margin-right:auto;width:750rpx;border-bottom-color:rgba(0, 0, 0, 0);","content":"<div><\/div>","customFeature":{"name":"\u5206\u5272\u7ebf","isLockWidget":false},"animations":[],"hidden":false,"id":"zhichi_87044634031","page_form":"","compId":"breakline35"},"has_tabbar":0,"page_hidden":true,"page_form":"store_list","top_nav":{"navigationBarBackgroundColor":"#fff","navigationBarTextStyle":"black","navigationBarTitleText":"\u5317\u6b27\u539f\u6728\u98ce"},"dataId":""},
    need_login: false,
      bind_phone: false,
    page_router: 'page10014',
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
