import * as crypto from 'crypto'
import axios from 'axios'
import * as qiniu from 'qiniu-js'

const config = {
  access_key: '42rOPiogxn5sU0Tw_qtEvYrDBZUhHEJ4x7-nYyx4',
  secret_key: 'Ah9k24vBXv4fSwLGgX8AUB019d2aqh9RGMDJtqnc',
  bucket: 'aituewn-book',
  https: 'http://up-z2.qiniup.com', //http(s)://upload-z2.qiniup.com
  domain_https: 'https://imgssl.tangshui.net',
}

class Qiniu {
  constructor() {
    // this.mac = new qiniu.auth.digest.Mac(config.access_key, config.secret_key);
    // const qiniuConfig = new qiniu.conf.Config();
    // // qiniuConfig.zone = Qiniu.zone.Zone_z2;
    // this.formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
    // this.putExtra = new qiniu.form_up.PutExtra();
    //
    // this.bucketManager = new qiniu.rs.BucketManager(this.mac, qiniuConfig);
    // this.operationManager = new qiniu.fop.OperationManager(this.mac, qiniuConfig);
  }
  //
  // async fetch(options) {
  //   options = {
  //     limit: 50,
  //     // prefix: 'images/', // 前缀
  //     ...(options || {}),
  //   };
  //
  //   return new Promise((resolve, reject) => {
  //     this.bucketManager.listPrefix(config.bucket, options, function (err, respBody, respInfo) {
  //       if (err)
  //         return reject(err)
  //
  //       if (respInfo.statusCode !== 200) {
  //         let err = new Error()
  //         err.message = respBody
  //         err.name = respInfo.statusCode
  //         return reject(err)
  //       }
  //
  //       let items = respBody.items;
  //       resolve(items.map(item => ({
  //         key: item.key
  //       })))
  //     });
  //   })
  // }
  //
  // async uploadWithUrl(url, key) {
  //   return new Promise((resolve, reject) => {
  //     this.bucketManager.fetch(url, config.bucket, key, (err, respBody, respInfo) => {
  //       if (err) return reject(err)
  //
  //       if (respInfo.statusCode === 200) {
  //         const {key, hash, fsize, mimeType} = respBody
  //         return resolve({key, fsize, mimeType, url: this.getImageUrl(key)})
  //       } else {
  //         let err = new Error(`下载错误--url: ${url}, error: ${JSON.stringify(respBody)}`)
  //         err.name = respInfo.statusCode
  //
  //         return reject(err)
  //       }
  //     })
  //   })
  // }
  //
  // /**
  //  *
  //  * @param baseUrl
  //  * @param mode 2：等比缩放，不裁剪； 缺省为1，等比缩放，居中裁剪
  //  * @param width
  //  * @param height
  //  * @param watermark
  //  * @param imageMogr
  //  * @return {*}
  //  * @private
  //  */
  // _handlePublicUrl(baseUrl, mode = 2, width, height, watermark, imageMogr) {
  //   if (width) baseUrl += '?imageView2/' + mode + '/w/' + width + '/interlace/1';
  //   else if (height && width) baseUrl += '?imageView2/' + mode + '/w/' + width + '/h/' + height + '/interlace/1';
  //   if (imageMogr) baseUrl += '|imageMogr2/rotate/' + imageMogr;
  //
  //   if (watermark && watermark.length > 0) {
  //     // URL中%7C是“|”的转义符，七牛用"|"做管道操作，微信图片轮播功能不行
  //     const fontFamily = this.safeUrlBase64Encode('微软雅黑');
  //     baseUrl += '%7C' + 'watermark/3/text/' + this.safeUrlBase64Encode(watermark) + '/font/' + fontFamily + '/fontsize/600/fill/d2hpdGU=/dissolve/30/gravity/SouthEast/dx/25/dy/20';
  //   }
  //
  //   return baseUrl
  // }
  //
  // getBookUrl(key) {
  //   let baseUrl = this.bucketManager.publicDownloadUrl(config.book_domain_https, key);
  //   baseUrl = this._handlePublicUrl(baseUrl)
  //   return baseUrl;
  // }
  //
  // getOriginUrl(key) {
  //   let baseUrl = this.bucketManager.publicDownloadUrl(config.domain_https, key);
  //   baseUrl = this._handlePublicUrl(baseUrl)
  //   return baseUrl;
  // }
  //
  // getImageOrigin(key) {
  //   return this.getOriginUrl(key)
  // }
  //
  // getImageUrl(key, mode, width = 640, height, watermark, imageMogr) {
  //   let baseUrl = this.bucketManager.publicDownloadUrl(config.domain_https, key);
  //   baseUrl = this._handlePublicUrl(baseUrl, mode, width, height, watermark, imageMogr)
  //   return baseUrl;
  // }
  //
  // getImageUrlSmall(key, mode = 2, height = 100) {
  //   let baseUrl = this.bucketManager.publicDownloadUrl(config.domain_https, key);
  //   baseUrl += '?imageView2/' + mode + '/h/' + height + '/interlace/1';
  //   return baseUrl;
  // }
  //
  // getFileHttpsUrl(key) {
  //   return this.bucketManager.publicDownloadUrl(config.domain_https, key);
  // }
  //
  // getMp3Url(key) {
  //   let baseUrl = this.bucketManager.publicDownloadUrl(config.domain_https, key);
  //   baseUrl += '?avthumb/mp3';
  //   return baseUrl;
  // }
  //
  // getVideoUrl(key) {
  //   return this.bucketManager.publicDownloadUrl(config.domain_https, key);
  // }
  //
  // getVideoCover(key, offset=4) {
  //   let baseUrl = this.bucketManager.publicDownloadUrl(config.domain_https, key);
  //   return `${baseUrl}?vframe/jpg/offset/${offset}/rotate/auto/w/800`
  // }
  //
  // // 获取封面图片正方形
  // async getCoverUrl(key) {
  //   let baseUrl = this.bucketManager.publicDownloadUrl(config.domain_https, key);
  //   let response = await axios.get(baseUrl + '?imageInfo')
  //   if (response.status !== 200) {
  //     throw new Error(response.data)
  //   }
  //
  //   const {size, width, height} = response.data
  //   if (width && height) {
  //     if (width > height) {
  //       if (height < 800) {
  //         baseUrl += '?imageView2/1/h/' + height + '/interlace/1';
  //       } else {
  //         baseUrl += '?imageView2/1/h/800/interlace/1';
  //       }
  //     } else {
  //       if (width < 800) {
  //         baseUrl += '?imageView2/1/w/' + width + '/interlace/1';
  //       } else {
  //         baseUrl += '?imageView2/1/w/800/interlace/1';
  //       }
  //     }
  //   }
  //   return baseUrl
  // }
  //
  // async getImageInfo(key) {
  //   const baseUrl = this.bucketManager.publicDownloadUrl(config.domain_https, key);
  //   const infoUrl = baseUrl + '?imageInfo';
  //   let response = await axios.get(infoUrl)
  //   if (response.status !== 200) throw new Error(response.data)
  //   const {size, format, width, height} = response.data
  //   return {size, suffix: format, width, height, key}
  // }
  //
  // async getVideoInfo(key) {
  //   const baseUrl = this.bucketManager.publicDownloadUrl(config.domain_https, key);
  //   const infoUrl = baseUrl + '?avinfo';
  //   let response = await axios.get(infoUrl)
  //   if (response.status !== 200) throw new Error(response.data)
  //   const {streams, format} = response.data
  //
  //   let data = {
  //     size: format.size,
  //     duration: parseFloat(parseFloat(format.duration).toFixed(1)) || null
  //   }
  //   if (format.tags && format.tags.major_brand === 'mp42') {
  //     data.suffix = 'mp4'
  //   }
  //   if (streams && streams.length > 0) {
  //     for (let stream of streams) {
  //       if (stream.width) {
  //         data.width = stream.width
  //         data.height = stream.height
  //         break
  //       }
  //     }
  //   }
  //   return data
  // }
  //
  // async getAudioInfo(key) {
  //   const baseUrl = this.bucketManager.publicDownloadUrl(config.domain_https, key);
  //   const infoUrl = baseUrl + '?avinfo';
  //   let response = await axios.get(infoUrl)
  //   if (response.status !== 200) throw new Error(response.data)
  //   const {streams, format} = response.data
  //   let data = {
  //     size: format.size,
  //     duration: parseInt(format.duration)
  //   }
  //   return data
  // }
  //
  // base64ToSafeUrl(v) {
  //   return v.replace(/\//g, '_').replace(/\+/g, '-');
  // }
  //
  // safeUrlBase64Encode(jsonFlags) {
  //   const encoded = new Buffer(jsonFlags).toString('base64');
  //   return this.base64ToSafeUrl(encoded);
  // }
  //
  // hmacSha1(encodedFlags, secretKey) {
  //   const hmac = crypto.createHmac('sha1', secretKey);
  //   hmac.update(encodedFlags);
  //   return hmac.digest('base64');
  // }
  //
  // //生成七牛上传凭证
  // uploadToken() {
  //   const options = {
  //     scope: config.bucket,
  //   };
  //   const putPolicy = new qiniu.rs.PutPolicy(options);
  //   return putPolicy.uploadToken(this.mac);
  // }
  //
  // // 查询文件是否存在
  // async fileExists(key) {
  //   return new Promise((resolve, reject) => {
  //     this.bucketManager.stat(config.bucket, key, function (err, respBody, respInfo) {
  //       if (err || respInfo.statusCode !== 200) return resolve(false)
  //       resolve(true)
  //     });
  //   })
  // }

  // async uploadLocalPath(key, filePath) {
  //   let self = this
  //   return new Promise((resolve, reject) => {
  //     this.formUploader.putFile(
  //       this.uploadToken(),
  //       key,
  //       filePath,
  //       this.putExtra,
  //       function (err, respBody, respInfo) {
  //         if (err || respInfo.statusCode !== 200)
  //           return reject(new Error(`上传失败：${err || respBody.error}`))
  //
  //         resolve(self.getImageOrigin(key))
  //       });
  //   })
  // }

  uploadKey(unionKey) {
    let hmac = crypto.createHmac('sha1', config.secret_key);
    hmac.update(unionKey);
    return hmac.digest('base64');
  }


  async upload(path, key, token) {
    const next = ()=>console.log('next')
    const error = ()=>console.log('err')
    const complete = ()=>console.log('com')
    const observable =qiniu.upload(path, key, token)
    const subscription = observable.subscribe(next, error, complete) // 这样传参形式也可以
  }
}

export default new Qiniu()