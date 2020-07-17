import React, {PureComponent} from "react"
import images from "../../../assets/images"
import './index.css'
import NavBar from "../../NavBar"
import {get, post, API} from '../../../request'

export default class EditAudio extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      types: [],
      curType: null,
      allCount: '',
      musics: [],
      choose: props.audio,
      playState: {
        isPlaying: false,
        url: ''
      }
    }

    this.audio = React.createRef()
  }

  componentDidMount() {
    this._initData()
  }

  async _initData() {
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
    if (result.audios && result.audios.length > 0) {
      this.setState({
        musics: result.audios
      })
    }
  }

  _onTypeClick(e, type) {
    e.stopPropagation()
    const {curType} = this.state
    if (curType && curType._id === type._id)
      return
    this.setState({curType: type})
    this._updateMusicsByType(type)
  }

  _chooseMusic(music) {
    const {_id, cover, url, filename} = music
    this.setState({
        choose: music
      }, () => {
        if (this.state.playState.isPlaying) {
          this._onPlay()
        }
      }
    )
  }

  _onPlay = () => {
    const {choose} = this.state
    if (!choose) return
    if (this.audio.current.src !== choose.url) {
      this.audio.current.src = choose.url
    }
    this.audio.current.play()
    this.setState({
      playState: {
        isPlaying: true,
        url: choose.url
      }
    })
  }

  _onPause = () => {
    this.audio.current.pause()
    this.setState({
      playState: {
        isPlaying: false,
        url: ''
      }
    })
  }

  _onCancel = () => {
    this.audio.current.pause()
    this.setState({
      choose: null
    })
  }

  _done = () => {
    const {onUpdate, onBack} = this.props
    onUpdate('audio_id', this.state.choose)
    onBack()
  }

  _renderTypes() {
    const {types, curType} = this.state
    return (
      <div id='audio-types-box'>
        <ul id='audio-types'>
          {types.map(type => (
            <li
              key={type._id}
              onClick={(e) => this._onTypeClick(e, type)}
              className={`audio-type-btn ${type === curType ? 'audio-type-btn-checked' : ''}`}
            >
              {type.title}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  _renderMusic = (music) => {
    const {_id, cover, url, filename} = music
    const {choose} = this.state
    return (
      <div
        onClick={() => this._chooseMusic(music)}
        className='music-item'
        key={_id}
        style={choose && choose._id === _id ? {color: '#FF4542'} : {}}
      >
        <img
          className='music-cover'
          src={cover}
        />
        {filename}
      </div>
    )
  }

  _renderMusics() {
    const {musics} = this.state
    return (
      <ul>
        {musics.map(this._renderMusic)}
      </ul>
    )
  }

  _renderHeader() {
    const {choose, playState} = this.state
    if (!choose) return null
    return (
      <div
        id='music-img-bg'
        style={{backgroundImage: `url(${images.MUSIC_BG})`}}
      >
        <div
          id='music-img-bg-icon-box'
          onClick={playState.isPlaying ? this._onPause : this._onPlay}
        >
          <img
            id='music-img-bg-icon'
            src={playState.isPlaying ? images.music_play_white : images.music_pause_white}
          />
          <p id='music-img-bg-name'>
            {choose.filename}
          </p>
        </div>

        <button
          onClick={this._onCancel}
          id='music-img-bg-cancel'
        >
          取消
        </button>
      </div>
    )
  }

  render() {
    const {allCount} = this.state
    const {onBack} = this.props
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        id='edit-music-container'>
        <NavBar
          title='背景音乐'
          onBack={onBack}
          rightButtons={[{
            text: '确认',
            onClick: this._done
          }]}
        />
        {this._renderHeader()}

        <div id='edit-music-box'>
          {this._renderTypes()}
          <p id='music-hot-text'>共有 {allCount} 首乐曲</p>
          {this._renderMusics()}
        </div>

        <p id='more-music-text'>
          - 更多背景音乐，请到糖水App中设置 -
        </p>

        <audio autoPlay={true} ref={this.audio}/>
      </div>
    )
  }
}