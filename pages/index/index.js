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
    bottomListStart: 1,
    bottomListEnd: 6,
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
    this.onBottomShow(this.data.bottomListStart, this.data.bottomListEnd);
  },
  getUserInfo: function (e) {
    // console.log(e)
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
        wx.request()
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
  onBottomShow: function (start = 1, end = 6) {
    var that = this;
    console.log(start);
    console.log(end)
    var pageNum = 'pn:' + start + ';' + 'l' + end
    wx.request({
      url: 'https://api.ilovelook.cn/api/kolshop/gogoboi/goodslist/list?code=gogoboi',
      data: {
        page: pageNum,
        limit: 6
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('成功再次请求');
        var temp = res.data;
        var result = temp.goods_lists
        var aSku;
        var reSetResult = [];
        for (let i in result) {
          var reSetResultList = {
            sku: [],
          };
          // if (result[i].covers) {
            reSetResultList.covers = result[i].covers;
          // } else {
            // break;
          // }
          aSku = result[i].sku;
          for (let j = 0; j < aSku.length; j++) {
            if (aSku[j].images && aSku[j].price) {
              reSetResultList.sku.push(aSku[j])
            }
          }
          reSetResult.push(reSetResultList);
          // console.log('00000' + JSON.stringify(reSetResult))
        }
        var reSetEnd = end
        end = that.data.bottomListEnd
        if (end < 18) {
          start = that.data.bottomListStart + 6
          end = that.data.bottomListEnd + 6
          that.setData({
            'bottomListStart': start,
            'bottomListEnd': end
          })
        } 
        if (reSetEnd < 7) {
          that.setData({
            'bottomLists': reSetResult,
          })
        } else {
          // console.log('7-12:===' + JSON.stringify(reSetResult))
          return reSetResult;
        }
        console.log("成功")
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
    var that = this
    console.log('下拉')
    var reSetResult = that.onBottomShow(that.data.bottomListStart, that.data.bottomListEnd)
    var result = that.data.bottomLists.concat(reSetResult)
    console.log('7-12:===' + JSON.stringify(reSetResult))

    that.setData({
      isHideLoadMore: true,
      'bottomLists': result
    })
  },
  onScrollBottom: function () {
    var that = this;
    that.onBottomShow();
    console.log("lower");
  },
  // 设置cookie
  // set 写入 request header 里面
  setCookie:function() {
    var name = 'Cookie';
    var session ='SESSID='+wx.getStorageSync("sessionid");
    var exp = new Date();
    exp.setTime(exp.getTime() + 7 * 24 * 60 * 60 * 1000);
    var strCookie = name + "=" + escape(session) + ";expires=" + exp.toGMTString();
    var setHeader = {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': strCookie
    }
    wx.request({
      header: setHeader
    })
  },
  // getCookie
  // 请求的response中取
  getCookie: function () {
    wx.removeStorageSync('sessionid');
    let sessionid = res.header['Set-Cookie']
    sessionid = sessionid.match(/=(\S*);/)[1]
    wx.setStorageSync('sessionid', sessionid)
  }
})


