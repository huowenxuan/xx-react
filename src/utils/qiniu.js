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

  async uploadFile(file, key) {
    let token = await this._getToken()
    const observable = qiniu.upload(file, key, token)
    return {
      start: ()=>{
        return new Promise((resolve, reject) => {
          observable.subscribe(
            () => resolve(key),
            reject
          )
        })
      },
      stop: ()=>observable.unsubscribe()
    }

  }
}

export default new Qiniu()