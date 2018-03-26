//index.js
var _ = require('../../utils/underscore.modifyied.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World lalal',
    movies: [
      { url: '11111111111' },
      { url: '3333333' },
      { url: '2222222222222' }
    ],
    weekLists: [],
    bottomLists: [],
    userInfo: {},
    hasUserInfo: false,
    isHideLoadMore: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    console.log('Hack PageOnLoad');
    this.onScrollShow();
    this.onWeekShow();
    this.onBottomShow();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function () {
    return {
      title: '转发啦',
      path: '/page/user?id=123'
    }
  },

// 轮播数据
  onScrollShow: function () {
    var that = this;
    wx.request({
      url: 'https://api.ilovelook.cn/api/kolshop/gogoboi/coms/list',
      data: {
        code: 'gogoboi'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var temp = res.data;
        var result = []
        for (var i in temp) {
          if (temp[i].component_type === 1) {
            if (temp[i].component_list.length === 1) {
              result = temp[i].component_list;
            }

          }
        }
        that.setData({
          'movies': result
        })
      },
      fail: function () {
        console.log("接口调用出错")
      }

    })
  },
// 获取每周推荐
  onWeekShow: function () {
    var that = this;
    wx.request({
      url: 'https://api.ilovelook.cn/api/kolshop/dabing/coms/list',
      data: {
        code: 'dabing'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var temp = res.data;
        var result = []
        for (var i in temp) {
          if (temp[i].component_type === 6) {
            result = temp[i].goodslist.sku;
          }
        }
        that.setData({
          'weekLists': result
        })
      },
      fail: function () {
        console.log("接口调用出错")
      }
    })
  },
  // 获取专题数据
  onBottomShow: function () {
    var that = this;
    wx.request({
      url: 'https://api.ilovelook.cn/api/kolshop/gogoboi/goodslist/list?code=gogoboi',
      data: {
        page: 'pn:1;l:6',
        limit: 6
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var temp = res.data;
        var result = temp.goods_lists
        that.setData({
          'bottomLists': result
        })
      },
      fail: function () {
        console.log("bottomList接口调用出错")
      }
    })
  },
  bindViewDemo: function () {
    wx.navigateTo({
      url: '../demo/demo',
    })
  },
  // 下拉函数
  onReachBottom: function () {
    console.log('000加载更多')
    var that = this
    setTimeout(() => {
      that.setData({
        isHideLoadMore: true,
        bottomLists:that.onBottomShow() 
      })
    }, 500)
  },
 load: function () {
    var that = this;
    that.onBottomShow();
    console.log("lower");
  }
})


