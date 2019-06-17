
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    personArr: [],
    showSubordinateClassicMask: false,
    selectedClassic: -1,
    userName: ''
  },
  page: 1,
  isMore: 1,
  onLoad: function (options) {
    this.dataInitial()
  },
  dataInitial: function () {
    this.getMyTeamMembersInfo()
  },
  getMyTeamMembersInfo:function(){
    var _this = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/GetAllTeamMembers',
      data: {
        page: _this.page,
        get_type: 1,
        search_value: _this.data.userName,
        lower_level: _this.data.selectedClassic == -1 ? '' : _this.data.selectedClassic
      },
      success: function (res) {
        this.isMore = res.is_more;
        _this.setData({
          personArr: [..._this.data.personArr, ...res.data]
        })
      }
    })
  },
  onReachBottom: function(){
    if (!this.isMore){return};
    this.page++;
    this.getMyTeamMembersInfo();
  },
  toggleSubordinateClassicMask: function(){
    this.setData({
      showSubordinateClassicMask: true
    })
  },
  hideSubordinateClassicMask: function(){
    this.setData({
      showSubordinateClassicMask: false
    })
  },
  clickClassic: function(event){
    this.page = 1;
    this.setData({
      personArr: [],
      selectedClassic: event.currentTarget.dataset.index,
      showSubordinateClassicMask: false,
      userName: ''
    })
    this.getMyTeamMembersInfo();
  },
  searchUser: function (event) {
    this.page = 1;
    this.setData({
      personArr: [],
      userName: event.detail.value,
      selectedClassic: -1
    })
    this.getMyTeamMembersInfo();
  }
})
