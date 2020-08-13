import {get, API} from "../request"
import wx from 'weixin-js-sdk'

let _wechat = null

async function getWechat() {
  if (!_wechat) {
    let url = encodeURIComponent(location.href.split('#')[0])
    let result = await get('/bookapi/weixin/jsconfig?url=' + url)
    _wechat = await new Promise((resolve, reject) => {
      let error = null
      wx.config({
        ...result.data,
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      })
      // 只在微信端才会有error
      wx.error((e) => error = e.errMsg)
      // 遇到错误同样会走ready，且ready和error的先后顺序不确定
      setTimeout(()=>{
        wx.ready(() => {
          if (error) reject(new Error(error))
          else resolve(wx)
        })
      }, 300)
    })
    window.wx = _wechat
    return _wechat
  }
  return _wechat
}

export async function chooseImage(multiple) {
  let wx = await getWechat()
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: multiple ? 9 : 1, // 默认9
      sizeType: ['original'], // 原图 original 压缩 compressed
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => resolve(res.localIds),
      fail: (e) => reject(new Error(e.errMsg))
    })
  })
}

export async function uploadImage(localId, fakeOnProgress, fakeMaxDuration) {
  let wx = await getWechat()
  let obj = {}
  let _reject
  let timer = null
  let canceled = false
  let _onProgress = (percent)=>{
    if (!canceled) {
      fakeOnProgress && fakeOnProgress(percent)
    }
  }
  obj.start = () => new Promise((resolve, reject) => {
    _reject = reject
    // 假的进度
    let fakePercent = 0
    let maxDuration = fakeMaxDuration || 10 * 1000 // 假设上传最大时间
    let duration = 100
    let maxTimes = Math.ceil(maxDuration / duration)
    let curTimes = 0
    timer = setInterval(() => {
      curTimes++
      fakePercent = ((curTimes * duration) / maxDuration) * 100
      _onProgress(fakePercent)
      // 最后一次不再增加（不会加到100%）
      if (curTimes === maxTimes - 1) clearInterval(timer)
    }, duration)

    wx.uploadImage({
      localId,
      isShowProgressTips: 0,
      success: async (res) => {
        let {serverId} = res
        let result = await get(API.mediaToQiniu + serverId)
        _onProgress(100)
        clearInterval(timer)
        resolve(result.data.key)
      },
      fail: () => {
        _onProgress(0)
        clearInterval(timer)
        reject(new Error('微信素材上传失败'))
      }
    })
  })
  obj.cancel = () => {
    canceled = true
    clearInterval(timer)
    // 微信不能取消，手动取消需要reject，让下面的代码继续执行
    _reject(new Error('cancel'))
  }
  return obj

}
