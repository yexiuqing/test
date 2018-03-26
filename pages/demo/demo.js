Page({
  formSubmit:function(e){
    console.log("form 發生了submit事件，携带的数据：", e.detail.value)
  },
  formReset:function() {
    console.log("form发生了reset事件")
  }
})