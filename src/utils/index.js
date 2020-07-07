/**
 * 转换从浏览器赋值或者客户端分享出来的优酷、腾讯视频
 */
export function getWebVideoUrl(srcValue) {
// srcValue = 'http://v.youku.com/v_show/id_XMjc4OTQ5OTIyOA==.html'
// srcValue = 'http://m.v.qq.com/play/play.html?vid=l0024si3r7q&coverid=dhzimk1301&type=2&sharePlayNumTag=0&ptag=4_5.6.3.19314_copy'

// 如果是优酷视频，就解析，如果解析失败就返回原来的网址
  let getYouKuVideo = (srcValue) => {
    let id;
    if (srcValue.indexOf('.html') !== -1 && srcValue.indexOf('id_') !== -1) {
      id = srcValue.substring(srcValue.indexOf('id_') + 3, srcValue.indexOf('.html'));
    } else {
      return srcValue
    }
    let url = "http://player.youku.com/embed/" + id
    return url
  }

  let getQQVideo = (srcValue) => {
    let vid;
    if (srcValue.indexOf('vid') !== -1) {
      vid = srcValue.substring(srcValue.indexOf('vid') + 4, srcValue.indexOf('vid') + 15);
    } else if (srcValue.indexOf('.html') !== -1) {
      vid = srcValue.substring(srcValue.indexOf('.html') - 11, srcValue.indexOf('.html'));
    } else {
      return srcValue
    }
    return 'http://v.qq.com/iframe/player.html?vid=' + vid + `&auto=0`
  }

  let errorUrl = 'http://v.qq.com/iframe/player.html?vid=l0024si3rco'
  if (!srcValue || !srcValue.indexOf) {
    return errorUrl
  }

  if (srcValue.indexOf('youku.com') !== -1) {
    // 优酷
    return getYouKuVideo(srcValue)
  } else if (srcValue.indexOf('qq.com') !== -1) {
    // 腾讯视频
    return getQQVideo(srcValue)
  }

  // 不是两者中的网址。返回一个错误的腾讯视频页面，显示视频不存在
  return errorUrl
}

//检测文字链接格式
function checkUrl(telAndWord) {
  let check;
  if (telAndWord === '') {
    return 3; // 为空
  }
  let strRegex = "^(http:\/\/|https:\/\/|Http:\/\/|Https:\/\/)((?:[A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[\?\:]?.*$";
  check = new RegExp(strRegex);
  if (check.test(telAndWord.trim())) {
    return true; // 正确
  } else {
    return false; // 错误
  }
}