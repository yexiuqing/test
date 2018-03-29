# 小程序test
#### app.json全局中配置，在page中加入路径，在window下定义全局变脸，
···
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
    // 获取每周推荐
  onWeekShow: function () {
    var that = this;
    wx.request({
      url: 'https://api.ilovelook.cn/api/kolshop/dabing/coms/list',
      data: {
        code: 'dabing'
      },
      ethod: 'GET',      默认请求方式为get，注意大写
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
  }
```
###<br/>小程序中不存在cookie,因此setCookie 和 getCookie 通过改header字段，wx.getStorageSync与wx.setStorageSync可以实现
###<br/>微信小程序运行环境exports、module并没有定义，挂载underscore.js可以修改Underscore代码，注释原有模块导出语句，使用       module.exports = _ 强制导出
#
#
#
#
#

