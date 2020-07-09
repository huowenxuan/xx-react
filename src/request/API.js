
'use strict'

const baseUrl = 'http://a.tangshui.net'
// const baseUrl = 'http://testenjoy.tangshui.net'

const route = {
  loginCode: baseUrl + '/youth/logincode', // 用户验证码登录
  loginWeiXin: baseUrl + '/youth/login/weixin', // 用户微信登录
  loginUmengWeiXin: baseUrl + '/youth/login/weixinunionid', //用户友盟微信登录
  loginPassword: baseUrl + '/youth/login', //用户手机号密码登录
  setnewPassWord : baseUrl + '/youth/setnewpassword', //重置用户密码
  getpassporttoken: baseUrl + '/youth/getpassporttoken',// 微信登录后获取token
  userAgreement : baseUrl + '/youth/useragreement', // 用户协议
  getrecaptcha: baseUrl + '/youth/getrecaptcha', // 获取短信验证码
  checkRecaptcha: baseUrl + '/youth/updatephone', //检查验证码是否正确
  qiniuToken: baseUrl + '/youth/uploadtoken', //七牛token
  hot : baseUrl + '/youth/hotlinenew', //热门文章推荐
  flash : baseUrl + '/youth/flashnew' , //热门闪拍推荐
  likeCreate : baseUrl + '/youth/like/create/', //创建点赞
  likeRemove : baseUrl + '/youth/like/remove/', //移除点赞
  useralbum : baseUrl + '/youth/post/albumlist/', //我的相册
  userPost: baseUrl + '/youth/post/user/', //我的文章
  userSpecial: baseUrl + '/youth/special/', //我的专集
  userRubbish: baseUrl + '/youth/post/rubbishlist/', //我的回收站
  specialShow: baseUrl + '/youth/specialinfo/', //专集信息
  specialShowPost: baseUrl + '/youth/specialinfo/post/', //专集show列表
  specialPost: baseUrl + '/youth/special/post/', //专集post列表
  specialCreate: baseUrl + '/youth/special/create', //专集创建
  specialUpdate: baseUrl + '/youth/special/update/', //专集更新
  specialRemove: baseUrl + '/youth/special/remove/', //专集删除
  commentCreate : baseUrl + '/youth/comment/create/', //创建评论
  collectCreate : baseUrl + '/youth/favorite/create', //创建收藏
  collectRemove: baseUrl + '/youth/favorite/remove/', //删除收藏
  followCreate : baseUrl + '/youth/user/focus', //创建关注
  boardRecommend : baseUrl + '/youth/board/recommend', //推荐圈子列表
  myBoard : baseUrl + '/youth/board/check/user/', //我的圈子列表
  recommendVip : baseUrl + '/youth/userrecommenddesc', //推荐达人
  newUser : baseUrl + '/youth/usernewlist', //新鲜面孔
  dynamicList : baseUrl + '/youth/feed/list/', //我的好友动态
  recommendUser : baseUrl + '/youth/userrecommend/list/', //可能感兴趣的人
  recommendPost : baseUrl + '/youth/vuser/post', //推荐文章
  postShow : baseUrl + '/youth/post/', //文章详情
  postOther : baseUrl + '/youth/post/othernew/', //作者其他推荐
  hotBoard : baseUrl + '/youth/board/recommend', //热门圈子
  recommendOriginal : baseUrl + '/youth/article/top', //推荐原创
  dynamicListFollow: baseUrl + '/youth/dynamic/list/', //你关注的好友动态
  messageList   : baseUrl + '/youth/message/list/',
  messageCount  : baseUrl + '/youth/message/count/',
  messageCountTeach: baseUrl + '/youth/message/counteach/',
  commentList : baseUrl + '/comment/list/', //文章评论列表
  boardArticles : baseUrl + '/youth/board/articlenew/', //圈子文章列表
  boardDetail : baseUrl + '/youth/board/info/', //圈子详情
  userInfo : baseUrl + '/youth/userinfo/', //用户信息
  userInfoDb : baseUrl + '/youth/user/', //用户信息数据库
  setUserInfo : baseUrl + '/youth/user/updateinfo', //修改用户信息
  userPhone : baseUrl + '/youth/userphone/', // 获取用户手机号
  userPosts : baseUrl + '/youth/zone/list/', //用户文章列表
  userSpecials : baseUrl + '/youth/zone/special/', //用户专集列表
  userAlbums : baseUrl + '/youth/zone/album/', //用户相册列表
  userBlock : baseUrl + '/youth/user/blocked', //是否拉黑
  userBlockCreate: baseUrl + '/youth/user/createuserblock', //创建拉黑名单
  userBlockRemove: baseUrl + '/youth/user/removeuserblock/', //移除黑名单
  userBlockList: baseUrl + '/youth/user/blocklist/', //黑名单列表
  visitZoneCreate : baseUrl + '/youth/zone/visit/', //创建访客记录
  userList : baseUrl + '/youth/user/relationship', //获取用户列表
  getRelation : baseUrl + '/userapi/relationship', //获取与当前用户关注关系
  themeList : baseUrl + '/youth/theme', //获取模版列表
  allBoards : baseUrl + '/youth/board/categorynew', //获取所有圈子
  boardCategory : baseUrl + '/youth/board/category', // 兴趣圈分类
  userAudio: baseUrl + '/youth/audio/listuser/', //获取用户上传音频
  friendAudio : baseUrl + '/youth/audio/listfriend/', //获取好友分享音频
  recommendAudio: baseUrl + '/youth/audio/recommend', //获取推荐音频
  audioCategory: baseUrl + '/youth/audio/category', // 获取音频分类
  audioCategoryList: baseUrl + '/youth/audio/categorylist/', // 获取分类中的音频列表
  searchAudio: baseUrl + '/youth/audio/search', //搜索音频
  audioStatus : baseUrl + '/youth/audio/status/', //更新我的上传音乐的状态
  audioCreate : baseUrl + '/youth/audio/create/', //保存上传的音频数据
  audioRemove : baseUrl + '/youth/audio/collectedremove/', // 移除收藏音频
  audioCollected: baseUrl + '/youth/audio/collected/', //收藏音频
  searchBoard : baseUrl + '/youth/board/search', //搜索圈子
  searchArticle : baseUrl + '/youth/article/search', //搜索文章
  searchUserPost  : baseUrl + '/youth/post/search/', // 搜索用户自己的帖子
  albumCreate   : baseUrl + '/youth/post/album', // 创作album数据
  postCreate    : baseUrl + '/youth/post/create', // 创作保存文章
  postEdit      : baseUrl + '/youth/post/editnew/', // 编辑获取文章
  postUpdate    : baseUrl + '/youth/post/update/', // 更新文章数据
  postRemove    : baseUrl + '/youth/post/remove/', // 彻底删除文章数据
  postRubbish   : baseUrl + '/youth/post/rubbish/',// 文章改为回收站数据
  postPublic    : baseUrl + '/youth/post/public/', // 回收站文章恢复公开
  postGetSet    : baseUrl + '/youth/post/setting/',// 文章设置信息
  postUpdateSet : baseUrl + '/youth/post/updatesetting/',//更新文章设置信息
  postDeleteAll : baseUrl + '/youth/post/cleanrubbish/', // 清空回收站
  boardDynamic : baseUrl + '/youth/board/listhot', //圈内动态
  recommendAds : baseUrl + '/youth/board/ads', //获取推荐页顶部广告
  relationCount : baseUrl + '/userapi/countFollowAndFans', //我的关注等count
  albumCount : baseUrl + '/youth/album/count/', //相册数量
  homePostCount : baseUrl + '/youth/zone/count/', //文章数量
  specailCount: baseUrl + '/youth/specail/count/', //专集数量
  report : baseUrl + '/youth/report', //举报文章
  getSetting : baseUrl + '/youth/setting', //获取设置相关参数
  boardMembers : baseUrl + '/youth/getboardmember/', //获取圈子成员
  joinBoard : baseUrl + '/youth/createboardmember/', //加入圈子
  searchUser : baseUrl + '/youth/search/list/', //搜索用户
  watchMe : baseUrl + '/youth/zone/visitlist/', //谁看过我
  followMe : baseUrl + '/youth/user/relationship', //我的关注 我的粉丝 我的好友
  focus : baseUrl + '/youth/user/focus', //关注
  unfocus : baseUrl + '/youth/user/unfocus', //取消关注
  collection : baseUrl + '/youth/post/favorite/', //我的收藏
  myDynamic : baseUrl + '/youth/zone/forward/', //我的动态
  exitBoard : baseUrl + '/youth/removeboardmember/', //退出圈子
  setSupCode : baseUrl + '/reward/setting/', //更改微信赞赏码
  weixinInfo : baseUrl + '/youth/weixininfo', //微信信息接口
  weixinInfoUmeng: baseUrl + '/youth/weixininfoumeng/', //微信信息接口 友盟
  isVideo : baseUrl + '/youth/user/settings/', //是否自动播放音频
  removeDynamic : baseUrl + '/youth/circle/remove/', //删除动态
  likeList : baseUrl + '/youth/like/list/', //获取点赞列表
  delComment : baseUrl + '/youth/comment/remove/', //删除评论
  feedBack : baseUrl +'/youth/note/create/', //用户反馈
  checkBoard : baseUrl + '/youth/checkboardnew/', //检查帖子加入兴趣圈状态
  addBoard : baseUrl + '/youth/addboard', //帖子加入兴趣圈
  isDynamic: baseUrl + '/youth/user/settings/', // 是否显示邻里消息
  tutorial: baseUrl + '/youth/tutorial', // 新手资源
  boardList: baseUrl + '/youth/board/list/', // 未加入圈子列表
  removePost: baseUrl + '/youth/special/updateremovepost/', // 删除专辑里面的文章
  addPost: baseUrl + '/youth/special/updateaddpost/', // 专辑里面添加文章
  addPostOne: baseUrl + '/youth/special/updateaddpostone/', // 专集里面添加指定文章
  postToOnce: baseUrl + '/youth/circle/post/once/', // 创建circle
  unreadzoneCount : baseUrl + '/youth/zone/unread/',
  dynamicRemoveOther: baseUrl + '/youth/circles/remove/', //从动态中移除他人动态
  dynamicRemoveAuthor: baseUrl + '/youth/circle/remove/', //从动态中移除自己动态
  updatePhone : baseUrl + '/youth/updatenewphone', //更新手机号
  postShare : baseUrl + '/youth/post/share', //分享成功分享数+1
  updatebrand : baseUrl + '/youth/user/pushinfo/', //更新用户的设备regid
  getJob: baseUrl + "/occupation", //获取职业数据
  getHobby: baseUrl + "/hobby", //获取职业数据
  setJob: baseUrl + "/user/occupation/", //更新职业数据
  setHobby: baseUrl + "/user/hobby/", //更新爱好数据
  createConversation: baseUrl + "/letter/create", //更新爱好数据
  coverrecommend: baseUrl + '/youth/coverrecommend', // 推荐封面
  getConversation: baseUrl + '/conversation/', //查询私信id
  getConversationList: baseUrl + "/conversation/list/", //获取私信列表
  getConversationDetailList: baseUrl + "/letter/list/", //获取私信列表
  testText: baseUrl + "/letter/text", //创建前文本检测
};
export { route }
export default route