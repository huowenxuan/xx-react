import * as crypto from 'crypto'
import * as qiniu from 'qiniu-js'
import {API, get} from "../request";

let _token = {
  token: '',
  expired_at: ''
}

class Qiniu {
  constructor() {
  }

  async _getToken() {
    const {expired_at, token} = _token
    // 缓存token
    if (!expired_at || expired_at < Date.now()) {
      let result = await get(API.qiniuToken)
      _token.expired_at = Date.now() + 10 * 1000
      _token.token = result.qiniutoken
    }
    return _token.token
  }

  generateKey(unionKey) {
    let hmac = crypto.createHmac('sha1', 'tangshui');
    hmac.update(unionKey);
    return hmac.digest('base64');
  }

  async uploadFile(file, key, onProgress) {
    let token = await this._getToken()
    const observable = qiniu.upload(file, key, token, null, {
      // TODO qiniu-js的bug
      // 在取消时会报错，但不影响正常运行
      // 但是禁用后依然会出错误，等待修复
      disableStatisticsReport: true,
    })
    let subscription
    observable.start = () => new Promise((resolve, reject) => {
      // 第一个参数为进度回到方法，包含已上传、总数、百分比 total:{ loaded, total, percent }
      subscription = observable.subscribe(
        ({total}) => {
          onProgress && onProgress(total.percent)
        },
        (e) => {
          reject(e)
          console.error('上传失败:', e)
        },
        () =>{
          resolve(key)
        })
    })
    observable.cancel = () => subscription.unsubscribe()
    return observable
  }

  getImageUrl(key) {
    return `${this.getOriginUrl(key)}?imageView2/1/w/800/interlace/1`
  }

  getOriginUrl(key) {
    return `https://imgssl.tangshui.net/${key}`
  }
}

export default new Qiniu()