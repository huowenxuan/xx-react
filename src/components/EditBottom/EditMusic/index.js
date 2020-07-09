import React, {PureComponent} from "react";
import images from "../../../assets/images";
import './index.css'
import NavBar from "../../NavBar";
import {get, post, API} from '../../../request'

export default class EditMusic extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      types: [],
      curType: null,
      allCount: '',
      musics: []
    }
  }

  componentDidMount() {
    this._initData()
  }

  async _initData() {
    this.setState({
      types: [{"_id":"5eaa8542e71b0142efa68ba7","title":"热门","__v":0,"updated_at":"2020-04-30T07:58:58.901Z","created_at":"2020-04-30T07:58:58.898Z"},{"_id":"5eba010c7fb955026f86aee3","title":"清新","__v":0,"updated_at":"2020-05-12T01:51:08.963Z","created_at":"2020-05-12T01:51:08.963Z"},{"_id":"5eba01137fb955026f86aee4","title":"欢快","__v":0,"updated_at":"2020-05-12T01:51:15.480Z","created_at":"2020-05-12T01:51:15.479Z"},{"_id":"5eba01187fb955026f86aee5","title":"优雅","__v":0,"updated_at":"2020-05-12T01:51:20.515Z","created_at":"2020-05-12T01:51:20.515Z"},{"_id":"5eba01207fb955026f86aee6","title":"怀旧","__v":0,"updated_at":"2020-05-12T01:51:28.179Z","created_at":"2020-05-12T01:51:28.179Z"},{"_id":"5eba01277fb955026f86aee7","title":"伤感","__v":0,"updated_at":"2020-05-12T01:51:35.944Z","created_at":"2020-05-12T01:51:35.944Z"}]
    })
    let result = await get(`${API.audioCategory}`)
    if (result.category && result.category.length > 0) {
      let types = result.category
      this.setState({
        types,
        curType: types[0],
        allCount: result.count
      })
      this._updateMusicsByType(types[0])
    }
  }

  async _updateMusicsByType(type) {
    let result = await get(`${API.audioCategoryList}${type._id}`, {},
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YTE2NDkzMDRhZjE1OTgwYWZlNDk2YSIsInBob25lIjoiMTg4NDA5MTY3NDIiLCJpYXQiOjE1ODEzMjY4NDV9.jYNFFZWf0DcO5Wu5is21Htywds2zCDGH31YiLZSEeBw'
      )
    this.setState({
      musics: [{"_id":"5e14204f9fb61446e344446c","status":"public","filename":"波浪 - Waves","key":"lrMkF0byTEn5psfqx9GVAvPbElTi","user_id":"5e12e78880f5dbab00d5c0b4","created_at":"2020-01-07T06:08:15.765Z","__v":0,"updated_at":"2020-05-14T02:26:44.400Z","category":{"_id":"5eaa8542e71b0142efa68ba7","title":"热门","created_at":"2020-04-30T07:58:58.898Z","updated_at":"2020-04-30T07:58:58.901Z","__v":0},"url":"https://imgssl.tangshui.net/lrMkF0byTEn5psfqx9GVAvPbElTi","cover":"https://static.tangshui.net/music_04.png","isCollected":false},{"_id":"5e142bcf6b9cb4482ab95c5a","status":"public","filename":"赤道 - Equatorial","key":"lk3fzrJ09bczCQWH5Zkw3xj5dYn6","user_id":"5e12e78880f5dbab00d5c0b4","created_at":"2020-01-07T06:57:19.180Z","__v":0,"updated_at":"2020-05-14T02:26:44.407Z","category":{"_id":"5eaa8542e71b0142efa68ba7","title":"热门","created_at":"2020-04-30T07:58:58.898Z","updated_at":"2020-04-30T07:58:58.901Z","__v":0},"url":"https://imgssl.tangshui.net/lk3fzrJ09bczCQWH5Zkw3xj5dYn6","cover":"https://static.tangshui.net/music_07.png","isCollected":false},{"_id":"5e142bef6b9cb4482ab95c5b","status":"public","filename":"马克西金属 - MAXI METAL","key":"ljvBPq69KsCc25elGkMixP6PWE1A","user_id":"5e12e78880f5dbab00d5c0b4","created_at":"2020-01-07T06:57:51.249Z","__v":0,"updated_at":"2020-05-14T02:26:44.409Z","category":{"_id":"5eaa8542e71b0142efa68ba7","title":"热门","created_at":"2020-04-30T07:58:58.898Z","updated_at":"2020-04-30T07:58:58.901Z","__v":0},"url":"https://imgssl.tangshui.net/ljvBPq69KsCc25elGkMixP6PWE1A","cover":"https://static.tangshui.net/music_02.png","isCollected":false},{"_id":"5e142cb16b9cb4482ab95c5c","status":"public","filename":"清晨 - Mornings","key":"FnCqMVJhtOIaLXHQuma-9pBoTcEN","user_id":"5e12e78880f5dbab00d5c0b4","created_at":"2020-01-07T07:01:05.906Z","__v":0,"updated_at":"2020-05-14T02:26:44.411Z","category":{"_id":"5eaa8542e71b0142efa68ba7","title":"热门","created_at":"2020-04-30T07:58:58.898Z","updated_at":"2020-04-30T07:58:58.901Z","__v":0},"url":"https://imgssl.tangshui.net/FnCqMVJhtOIaLXHQuma-9pBoTcEN","cover":"https://static.tangshui.net/music_03.png","isCollected":false}]
    })
    if (result.audios && result.audios.length > 0) {
      this.setState({
        musics: result.audios
      })
    }
  }

  _onTypeClick(e, type) {
    e.stopPropagation()
    this.setState({curType: type})
  }

  _renderTypes() {
    const {types, curType} = this.state
    return (
      <div id='audio-types-box'>
        <ul id='audio-types'>
          {types.map(type => (
            <li
              key={type._id}
              onClick={(e)=> this._onTypeClick(e, type)}
              className={`audio-type-btn ${type === curType ? 'audio-type-btn-checked' : ''}`}
            >
              {type.title}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  _renderMusic = (music)=> {
    const {_id, cover, url, filename} = music
    return (
      <div key={_id}>
        {filename}
      </div>
    )
  }

  _renderMusics() {
    const {musics} = this.state
    return (
      <div>
      <ul>
        {musics.map(this._renderMusic)}
      </ul>
      </div>
    )
  }

  render() {
    const {allCount} = this.state
    const {onBack} = this.props
    return (
      <div
        onClick={(e)=>e.stopPropagation()}
        id='edit-music-container'>
        <NavBar
          title='背景音乐'
          onBack={onBack}
        />
        <img
          id='music-img-bg'
          src={images.MUSIC_BG}
        />

        <div id='edit-music-box'>
          {this._renderTypes()}
          <p id='music-hot-text'>共有 {allCount} 首乐曲</p>
          {this._renderMusics()}
        </div>
      </div>
    )
  }
}