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
    // 缓存token，一小时过期
    if (!expired_at || expired_at < Date.now()) {
      _token.expired_at = Date.now() + 60 * 1000
      let result = await get(API.qiniuToken)
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
    const observable = qiniu.upload(file, key, token)
    observable.start = () => new Promise((resolve, reject) => {
      // 第一个参数为进度回到方法，包含已上传、总数、百分比 total:{ loaded, total, percent }
      observable.subscribe(
        ({total}) => onProgress && onProgress(total.percent),
        reject,
        () => resolve(key))
    })
    observable.cancel = observable.unsubscribe
    return observable
  }
}

export default new Qiniu()