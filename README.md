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
```
var exp = new Date();
exp.setTime(exp.getTime() + 7*24*60*60*1000)
var name = 'Cookie'
var sessionid: "SESSID=" + wx.getStorageSync("sessionid")
var strCookie = name +"="+escape (sessionid)+ ";expires=" + exp.toGMTString()
header = {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': strCookie
    }
```
#### 微信小程序运行环境exports、module并没有定义，挂载underscore.js可以修改Underscore代码，注释原有模块导出语句，使用module.exports = _ 强制导出
