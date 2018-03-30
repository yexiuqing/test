# 小程序test
#### app.json全局中配置，在page中加入路径，在window下定义全局变脸，
```
    {
       "pages":[
           "pages/index/index",
           "pages/logs/logs",
           "pages/demo/demo"
        ],
        "window":{
            "backgroundTextStyle":"light",
            "navigationBarBackgroundColor": "#fff",
            "navigationBarTitleText": "啦",
            "navigationBarTextStyle":"black",
            "enablePullDownRefresh":true
       }
    }
```
####    // 获取每周推荐
```
  onWeekShow: function () {
    var that = this;
    wx.request({
      url: 'https://api.ilovelook.cn/api/kolshop/dabing/coms/list',
      data: {
        code: 'dabing'
      },
      method: 'GET',      
      header: {
        'content-type': 'application/json' 
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
  }
```
#### 小程序中不存在cookie,但http可以设置header.可以通过保存cookie,并且请求的时候加上cookie.使用wx.getStorageSync(）方法可以获取到sessionid,将此保存在cookie中，下次请求时，在header中带上sessionid，写在cookie中，wx.setStorageSync('sessionid', sessionid)，由于是本地存储了sessionid，所以在每次请求前，先清空本地存储的sessionid，然后发送首次请求获取新的sessionid
#### 设置coookie
```
function setCookie(name, value, times) {
    var exp = new Date();
    exp.setTime(exp.getTime() + times*24*60*60*1000);
    var strCookie = name +"="+escape (value)+ ";expires=" + exp.toGMTString();
    header = {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': strCookie
    }
}
var name = 'Cookie';
var sessionid: "SESSID=" + wx.getStorageSync("sessionid");
setCookie(name, sessionid, 7)
```
#### 获取cookie
```
function(res) {
    wx.removeStorageSync('sessionid');
    let sessionid = res.header['Set-Cookie'];
    sessionid = sessionid.match(/=(\S*);/)[1];
    wx.setStorageSync('sessionid', sessionid);
}
```
#### 挂载underscore.js
#### 小程序中不能使用require(underscore.js),但是运行环境支持CommoJS模块化，可以通过module.exports暴露对象，require来获取对象
```
  // // Export the Underscore object for **Node.js**, with
  // // backwards-compatibility for the old `require()` API. If we're in
  // // the browser, add `_` as a global object.
  // if (typeof exports !== 'undefined') {
  //     if (typeof module !== 'undefined' && module.exports) {
  //         exports = module.exports = _;
  //     }
  //     exports._ = _;
  // } else {
  //     root._ = _;
  // }

  module.exports = _;
```
```
  // // AMD registration happens at the end for compatibility with AMD loaders
  // // that may not enforce next-turn semantics on modules. Even though general
  // // practice for AMD registration is to be anonymous, underscore registers
  // // as a named module because, like jQuery, it is a base library that is
  // // popular enough to be bundled in a third party lib, but not be part of
  // // an AMD load request. Those cases could generate an error when an
  // // anonymous define() is called outside of a loader request.
  // if (typeof define === 'function' && define.amd) {
  //     define('underscore', [], function() {
  //         return _;
  //     });
  // }
``` 
#### 使用
```
var _ = require('../../utils/underscore.modifyied.js');
```
