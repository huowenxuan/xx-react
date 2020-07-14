import {get, API} from "../request"

let _wechat = null

async function getWechat() {
  if (!_wechat) {
    let url = encodeURIComponent('http://m.tripcity.cn/')
    let result = await get('/bookapi/weixin/jsconfig?url=' + url)
    window.wx.config({
      ...result.data,
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    })
    _wechat = window.wx
  }
  return _wechat
}

export async function chooseImage(max) {
  let wx = await getWechat()
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: max, // 默认9
      sizeType: ['original'], // 原图 original 压缩 compressed
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => resolve(res.localIds),
      fail: reject
    })
  })
}

export async function uploadImage(localId) {
  let wx = await getWechat()
  return new Promise((resolve, reject) => {
    wx.uploadImage({
      localId,
      isShowProgressTips: 0,
      success: async (res) => {
        let {serverId} = res
        let result = await get(API.mediaToQiniu + serverId)
        resolve(result.data)
      },
      fail: reject
    })
  })

}
