function pickPhotoBrowser(isImage, max) {
  const handleVideo = async (src) => {
    let video = document.createElement('video')
    document.body.appendChild(video)
    video.src = src
    return new Promise((resolve, reject) => {
      video.addEventListener('loadedmetadata', (e) => {
        const {videoWidth, videoHeight, duration} = video
        if (duration > 60) {
          let e = '视频最长60秒'
          reject(new Error(e))
        } else {
          resolve({src, width: videoWidth, height: videoHeight, duration})
        }
        document.body.removeChild(video)
      })
    })

  }

  const handleImage = (src) => {
    let image = new Image()
    image.src = src
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve({src, width: image.width, height: image.height})
      }
      image.onerror = () => {
        reject(new Error())
        return null
      }
    })
  }

  let input = document.createElement('input')
  document.body.appendChild(input)
  input.style = "display:none"
  input.type = 'file'
  input.multiple = max > 1
  input.accept = isImage
    ? 'image/gif, image/jpeg, image/png'
    : 'video/mp4'

  input.onclick = function (event) {
    event.target.value = null
  }
  return new Promise((resolve, reject) => {
    input.onchange = async function () {
      document.body.removeChild(input)
      let result = []
      let files = input.files
      for (let file of files) {
        let src = window.URL.createObjectURL(file)
        let item
        try {
          if (file.type.startsWith('image'))
            item = await handleImage(src)
          else
            item = await handleVideo(src)
          item.size = file.size
          result.push(item)
        } catch (e) {
          return reject(e)
        }
      }
      resolve(result)
    }
    input.click()
  })
}

function pickPhotoWx(isImage, max) {
  const handleImage = (src) => {
    let image = new Image()
    image.src = src
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve({src, width: image.width, height: image.height})
      }
      image.oncomplete = () => {
        alert('comp')
      }
    })
  }
  return new Promise((resolve, reject) => {
    window.wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: async function (res) {
        let result = []
        var localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        for (let localId of localIds) {
          window.wx.getLocalImgData({
            localId,
            success: function (res) {
              var localData = res.localData // localData是图片的base64数据，可以用img标签显示
              alert(localData.length)
              let image = new Image()
              image.src = localData
              image.onload = () => {
                // alert(localData.length)
              }
              image.onerror = () => {
                // alert(localData)
              }
              resolve([{
                src: localData,
                width: 100,
                height: 100,
              }])
            }
          })

        }
      },
      fail: function (res) {
        alert(res)
        reject(res)
      }
    })
  })

}

/**
 * 选择图片/视频
 * @param isImage true为图片。false为视频
 * @param max 最大数量
 */
export function pickPhoto(isImage, max) {
  if (false) {
    return pickPhotoWx(isImage, max)
  } else {
    return pickPhotoBrowser(isImage, 100)
  }
}

/* 转换从浏览器赋值或者客户端分享出来的优酷、腾讯视频 */
export function getWebVideoUrl(srcValue) {
  // srcValue = 'http://v.youku.com/v_show/id_XMjc4OTQ5OTIyOA==.html'
  // srcValue = 'http://m.v.qq.com/play/play.html?vid=l0024si3r7q&coverid=dhzimk1301&type=2&sharePlayNumTag=0&ptag=4_5.6.3.19314_copy'
  // 如果是优酷视频，就解析，如果解析失败就返回原来的网址
  let getYouKuVideo = (srcValue) => {
    let id
    if (srcValue.indexOf('.html') !== -1 && srcValue.indexOf('id_') !== -1)
      id = srcValue.substring(srcValue.indexOf('id_') + 3, srcValue.indexOf('.html'))
    else return srcValue
    return "http://player.youku.com/embed/" + id
  }

  let getQQVideo = (srcValue) => {
    let vid
    if (srcValue.indexOf('vid') !== -1)
      vid = srcValue.substring(srcValue.indexOf('vid') + 4, srcValue.indexOf('vid') + 15)
    else if (srcValue.indexOf('.html') !== -1)
      vid = srcValue.substring(srcValue.indexOf('.html') - 11, srcValue.indexOf('.html'))
    else return srcValue
    return 'http://v.qq.com/iframe/player.html?vid=' + vid + `&auto=0`
  }

  let errorUrl = 'http://v.qq.com/iframe/player.html?vid=l0024si3rco'
  if (!srcValue || !srcValue.indexOf) return errorUrl
  if (srcValue.indexOf('youku.com') !== -1) return getYouKuVideo(srcValue)
  if (srcValue.indexOf('qq.com') !== -1) return getQQVideo(srcValue)
  return errorUrl  // 不是两者中的网址。返回一个错误的腾讯视频页面，显示视频不存在
}

//检测文字链接格式
export function checkUrl(telAndWord) {
  let check
  if (telAndWord === '') return 3 // 为空
  let strRegex = "^(http:\/\/|https:\/\/|Http:\/\/|Https:\/\/)((?:[A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[\?\:]?.*$"
  check = new RegExp(strRegex)
  return check.test(telAndWord.trim())
}