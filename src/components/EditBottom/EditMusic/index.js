import React, {PureComponent} from "react";
import images from "../../../assets/images";
import './index.css'
import NavBar from "../../NavBar";
import {get, post, API} from '../../../request'

export default class EditMusic extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      types: []
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
      this.setState({
        types: result.category
      })
    }
  }


  _renderTypes() {
    const {types} = this.state
    return (
      <div id='audio-types-box'>
        <ul id='audio-types'>
          {types.map(({title}) => (
            <li className='audio-type-btn'>
              {title}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    return (
      <div id='edit-music-container'>
        <NavBar
          title='背景音乐'
        />
        <img
          id='music-img-bg'
          src={images.MUSIC_BG}
        />

        <div id='edit-music-box'>
          {this._renderTypes()}
          <p id='music-hot-text'>共有 50 首乐曲</p>
        </div>
      </div>
    )
  }
}