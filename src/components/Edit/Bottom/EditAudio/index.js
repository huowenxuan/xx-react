import React, {PureComponent} from "react"
import images from "../../../../assets/images"
import './index.less'
import NavBar from "../../../NavBar"
import {get, post, API} from '../../../../request'
import {EditBottomHeight} from "../Buttons"

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
      <div className='types-box'>
        <ul className='types'>
          {types.map(type => (
            <li
              key={type._id}
              onClick={(e) => this._onTypeClick(e, type)}
              className={`btn ${type === curType ? 'checked' : ''}`}
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
        className='audio'
        key={_id}
        style={choose && choose._id === _id ? {color: '#FF4542'} : {}}
      >
        <img className='cover' src={cover}/>
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
        className='header'
        style={{backgroundImage: `url(${images.MUSIC_BG})`}}
      >
        <div
          className='icon-box'
          onClick={playState.isPlaying ? this._onPause : this._onPlay}
        >
          <img
            className='icon'
            src={playState.isPlaying ? images.music_play_white : images.music_pause_white}
          />
          <p className='name'>{choose.filename}</p>
        </div>

        <button onClick={this._onCancel} className='cancel'>
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
        className='edit-audio'
      >
        <NavBar
          title='背景音乐'
          onBack={onBack}
          rightButtons={[{
            text: '确认',
            onClick: this._done
          }]}
        />
        {this._renderHeader()}

        <div className='main'>
          {this._renderTypes()}
          <p className='hot-text'>共有 {allCount} 首乐曲</p>
          {this._renderMusics()}
        </div>

        <p className='more'>
          - 更多背景音乐，请到糖水App中设置 -
        </p>
        <audio autoPlay={true} ref={this.audio}/>
      </div>
    )
  }
}