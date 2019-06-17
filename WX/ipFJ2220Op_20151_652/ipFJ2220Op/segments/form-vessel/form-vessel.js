var Element = require('../../utils/element.js');
var util = require('../../utils/util.js');
var app = getApp();

var formVessel = new Element({
  events: {
    formAddress: function(e){
      this.formAddress(e);
    },
    changeDropDown:function(e){
      this.changeDropDown(e);
    },
    inputChange: function (e) {
      this.inputChange(e);
    },
    bindScoreChange: function (e) {
      this.bindScoreChange(e);
    },
    bindSliderChange: function (e) {
      this.bindSliderChange(e);
    },
    bindSelectChange: function (e) {
      this.bindSelectChange(e);
    },
    selectOptionOne: function (e) {
      this.selectOptionOne(e);
    },
    selectOptionSecond: function (e) {
      this.selectOptionSecond(e);
    },
    bindDateChange: function (e) {
      this.bindDateChange(e);
    },
    bindTimeChange: function (e) {
      this.bindTimeChange(e);
    },
    uploadFormImg: function (e) {
      this.uploadFormImg(e);
    },
    deleteUploadImg: function (e) {
      this.deleteUploadImg(e);
    },
    selectPicOption:function(e){
      this.selectPicOption(e);
    },
    submitForm: function (e) {
      this.submitForm(e);
    }
  },
  methods: {
    init: function(pageInstance){
      this.formVessel(pageInstance);
    },
    formVessel: function (pageInstance) {
      let _this = this;
      for (let formConfig of pageInstance.formVesselComps) {
        let newData = {};
        let formCompId = formConfig.compid;
        let customFeature = pageInstance.data[formCompId].customFeature;
        let content = pageInstance.data[formCompId].content;
        let buttonContent = '';
        let buttonIndex = '';
        for (let i = 0; i < content.length; i++) {
          if (content[i].type == 'form-button') {
            buttonContent = content[i];
            buttonIndex = i;
          }
        }
        if (buttonIndex === ''){
          continue;
        }
        newData[formCompId + '.content[' + buttonIndex + '].can_use'] = 1;
        pageInstance.setData(newData);
        let param = {
          button_info: {
            'type': buttonContent.customFeature.effect || 1,
            'times': buttonContent.customFeature.frequency || -1,
            'button_id': customFeature.id
          }
        }
        app.sendRequest({
          hideLoading: true,
          url: '/index.php?r=AppData/isFormSubmitButtonValid',
          data: param,
          method: 'post',
          success: function (res) {
            console.log(res);
            newData[formCompId + '.content[' + buttonIndex + '].can_use'] = res.data.can_use;
            newData[formCompId + '.buttonContent'] = buttonContent;
            pageInstance.setData(newData);
          }
        })
      }
    },
    formAddress: function (event) {
      let pageInstance = app.getAppCurrentPage();
      let compid = event.currentTarget.dataset.compid;
      let syncUserAddress = event.currentTarget.dataset.syncUserAddress;
      let filed = event.currentTarget.dataset.filed;
      app.turnToPage('/eCommerce/pages/myAddress/myAddress?from=form&syncUserAddress=' + syncUserAddress);
      pageInstance.selectAddressCallback = (res) => {
        let newdata = {};
        let address = res.address_info.province.text + res.address_info.city.text + res.address_info.district.text + res.address_info.detailAddress;
        newdata[compid + '.form_data.' + filed] = address
        pageInstance.setData(newdata);
      }
    },
    changeDropDown: function (e) {
      let pageInstance = app.getAppCurrentPage();
      let dataset = e.currentTarget.dataset;
      let form = dataset.form;
      let index = dataset.index;
      let name = dataset.name;
      let key = dataset.key;
      let filed = dataset.filed;
      let range = dataset.range;
      let value = e.detail.value;
      let newdata = {};
      newdata[form + '.dropDown'] = pageInstance.data[form].dropDown ? pageInstance.data[form].dropDown : {};
      newdata[form + '.dropDown'][filed] = newdata[form + '.dropDown'][filed] ? newdata[form + '.dropDown'][filed] : [];
      newdata[form + '.dropDown'][filed][index] = range[value];
      newdata[form + '.form_data.' + filed] = newdata[form + '.dropDown'][filed].join(',');
      pageInstance.setData(newdata);
    },
    inputChange: function (event) {
      let dataset      = event.currentTarget.dataset;
      let value        = event.detail.value;
      let pageInstance = app.getAppCurrentPage();
      let datakey      = dataset.datakey;
      let segment      = dataset.segment;
  
      if (!segment) {
        app.showModal({
          content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
        });
        return;
      }
      let newdata = {};
      newdata[datakey] = value;
      let selectKey ={}
      for(let i in value){
        selectKey[value[i]] = 1;
      }
      selectKey.itemLength = value.length
      newdata[dataset.compid + '.selectedData'] = selectKey
      pageInstance.setData(newdata);
    },
    bindScoreChange: function (event) {
      let dataset      = event.currentTarget.dataset;
      let pageInstance = app.getAppCurrentPage();
      let datakey      = dataset.datakey;
      let value        = dataset.score;
      let compid       = dataset.compid;
      let formcompid   = dataset.formcompid;
      let segment      = dataset.segment;
  
      compid = formcompid + compid.substr(4);
  
      if (!segment) {
        app.showModal({
          content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
        });
        return;
      }
      let newdata = {};
      newdata[datakey] = value;
      newdata[compid + '.editScore'] = value;
      pageInstance.setData(newdata);
    },
    bindSliderChange: function (event) {
      let pageInstance = app.getAppCurrentPage();
      let dataset = event.currentTarget.dataset;
      let datakey = dataset.datakey;
      let compid = dataset.compid;
      let formcompid = dataset.formcompid;
      let segment = dataset.segment;
      let value = event.detail.value;
  
      compid = formcompid + compid.substr(4);
  
      if (!segment) {
        app.showModal({
          content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
        });
        return;
      }
      let newdata = {};
      newdata[datakey] = value;
      newdata[compid + '.sliderScore'] = value;
      pageInstance.setData(newdata);
    },
    bindSelectChange: function (event) {
      let dataset      = event.currentTarget.dataset;
      let value        = event.detail.value;
      let pageInstance = app.getAppCurrentPage();
      let datakey      = dataset.datakey;
      let segment      = dataset.segment;
  
      if (!segment) {
        app.showModal({
          content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
        });
        return;
      }
      let newdata = {};
      newdata[datakey] = value;
      if (newdata[datakey].constructor === Array){
        newdata[datakey] = newdata[datakey].join();
      }
      let selectKey ={}
      for(let i in value){
        selectKey[value[i]] = 1;
      }
      selectKey.itemLength = value.length
      newdata[dataset.compid + '.selectedData.'+segment] = selectKey
      pageInstance.setData(newdata);
    },
    selectOptionOne: function (event){
      let dataset = event.currentTarget.dataset;
      let value = event.detail.value;
      let pageInstance = app.getAppCurrentPage();
      let datakey = dataset.datakey;
      let segment = dataset.segment;
      let compid = dataset.compid;
      let formcompid = dataset.formcompid;
      compid = formcompid + compid.substr(4);
      if (!segment) {
        app.showModal({
          content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
        });
        return;
      }
      let newdata = {};
      let selectKey = {}
      newdata[datakey] = value;
      if (newdata[datakey].constructor === Array) {
        newdata[datakey] = newdata[datakey].join();
        for (let i in value) {
          selectKey[value[i]] = 1;
        }
        selectKey.itemLength = value.length
      }else{
        selectKey[value] = 1;
        selectKey.itemLength = 1;
      }
      newdata[compid + '.selectedData'] = selectKey
      pageInstance.setData(newdata);
    },
    selectOptionSecond: function (event) {
      let dataset = event.currentTarget.dataset;
      let pageInstance = app.getAppCurrentPage();
      let datakey = dataset.datakey;
      let index = dataset.index;
      let selectedValue = dataset.selectedValue;
      let selectedData = dataset.selectedData;
      let compid = dataset.compid;
      let formcompid = dataset.formcompid;
      let segment = dataset.segment;
      let newdata = {};
      let dataArray = [];
      let multi = dataset.multi;
      let min = dataset.min;
      let max = dataset.max;
      compid = formcompid + compid.substr(4);
  
      if (!segment) {
        app.showModal({
          content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
        });
        return;
      }
      newdata[compid + '.selectedValue'] = selectedValue ? selectedValue : [];
      if (multi){
        let arrLength = 0;
        if (newdata[compid + '.selectedValue'][index] === index) {
          newdata[compid + '.selectedValue'][index] = null;
        } else {
          newdata[compid + '.selectedValue'][index] = index;
        }
        for (let i = 0; i < newdata[compid + '.selectedValue'].length; i++) {
          let dataIndex = newdata[compid + '.selectedValue'][i];
          if (dataIndex != null) {
            arrLength++;
            if (arrLength > max){
              app.showModal({
                content: '最多选择' + max + '项'
              });
              return;
            }
            dataArray.push(selectedData[dataIndex]);
          }
          newdata[datakey] = dataArray.join(',');
        }
      }else{
        newdata[datakey] = '';
        if (newdata[compid + '.selectedValue'][index] === index) {
          newdata[compid + '.selectedValue'][index] = null;
        }else{
          newdata[compid + '.selectedValue'] = [];
          newdata[compid + '.selectedValue'][index] = index;
          newdata[datakey] = selectedData[index];
        }
      }
      pageInstance.setData(newdata);
    },
    bindDateChange: function (event) {
      let dataset      = event.currentTarget.dataset;
      let value        = event.detail.value;
      let pageInstance = app.getAppCurrentPage();
      let datakey      = dataset.datakey;
      let compid       = dataset.compid;
      let formcompid   = dataset.formcompid;
      let segment      = dataset.segment;
      let newdata      = {};
  
      compid = formcompid + compid.substr(4);
  
      if (!segment) {
        app.showModal({
          content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
        });
        return;
      }
  
      let obj = pageInstance.data[formcompid]['form_data'];
      if (util.isPlainObject(obj)) {
        obj = pageInstance.data[formcompid]['form_data'] = {};
      }
      obj = obj[segment];
  
      if (!!obj) {
        let date = obj.substr(0, 10);
        let time = obj.substr(11);
  
        if (obj.length == 16) {
          newdata[datakey] = value + ' ' + time;
        } else if (obj.length == 10) {
          newdata[datakey] = value;
        } else if (obj.length == 5) {
          newdata[datakey] = value + ' ' + obj;
        } else if (obj.length == 0) {
          newdata[datakey] = value;
        }
      } else {
        newdata[datakey] = value;
      }
      newdata[compid + '.date'] = value;
      pageInstance.setData(newdata);
    },
    bindTimeChange: function (event) {
      let dataset      = event.currentTarget.dataset;
      let value        = event.detail.value;
      let pageInstance = app.getAppCurrentPage();
      let datakey      = dataset.datakey;
      let compid       = dataset.compid;
      let formcompid   = dataset.formcompid;
      let segment      = dataset.segment;
      let newdata      = {};
  
      compid = formcompid + compid.substr(4);
      if (!segment) {
        app.showModal({
          content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
        });
        return;
      }
  
      let obj = pageInstance.data[formcompid]['form_data'];
      if (util.isPlainObject(obj)) {
        obj = pageInstance.data[formcompid]['form_data'] = {};
      }
      obj = obj[segment];
  
      if (!!obj) {
        let date = obj.substr(0, 10);
        let time = obj.substr(11);
  
        if (obj.length == 16) {
          newdata[datakey] = date + ' ' + value;
        } else if (obj.length == 10) {
          newdata[datakey] = obj + ' ' + value;
        } else if (obj.length == 5) {
          newdata[datakey] = value;
        } else if (obj.length == 0) {
          newdata[datakey] = value;
        }
      } else {
        newdata[datakey] = value;
      }
      newdata[compid + '.time'] = value;
      pageInstance.setData(newdata);
    },
    uploadFormImg: function (event) {
      let dataset      = event.currentTarget.dataset;
      let pageInstance = app.getAppCurrentPage();
      let datakey      = dataset.datakey;
      let segment      = dataset.segment;
  
      if (!segment) {
        app.showModal({
          content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
        })
        console.log('segment empty 请绑定数据对象字段');
        return;
      }
      app.chooseImage((res) => {
        let newdata = {};
        newdata[datakey] = res;
        pageInstance.setData(newdata);
      }, 9);
    },
    deleteUploadImg: function (event) {
      let dataset      = event.currentTarget.dataset;
      let pageInstance = app.getAppCurrentPage();
      let formcompid   = dataset.formcompid;
      let index        = dataset.index;
      let datakey      = dataset.datakey;
      let newdata      = {};
      let segment      = dataset.segment;
      app.showModal({
        content: '确定删除该图片？',
        showCancel: true,
        confirm: function () {
          pageInstance.data[formcompid].form_data[segment].splice(index, 1)
          newdata[datakey] = pageInstance.data[formcompid].form_data[segment];
          pageInstance.setData(newdata);
        }
      })
    },
    selectPicOption:function(e){
      let pageInstance = app.getAppCurrentPage();
      let dataset = e.currentTarget.dataset;
      let form = dataset.form;
      let src = dataset.src;
      let filed = dataset.filed;
      let index = dataset.index;
      let multi = dataset.multi;
      let min = dataset.min;
      let max = dataset.max;
      let name = dataset.name;
      let newdata = {};
      let arr = [];
      if (!filed) {
        app.showModal({
          content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
        });
        return;
      }
      if (multi) {
        if (pageInstance.data[form].picOptions && pageInstance.data[form].picOptions[filed]) {
          newdata[form + '.picOptions.' + filed] = [...pageInstance.data[form].picOptions[filed]]
        }else {
          newdata[form + '.picOptions.' + filed] = [];
        }
        if (!newdata[form + '.picOptions.' + filed][index] ) {
          newdata[form + '.picOptions.'+filed][index] = src;
        } else {
          newdata[form + '.picOptions.'+filed][index] = '';
        }
        for (let i in newdata[form + '.picOptions.' + filed]){
          if (newdata[form + '.picOptions.' + filed][i] !== '' && newdata[form + '.picOptions.' + filed][i] !== undefined ){
            arr.push(newdata[form + '.picOptions.' + filed][i]);
          }
        }
        if (arr.length > max) {
          app.showModal({
            content: name + '最多选择' + max + '项'
          });
          return;
        }
        if (pageInstance.data[form].picOptionsIndex) {
          if ((pageInstance.data[form].picOptionsIndex[filed] && pageInstance.data[form].picOptionsIndex[filed][index]) || (pageInstance.data[form].picOptionsIndex[filed] && pageInstance.data[form].picOptionsIndex[filed][index] === 0)) {
            newdata[form + '.picOptionsIndex.' + filed + '.' + index] = null;
          } else {
            newdata[form + '.picOptionsIndex.' + filed + '.' + index] = index;
          }
        } else {
          newdata[form + '.picOptionsIndex.' + filed + '.' + index] = index;
        }
        newdata[form + '.form_data.' + filed] = arr;
      } else {
        let i = '';
        pageInstance.data[form].picOptionsIndex ? ((pageInstance.data[form].picOptionsIndex[filed] || pageInstance.data[form].picOptionsIndex[filed] == 0) && pageInstance.data[form].picOptionsIndex[filed] === index ? i = -1 : i = index) : i = index
        newdata[form + '.picOptionsIndex.' + filed] = i;
        newdata[form + '.form_data.' + filed] = newdata[form + '.picOptions.0'] = i === -1 ? '' : [src];
      }
      pageInstance.setData(newdata);
    },
    submitForm: function (event) {
      let dataset      = event.currentTarget.dataset;
      let pageInstance = app.getAppCurrentPage();
      let _this        = this;
      let compid       = dataset.compid;
      let form         = dataset.form;
      let form_data    = pageInstance.data[compid].form_data;
      let field_info   = pageInstance.data[compid].field_info;
      let content      = pageInstance.data[compid].content;
      let form_id      = pageInstance.data[compid].customFeature.id;
      let buttonContent = pageInstance.data[compid].buttonContent;
      if (!buttonContent){
        console.log('提交按钮信息有误');
        return;
      }
      let button_info = {
                        'type': buttonContent.customFeature.effect,
                        'times': buttonContent.customFeature.frequency,
                        'pay': buttonContent.customFeature.pay,
                        'price': buttonContent.customFeature.price,
                        'isDiscount': buttonContent.customFeature.discount,
                        'button_id': form_id,
                        'operation': ''
                        };
      let url = '';
      let contentTip = '';
      let formEleType = ['input-ele', 'textarea-ele', 'grade-ele', 'select-ele', 'upload-img', 'time-ele', 'drop-down', 'pic-options', 'address-ele'];
      let pageRoot = {
        'groupCenter': '/eCommerce/pages/groupCenter/groupCenter',
        'shoppingCart': '/eCommerce/pages/shoppingCart/shoppingCart',
        'myOrder': '/eCommerce/pages/myOrder/myOrder',
        'myMessage': '/userCenter/pages/myMessage/myMessage',
      };
      switch (buttonContent.customFeature.action){
        case 'integral':
          button_info['operation'] = 1;
          contentTip = '提交成功，增加' + (buttonContent.customFeature['interests'] || 0) + '积分';
          button_info['num'] = buttonContent.customFeature['interests'];
          url = "/userCenter/pages/myIntegral/myIntegral";
          break;
        case 'scratch':
          button_info['operation'] = 2;
          contentTip = '提交成功，增加' + (buttonContent.customFeature['scratch'] || 0) + '刮刮乐次数';
          button_info['num'] = buttonContent.customFeature['scratch'];
          url = "/awardManagement/pages/scratch/scratch";
          break;
        case 'break-egg':
          button_info['operation'] = 3;
          contentTip = '提交成功，增加' + (buttonContent.customFeature['break-egg'] || 0) + '砸金蛋次数';
          button_info['num'] = buttonContent.customFeature['break-egg'];
          url = "/awardManagement/pages/goldenEggs/goldenEggs";
          break;
        case 'turntable':
          button_info['operation'] = 4;
          contentTip = '提交成功，增加' + (buttonContent.customFeature['turntable'] || 0) + '大转盘次数';
          button_info['num'] = buttonContent.customFeature['turntable'];
          url = "/awardManagement/pages/luckyWheelDetail/luckyWheelDetail";
          break;
        case 'coupon':
          button_info['operation'] = 5;
          button_info['obj_id'] = buttonContent.customFeature['couponId'];
          button_info['num'] = buttonContent.customFeature['coupon-num'];
          contentTip = '提交成功，增加' + (buttonContent.customFeature['coupon-num'] || 0) + '优惠券';
          url = "/eCommerce/pages/couponList/couponList";
          break;
        case 'vip-card':
          button_info['operation'] = 6;
          button_info['obj_id'] = buttonContent.customFeature['vipId'];
          contentTip = '提交成功，增加会员卡一张';
          url = "/userCenter/pages/vipCardList/vipCardList";
          break;
        case 'inner-link':
          button_info['operation'] = 'inner-link';
          let innerParam = JSON.parse(buttonContent.eventParams);
          let pageLink = innerParam.inner_page_link;
          url = pageRoot[pageLink] ? pageRoot[pageLink] : '/pages/' + pageLink + '/' + pageLink;
          break
        case 'plugin-link':
          button_info['operation'] = 'plugin-link';
          let pluginParam = JSON.parse(buttonContent.eventParams);
          url = pluginParam.plugin_page;
          break;
      }
  
      for(let index = 0; index < content.length; index++){
        if(formEleType.indexOf(content[index].type) == -1){
          continue;
        }
        let customFeature = content[index].customFeature,
            segment = customFeature.segment,
            ifMust = content[index].segment_required;
        switch (content[index].type){
          case 'drop-down':
            if ((!form_data || !form_data[segment] || form_data[segment].length < content[index].customFeature.contents.length || form_data[segment].split(',').includes('')) && ifMust == 1 ){
              app.showModal({
                content: field_info[segment].title + ' 没有填写'
              });
              return;
            }
            break;
          case 'pic-options':
            if (ifMust == 1) {
              if (content[index].customFeature.multiSelection) {
                if (!form_data || !form_data[segment] || form_data[segment].length < content[index].customFeature.minSelect) {
                  app.showModal({
                    content: content[index].customFeature.name + '是多选必选项'
                  })
                  return;
                }
              } else {
                if (!form_data || !form_data[segment]) {
                  app.showModal({
                    content: content[index].customFeature.name + '是必选项'
                  })
                  return;
                }
              }
            } else {
              if (content[index].customFeature.multiSelection && form_data && form_data[segment] && form_data[segment].length && form_data[segment].length < content[index].customFeature.minSelect) {
                app.showModal({
                  content: content[index].customFeature.name + '至少选择' + content[index].customFeature.minSelect + '项'
                })
                return;
              }
            }
            break;
          case 'input-ele':
          case 'textarea-ele':
            if (ifMust == 1) {
              if (!form_data || !form_data[segment] || form_data[segment].length == 0){
                app.showModal({
                  content: field_info[segment].title + ' 没有填写'
                });
                return;
              }else{
                if( _this.formRegex(content[index].customFeature.dataType, form_data[segment])){
                  return;
                }
              }
            }else{
              if (form_data && segment && form_data[segment] && form_data[segment].length && _this.formRegex(content[index].customFeature.dataType, form_data[segment])) {
                return;
              }
            }
            break;
          case 'select-ele':
            if (content[index].customFeature.type === undefined ){break}
            else if (content[index].customFeature.type === 0){
              if (ifMust == 1) {
                if (content[index].customFeature.multiSelection) {
                  if (!form_data || !form_data[segment] || content[index].selectedData.itemLength < content[index].customFeature.minSelect) {
                    app.showModal({
                      content: content[index].content.title + '是多选必选项'
                    })
                    return;
                  }
                } else {
                  if (!form_data || !form_data[segment]) {
                    app.showModal({
                      content: content[index].content.title + '是必选项'
                    })
                    return;
                  }
                }
              } else {
                if (content[index].customFeature.multiSelection && form_data && form_data[segment] && content[index].selectedData.itemLength && content[index].selectedData.itemLength < content[index].customFeature.minSelect) {
                  app.showModal({
                    content: content[index].content.title + '至少选择' + content[index].customFeature.minSelect + '项'
                  })
                  return;
                }
              }
            } else if (content[index].customFeature.type === 1){
              if (!content[index].selectedValue) {
                if (ifMust == 1){
                  app.showModal({
                    content: content[index].content.title + ' 没有填写'
                  });
                  return;
                }
              }else{
                let arrLength = 0;
                for (let i=0;i < content[index].selectedValue.length;i++){
                  if (content[index].selectedValue[i] != null){arrLength++}
                }
                if (ifMust == 1) {
                  if (content[index].customFeature.multiSelection) {
                    if (!form_data || !form_data[segment] || arrLength < content[index].customFeature.minSelect) {
                      app.showModal({
                        content: content[index].content.title + '是多选必选项'
                      })
                      return;
                    }
                  } else {
                    if (!form_data || !form_data[segment]) {
                      app.showModal({
                        content: content[index].content.title + '是必选项'
                      })
                      return;
                    }
                  }
                } else {
                  if (content[index].customFeature.multiSelection && form_data && form_data[segment] && arrLength && arrLength < content[index].customFeature.minSelect) {
                    app.showModal({
                      content: content[index].content.title + '至少选择' + content[index].customFeature.minSelect + '项'
                    })
                    return;
                  }
                }
              }
            }
            break;
          case 'time-ele':
            if ((!form_data || !form_data[segment] || form_data[segment].length == 0) && ifMust == 1) { // 提示错误
              app.showModal({
                content: field_info[segment].title + ' 没有填写'
              });
              return;
            }
            if (!content[index].customFeature.ifAllDay && ((content[index].date && !content[index].time) || (!content[index].date && content[index].time)) ) {
              app.showModal({
                content: '请选择具体时间'
              });
              return;
            }
            break;
          default:
            if (ifMust == 1 && (!form_data || !form_data[segment] || form_data[segment].length == 0)) { // 提示错误
              app.showModal({
                content: field_info[segment].title + ' 没有填写'
              });
              return;
            }
            break;
        }
      }
  
      if(pageInstance.submitting) return;
      let countNum = 0;
      let countEmptyNum = 0;
      if (!form_data) {
        app.showModal({
          content: '数据为空'
        });
        return;
      } else {
        for (let i in form_data) {
          countNum++;
          if (form_data[i] && typeof form_data[i] == 'number') {
            continue;
          }
          if (!form_data[i] || (form_data[i] instanceof Array && form_data[i].length == 0)) { countEmptyNum++ }
        }
        if (countNum == countEmptyNum) {
          app.showModal({
            content: '数据为空'
          });
          return;
        }
      }
      pageInstance.submitting = true;
  
      let submitData = {
        button_info: button_info,
        form: form,
        form_data: form_data,
        is_transfer_order: button_info.pay ? 1 : 0
      };
  
      _this.submitFormRequest({
        url: url,
        data: submitData,
        compid: compid,
        contentTip: contentTip
      })
    },
    formRegex: function(dataType, data){
      switch (dataType) {
        case 'phone':
          if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(data)) {
            app.showModal({
              content: '请输入正确的手机号'
            });
            return true;
          }
          break;
        case 'IDcard':
          if (!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/.test(data) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(data))) {
            app.showModal({
              content: '请输入正确的身份证'
            });
            return true;
          }
          break;
        case 'email':
          if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(data)) {
            app.showModal({
              content: '请输入正确的邮箱'
            });
            return true;
          }
          break;
        case 'chinese':
          if (!/^[\u4e00-\u9fa5]*$/.test(data)) {
            app.showModal({
              content: '请输入中文'
            });
            return true;
          }
          break;
        case 'number':
          if (!/^[0-9]*$/.test(data)) {
            app.showModal({
              content: '请输入数字'
            });
            return true;
          }
          break;
        case 'english':
          if (!/^[a-zA-Z]*$/.test(data)) {
            app.showModal({
              content: '请输入英文'
            });
            return true;
          }
          break;
        default:
          return false;
          break;
      }
    },
    submitFormRequest: function(options){
      let _this = this;
      let pageInstance = app.getAppCurrentPage();
      app.sendRequest({
        url: '/index.php?r=AppData/addData',
        data: options.data,
        method: 'POST',
        success: function (res) {
          if (options.data.button_info.pay){
            options.data.form_data_id = res.data;
            _this.submitFormByPay({
              price: options.data.button_info.price,
              isDiscount: options.data.button_info.isDiscount,
              submitData: options.data,
              url: options.url,
              contentTip: options.contentTip
            });
            return
          };
          _this.addFormDataSuccess(options,res)
        },
        complete: function () {
          pageInstance.submitting = false;
        }
      })
    },
    submitFormByPay: function (options) {
      let pageInstance = app.getAppCurrentPage();
      let _data = {  };
      if (!options.isDiscount) {
        _data = {
          price: options.price,
          is_balance: 0,
          selected_benefit: {
            no_use_benefit: 1
          }
        }
      } else {
        _data = {
          price: options.price,
          is_balance: 0
        }
      }
      pageInstance.setData({
        formInfo: {
          calculData: _data,
          isDiscount: options.isDiscount,
          price: +options.price,
          submitData: options.submitData,
          show: true,
          logo: app.globalData.appLogo,
          name: app.getAppTitle()
        }
      });
      pageInstance.selectComponent('#component-formPay').calculateTotalPrice({
        url: options.url,
        contentTip: options.contentTip,
        data: options.submitData
      });
    },
    addFormDataSuccess: function (options,res){
      let pageInstance = app.getAppCurrentPage();
      this.init(pageInstance);
      if (options.data.button_info['operation'] === 'inner-link' || options.data.button_info['operation'] === 'plugin-link') {
        app.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 3000,
          success: function () {
            if (options.url) {
              app.turnToPage(options.url);
            }
          }
        });
        return;
      }
      if (!res.msg) {
        app.showModal({
          content: options.contentTip || '提交成功',
          confirmText: options.data.button_info['operation'] ? '去查看' : '确认',
          confirm: function () {
            if (options.url) {
              app.turnToPage(options.url);
            }
          }
        });
      } else {
        app.showModal({
          content: res.msg
        });
      }
    }
  }
})


module.exports = formVessel;